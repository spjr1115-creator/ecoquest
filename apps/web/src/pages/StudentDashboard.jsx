import { useState, useEffect } from 'react'
import { useAuth } from '../context/AuthContext'
import { supabase } from '../supabase/supabaseClient'
import { Link } from 'react-router-dom'
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
  const [showActionModal, setShowActionModal] = useState(false)
  const [selectedAction, setSelectedAction] = useState('Reusable Water Bottle')
  const [actionSuccess, setActionSuccess] = useState('')

  const dailyActions = [
    { title: 'Used Reusable Bottle', xp: 15, icon: '🚰' },
    { title: 'Biked / Walked to Class', xp: 20, icon: '🚲' },
    { title: 'Zero Food Waste Lunch', xp: 15, icon: '🥗' },
    { title: 'Turned off Unused Electronics', xp: 10, icon: '💡' }
  ]

  useEffect(() => {
    async function fetchDashboardData() {
      if (!currentUser) return

      try {
        const fallbackProfile = {
          name: currentUser.user_metadata?.name || currentUser.email?.split('@')[0] || 'Eco Student',
          xp: 150,
          level: 2,
          streak: 3,
          impact_score: 18,
          badges: [{ name: 'Eco Starter', emoji: '🌱' }, { name: 'Water Guard', emoji: '💧' }]
        }

        // Fetch user profile from Supabase
        const { data: userDoc, error: userError } = await supabase
          .from('users')
          .select('*')
          .eq('id', currentUser.id)
          .maybeSingle()

        if (userError) console.error('Error fetching user profile:', userError)
        setUserData(userDoc || fallbackProfile)

        // Fetch recent submissions/user challenges
        const { data: activities, error: actError } = await supabase
          .from('user_challenges')
          .select('*')
          .eq('user_id', currentUser.id)
          .order('submitted_at', { ascending: false })
          .limit(5)

        if (actError) console.error('Error fetching recent activities:', actError)
        if (activities && activities.length > 0) {
          setRecentActivities(activities.map(a => ({
            id: a.id,
            challengeTitle: a.challenge_id || 'Eco Challenge',
            submittedAt: a.submitted_at,
            status: a.status
          })))
        } else {
          setRecentActivities([
            { id: '1', challengeTitle: 'Plastic-Free Day Challenge', submittedAt: new Date().toISOString(), status: 'approved' },
            { id: '2', challengeTitle: 'Water Conservation Audit', submittedAt: new Date(Date.now() - 86400000).toISOString(), status: 'pending' }
          ])
        }

        // Fetch a recommended active challenge
        const { data: challenges, error: chalError } = await supabase
          .from('challenges')
          .select('*')
          .eq('status', 'active')
          .limit(1)

        if (chalError) console.error('Error fetching challenge:', chalError)
        if (challenges && challenges.length > 0) {
          setRecommendedChallenge(challenges[0])
        } else {
          setRecommendedChallenge({
            id: '1',
            title: 'Plastic-Free Day Challenge',
            description: 'Eliminate all single-use plastics for 24 hours to reduce plastic pollution.',
            difficulty: 'Medium',
            xp: 100
          })
        }
      } catch (error) {
        console.error('Error fetching dashboard data:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchDashboardData()

    const channel1 = supabase
      .channel('public:user_challenges:student')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'user_challenges', filter: `user_id=eq.${currentUser?.id}` }, () => {
        fetchDashboardData()
      })
      .subscribe()

    const channel2 = supabase
      .channel('public:challenges:student')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'challenges' }, () => {
        fetchDashboardData()
      })
      .subscribe()

    const channel3 = supabase
      .channel('public:users:student')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'users', filter: `id=eq.${currentUser?.id}` }, () => {
        fetchDashboardData()
      })
      .subscribe()

    return () => {
      supabase.removeChannel(channel1)
      supabase.removeChannel(channel2)
      supabase.removeChannel(channel3)
    }
  }, [currentUser])

  async function handleLogAction() {
    const actionObj = dailyActions.find(a => a.title === selectedAction) || dailyActions[0]
    const xpGained = actionObj.xp

    try {
      const { data: userDoc } = await supabase
        .from('users')
        .select('xp, level, impact_score, streak, badges')
        .eq('id', currentUser.id)
        .maybeSingle()

      if (userDoc) {
        const newXp = (userDoc.xp || 0) + xpGained
        const newImpact = (userDoc.impact_score || 0) + 2
        const newLevel = Math.max(1, Math.floor(newXp / 200) + 1)
        const newStreak = (userDoc.streak || 0) + 1
        const currentBadges = userDoc.badges || []
        const newBadges = currentBadges.length > 0 ? [...currentBadges] : []

        if (!currentBadges.some(b => b.name === 'Daily Doer')) {
          newBadges.push({ name: 'Daily Doer', emoji: '⚡' })
        }
        if (!currentBadges.some(b => b.name === 'Eco Starter') && newXp >= 50) {
          newBadges.push({ name: 'Eco Starter', emoji: '🌱' })
        }

        await supabase
          .from('users')
          .update({
            xp: newXp,
            level: newLevel,
            impact_score: newImpact,
            streak: newStreak,
            badges: newBadges
          })
          .eq('id', currentUser.id)

        setUserData({
          xp: newXp,
          level: newLevel,
          streak: newStreak,
          impact_score: newImpact,
          badges: newBadges,
          name: userDoc.name
        })
      }
    } catch (error) {
      console.error('Error logging daily action:', error)
    }

    setRecentActivities(prev => [
      {
        id: Date.now().toString(),
        challengeTitle: `Daily Action: ${actionObj.title}`,
        submittedAt: new Date().toISOString(),
        status: 'approved'
      },
      ...prev
    ])

    setActionSuccess(`Awesome! You earned +${xpGained} XP for logging "${actionObj.title}"! 🎉`)
    setTimeout(() => {
      setActionSuccess('')
      setShowActionModal(false)
    }, 2000)
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600"></div>
      </div>
    )
  }

  const userXp = userData?.xp || 0
  const userLevel = userData?.level || 1
  const xpForCurrentLevel = (userLevel - 1) * 200
  const xpForNextLevel = userLevel * 200
  const progressPercent = Math.min(100, Math.round(((userXp - xpForCurrentLevel) / 200) * 100))

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-8 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-slate-900">
            Welcome back, {userData?.name?.split(' ')[0] || 'Explorer'}! 👋
          </h1>
          <p className="mt-2 text-slate-600">
            Continue your environmental journey and earn XP!
          </p>
        </div>

        <button
          onClick={() => setShowActionModal(true)}
          className="inline-flex items-center justify-center px-4 py-2.5 bg-gradient-to-r from-green-600 to-emerald-600 text-white rounded-xl font-semibold shadow-sm hover:from-green-500 hover:to-emerald-500 transition-all transform hover:-translate-y-0.5"
        >
          <Zap className="h-5 w-5 mr-2" />
          Log Daily Action (+15 XP)
        </button>
      </div>

      {/* Level Progress Bar */}
      <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-5 mb-8">
        <div className="flex justify-between items-center mb-2">
          <span className="text-sm font-semibold text-slate-700">Level {userLevel} Eco Warrior</span>
          <span className="text-sm font-bold text-green-600">{userXp} / {xpForNextLevel} XP</span>
        </div>
        <div className="w-full bg-slate-100 rounded-full h-3 overflow-hidden">
          <div
            className="bg-gradient-to-r from-green-500 to-emerald-400 h-3 rounded-full transition-all duration-500"
            style={{ width: `${progressPercent}%` }}
          ></div>
        </div>
      </div>

      {/* Action Modal */}
      {showActionModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-xl relative animate-in fade-in zoom-in duration-200">
            <h3 className="text-xl font-bold text-slate-900 mb-2">Log Daily Eco Action</h3>
            <p className="text-slate-600 text-sm mb-4">Select an eco-friendly habit you completed today:</p>

            {actionSuccess ? (
              <div className="bg-green-50 border border-green-200 text-green-800 p-4 rounded-xl text-center font-medium my-4">
                {actionSuccess}
              </div>
            ) : (
              <>
                <div className="space-y-2 mb-6">
                  {dailyActions.map((act) => (
                    <label
                      key={act.title}
                      className={`flex items-center justify-between p-3 rounded-xl border cursor-pointer transition-colors ${
                        selectedAction === act.title
                          ? 'border-green-500 bg-green-50'
                          : 'border-slate-200 hover:border-slate-300'
                      }`}
                    >
                      <div className="flex items-center space-x-3">
                        <span className="text-xl">{act.icon}</span>
                        <span className="font-medium text-slate-800 text-sm">{act.title}</span>
                      </div>
                      <span className="text-xs font-semibold bg-green-100 text-green-700 px-2 py-1 rounded-full">
                        +{act.xp} XP
                      </span>
                      <input
                        type="radio"
                        name="dailyAction"
                        value={act.title}
                        checked={selectedAction === act.title}
                        onChange={() => setSelectedAction(act.title)}
                        className="hidden"
                      />
                    </label>
                  ))}
                </div>

                <div className="flex space-x-3">
                  <button
                    onClick={() => setShowActionModal(false)}
                    className="flex-1 py-2.5 px-4 bg-slate-100 text-slate-700 rounded-xl font-medium hover:bg-slate-200 transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleLogAction}
                    className="flex-1 py-2.5 px-4 bg-green-600 text-white rounded-xl font-medium hover:bg-green-700 transition-colors"
                  >
                    Complete Action
                  </button>
                </div>
              </>
            )}
          </div>
        </div>
      )}

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
          value={userData?.impact_score || 0}
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

              <Link
                to={`/challenges/${recommendedChallenge.id}`}
                className="inline-flex items-center text-green-600 hover:text-green-700 font-medium"
              >
                Start Challenge
                <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
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
    <Link
      to={href}
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
    </Link>
  )
}