import { useState, useEffect } from 'react'
import { db } from '../firebase/config'
import { collection, getDocs, query, orderBy, limit } from 'firebase/firestore'
import { Trophy, Medal, Award, TrendingUp, Users, Building } from 'lucide-react'

export default function Leaderboard() {
  const [activeTab, setActiveTab] = useState('individual')
  const [leaderboard, setLeaderboard] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function fetchLeaderboard() {
      try {
        let query
        
        if (activeTab === 'individual') {
          query = query(
            collection(db, 'users'),
            where('role', '==', 'student'),
            orderBy('xp', 'desc'),
            limit(20)
          )
        } else if (activeTab === 'class') {
          // Mock class data
          setLeaderboard([
            { name: 'Class 10-A', xp: 2450, impact: 120, rank: 1 },
            { name: 'Class 11-B', xp: 2100, impact: 105, rank: 2 },
            { name: 'Class 12-C', xp: 1890, impact: 95, rank: 3 },
            { name: 'Class 9-D', xp: 1750, impact: 88, rank: 4 },
            { name: 'Class 10-E', xp: 1620, impact: 81, rank: 5 },
          ])
          setLoading(false)
          return
        } else if (activeTab === 'institution') {
          // Mock institution data
          setLeaderboard([
            { name: 'Green Valley High School', xp: 15420, impact: 771, rank: 1 },
            { name: 'Eco Academy', xp: 12350, impact: 617, rank: 2 },
            { name: 'Sustainable College', xp: 10890, impact: 544, rank: 3 },
            { name: 'Nature School', xp: 9750, impact: 487, rank: 4 },
            { name: 'Environmental Institute', xp: 8920, impact: 446, rank: 5 },
          ])
          setLoading(false)
          return
        }

        const snapshot = await getDocs(query)
        const data = snapshot.docs.map((doc, index) => ({
          id: doc.id,
          rank: index + 1,
          ...doc.data()
        }))
        setLeaderboard(data)
      } catch (error) {
        console.error('Error fetching leaderboard:', error)
        // Set mock data for demo
        setLeaderboard([
          { name: 'Alex Johnson', xp: 3450, impact: 172, rank: 1, level: 12 },
          { name: 'Emma Smith', xp: 3200, impact: 160, rank: 2, level: 11 },
          { name: 'Michael Brown', xp: 2980, impact: 149, rank: 3, level: 10 },
          { name: 'Sarah Davis', xp: 2850, impact: 142, rank: 4, level: 10 },
          { name: 'James Wilson', xp: 2700, impact: 135, rank: 5, level: 9 },
          { name: 'Emily Taylor', xp: 2550, impact: 127, rank: 6, level: 9 },
          { name: 'David Martinez', xp: 2400, impact: 120, rank: 7, level: 8 },
          { name: 'Lisa Anderson', xp: 2250, impact: 112, rank: 8, level: 8 },
          { name: 'Robert Thomas', xp: 2100, impact: 105, rank: 9, level: 7 },
          { name: 'Jennifer Garcia', xp: 1950, impact: 97, rank: 10, level: 7 },
        ])
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
          <button
            onClick={() => setActiveTab('class')}
            className={`py-4 px-1 border-b-2 font-medium text-sm transition-colors ${
              activeTab === 'class'
                ? 'border-green-500 text-green-600'
                : 'border-transparent text-slate-500 hover:text-slate-700'
            }`}
          >
            <Award className="h-5 w-5 inline mr-2" />
            Class
          </button>
          <button
            onClick={() => setActiveTab('institution')}
            className={`py-4 px-1 border-b-2 font-medium text-sm transition-colors ${
              activeTab === 'institution'
                ? 'border-green-500 text-green-600'
                : 'border-transparent text-slate-500 hover:text-slate-700'
            }`}
          >
            <Building className="h-5 w-5 inline mr-2" />
            Institution
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