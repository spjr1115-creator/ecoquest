import { useState, useEffect } from 'react'
import { useAuth } from '../context/AuthContext'
import { db } from '../firebase/config'
import { 
  collection, 
  query, 
  where, 
  getDocs,
  orderBy,
  doc,
  updateDoc
} from 'firebase/firestore'
import { 
  Users, 
  CheckCircle, 
  Clock, 
  TrendingUp,
  Award,
  FileText,
  Eye,
  Check,
  X
} from 'lucide-react'

export default function TeacherDashboard() {
  const { currentUser } = useAuth()
  const [stats, setStats] = useState({
    totalStudents: 0,
    activeStudents: 0,
    pendingVerifications: 0,
    completedChallenges: 0
  })
  const [pendingSubmissions, setPendingSubmissions] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function fetchDashboardData() {
      if (!currentUser) return

      try {
        // Fetch students (simplified - in production would filter by institution)
        const studentsQuery = query(
          collection(db, 'users'),
          where('role', '==', 'student')
        )
        const studentsSnapshot = await getDocs(studentsQuery)
        const students = studentsSnapshot.docs.map(doc => doc.data())
        
        const activeStudents = students.filter(s => s.streak > 0).length

        // Fetch pending submissions
        const submissionsQuery = query(
          collection(db, 'submissions'),
          where('status', '==', 'pending'),
          orderBy('submittedAt', 'desc')
        )
        const submissionsSnapshot = await getDocs(submissionsQuery)
        const submissions = submissionsSnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        }))

        // Fetch completed challenges count
        const completedQuery = query(
          collection(db, 'submissions'),
          where('status', '==', 'approved')
        )
        const completedSnapshot = await getDocs(completedQuery)

        setStats({
          totalStudents: students.length,
          activeStudents,
          pendingVerifications: submissions.length,
          completedChallenges: completedSnapshot.size
        })

        setPendingSubmissions(submissions.slice(0, 5))
      } catch (error) {
        console.error('Error fetching dashboard data:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchDashboardData()
  }, [currentUser])

  async function handleVerification(submissionId, status) {
    try {
      await updateDoc(doc(db, 'submissions', submissionId), {
        status,
        verifiedAt: new Date().toISOString()
      })
      
      // Refresh the list
      setPendingSubmissions(prev => 
        prev.filter(sub => sub.id !== submissionId)
      )
      setStats(prev => ({
        ...prev,
        pendingVerifications: prev.pendingVerifications - 1
      }))
    } catch (error) {
      console.error('Error updating submission:', error)
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
          Teacher Dashboard
        </h1>
        <p className="mt-2 text-slate-600">
          Monitor student progress and verify submissions
        </p>
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
        {/* Pending Verifications */}
        <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-semibold text-slate-900">
              Pending Verifications
            </h2>
            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
              {stats.pendingVerifications} pending
            </span>
          </div>

          {pendingSubmissions.length === 0 ? (
            <div className="text-center py-8">
              <CheckCircle className="h-12 w-12 text-slate-300 mx-auto mb-3" />
              <p className="text-slate-500">No pending verifications</p>
            </div>
          ) : (
            <div className="space-y-4">
              {pendingSubmissions.map((submission) => (
                <SubmissionCard
                  key={submission.id}
                  submission={submission}
                  onApprove={() => handleVerification(submission.id, 'approved')}
                  onReject={() => handleVerification(submission.id, 'rejected')}
                />
              ))}
            </div>
          )}
        </div>

        {/* Quick Actions */}
        <div className="space-y-6">
          <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
            <h2 className="text-xl font-semibold text-slate-900 mb-4">
              Quick Actions
            </h2>
            <div className="space-y-3">
              <QuickAction
                icon={<FileText className="h-5 w-5" />}
                label="Create Challenge"
                description="Create a new eco-challenge for students"
              />
              <QuickAction
                icon={<Users className="h-5 w-5" />}
                label="View Students"
                description="See all enrolled students and their progress"
              />
              <QuickAction
                icon={<Award className="h-5 w-5" />}
                label="Leaderboard"
                description="View class leaderboard and rankings"
              />
            </div>
          </div>

          <div className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-xl border border-green-200 p-6">
            <h3 className="font-semibold text-slate-900 mb-2">
              Create a Challenge
            </h3>
            <p className="text-sm text-slate-600 mb-4">
              Design custom challenges for your students to complete
            </p>
            <button className="w-full bg-green-600 text-white py-2 px-4 rounded-lg hover:bg-green-700 transition-colors font-medium">
              Create New Challenge
            </button>
          </div>
        </div>
      </div>
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