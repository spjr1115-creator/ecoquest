import { useState, useEffect, useMemo } from 'react'
import { Link } from 'react-router-dom'
import { supabase } from '../supabase/supabaseClient'
import { Target, Clock, Search, Filter, Zap, Flame } from 'lucide-react'

export default function Challenges() {
  const [challenges, setChallenges] = useState([])
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedCategory, setSelectedCategory] = useState('all')
  const [selectedDifficulty, setSelectedDifficulty] = useState('all')
  const [loading, setLoading] = useState(true)

  const categories = [
    'all',
    'Waste Management',
    'Recycling',
    'Water Conservation',
    'Energy Conservation',
    'Climate Change',
    'Biodiversity',
    'Sustainable Transportation',
    'E-Waste',
    'Plastic Pollution',
    'Sustainable Consumption'
  ]

  const difficulties = ['all', 'Easy', 'Medium', 'Hard']

  useEffect(() => {
    async function fetchChallenges() {
      try {
        const { data, error } = await supabase
          .from('challenges')
          .select('*')
          .eq('status', 'active')

        if (error) throw error
        if (data && data.length > 0) {
          setChallenges(data)
          return
        }
      } catch (error) {
        console.error('Error fetching challenges from Supabase:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchChallenges()

    const channel = supabase
      .channel('public:challenges')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'challenges' }, (payload) => {
        if (payload.eventType === 'INSERT') {
          if (payload.new.status === 'active') {
            setChallenges(prev => [payload.new, ...prev])
          }
        } else if (payload.eventType === 'UPDATE') {
          if (payload.new.status === 'active') {
            setChallenges(prev => {
              const exists = prev.some(c => c.id === payload.new.id)
              if (exists) {
                return prev.map(c => c.id === payload.new.id ? payload.new : c)
              } else {
                return [payload.new, ...prev]
              }
            })
          } else {
            setChallenges(prev => prev.filter(c => c.id !== payload.new.id))
          }
        } else if (payload.eventType === 'DELETE') {
          setChallenges(prev => prev.filter(c => c.id !== payload.old.id))
        }
      })
      .subscribe()

    return () => {
      supabase.removeChannel(channel)
    }
  }, [])

  const filteredChallenges = useMemo(() => {
    let filtered = challenges

    if (searchTerm) {
      filtered = filtered.filter(challenge =>
        challenge.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        challenge.description.toLowerCase().includes(searchTerm.toLowerCase())
      )
    }

    if (selectedCategory !== 'all') {
      filtered = filtered.filter(challenge => challenge.category === selectedCategory)
    }

    if (selectedDifficulty !== 'all') {
      filtered = filtered.filter(challenge => challenge.difficulty === selectedDifficulty)
    }

    return filtered
  }, [searchTerm, selectedCategory, selectedDifficulty, challenges])

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
          Eco Challenges
        </h1>
        <p className="mt-2 text-slate-600">
          Take on challenges and make a real environmental impact
        </p>
      </div>

      {/* Search and Filter */}
      <div className="mb-6 flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-slate-400" />
          <input
            type="text"
            placeholder="Search challenges..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
          />
        </div>
        <div className="relative">
          <Filter className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-slate-400" />
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="pl-10 pr-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent appearance-none bg-white"
          >
            {categories.map(category => (
              <option key={category} value={category}>
                {category === 'all' ? 'All Categories' : category}
              </option>
            ))}
          </select>
        </div>
        <div className="relative">
          <select
            value={selectedDifficulty}
            onChange={(e) => setSelectedDifficulty(e.target.value)}
            className="pl-4 pr-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent appearance-none bg-white"
          >
            {difficulties.map(difficulty => (
              <option key={difficulty} value={difficulty}>
                {difficulty === 'all' ? 'All Difficulties' : difficulty}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Challenges Grid */}
      {filteredChallenges.length === 0 ? (
        <div className="text-center py-12">
          <Target className="h-12 w-12 text-slate-300 mx-auto mb-3" />
          <p className="text-slate-500">No challenges found matching your criteria.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredChallenges.map(challenge => (
            <ChallengeCard key={challenge.id} challenge={challenge} />
          ))}
        </div>
      )}
    </div>
  )
}

function ChallengeCard({ challenge }) {
  const difficultyColors = {
    Easy: 'bg-green-100 text-green-800',
    Medium: 'bg-yellow-100 text-yellow-800',
    Hard: 'bg-red-100 text-red-800'
  }

  return (
    <Link
      to={`/challenges/${challenge.id}`}
      className="block bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden hover:shadow-md transition-shadow"
    >
      <div className="p-6">
        <div className="flex items-start justify-between mb-3">
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
            {challenge.category}
          </span>
          <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${difficultyColors[challenge.difficulty]}`}>
            {challenge.difficulty}
          </span>
        </div>

        <h3 className="text-lg font-semibold text-slate-900 mb-2">
          {challenge.title}
        </h3>
        
        <p className="text-slate-600 text-sm mb-4 line-clamp-2">
          {challenge.description}
        </p>

        <div className="flex items-center justify-between text-sm mb-3">
          <div className="flex items-center space-x-4 text-slate-500">
            <span className="flex items-center">
              <Flame className="h-4 w-4 mr-1" />
              {challenge.participants}
            </span>
            <span className="flex items-center">
              <Clock className="h-4 w-4 mr-1" />
              {new Date(challenge.deadline).toLocaleDateString()}
            </span>
          </div>
        </div>

        <div className="flex items-center justify-between pt-3 border-t border-slate-200">
          <div className="flex items-center space-x-3">
            <span className="flex items-center text-yellow-600 font-semibold">
              <Zap className="h-4 w-4 mr-1" />
              {challenge.xp} XP
            </span>
            <span className="flex items-center text-green-600 font-semibold">
              <Target className="h-4 w-4 mr-1" />
              +{challenge.impactValue} Impact
            </span>
          </div>
        </div>
      </div>
    </Link>
  )
}
