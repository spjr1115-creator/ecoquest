import { useState, useEffect } from 'react'
import { useAuth } from '../context/AuthContext'
import { db } from '../firebase/config'
import { 
  collection, 
  query, 
  where, 
  getDocs,
  orderBy
} from 'firebase/firestore'
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
        const studentsQuery = query(
          collection(db, 'users'),
          where('role', '==', 'student')
        )
        const studentsSnapshot = await getDocs(studentsQuery)
        const students = studentsSnapshot.docs.map(doc => doc.data())
        
        // Fetch teachers
        const teachersQuery = query(
          collection(db, 'users'),
          where('role', '==', 'teacher')
        )
        const teachersSnapshot = await getDocs(teachersQuery)
        
        // Fetch institutions
        const institutionsSnapshot = await getDocs(collection(db, 'institutions'))

        // Calculate total impact
        const totalImpact = students.reduce((sum, student) => sum + (student.impactScore || 0), 0)

        // Fetch recent activity
        const activityQuery = query(
          collection(db, 'submissions'),
          orderBy('submittedAt', 'desc')
        )
        const activitySnapshot = await getDocs(activityQuery)
        const activities = activitySnapshot.docs.slice(0, 5).map(doc => ({
          id: doc.id,
          ...doc.data()
        }))

        setStats({
          totalInstitutions: institutionsSnapshot.size,
          totalStudents: students.length,
          totalTeachers: teachersSnapshot.size,
          totalImpact
        })

        setRecentActivity(activities)
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

          {/* Impact Categories */}
          <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
            <h2 className="text-xl font-semibold text-slate-900 mb-4">
              Environmental Impact by Category
            </h2>
            <div className="space-y-4">
              <ImpactCategory category="Waste Management" value={35} color="green" />
              <ImpactCategory category="Water Conservation" value={25} color="blue" />
              <ImpactCategory category="Energy Conservation" value={20} color="yellow" />
              <ImpactCategory category="Tree Planting" value={15} color="emerald" />
              <ImpactCategory category="E-Waste" value={5} color="purple" />
            </div>
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

          {/* Top Performing Classes */}
          <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
            <h2 className="text-xl font-semibold text-slate-900 mb-4">
              Top Performing Classes
            </h2>
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-slate-700">Class 10-A</span>
                <span className="font-semibold text-green-600">2,450 XP</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-slate-700">Class 11-B</span>
                <span className="font-semibold text-green-600">2,100 XP</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-slate-700">Class 12-C</span>
                <span className="font-semibold text-green-600">1,890 XP</span>
              </div>
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

function ImpactCategory({ category, value, color }) {
  const colorClasses = {
    green: 'bg-green-500',
    blue: 'bg-blue-500',
    yellow: 'bg-yellow-500',
    emerald: 'bg-emerald-500',
    purple: 'bg-purple-500'
  }

  return (
    <div>
      <div className="flex justify-between text-sm mb-1">
        <span className="text-slate-700">{category}</span>
        <span className="font-medium text-slate-900">{value}%</span>
      </div>
      <div className="w-full bg-slate-200 rounded-full h-2">
        <div
          className={`${colorClasses[color]} h-2 rounded-full transition-all`}
          style={{ width: `${value}%` }}
        ></div>
      </div>
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