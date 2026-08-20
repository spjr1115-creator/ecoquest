import { useState, useEffect } from 'react'
import { db } from '../firebase/config'
import { collection, getDocs } from 'firebase/firestore'
import { BookOpen, Clock, Target, Search, Filter } from 'lucide-react'

export default function Lessons() {
  const [lessons, setLessons] = useState([])
  const [filteredLessons, setFilteredLessons] = useState([])
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedCategory, setSelectedCategory] = useState('all')
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

  useEffect(() => {
    async function fetchLessons() {
      try {
        const lessonsSnapshot = await getDocs(collection(db, 'lessons'))
        const lessonsData = lessonsSnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        }))
        setLessons(lessonsData)
        setFilteredLessons(lessonsData)
      } catch (error) {
        console.error('Error fetching lessons:', error)
        // Set enhanced mock data for demo
        const mockLessons = [
          {
            id: '1',
            title: 'Introduction to Waste Management',
            category: 'Waste Management',
            description: 'Learn the fundamentals of waste management and discover how your daily choices impact our environment.',
            duration: '20 min',
            difficulty: 'Beginner',
            xp: 15
          },
          {
            id: '2',
            title: 'The Art of Recycling: Beyond the Basics',
            category: 'Recycling',
            description: 'Master the art of recycling with detailed guidance on materials, processes, and common mistakes.',
            duration: '25 min',
            difficulty: 'Beginner',
            xp: 20
          },
          {
            id: '3',
            title: 'Water Conservation: Every Drop Counts',
            category: 'Water Conservation',
            description: 'Master water conservation techniques with practical solutions for home, garden, and daily life.',
            duration: '30 min',
            difficulty: 'Intermediate',
            xp: 25
          },
          {
            id: '4',
            title: 'Climate Change: Understanding Our Impact',
            category: 'Climate Change',
            description: 'Comprehensive guide to climate change science, impacts, and actionable solutions for individuals.',
            duration: '35 min',
            difficulty: 'Intermediate',
            xp: 30
          },
          {
            id: '5',
            title: 'Energy Conservation: Power Your Home Sustainably',
            category: 'Energy Conservation',
            description: 'Master energy conservation with practical strategies for home, appliances, and daily habits that save money and planet.',
            duration: '25 min',
            difficulty: 'Beginner',
            xp: 20
          },
          {
            id: '6',
            title: 'Biodiversity: The Web of Life',
            category: 'Biodiversity',
            description: 'Explore the intricate connections in ecosystems and discover why biodiversity is essential for human survival.',
            duration: '40 min',
            difficulty: 'Advanced',
            xp: 35
          }
        ]
        setLessons(mockLessons)
        setFilteredLessons(mockLessons)
      } finally {
        setLoading(false)
      }
    }

    fetchLessons()
  }, [])

  useEffect(() => {
    let filtered = lessons

    if (searchTerm) {
      filtered = filtered.filter(lesson =>
        lesson.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        lesson.description.toLowerCase().includes(searchTerm.toLowerCase())
      )
    }

    if (selectedCategory !== 'all') {
      filtered = filtered.filter(lesson => lesson.category === selectedCategory)
    }

    setFilteredLessons(filtered)
  }, [searchTerm, selectedCategory, lessons])

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
          Environmental Lessons
        </h1>
        <p className="mt-2 text-slate-600">
          Learn about environmental topics and earn XP
        </p>
      </div>

      {/* Search and Filter */}
      <div className="mb-6 flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-slate-400" />
          <input
            type="text"
            placeholder="Search lessons..."
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
      </div>

      {/* Lessons Grid */}
      {filteredLessons.length === 0 ? (
        <div className="text-center py-12">
          <BookOpen className="h-12 w-12 text-slate-300 mx-auto mb-3" />
          <p className="text-slate-500">No lessons found matching your criteria.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredLessons.map(lesson => (
            <LessonCard key={lesson.id} lesson={lesson} />
          ))}
        </div>
      )}
    </div>
  )
}

function LessonCard({ lesson }) {
  const difficultyColors = {
    Beginner: 'bg-green-100 text-green-800',
    Intermediate: 'bg-yellow-100 text-yellow-800',
    Advanced: 'bg-red-100 text-red-800'
  }

  return (
    <a
      href={`/lessons/${lesson.id}`}
      className="block bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden hover:shadow-md transition-shadow"
    >
      <div className="p-6">
        <div className="flex items-start justify-between mb-3">
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
            {lesson.category}
          </span>
          <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${difficultyColors[lesson.difficulty]}`}>
            {lesson.difficulty}
          </span>
        </div>

        <h3 className="text-lg font-semibold text-slate-900 mb-2">
          {lesson.title}
        </h3>
        
        <p className="text-slate-600 text-sm mb-4 line-clamp-2">
          {lesson.description}
        </p>

        <div className="flex items-center justify-between text-sm">
          <div className="flex items-center space-x-4 text-slate-500">
            <span className="flex items-center">
              <Clock className="h-4 w-4 mr-1" />
              {lesson.duration}
            </span>
            <span className="flex items-center text-yellow-600">
              <Target className="h-4 w-4 mr-1" />
              {lesson.xp} XP
            </span>
          </div>
        </div>
      </div>
    </a>
  )
}