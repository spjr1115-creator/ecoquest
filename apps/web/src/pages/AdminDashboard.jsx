import { useState, useEffect } from 'react'
import { useAuth } from '../context/AuthContext'
import { supabase } from '../supabase/supabaseClient'
import { 
  Building, 
  Users, 
  TrendingUp, 
  Award,
  Activity,
  BarChart3,
  FileText,
  Settings,
  FilePlus
} from 'lucide-react'

export default function AdminDashboard() {
  const { currentUser } = useAuth()
  const [stats, setStats] = useState({
    totalInstitutions: 0,
    totalStudents: 0,
    totalTeachers: 0,
    totalImpact: 0
  })
  const [recentActivity, setRecentActivity] = useState([])
  const [loading, setLoading] = useState(true)

  const [showCreateModal, setShowCreateModal] = useState(false)
  const [createSuccess, setCreateSuccess] = useState('')
  const [newChallenge, setNewChallenge] = useState({
    title: '',
    category: 'Waste Management',
    xp: 100,
    impactValue: 10,
    difficulty: 'Medium',
    description: ''
  })

  useEffect(() => {
    async function fetchDashboardData() {
      if (!currentUser) return

      try {
        // Fetch students
        const { data: students } = await supabase
          .from('users')
          .select('*')
          .eq('role', 'student')
        const studentList = students || []
        
        // Fetch teachers count
        const { count: teacherCount } = await supabase
          .from('users')
          .select('*', { count: 'exact', head: true })
          .eq('role', 'teacher')

        // Calculate total impact
        const totalImpact = studentList.reduce((sum, s) => sum + (s.impact_score || 0), 0)

        // Fetch recent activity
        const { data: activities } = await supabase
          .from('user_challenges')
          .select('*')
          .order('submitted_at', { ascending: false })
          .limit(5)

        setStats({
          totalInstitutions: 1, // Default institution
          totalStudents: studentList.length,
          totalTeachers: teacherCount || 0,
          totalImpact
        })

        setRecentActivity((activities || []).map(a => ({
          id: a.id,
          challengeTitle: a.challenge_id || 'Challenge',
          submittedAt: a.submitted_at,
          status: a.status
        })))
      } catch (error) {
        console.error('Error fetching dashboard data:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchDashboardData()
  }, [currentUser])

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

      if (error) {
        console.warn('Error creating challenge:', error.message)
      } else {
        setCreateSuccess(`Challenge "${newChallenge.title}" uploaded successfully! 🎉`)
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
      }
    } catch (err) {
      console.error('Error creating challenge:', err)
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
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-slate-900">
          Institution Dashboard
        </h1>
        <p className="mt-2 text-slate-600">
          Overview of your institution's environmental impact
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <StatCard
          icon={<Building className="h-6 w-6 text-blue-500" />}
          label="Institutions"
          value={stats.totalInstitutions}
          color="blue"
        />
        <StatCard
          icon={<Users className="h-6 w-6 text-green-500" />}
          label="Total Students"
          value={stats.totalStudents}
          color="green"
        />
        <StatCard
          icon={<Award className="h-6 w-6 text-purple-500" />}
          label="Total Teachers"
          value={stats.totalTeachers}
          color="purple"
        />
        <StatCard
          icon={<TrendingUp className="h-6 w-6 text-orange-500" />}
          label="Total Impact Score"
          value={stats.totalImpact}
          color="orange"
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-6">
          {/* Recent Activity */}
          <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
            <h2 className="text-xl font-semibold text-slate-900 mb-4">
              Recent Activity
            </h2>
            
            {recentActivity.length === 0 ? (
              <div className="text-center py-8">
                <Activity className="h-12 w-12 text-slate-300 mx-auto mb-3" />
                <p className="text-slate-500">No recent activity</p>
              </div>
            ) : (
              <div className="space-y-3">
                {recentActivity.map((activity) => (
                  <ActivityItem key={activity.id} activity={activity} />
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Quick Actions */}
          <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
            <h2 className="text-xl font-semibold text-slate-900 mb-4">
              Quick Actions
            </h2>
            <div className="space-y-3">
              <div onClick={() => setShowCreateModal(true)}>
                <AdminAction
                  icon={<FilePlus className="h-5 w-5" />}
                  label="Upload Challenge"
                  description="Create a new challenge for users"
                />
              </div>
              <AdminAction
                icon={<Users className="h-5 w-5" />}
                label="Manage Users"
                description="Add or remove users and roles"
              />
              <AdminAction
                icon={<Building className="h-5 w-5" />}
                label="Institution Settings"
                description="Configure institution details"
              />
              <AdminAction
                icon={<FileText className="h-5 w-5" />}
                label="Generate Reports"
                description="Create impact and activity reports"
              />
              <AdminAction
                icon={<BarChart3 className="h-5 w-5" />}
                label="Analytics"
                description="View detailed analytics"
              />
              <AdminAction
                icon={<Settings className="h-5 w-5" />}
                label="Platform Settings"
                description="Configure platform-wide settings"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Create Challenge Modal */}
      {showCreateModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-xl relative animate-in fade-in duration-200">
            <h3 className="text-xl font-bold text-slate-900 mb-2">Upload New Challenge</h3>
            <p className="text-slate-600 text-sm mb-4">Create a new environmental challenge for the platform</p>

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
                    Upload Challenge
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
    purple: 'bg-purple-50 border-purple-200',
    orange: 'bg-orange-50 border-orange-200'
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

function ActivityItem({ activity }) {
  return (
    <div className="flex items-center justify-between p-3 bg-slate-50 rounded-lg">
      <div className="flex items-center space-x-3">
        <div className="p-2 bg-white rounded-lg">
          <Activity className="h-5 w-5 text-green-500" />
        </div>
        <div>
          <p className="font-medium text-slate-900 text-sm">
            {activity.challengeTitle || 'Challenge'}
          </p>
          <p className="text-xs text-slate-500">
            {new Date(activity.submittedAt).toLocaleDateString()}
          </p>
        </div>
      </div>
      <span className={`px-2 py-1 rounded-full text-xs font-medium ${
        activity.status === 'approved' ? 'bg-green-100 text-green-800' : 
        activity.status === 'rejected' ? 'bg-red-100 text-red-800' : 
        'bg-yellow-100 text-yellow-800'
      }`}>
        {activity.status}
      </span>
    </div>
  )
}

function AdminAction({ icon, label, description }) {
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