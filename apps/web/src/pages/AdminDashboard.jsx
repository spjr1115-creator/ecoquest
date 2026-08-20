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
  Settings
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