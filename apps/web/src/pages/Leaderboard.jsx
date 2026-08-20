import { useState, useEffect } from 'react'
import { supabase } from '../supabase/supabaseClient'
import { Trophy, Medal, Award, TrendingUp, Users } from 'lucide-react'

export default function Leaderboard() {
  const [activeTab, setActiveTab] = useState('individual')
  const [leaderboard, setLeaderboard] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function fetchLeaderboard() {
      try {
        if (activeTab === 'individual') {
          const { data, error } = await supabase
            .from('users')
            .select('id, name, xp, impact_score, level')
            .eq('role', 'student')
            .order('xp', { ascending: false })
            .limit(20)

          if (error) throw error
          if (data && data.length > 0) {
            setLeaderboard(data.map((user, index) => ({
              id: user.id,
              rank: index + 1,
              name: user.name,
              xp: user.xp || 0,
              impact: user.impact_score || 0,
              level: user.level || 1
            })))
            return
          }
        }
      } catch (error) {
        console.error('Error fetching leaderboard:', error)
        setLeaderboard([])
      } finally {
        setLoading(false)
      }
    }

    fetchLeaderboard()
  }, [activeTab])

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
          Leaderboard
        </h1>
        <p className="mt-2 text-slate-600">
          See how you rank among other eco-warriors
        </p>
      </div>

      {/* Tabs */}
      <div className="mb-6 border-b border-slate-200">
        <nav className="flex space-x-8">
          <button
            onClick={() => setActiveTab('individual')}
            className={`py-4 px-1 border-b-2 font-medium text-sm transition-colors ${
              activeTab === 'individual'
                ? 'border-green-500 text-green-600'
                : 'border-transparent text-slate-500 hover:text-slate-700'
            }`}
          >
            <Users className="h-5 w-5 inline mr-2" />
            Individual
          </button>
        </nav>
      </div>

      {/* Top 3 Podium */}
      {leaderboard.length >= 3 && (
        <div className="mb-8 flex items-end justify-center space-x-4">
          {/* 2nd Place */}
          <div className="text-center">
            <div className="relative">
              <div className="w-20 h-20 mx-auto rounded-full bg-gradient-to-br from-slate-200 to-slate-300 flex items-center justify-center mb-2 border-4 border-slate-300">
                <Medal className="h-10 w-10 text-slate-500" />
              </div>
              <div className="absolute -top-2 left-1/2 transform -translate-x-1/2 bg-slate-400 text-white w-8 h-8 rounded-full flex items-center justify-center font-bold">
                2
              </div>
            </div>
            <p className="font-semibold text-slate-900 mt-2">{leaderboard[1].name}</p>
            <p className="text-sm text-slate-600">{leaderboard[1].xp} XP</p>
            <div className="h-24 bg-gradient-to-t from-slate-200 to-slate-100 rounded-t-lg mt-2 w-24 mx-auto"></div>
          </div>

          {/* 1st Place */}
          <div className="text-center">
            <div className="relative">
              <div className="w-24 h-24 mx-auto rounded-full bg-gradient-to-br from-yellow-200 to-yellow-400 flex items-center justify-center mb-2 border-4 border-yellow-400">
                <Trophy className="h-12 w-12 text-yellow-600" />
              </div>
              <div className="absolute -top-2 left-1/2 transform -translate-x-1/2 bg-yellow-500 text-white w-8 h-8 rounded-full flex items-center justify-center font-bold">
                1
              </div>
            </div>
            <p className="font-semibold text-slate-900 mt-2">{leaderboard[0].name}</p>
            <p className="text-sm text-slate-600">{leaderboard[0].xp} XP</p>
            <div className="h-32 bg-gradient-to-t from-yellow-200 to-yellow-100 rounded-t-lg mt-2 w-24 mx-auto"></div>
          </div>

          {/* 3rd Place */}
          <div className="text-center">
            <div className="relative">
              <div className="w-20 h-20 mx-auto rounded-full bg-gradient-to-br from-orange-200 to-orange-300 flex items-center justify-center mb-2 border-4 border-orange-300">
                <Award className="h-10 w-10 text-orange-500" />
              </div>
              <div className="absolute -top-2 left-1/2 transform -translate-x-1/2 bg-orange-400 text-white w-8 h-8 rounded-full flex items-center justify-center font-bold">
                3
              </div>
            </div>
            <p className="font-semibold text-slate-900 mt-2">{leaderboard[2].name}</p>
            <p className="text-sm text-slate-600">{leaderboard[2].xp} XP</p>
            <div className="h-16 bg-gradient-to-t from-orange-200 to-orange-100 rounded-t-lg mt-2 w-24 mx-auto"></div>
          </div>
        </div>
      )}

      {/* Full Leaderboard */}
      <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
        <table className="min-w-full divide-y divide-slate-200">
          <thead className="bg-slate-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">
                Rank
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">
                Name
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">
                XP
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">
                Impact Score
              </th>
              {activeTab === 'individual' && (
                <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">
                  Level
                </th>
              )}
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-slate-200">
            {leaderboard.map((entry) => (
              <tr key={entry.id || entry.rank} className="hover:bg-slate-50">
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className={`inline-flex items-center justify-center w-8 h-8 rounded-full font-bold ${
                    entry.rank === 1 ? 'bg-yellow-100 text-yellow-800' :
                    entry.rank === 2 ? 'bg-slate-100 text-slate-800' :
                    entry.rank === 3 ? 'bg-orange-100 text-orange-800' :
                    'bg-slate-50 text-slate-600'
                  }`}>
                    {entry.rank}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex items-center">
                    <div className="flex-shrink-0 h-10 w-10">
                      <div className="h-10 w-10 rounded-full bg-green-100 flex items-center justify-center">
                        <span className="text-sm font-semibold text-green-600">
                          {entry.name.charAt(0)}
                        </span>
                      </div>
                    </div>
                    <div className="ml-4">
                      <div className="text-sm font-medium text-slate-900">{entry.name}</div>
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex items-center text-yellow-600">
                    <TrendingUp className="h-4 w-4 mr-1" />
                    <span className="text-sm font-semibold">{entry.xp}</span>
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-green-600 font-semibold">
                  {entry.impact}
                </td>
                {activeTab === 'individual' && (
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-900">
                    {entry.level || '-'}
                  </td>
                )}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}