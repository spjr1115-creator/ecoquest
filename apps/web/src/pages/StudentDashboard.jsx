import { useState, useEffect } from 'react'
import { useAuth } from '../context/AuthContext'
import { db } from '../firebase/config'
import { 
  doc, 
  getDoc, 
  collection, 
  query, 
  where, 
  getDocs,
  orderBy,
  limit
} from 'firebase/firestore'
import { 
  TrendingUp, 
  Award, 
  Zap, 
  Target, 
  Flame,
  BookOpen,
  CheckCircle,
  Clock,
  ArrowRight
} from 'lucide-react'

export default function StudentDashboard() {
  const { currentUser } = useAuth()
  const [userData, setUserData] = useState(null)
  const [recentActivities, setRecentActivities] = useState([])
  const [recommendedChallenge, setRecommendedChallenge] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function fetchDashboardData() {
      if (!currentUser) return

      try {
        // Fetch user data
        const userDoc = await getDoc(doc(db, 'users', currentUser.uid))
        if (userDoc.exists()) {
          setUserData(userDoc.data())
        }

        // Fetch recent submissions
        const submissionsQuery = query(
          collection(db, 'submissions'),
          where('userId', '==', currentUser.uid),
          orderBy('submittedAt', 'desc'),
          limit(5)
        )
        const submissionsSnapshot = await getDocs(submissionsQuery)
        const activities = submissionsSnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        }))
        setRecentActivities(activities)

        // Fetch a recommended challenge (simplified - would use AI in production)
        const challengesQuery = query(
          collection(db, 'challenges'),
          where('status', '==', 'active'),
          limit(1)
        )
        const challengesSnapshot = await getDocs(challengesQuery)
        if (!challengesSnapshot.empty) {
          setRecommendedChallenge({
            id: challengesSnapshot.docs[0].id,
            ...challengesSnapshot.docs[0].data()
          })
        }
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
          Welcome back, {userData?.name?.split(' ')[0]}! 👋
        </h1>
        <p className="mt-2 text-slate-600">
          Continue your environmental journey
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <StatCard
          icon={<Zap className="h-6 w-6 text-yellow-500" />}
          label="Total XP"
          value={userData?.xp || 0}
          color="yellow"
        />
        <StatCard
          icon={<Award className="h-6 w-6 text-purple-500" />}
          label="Level"
          value={userData?.level || 1}
          color="purple"
        />
        <StatCard
          icon={<Flame className="h-6 w-6 text-orange-500" />}
          label="Current Streak"
          value={`${userData?.streak || 0} days`}
          color="orange"
        />
        <StatCard
          icon={<TrendingUp className="h-6 w-6 text-green-500" />}
          label="Impact Score"
          value={userData?.impactScore || 0}
          color="green"
        />
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Column - Recommended Challenge & Recent Activity */}
        <div className="lg:col-span-2 space-y-6">
          {/* Recommended Challenge */}
          {recommendedChallenge && (
            <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-semibold text-slate-900">
                  Recommended Challenge
                </h2>
                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                  For You
                </span>
              </div>
              
              <div className="bg-gradient-to-r from-green-50 to-emerald-50 rounded-lg p-4 mb-4">
                <h3 className="text-lg font-semibold text-slate-900 mb-2">
                  {recommendedChallenge.title}
                </h3>
                <p className="text-slate-600 text-sm mb-3">
                  {recommendedChallenge.description}
                </p>
                <div className="flex items-center space-x-4 text-sm">
                  <span className="flex items-center text-slate-600">
                    <Target className="h-4 w-4 mr-1" />
                    {recommendedChallenge.difficulty}
                  </span>
                  <span className="flex items-center text-yellow-600">
                    <Zap className="h-4 w-4 mr-1" />
                    {recommendedChallenge.xp} XP
                  </span>
                </div>
              </div>

              <a
                href={`/challenges/${recommendedChallenge.id}`}
                className="inline-flex items-center text-green-600 hover:text-green-700 font-medium"
              >
                Start Challenge
                <ArrowRight className="ml-2 h-4 w-4" />
              </a>
            </div>
          )}

          {/* Recent Activities */}
          <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
            <h2 className="text-xl font-semibold text-slate-900 mb-4">
              Recent Activities
            </h2>
            
            {recentActivities.length === 0 ? (
              <div className="text-center py-8">
                <BookOpen className="h-12 w-12 text-slate-300 mx-auto mb-3" />
                <p className="text-slate-500">No activities yet. Start your first challenge!</p>
              </div>
            ) : (
              <div className="space-y-3">
                {recentActivities.map((activity) => (
                  <ActivityItem key={activity.id} activity={activity} />
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Right Column - Badges & Progress */}
        <div className="space-y-6">
          {/* Badges */}
          <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
            <h2 className="text-xl font-semibold text-slate-900 mb-4">
              Your Badges
            </h2>
            
            {userData?.badges?.length === 0 ? (
              <div className="text-center py-8">
                <Award className="h-12 w-12 text-slate-300 mx-auto mb-3" />
                <p className="text-slate-500">Complete challenges to earn badges!</p>
              </div>
            ) : (
              <div className="grid grid-cols-3 gap-3">
                {userData?.badges?.map((badge, index) => (
                  <div
                    key={index}
                    className="aspect-square bg-gradient-to-br from-green-100 to-emerald-100 rounded-lg flex items-center justify-center"
                  >
                    <span className="text-2xl">{badge.emoji}</span>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Quick Actions */}
          <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
            <h2 className="text-xl font-semibold text-slate-900 mb-4">
              Quick Actions
            </h2>
            <div className="space-y-3">
              <QuickAction
                href="/lessons"
                icon={<BookOpen className="h-5 w-5" />}
                label="Browse Lessons"
                description="Learn about environmental topics"
              />
              <QuickAction
                href="/challenges"
                icon={<Target className="h-5 w-5" />}
                label="View Challenges"
                description="Find new eco-challenges"
              />
              <QuickAction
                href="/leaderboard"
                icon={<TrendingUp className="h-5 w-5" />}
                label="Leaderboard"
                description="See how you rank"
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
    yellow: 'bg-yellow-50 border-yellow-200',
    purple: 'bg-purple-50 border-purple-200',
    orange: 'bg-orange-50 border-orange-200',
    green: 'bg-green-50 border-green-200'
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
  const statusColors = {
    pending: 'bg-yellow-100 text-yellow-800',
    approved: 'bg-green-100 text-green-800',
    rejected: 'bg-red-100 text-red-800'
  }

  return (
    <div className="flex items-center justify-between p-3 bg-slate-50 rounded-lg">
      <div className="flex items-center space-x-3">
        <div className="p-2 bg-white rounded-lg">
          {activity.status === 'approved' ? (
            <CheckCircle className="h-5 w-5 text-green-500" />
          ) : (
            <Clock className="h-5 w-5 text-yellow-500" />
          )}
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
      <span className={`px-2 py-1 rounded-full text-xs font-medium ${statusColors[activity.status]}`}>
        {activity.status}
      </span>
    </div>
  )
}

function QuickAction({ href, icon, label, description }) {
  return (
    <a
      href={href}
      className="block p-4 rounded-lg border border-slate-200 hover:border-green-300 hover:bg-green-50 transition-colors"
    >
      <div className="flex items-start space-x-3">
        <div className="p-2 bg-green-100 rounded-lg text-green-600">
          {icon}
        </div>
        <div>
          <p className="font-medium text-slate-900">{label}</p>
          <p className="text-sm text-slate-500">{description}</p>
        </div>
      </div>
    </a>
  )
}