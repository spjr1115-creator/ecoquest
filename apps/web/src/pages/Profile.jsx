import { useState, useEffect } from 'react'
import { useAuth } from '../context/AuthContext'
import { supabase } from '../supabase/supabaseClient'
import { User, Mail, Award, Zap, TrendingUp, Flame, Edit2, Save, X } from 'lucide-react'

export default function Profile() {
  const { currentUser, userRole } = useAuth()
  const [userData, setUserData] = useState(null)
  const [editing, setEditing] = useState(false)
  const [editedName, setEditedName] = useState('')
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)

  useEffect(() => {
    async function fetchUserData() {
      if (!currentUser) return

      try {
        const { data: userDoc, error } = await supabase
          .from('users')
          .select('*')
          .eq('id', currentUser.id)
          .maybeSingle()

        if (error) console.error('Error fetching user profile:', error)
        
        const fallbackProfile = {
          id: currentUser.id,
          name: currentUser.user_metadata?.name || currentUser.email?.split('@')[0] || 'Eco Explorer',
          email: currentUser.email,
          role: userRole || currentUser.user_metadata?.role || 'student',
          xp: 150,
          level: 2,
          streak: 3,
          impact_score: 15,
          institution_id: currentUser.user_metadata?.institutionId || 'Green Valley High',
          badges: [
            { name: 'Eco Starter', emoji: '🌱' },
            { name: 'Plastic Free Hero', emoji: '🥤' }
          ]
        }

        const profileData = userDoc || fallbackProfile
        setUserData(profileData)
        setEditedName(profileData.name || '')
      } catch (error) {
        console.error('Error fetching user data:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchUserData()
  }, [currentUser, userRole])

  async function handleSave() {
    if (!currentUser) return

    setSaving(true)
    try {
      const { data: existingUser } = await supabase
        .from('users')
        .select('*')
        .eq('id', currentUser.id)
        .maybeSingle()

      const preservedFields = existingUser ? {
        xp: existingUser.xp,
        level: existingUser.level,
        impact_score: existingUser.impact_score,
        streak: existingUser.streak,
        badges: existingUser.badges,
        institution_id: existingUser.institution_id
      } : {}

      const { error } = await supabase
        .from('users')
        .upsert({
          id: currentUser.id,
          email: currentUser.email,
          name: editedName,
          role: userRole || 'student',
          ...preservedFields
        })

      if (error) console.warn('Supabase profile update notice:', error.message)
      setUserData(prev => ({ ...prev, name: editedName }))
      setEditing(false)
    } catch (error) {
      console.error('Error updating profile:', error)
    } finally {
      setSaving(false)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600"></div>
      </div>
    )
  }

  if (!userData) {
    return (
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="text-center">
          <User className="h-12 w-12 text-slate-300 mx-auto mb-3" />
          <p className="text-slate-500">Unable to load profile</p>
        </div>
      </div>
    )
  }

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-slate-900">
          Profile
        </h1>
        <p className="mt-2 text-slate-600">
          Manage your account and view your progress
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Profile Card */}
        <div className="lg:col-span-1">
          <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
            <div className="text-center">
              <div className="mx-auto h-24 w-24 rounded-full bg-gradient-to-br from-green-100 to-emerald-100 flex items-center justify-center mb-4">
                <span className="text-3xl font-bold text-green-600">
                  {userData.name?.charAt(0) || 'U'}
                </span>
              </div>
              
              {editing ? (
                <div className="mb-4">
                  <input
                    type="text"
                    value={editedName}
                    onChange={(e) => setEditedName(e.target.value)}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 text-center"
                  />
                </div>
              ) : (
                <h2 className="text-xl font-semibold text-slate-900 mb-1">
                  {userData.name}
                </h2>
              )}

              <p className="text-sm text-slate-500 mb-4">{userData.email}</p>

              <div className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-green-100 text-green-800 mb-4">
                {userRole?.charAt(0).toUpperCase() + userRole?.slice(1)}
              </div>

              {editing ? (
                <div className="flex space-x-2 justify-center">
                  <button
                    onClick={handleSave}
                    disabled={saving}
                    className="flex items-center px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors text-sm disabled:opacity-50"
                  >
                    <Save className="h-4 w-4 mr-1" />
                    {saving ? 'Saving...' : 'Save'}
                  </button>
                  <button
                    onClick={() => {
                      setEditing(false)
                      setEditedName(userData.name)
                    }}
                    className="flex items-center px-4 py-2 bg-slate-200 text-slate-700 rounded-lg hover:bg-slate-300 transition-colors text-sm"
                  >
                    <X className="h-4 w-4 mr-1" />
                    Cancel
                  </button>
                </div>
              ) : (
                <button
                  onClick={() => setEditing(true)}
                  className="flex items-center justify-center px-4 py-2 bg-slate-100 text-slate-700 rounded-lg hover:bg-slate-200 transition-colors text-sm"
                >
                  <Edit2 className="h-4 w-4 mr-1" />
                  Edit Profile
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Stats and Achievements */}
        <div className="lg:col-span-2 space-y-6">
          {/* Stats Grid */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <StatCard
              icon={<Zap className="h-5 w-5 text-yellow-500" />}
              label="Total XP"
              value={userData.xp || 0}
            />
            <StatCard
              icon={<Award className="h-5 w-5 text-purple-500" />}
              label="Level"
              value={userData.level || 1}
            />
            <StatCard
              icon={<Flame className="h-5 w-5 text-orange-500" />}
              label="Streak"
              value={`${userData.streak || 0} days`}
            />
            <StatCard
              icon={<TrendingUp className="h-5 w-5 text-green-500" />}
              label="Impact"
              value={userData.impact_score ?? userData.impactScore ?? 0}
            />
          </div>

          {/* Badges */}
          <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
            <h3 className="text-lg font-semibold text-slate-900 mb-4">
              Badges Earned
            </h3>
            
            {userData.badges?.length === 0 ? (
              <div className="text-center py-8">
                <Award className="h-12 w-12 text-slate-300 mx-auto mb-3" />
                <p className="text-slate-500">No badges yet. Complete challenges to earn badges!</p>
              </div>
            ) : (
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
                {userData.badges?.map((badge, index) => (
                  <div
                    key={index}
                    className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-lg p-4 text-center border border-green-200"
                  >
                    <div className="text-3xl mb-2">{badge.emoji || '🏆'}</div>
                    <p className="text-sm font-medium text-slate-900">{badge.name}</p>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Account Info */}
          <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
            <h3 className="text-lg font-semibold text-slate-900 mb-4">
              Account Information
            </h3>
            <div className="space-y-4">
              <InfoRow
                icon={<User className="h-5 w-5 text-slate-400" />}
                label="Name"
                value={userData.name}
              />
              <InfoRow
                icon={<Mail className="h-5 w-5 text-slate-400" />}
                label="Email"
                value={userData.email}
              />
              <InfoRow
                icon={<Award className="h-5 w-5 text-slate-400" />}
                label="Role"
                value={userRole?.charAt(0).toUpperCase() + userRole?.slice(1)}
              />
              {(userData.institution_id || userData.institutionId) && (
                <InfoRow
                  icon={<Award className="h-5 w-5 text-slate-400" />}
                  label="Institution ID"
                  value={userData.institution_id || userData.institutionId}
                />
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

function StatCard({ icon, label, value }) {
  return (
    <div className="bg-white rounded-lg border border-slate-200 p-4">
      <div className="flex items-center justify-between mb-2">
        <div className="p-2 bg-slate-50 rounded-lg">{icon}</div>
      </div>
      <p className="text-2xl font-bold text-slate-900">{value}</p>
      <p className="text-xs text-slate-500 mt-1">{label}</p>
    </div>
  )
}

function InfoRow({ icon, label, value }) {
  return (
    <div className="flex items-center space-x-3">
      <div className="p-2 bg-slate-50 rounded-lg">{icon}</div>
      <div className="flex-1">
        <p className="text-sm text-slate-500">{label}</p>
        <p className="text-sm font-medium text-slate-900">{value}</p>
      </div>
    </div>
  )
}