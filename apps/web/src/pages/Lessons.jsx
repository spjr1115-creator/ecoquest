import { useState, useEffect, useMemo } from 'react'
import { Link } from 'react-router-dom'
import { supabase } from '../supabase/supabaseClient'
import { useAuth } from '../context/AuthContext'
import { LESSONS_DATA } from '../data/lessonsData'
import { BookOpen, Clock, Target, Search, Filter, HelpCircle, CheckCircle, Sparkles } from 'lucide-react'

export default function Lessons() {
  const { currentUser } = useAuth()
  const [lessons, setLessons] = useState(LESSONS_DATA)
  const [completedLessonIds, setCompletedLessonIds] = useState(new Set())
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

  const difficulties = ['all', 'Beginner', 'Intermediate', 'Advanced']

  useEffect(() => {
    async function fetchLessonsAndProgress() {
      try {
        // 1. Fetch lessons from Supabase if available
        const { data: dbLessons, error: lessonError } = await supabase
          .from('lessons')
          .select('*')

        if (!lessonError && dbLessons && dbLessons.length > 0) {
          // Merge db lessons with LESSONS_DATA to preserve rich quizzes/content
          const merged = LESSONS_DATA.map(local => {
            const match = dbLessons.find(db => db.id === local.id || db.title === local.title)
            return match ? { ...local, ...match, quiz: match.quiz || local.quiz } : local
          })

          // Add any newly created db lessons not in local
          dbLessons.forEach(db => {
            if (!merged.some(m => m.id === db.id || m.title === db.title)) {
              merged.push(db)
            }
          })

          setLessons(merged)
        } else {
          setLessons(LESSONS_DATA)
        }

        // 2. Fetch completed lessons for current student
        if (currentUser) {
          const { data: userLessons, error: ulError } = await supabase
            .from('user_lessons')
            .select('lesson_id, completed')
            .eq('user_id', currentUser.id)
            .eq('completed', true)

          if (!ulError && userLessons) {
            setCompletedLessonIds(new Set(userLessons.map(ul => ul.lesson_id)))
          }
        }
      } catch (error) {
        console.error('Error loading lessons:', error)
        setLessons(LESSONS_DATA)
      } finally {
        setLoading(false)
      }
    }

    fetchLessonsAndProgress()

    const channel = supabase
      .channel('public:lessons')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'lessons' }, (payload) => {
        if (payload.eventType === 'INSERT') {
          setLessons(prev => [payload.new, ...prev])
        } else if (payload.eventType === 'UPDATE') {
          setLessons(prev => prev.map(l => l.id === payload.new.id ? { ...l, ...payload.new } : l))
        } else if (payload.eventType === 'DELETE') {
          setLessons(prev => prev.filter(l => l.id !== payload.old.id))
        }
      })
      .subscribe()

    return () => {
      supabase.removeChannel(channel)
    }
  }, [currentUser])

  const filteredLessons = useMemo(() => {
    let filtered = lessons

    if (searchTerm.trim()) {
      const term = searchTerm.toLowerCase()
      filtered = filtered.filter(lesson =>
        (lesson.title && lesson.title.toLowerCase().includes(term)) ||
        (lesson.description && lesson.description.toLowerCase().includes(term)) ||
        (lesson.category && lesson.category.toLowerCase().includes(term))
      )
    }

    if (selectedCategory !== 'all') {
      filtered = filtered.filter(lesson => lesson.category === selectedCategory)
    }

    if (selectedDifficulty !== 'all') {
      filtered = filtered.filter(lesson => lesson.difficulty === selectedDifficulty)
    }

    return filtered
  }, [searchTerm, selectedCategory, selectedDifficulty, lessons])

  const completedCount = completedLessonIds.size
  const totalXpAvailable = lessons.reduce((sum, l) => sum + (Number(l.xp) || 20) + ((l.quiz?.length || 3) * 10), 0)

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600"></div>
      </div>
    )
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-emerald-700 via-green-600 to-teal-700 rounded-3xl p-6 sm:p-10 text-white mb-8 shadow-lg shadow-emerald-900/10">
        <div className="max-w-3xl">
          <div className="inline-flex items-center space-x-2 px-3 py-1 bg-white/20 backdrop-blur-md rounded-full text-xs font-semibold uppercase tracking-wider mb-4 border border-white/20">
            <Sparkles className="h-3.5 w-3.5 text-yellow-300" />
            <span>Interactive Environmental Curriculum</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight mb-3">
            Environmental Knowledge Academy
          </h1>
          <p className="text-emerald-50 text-base sm:text-lg leading-relaxed mb-6">
            Master fundamental ecological science across 10 vital sustainability disciplines. Complete readings, test your mastery with interactive quizzes, and earn XP to level up your green avatar.
          </p>

          {/* Quick Metrics Pills */}
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 pt-4 border-t border-white/15 text-sm">
            <div>
              <p className="text-xs text-emerald-200 uppercase font-medium">Available Lessons</p>
              <p className="text-xl font-extrabold">{lessons.length} Modules</p>
            </div>
            <div>
              <p className="text-xs text-emerald-200 uppercase font-medium">Completed by You</p>
              <p className="text-xl font-extrabold text-emerald-200">{completedCount} of {lessons.length}</p>
            </div>
            <div className="col-span-2 sm:col-span-1">
              <p className="text-xs text-emerald-200 uppercase font-medium">Total Potential Reward</p>
              <p className="text-xl font-extrabold text-yellow-300">+{totalXpAvailable} XP</p>
            </div>
          </div>
        </div>
      </div>

      {/* Search and Filters Bar */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm mb-8 flex flex-col md:flex-row gap-3 items-center justify-between">
        {/* Search */}
        <div className="relative w-full md:flex-1">
          <Search className="absolute left-3.5 top-1/2 transform -translate-y-1/2 h-4 w-4 text-slate-400" />
          <input
            type="text"
            placeholder="Search lessons by title, topic, or concept (e.g. 5Rs, microplastics, methane)..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:bg-white transition-all"
          />
        </div>

        <div className="flex flex-wrap sm:flex-nowrap gap-3 w-full md:w-auto">
          {/* Category Dropdown */}
          <div className="relative flex-1 sm:w-56">
            <Filter className="absolute left-3.5 top-1/2 transform -translate-y-1/2 h-4 w-4 text-slate-400 pointer-events-none" />
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="w-full pl-10 pr-8 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 appearance-none cursor-pointer bg-white"
            >
              {categories.map(category => (
                <option key={category} value={category}>
                  {category === 'all' ? 'All Categories (10)' : category}
                </option>
              ))}
            </select>
          </div>

          {/* Difficulty Dropdown */}
          <div className="relative flex-1 sm:w-44">
            <select
              value={selectedDifficulty}
              onChange={(e) => setSelectedDifficulty(e.target.value)}
              className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 appearance-none cursor-pointer bg-white"
            >
              {difficulties.map(diff => (
                <option key={diff} value={diff}>
                  {diff === 'all' ? 'All Difficulties' : diff}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Lessons Grid */}
      {filteredLessons.length === 0 ? (
        <div className="text-center py-16 bg-white rounded-2xl border border-slate-200">
          <BookOpen className="h-12 w-12 text-slate-300 mx-auto mb-3" />
          <h3 className="text-base font-bold text-slate-800">No lessons matched your search</h3>
          <p className="text-slate-500 text-sm mt-1">Try searching for a different keyword or resetting the category filter.</p>
          <button
            onClick={() => { setSearchTerm(''); setSelectedCategory('all'); setSelectedDifficulty('all'); }}
            className="mt-4 px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg text-sm font-medium transition-colors"
          >
            Reset Filters
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredLessons.map(lesson => (
            <LessonCard 
              key={lesson.id} 
              lesson={lesson} 
              isCompleted={completedLessonIds.has(lesson.id)}
            />
          ))}
        </div>
      )}
    </div>
  )
}

