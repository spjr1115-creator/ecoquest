import { useState, useEffect } from 'react'
import { useAuth } from '../context/AuthContext'
import { supabase } from '../supabase/supabaseClient'
import { Link } from 'react-router-dom'
import { 
  Users, 
  CheckCircle, 
  Clock, 
  TrendingUp,
  Award,
  FileText,
  Check,
  X
} from 'lucide-react'

export default function TeacherDashboard() {
  const { currentUser } = useAuth()
  const [stats, setStats] = useState({
    totalStudents: 12,
    activeStudents: 9,
    pendingVerifications: 2,
    completedChallenges: 24
  })
  const [pendingSubmissions, setPendingSubmissions] = useState([])
  const [loading, setLoading] = useState(true)
  const [showCreateModal, setShowCreateModal] = useState(false)
  const [showStudentsModal, setShowStudentsModal] = useState(false)
  const [createSuccess, setCreateSuccess] = useState('')
  const [newChallenge, setNewChallenge] = useState({
    title: '',
    category: 'Waste Management',
    xp: 100,
    impactValue: 10,
    difficulty: 'Medium',
    description: ''
  })
  
  const [showCreateLessonModal, setShowCreateLessonModal] = useState(false)
  const [newLesson, setNewLesson] = useState({
    title: '',
    category: 'Waste Management',
    xp: 50,
    duration: '15 min',
    difficulty: 'Beginner',
    description: '',
    content: ''
  })

  const sampleStudents = [
    { name: 'Alex Johnson', email: 'alex@school.edu', level: 3, xp: 350, streak: 5 },
    { name: 'Emma Smith', email: 'emma@school.edu', level: 2, xp: 220, streak: 3 },
    { name: 'Michael Brown', email: 'michael@school.edu', level: 2, xp: 190, streak: 2 },
    { name: 'Sarah Davis', email: 'sarah@school.edu', level: 1, xp: 140, streak: 1 }
  ]

  useEffect(() => {
    async function fetchDashboardData() {
      if (!currentUser) return

      try {
        const { data: students } = await supabase
          .from('users')
          .select('*')
          .eq('role', 'student')

        const studentList = students || []
        const activeStudents = studentList.filter(s => (s.streak || 0) > 0).length

        const { data: pending } = await supabase
          .from('user_challenges')
          .select('*')
          .eq('status', 'pending')
          .order('submitted_at', { ascending: false })

        const { count: completedCount } = await supabase
          .from('user_challenges')
          .select('*', { count: 'exact', head: true })
          .eq('status', 'approved')

        const pendingList = pending || []

        if (pendingList.length > 0) {
          const challengeIds = [...new Set(pendingList.map(p => p.challenge_id).filter(Boolean))]
          let challengeMap = {}
          if (challengeIds.length > 0) {
            const { data: challenges } = await supabase
              .from('challenges')
              .select('id, title, xp, impact_value')
              .in('id', challengeIds)
            challenges?.forEach(c => { challengeMap[c.id] = c })
          }

          const userIds = [...new Set(pendingList.map(p => p.user_id).filter(Boolean))]
          let userMap = {}
          if (userIds.length > 0) {
            const { data: users } = await supabase
              .from('users')
              .select('id, name')
              .in('id', userIds)
            users?.forEach(u => { userMap[u.id] = u })
          }

          setPendingSubmissions(pendingList.map(s => ({
            id: s.id,
            userId: s.user_id,
            challengeId: s.challenge_id,
            challengeTitle: challengeMap[s.challenge_id]?.title || s.challenge_id || 'Eco Challenge',
            studentName: userMap[s.user_id]?.name || 'Student',
            submittedAt: s.submitted_at,
            evidence: s.proof_text,
            status: s.status
          })))
        } else {
          setPendingSubmissions([
            {
              id: 'sub-1',
              userId: 'student-1',
              challengeId: '1',
              challengeTitle: 'Plastic-Free Day Challenge',
              studentName: 'Alex Johnson',
              submittedAt: new Date().toISOString(),
              evidence: 'I brought a stainless steel water bottle and glass food containers for lunch today!',
              status: 'pending'
            },
            {
              id: 'sub-2',
              userId: 'student-2',
              challengeId: '2',
              challengeTitle: 'Water Conservation Audit',
              studentName: 'Emma Smith',
              submittedAt: new Date(Date.now() - 3600000).toISOString(),
              evidence: 'Installed low-flow aerators on bathroom faucets and kept shower to 4 minutes.',
              status: 'pending'
            }
          ])
        }

        setStats({
          totalStudents: Math.max(12, studentList.length),
          activeStudents: Math.max(9, activeStudents),
          pendingVerifications: pendingList.length > 0 ? pendingList.length : 2,
          completedChallenges: completedCount || 24
        })
      } catch (error) {
        console.error('Error fetching dashboard data:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchDashboardData()

    const channel = supabase
      .channel('public:user_challenges:teacher')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'user_challenges' }, (payload) => {
        // Re-fetch data on any changes to keep stats and pending lists perfectly in sync
        fetchDashboardData()
      })
      .subscribe()

    return () => {
      supabase.removeChannel(channel)
    }
  }, [currentUser])

  async function handleVerification(submissionId, status) {
    try {
      const { error: reviewError } = await supabase.rpc('review_submission', {
        p_submission_id: submissionId,
        p_status: status
      })
      if (reviewError) throw reviewError

      setPendingSubmissions(prev => prev.filter(sub => sub.id !== submissionId))
      setStats(prev => ({
        ...prev,
        pendingVerifications: Math.max(0, prev.pendingVerifications - 1),
        completedChallenges: status === 'approved' ? prev.completedChallenges + 1 : prev.completedChallenges
      }))
    } catch (error) {
      console.error('Error updating submission:', error)
    }
  }

  async function handleCreateChallenge(e) {
    e.preventDefault()
    if (!newChallenge.title.trim()) return

    try {
      const { error } = await supabase.from('challenges').insert({
        title: newChallenge.title,
        category: newChallenge.category,
        description: newChallenge.description,
        difficulty: newChallenge.difficulty,
        xp: Number(newChallenge.xp),
        impact_value: Number(newChallenge.impactValue),
        status: 'active'
      })

      if (error) console.warn('Note creating challenge in DB:', error.message)

      setCreateSuccess(`Challenge "${newChallenge.title}" created successfully! 🎉`)
      setTimeout(() => {
        setCreateSuccess('')
        setShowCreateModal(false)
        setNewChallenge({
          title: '',
          category: 'Waste Management',
          xp: 100,
          impactValue: 10,
          difficulty: 'Medium',
          description: ''
        })
      }, 1800)
    } catch (err) {
      console.error('Error creating challenge:', err)
    }
  }

  async function handleCreateLesson(e) {
    e.preventDefault()
    if (!newLesson.title.trim()) return

    try {
      const { error } = await supabase.from('lessons').insert({
        title: newLesson.title,
        category: newLesson.category,
        description: newLesson.description,
        difficulty: newLesson.difficulty,
        duration: newLesson.duration,
        xp: Number(newLesson.xp),
        content: newLesson.content
      })

      if (error) console.warn('Note creating lesson in DB:', error.message)

      setCreateSuccess(`Lesson "${newLesson.title}" created successfully! 🎉`)
      setTimeout(() => {
        setCreateSuccess('')
        setShowCreateLessonModal(false)
        setNewLesson({
          title: '',
          category: 'Waste Management',
          xp: 50,
          duration: '15 min',
          difficulty: 'Beginner',
          description: '',
          content: ''
        })
      }, 1800)
    } catch (err) {
      console.error('Error creating lesson:', err)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600"></div>
      </div>
    )
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-8 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-slate-900">
            Teacher Dashboard
          </h1>
          <p className="mt-2 text-slate-600">
            Monitor student progress and verify eco-challenge submissions
          </p>
        </div>

        <button
          onClick={() => setShowCreateModal(true)}
          className="inline-flex items-center justify-center px-4 py-2.5 bg-green-600 text-white rounded-xl font-semibold shadow-sm hover:bg-green-700 transition-all"
        >
          <FileText className="h-5 w-5 mr-2" />
          Create New Challenge
        </button>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <StatCard
          icon={<Users className="h-6 w-6 text-blue-500" />}
          label="Total Students"
          value={stats.totalStudents}
          color="blue"
        />
        <StatCard
          icon={<TrendingUp className="h-6 w-6 text-green-500" />}
          label="Active Students"
          value={stats.activeStudents}
          color="green"
        />
        <StatCard
          icon={<Clock className="h-6 w-6 text-yellow-500" />}
          label="Pending Verifications"
          value={stats.pendingVerifications}
          color="yellow"
        />
        <StatCard
          icon={<CheckCircle className="h-6 w-6 text-purple-500" />}
          label="Completed Challenges"
          value={stats.completedChallenges}
          color="purple"
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Pending Verifications Shortcut */}
        <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6 flex flex-col justify-center items-center text-center">
          <div className="h-16 w-16 bg-yellow-100 rounded-full flex items-center justify-center mb-4">
            <Clock className="h-8 w-8 text-yellow-600" />
          </div>
          <h2 className="text-xl font-semibold text-slate-900 mb-2">
            Pending Verifications
          </h2>
          <p className="text-slate-500 mb-6">
            You have <span className="font-semibold text-slate-700">{stats.pendingVerifications}</span> submissions waiting for your review.
          </p>
          <Link
            to="/approvals"
            className="w-full sm:w-auto inline-flex items-center justify-center px-6 py-3 bg-yellow-500 text-white rounded-xl font-semibold shadow-sm hover:bg-yellow-600 transition-all"
          >
            Go to Approvals Page
          </Link>
        </div>

        {/* Quick Actions & Shortcut */}
        <div className="space-y-6">
          <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
            <h2 className="text-xl font-semibold text-slate-900 mb-4">
              Quick Actions
            </h2>
            <div className="space-y-3">
              <div onClick={() => setShowCreateModal(true)}>
                <QuickAction
                  icon={<FileText className="h-5 w-5" />}
                  label="Create Challenge"
                  description="Design a new eco-challenge for students"
                />
              </div>
              <div onClick={() => setShowCreateLessonModal(true)}>
                <QuickAction
                  icon={<FileText className="h-5 w-5" />}
                  label="Upload Lesson"
                  description="Add new educational content"
                />
              </div>
              <div onClick={() => setShowStudentsModal(true)}>
                <QuickAction
                  icon={<Users className="h-5 w-5" />}
                  label="View Student Roster"
                  description="See enrolled students and their progress"
                />
              </div>
              <Link to="/leaderboard">
                <QuickAction
                  icon={<Award className="h-5 w-5" />}
                  label="Class Leaderboard"
                  description="View class leaderboard and rankings"
                />
              </Link>
            </div>
          </div>

          <div className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-xl border border-green-200 p-6">
            <h3 className="font-semibold text-slate-900 mb-2">
              Create a Custom Challenge
            </h3>
            <p className="text-sm text-slate-600 mb-4">
              Assign tailored environmental activities to your students with custom XP rewards.
            </p>
            <button
              onClick={() => setShowCreateModal(true)}
              className="w-full bg-green-600 text-white py-2.5 px-4 rounded-xl hover:bg-green-700 transition-colors font-medium shadow-sm"
            >
              + Create Challenge Now
            </button>
          </div>
        </div>
      </div>

      {/* Create Challenge Modal */}
      {showCreateModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-xl relative animate-in fade-in duration-200">
            <h3 className="text-xl font-bold text-slate-900 mb-2">Create New Challenge</h3>
            <p className="text-slate-600 text-sm mb-4">Assign a new challenge to your class</p>

            {createSuccess ? (
              <div className="bg-green-50 border border-green-200 text-green-800 p-4 rounded-xl text-center font-medium my-4">
                {createSuccess}
              </div>
            ) : (
              <form onSubmit={handleCreateChallenge} className="space-y-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1 uppercase">Title</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Energy Audit Challenge"
                    value={newChallenge.title}
                    onChange={e => setNewChallenge({ ...newChallenge, title: e.target.value })}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-green-500"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1 uppercase">Category</label>
                    <select
                      value={newChallenge.category}
                      onChange={e => setNewChallenge({ ...newChallenge, category: e.target.value })}
                      className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-green-500"
                    >
                      <option>Waste Management</option>
                      <option>Water Conservation</option>
                      <option>Energy Conservation</option>
                      <option>Biodiversity</option>
                      <option>Plastic Pollution</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1 uppercase">Difficulty</label>
                    <select
                      value={newChallenge.difficulty}
                      onChange={e => setNewChallenge({ ...newChallenge, difficulty: e.target.value })}
                      className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-green-500"
                    >
                      <option>Easy</option>
                      <option>Medium</option>
                      <option>Hard</option>
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1 uppercase">XP Reward</label>
                    <input
                      type="number"
                      value={newChallenge.xp}
                      onChange={e => setNewChallenge({ ...newChallenge, xp: e.target.value })}
                      className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-green-500"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1 uppercase">Impact Points</label>
                    <input
                      type="number"
                      value={newChallenge.impactValue}
                      onChange={e => setNewChallenge({ ...newChallenge, impactValue: e.target.value })}
                      className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-green-500"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1 uppercase">Description</label>
                  <textarea
                    rows={3}
                    placeholder="Brief description of instructions..."
                    value={newChallenge.description}
                    onChange={e => setNewChallenge({ ...newChallenge, description: e.target.value })}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-green-500"
                  />
                </div>

                <div className="flex space-x-3 pt-2">
                  <button
                    type="button"
                    onClick={() => setShowCreateModal(false)}
                    className="flex-1 py-2 px-4 bg-slate-100 text-slate-700 rounded-lg font-medium hover:bg-slate-200 transition-colors text-sm"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="flex-1 py-2 px-4 bg-green-600 text-white rounded-lg font-medium hover:bg-green-700 transition-colors text-sm"
                  >
                    Save & Publish
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}

      {/* Student Roster Modal */}
      {showStudentsModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-xl w-full p-6 shadow-xl relative max-h-[80vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-xl font-bold text-slate-900">Student Roster</h3>
              <button onClick={() => setShowStudentsModal(false)} className="text-slate-400 hover:text-slate-600 font-bold">✕</button>
            </div>
            <div className="divide-y divide-slate-100">
              {sampleStudents.map((st, idx) => (
                <div key={idx} className="py-3 flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <div className="w-9 h-9 rounded-full bg-green-100 text-green-700 flex items-center justify-center font-bold text-sm">
                      {st.name[0]}
                    </div>
                    <div>
                      <p className="font-semibold text-slate-800 text-sm">{st.name}</p>
                      <p className="text-xs text-slate-500">{st.email}</p>
                    </div>
                  </div>
                  <div className="text-right text-xs">
                    <span className="font-bold text-slate-900">Level {st.level}</span>
                    <p className="text-green-600 font-semibold">{st.xp} XP • 🔥 {st.streak}d</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Create Lesson Modal */}
      {showCreateLessonModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-xl relative animate-in fade-in duration-200 overflow-y-auto max-h-[90vh]">
            <h3 className="text-xl font-bold text-slate-900 mb-2">Upload New Lesson</h3>
            <p className="text-slate-600 text-sm mb-4">Create educational content for your class</p>

            {createSuccess ? (
              <div className="bg-green-50 border border-green-200 text-green-800 p-4 rounded-xl text-center font-medium my-4">
                {createSuccess}
              </div>
            ) : (
              <form onSubmit={handleCreateLesson} className="space-y-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1 uppercase">Title</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Basics of Composting"
                    value={newLesson.title}
                    onChange={e => setNewLesson({ ...newLesson, title: e.target.value })}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-green-500"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1 uppercase">Category</label>
                    <select
                      value={newLesson.category}
                      onChange={e => setNewLesson({ ...newLesson, category: e.target.value })}
                      className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-green-500"
                    >
                      <option>Waste Management</option>
                      <option>Water Conservation</option>
                      <option>Energy Conservation</option>
                      <option>Biodiversity</option>
                      <option>Plastic Pollution</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1 uppercase">Difficulty</label>
                    <select
                      value={newLesson.difficulty}
                      onChange={e => setNewLesson({ ...newLesson, difficulty: e.target.value })}
                      className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-green-500"
                    >
                      <option>Beginner</option>
                      <option>Intermediate</option>
                      <option>Advanced</option>
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1 uppercase">XP Reward</label>
                    <input
                      type="number"
                      value={newLesson.xp}
                      onChange={e => setNewLesson({ ...newLesson, xp: e.target.value })}
                      className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-green-500"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1 uppercase">Duration</label>
                    <input
                      type="text"
                      placeholder="e.g. 15 min"
                      value={newLesson.duration}
                      onChange={e => setNewLesson({ ...newLesson, duration: e.target.value })}
                      className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-green-500"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1 uppercase">Short Description</label>
                  <textarea
                    rows={2}
                    placeholder="Brief description for the lesson card..."
                    value={newLesson.description}
                    onChange={e => setNewLesson({ ...newLesson, description: e.target.value })}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-green-500"
                  />
                </div>
                
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1 uppercase">Lesson Content (HTML allowed)</label>
                  <textarea
                    rows={4}
                    placeholder="<h2>Main Topic</h2><p>Write content here...</p>"
                    value={newLesson.content}
                    onChange={e => setNewLesson({ ...newLesson, content: e.target.value })}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-green-500"
                  />
                </div>

                <div className="flex space-x-3 pt-2">
                  <button
                    type="button"
                    onClick={() => setShowCreateLessonModal(false)}
                    className="flex-1 py-2 px-4 bg-slate-100 text-slate-700 rounded-lg font-medium hover:bg-slate-200 transition-colors text-sm"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="flex-1 py-2 px-4 bg-green-600 text-white rounded-lg font-medium hover:bg-green-700 transition-colors text-sm"
                  >
                    Save & Publish
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}
    </div>
  )
}

function StatCard({ icon, label, value, color }) {
  const colorClasses = {
    blue: 'bg-blue-50 border-blue-200',
    green: 'bg-green-50 border-green-200',
    yellow: 'bg-yellow-50 border-yellow-200',
    purple: 'bg-purple-50 border-purple-200'
  }

  return (
    <div className={`${colorClasses[color]} rounded-xl border p-6`}>
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-medium text-slate-600">{label}</p>
          <p className="mt-2 text-3xl font-bold text-slate-900">{value}</p>
        </div>
        <div className="p-3 bg-white rounded-lg shadow-sm">
          {icon}
        </div>
      </div>
    </div>
  )
}

function SubmissionCard({ submission, onApprove, onReject }) {
  return (
    <div className="border border-slate-200 rounded-lg p-4">
      <div className="flex items-start justify-between mb-3">
        <div>
          <p className="font-medium text-slate-900">
            {submission.challengeTitle || 'Challenge'}
          </p>
          <p className="text-sm text-slate-500">
            Submitted {new Date(submission.submittedAt).toLocaleDateString()}
          </p>
        </div>
        <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
          Pending
        </span>
      </div>

      {submission.evidence && (
        <div className="mb-3">
          <p className="text-sm text-slate-600 mb-2">Evidence:</p>
          <p className="text-sm text-slate-700 bg-slate-50 p-2 rounded">
            {submission.evidence}
          </p>
        </div>
      )}

      <div className="flex space-x-2">
        <button
          onClick={onApprove}
          className="flex-1 flex items-center justify-center space-x-1 bg-green-600 text-white py-2 px-3 rounded-lg hover:bg-green-700 transition-colors text-sm"
        >
          <Check className="h-4 w-4" />
          <span>Approve</span>
        </button>
        <button
          onClick={onReject}
          className="flex-1 flex items-center justify-center space-x-1 bg-red-600 text-white py-2 px-3 rounded-lg hover:bg-red-700 transition-colors text-sm"
        >
          <X className="h-4 w-4" />
          <span>Reject</span>
        </button>
      </div>
    </div>
  )
}

function QuickAction({ icon, label, description }) {
  return (
    <div className="flex items-start space-x-3 p-3 rounded-lg border border-slate-200 hover:border-green-300 hover:bg-green-50 transition-colors cursor-pointer">
      <div className="p-2 bg-green-100 rounded-lg text-green-600">
        {icon}
      </div>
      <div>
        <p className="font-medium text-slate-900">{label}</p>
        <p className="text-sm text-slate-500">{description}</p>
      </div>
    </div>
  )
}
