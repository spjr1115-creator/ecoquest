import { useState, useEffect } from 'react'
import { db } from '../firebase/config'
import { collection, getDocs, query, where } from 'firebase/firestore'
import { Target, Clock, Search, Filter, Zap, Flame } from 'lucide-react'

export default function Challenges() {
  const [challenges, setChallenges] = useState([])
  const [filteredChallenges, setFilteredChallenges] = useState([])
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
        const challengesQuery = query(
          collection(db, 'challenges'),
          where('status', '==', 'active')
        )
        const challengesSnapshot = await getDocs(challengesQuery)
        const challengesData = challengesSnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        }))
        setChallenges(challengesData)
        setFilteredChallenges(challengesData)
      } catch (error) {
        console.error('Error fetching challenges:', error)
        // Set enhanced mock data for demo
        const mockChallenges = [
          {
            id: '1',
            title: 'Plastic-Free Day Challenge',
            category: 'Plastic Pollution',
            description: 'Eliminate all single-use plastics for 24 hours. This challenge raises awareness about plastic pollution and helps you discover sustainable alternatives.',
            difficulty: 'Medium',
            xp: 100,
            impactValue: 5,
            deadline: '2024-12-31',
            participants: 234
          },
          {
            id: '2',
            title: 'Water Warrior: 7-Day Conservation Challenge',
            category: 'Water Conservation',
            description: 'Reduce your water consumption by 30% for one week through conscious habits and practical water-saving techniques.',
            difficulty: 'Medium',
            xp: 150,
            impactValue: 8,
            deadline: '2024-12-31',
            participants: 189
          },
          {
            id: '3',
            title: 'Energy Saver: Phantom Load Elimination',
            category: 'Energy Conservation',
            description: 'Identify and eliminate phantom energy loads in your home. Electronics consume energy even when "off" - costing you money and increasing your carbon footprint.',
            difficulty: 'Easy',
            xp: 75,
            impactValue: 6,
            deadline: '2024-12-31',
            participants: 312
          },
          {
            id: '4',
            title: 'Community Tree Planting Initiative',
            category: 'Biodiversity',
            description: 'Plant a native tree in your community and commit to its care for the first year. Trees provide countless environmental benefits from carbon sequestration to habitat creation.',
            difficulty: 'Hard',
            xp: 200,
            impactValue: 15,
            deadline: '2024-12-31',
            participants: 87
          },
          {
            id: '5',
            title: 'E-Waste Warrior: Responsible Electronics Disposal',
            category: 'E-Waste',
            description: 'Collect and properly dispose of 5 electronic waste items from your home. E-waste is the fastest-growing waste stream and contains valuable, toxic materials.',
            difficulty: 'Easy',
            xp: 80,
            impactValue: 7,
            deadline: '2024-12-31',
            participants: 156
          },
          {
            id: '6',
            title: 'Zero Waste Week: Minimalist Living Challenge',
            category: 'Waste Management',
            description: 'Produce zero landfill waste for one week through composting, recycling, and conscious consumption. This challenge transforms your relationship with waste.',
            difficulty: 'Hard',
            xp: 250,
            impactValue: 12,
            deadline: '2024-12-31',
            participants: 67
          },
          {
            id: '7',
            title: 'Sustainable Transportation Week',
            category: 'Sustainable Transportation',
            description: 'Replace car trips with sustainable alternatives for one week. Transportation accounts for 29% of US greenhouse gas emissions.',
            difficulty: 'Medium',
            xp: 120,
            impactValue: 9,
            deadline: '2024-12-31',
            participants: 145
          },
          {
            id: '8',
            title: 'Sustainable Shopping Challenge',
            category: 'Sustainable Consumption',
            description: 'Practice conscious consumption for one week by prioritizing second-hand, local, and sustainable products.',
            difficulty: 'Medium',
            xp: 100,
            impactValue: 7,
            deadline: '2024-12-31',
            participants: 178
          },
          {
            id: '9',
            title: 'Carbon Footprint Audit and Reduction',
            category: 'Climate Change',
            description: 'Calculate your carbon footprint and implement strategies to reduce it by 20% over one month.',
            difficulty: 'Hard',
            xp: 200,
            impactValue: 14,
            deadline: '2024-12-31',
            participants: 92
          }
        ]
        setChallenges(mockChallenges)
        setFilteredChallenges(mockChallenges)
      } finally {
        setLoading(false)
      }
    }

    fetchChallenges()
  }, [])

  useEffect(() => {
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

    setFilteredChallenges(filtered)
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
    <a
      href={`/challenges/${challenge.id}`}
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
    </a>
  )
}