function LessonCard({ lesson, isCompleted }) {
  const difficultyColors = {
    Beginner: 'bg-green-50 text-green-700 border-green-200',
    Intermediate: 'bg-amber-50 text-amber-700 border-amber-200',
    Advanced: 'bg-rose-50 text-rose-700 border-rose-200'
  }

  const quizCount = lesson.quiz?.length || 3
  const totalLessonXp = (Number(lesson.xp) || 20) + (quizCount * 10)

  return (
    <Link
      to={`/lessons/${lesson.id}`}
      className="group flex flex-col justify-between bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden hover:shadow-md hover:border-emerald-300 transition-all duration-200"
    >
      <div className="p-6">
        {/* Header Tags */}
        <div className="flex items-center justify-between gap-2 mb-3">
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold bg-emerald-50 text-emerald-800 border border-emerald-100">
            {lesson.category}
          </span>
          <div className="flex items-center space-x-1.5">
            <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium border ${difficultyColors[lesson.difficulty] || difficultyColors.Beginner}`}>
              {lesson.difficulty}
            </span>
            {isCompleted && (
              <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-semibold bg-green-100 text-green-800" title="Completed">
                <CheckCircle className="h-3 w-3 mr-0.5 text-green-600" /> Done
              </span>
            )}
          </div>
        </div>

        {/* Title */}
        <h3 className="text-lg font-bold text-slate-900 mb-2 group-hover:text-emerald-600 transition-colors leading-snug">
          {lesson.title}
        </h3>
        
        {/* Description */}
        <p className="text-slate-600 text-sm mb-4 line-clamp-3 leading-relaxed">
          {lesson.description}
        </p>
      </div>

      {/* Footer Metrics */}
      <div className="px-6 py-4 bg-slate-50 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
        <div className="flex items-center space-x-3">
          <span className="flex items-center font-medium">
            <Clock className="h-3.5 w-3.5 mr-1 text-slate-400" />
            {lesson.duration}
          </span>
          <span className="flex items-center text-blue-600 font-medium">
            <HelpCircle className="h-3.5 w-3.5 mr-1" />
            {quizCount} Qs Quiz
          </span>
        </div>
        <span className="flex items-center font-bold text-amber-600 bg-amber-50 px-2 py-1 rounded-lg border border-amber-100">
          <Target className="h-3.5 w-3.5 mr-1" />
          +{totalLessonXp} XP
        </span>
      </div>
    </Link>
  )
}
