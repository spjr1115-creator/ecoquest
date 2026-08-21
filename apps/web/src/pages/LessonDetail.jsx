import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { supabase } from '../supabase/supabaseClient'
import { LESSONS_DATA } from '../data/lessonsData'
import { 
  ArrowLeft, 
  Clock, 
  Target, 
  CheckCircle, 
  BookOpen, 
  HelpCircle, 
  Sparkles, 
  Check, 
  X, 
  RotateCcw, 
  Award,
  ChevronRight,
  AlertCircle
} from 'lucide-react'

export default function LessonDetail() {
  const { id } = useParams()
  const navigate = useNavigate()
  const { currentUser } = useAuth()
  const [lesson, setLesson] = useState(null)
  const [completed, setCompleted] = useState(false)
  const [loading, setLoading] = useState(true)
  
  // Quiz states
  const [quizState, setQuizState] = useState('ready') // 'ready' | 'active' | 'finished'
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0)
  const [selectedOption, setSelectedOption] = useState(null)
  const [isAnswerSubmitted, setIsAnswerSubmitted] = useState(false)
  const [userAnswers, setUserAnswers] = useState([]) // array of { questionId, selectedIndex, isCorrect }
  const [quizScore, setQuizScore] = useState(0)
  const [awardedXp, setAwardedXp] = useState(0)
  const [bonusEarned, setBonusEarned] = useState(0)

  useEffect(() => {
    async function fetchLesson() {
      try {
        // Try fetching from Supabase first
        const { data, error } = await supabase
          .from('lessons')
          .select('*')
          .eq('id', id)
          .maybeSingle()

        if (error) console.error('Supabase lesson query error:', error)
        
        let foundLesson = data

        // If not found in Supabase or missing detailed content/quiz, fallback to LESSONS_DATA
        if (!foundLesson || !foundLesson.content || !foundLesson.quiz) {
          const fallback = LESSONS_DATA.find(l => l.id === id) ||
            LESSONS_DATA.find(l => l.title.toLowerCase().includes(id.toLowerCase())) ||
            LESSONS_DATA[0]
          
          foundLesson = foundLesson ? { ...fallback, ...foundLesson, quiz: foundLesson.quiz || fallback.quiz, content: foundLesson.content || fallback.content } : fallback
        }

        setLesson(foundLesson)

        // Check if user previously completed this lesson
        if (currentUser) {
          const { data: userLesson } = await supabase
            .from('user_lessons')
            .select('*')
            .eq('user_id', currentUser.id)
            .eq('lesson_id', foundLesson.id)
            .maybeSingle()

          if (userLesson && userLesson.completed) {
            setCompleted(true)
          }
        }
      } catch (error) {
        console.error('Error fetching lesson:', error)
        const fallback = LESSONS_DATA.find(l => l.id === id) || LESSONS_DATA[0]
        setLesson(fallback)
      } finally {
        setLoading(false)
      }
    }

    fetchLesson()
  }, [id, currentUser])

  async function handleMarkLessonComplete() {
    if (!currentUser || !lesson || completed) return

    try {
      const { data: existing } = await supabase
        .from('user_lessons')
        .select('*')
        .eq('user_id', currentUser.id)
        .eq('lesson_id', lesson.id)
        .maybeSingle()

      const baseLessonXp = Number(lesson.xp) || 20

      if (!existing) {
        await supabase.from('user_lessons').insert({
          user_id: currentUser.id,
          lesson_id: lesson.id,
          completed: true
        })

        // Award base XP to user
        const { data: userDoc } = await supabase
          .from('users')
          .select('xp, level, badges')
          .eq('id', currentUser.id)
          .maybeSingle()

        if (userDoc) {
          const newXp = (userDoc.xp || 0) + baseLessonXp
          const newLevel = Math.max(1, Math.floor(newXp / 200) + 1)
          const currentBadges = userDoc.badges || []
          const newBadges = [...currentBadges]

          if (!newBadges.some(b => b.name === 'Knowledge Seeker')) {
            newBadges.push({ name: 'Knowledge Seeker', emoji: '📚', description: 'Completed first environmental lesson' })
          }

          await supabase
            .from('users')
            .update({ xp: newXp, level: newLevel, badges: newBadges })
            .eq('id', currentUser.id)
        }
      }

      setAwardedXp(baseLessonXp)
      setCompleted(true)
    } catch (error) {
      console.error('Error marking lesson complete:', error)
      setCompleted(true)
    }
  }

  function handleStartQuiz() {
    setQuizState('active')
    setCurrentQuestionIndex(0)
    setSelectedOption(null)
    setIsAnswerSubmitted(false)
    setUserAnswers([])
    setQuizScore(0)
  }

  function handleSelectOption(optionIndex) {
    if (isAnswerSubmitted) return
    setSelectedOption(optionIndex)
  }

  function handleSubmitAnswer() {
    if (selectedOption === null || isAnswerSubmitted || !lesson?.quiz) return

    const currentQuestion = lesson.quiz[currentQuestionIndex]
    const isCorrect = selectedOption === currentQuestion.correctIndex

    const answerRecord = {
      questionId: currentQuestion.id || currentQuestionIndex,
      selectedIndex: selectedOption,
      isCorrect
    }

    setUserAnswers(prev => [...prev, answerRecord])
    setIsAnswerSubmitted(true)
  }

  async function handleNextQuestion() {
    if (!lesson?.quiz) return

    if (currentQuestionIndex + 1 < lesson.quiz.length) {
      setCurrentQuestionIndex(prev => prev + 1)
      setSelectedOption(null)
      setIsAnswerSubmitted(false)
    } else {
      // Quiz finished - calculate score and bonus XP
      const finalAnswers = [...userAnswers]
      const totalCorrect = finalAnswers.filter(a => a.isCorrect).length
      setQuizScore(totalCorrect)
      setQuizState('finished')

      // Calculate quiz bonus XP: 10 XP per correct answer
      const bonus = totalCorrect * 10
      setBonusEarned(bonus)

      // Also ensure lesson is marked complete and XP added
      if (currentUser) {
        try {
          const totalReward = (completed ? 0 : Number(lesson.xp) || 20) + bonus
          
          await supabase.from('user_lessons').upsert({
            user_id: currentUser.id,
            lesson_id: lesson.id,
            completed: true
          })

          const { data: userDoc } = await supabase
            .from('users')
            .select('xp, level, badges')
            .eq('id', currentUser.id)
            .maybeSingle()

          if (userDoc) {
            const newXp = (userDoc.xp || 0) + totalReward
            const newLevel = Math.max(1, Math.floor(newXp / 200) + 1)
            const currentBadges = userDoc.badges || []
            const newBadges = [...currentBadges]

            if (!newBadges.some(b => b.name === 'Knowledge Seeker')) {
              newBadges.push({ name: 'Knowledge Seeker', emoji: '📚', description: 'Completed first environmental lesson' })
            }
            if (totalCorrect === lesson.quiz.length && !newBadges.some(b => b.name === 'Eco Ace')) {
              newBadges.push({ name: 'Eco Ace', emoji: '🌟', description: 'Scored 100% on a lesson quiz' })
            }

            await supabase
              .from('users')
              .update({ xp: newXp, level: newLevel, badges: newBadges })
              .eq('id', currentUser.id)
          }

          setCompleted(true)
        } catch (err) {
          console.error('Error saving quiz reward to Supabase:', err)
        }
      }
    }
  }

  function handleRetakeQuiz() {
    handleStartQuiz()
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600"></div>
      </div>
    )
  }

  if (!lesson) {
    return (
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="text-center bg-white p-8 rounded-xl border border-slate-200 shadow-sm">
          <BookOpen className="h-12 w-12 text-slate-400 mx-auto mb-3" />
          <h2 className="text-xl font-bold text-slate-800">Lesson Not Found</h2>
          <p className="text-slate-500 mt-2">The requested lesson could not be loaded.</p>
          <button
            onClick={() => navigate('/lessons')}
            className="mt-4 inline-flex items-center px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 font-medium text-sm"
          >
            <ArrowLeft className="h-4 w-4 mr-2" /> Back to Lessons
          </button>
        </div>
      </div>
    )
  }

  const quizQuestions = lesson.quiz || []
  const currentQuestion = quizQuestions[currentQuestionIndex]

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <button
        onClick={() => navigate('/lessons')}
        className="flex items-center text-slate-600 hover:text-green-600 mb-6 transition-colors font-medium text-sm"
      >
        <ArrowLeft className="h-4 w-4 mr-2" />
        Back to Lessons Catalog
      </button>

      {/* Lesson Main Card */}
      <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden mb-8">
        {/* Header */}
        <div className="bg-gradient-to-r from-emerald-50 via-green-50 to-teal-50 p-6 sm:p-8 border-b border-slate-200">
          <div className="flex flex-wrap items-center justify-between gap-2 mb-3">
            <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold bg-emerald-100 text-emerald-800 border border-emerald-200">
              {lesson.category}
            </span>
            <div className="flex items-center space-x-2">
              <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                lesson.difficulty === 'Beginner' ? 'bg-green-100 text-green-800' :
                lesson.difficulty === 'Intermediate' ? 'bg-amber-100 text-amber-800' :
                'bg-rose-100 text-rose-800'
              }`}>
                {lesson.difficulty}
              </span>
              {completed && (
                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-700">
                  <CheckCircle className="h-3.5 w-3.5 mr-1" /> Completed
                </span>
              )}
            </div>
          </div>

          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 mb-3 tracking-tight">
            {lesson.title}
          </h1>
          <p className="text-slate-600 leading-relaxed max-w-3xl">
            {lesson.description}
          </p>

          <div className="flex flex-wrap items-center gap-6 mt-6 pt-6 border-t border-emerald-100 text-sm">
            <div className="flex items-center text-slate-600">
              <Clock className="h-4 w-4 mr-2 text-emerald-600" />
              <span>{lesson.duration}</span>
            </div>
            <div className="flex items-center text-amber-600 font-semibold">
              <Target className="h-4 w-4 mr-2" />
              <span>+{lesson.xp} Base XP</span>
            </div>
            {quizQuestions.length > 0 && (
              <div className="flex items-center text-blue-600 font-medium">
                <HelpCircle className="h-4 w-4 mr-2" />
                <span>{quizQuestions.length} Questions Quiz (+{quizQuestions.length * 10} XP Bonus)</span>
              </div>
            )}
          </div>
        </div>

        {/* Content Body */}
        <div className="p-6 sm:p-8">
          <div 
            className="prose prose-slate max-w-none prose-headings:text-slate-900 prose-headings:font-bold prose-p:text-slate-700 prose-p:leading-relaxed prose-li:text-slate-700"
            dangerouslySetInnerHTML={{ __html: lesson.content }}
          />
        </div>

        {/* Lesson Reading Completion Bar */}
        <div className="bg-slate-50 p-6 border-t border-slate-200 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div>
            <p className="text-sm font-medium text-slate-900">
              {completed ? 'Lesson Completed' : 'Finished reading the material?'}
            </p>
            <p className="text-xs text-slate-500">
              {completed 
                ? 'Great job! You have earned the base knowledge points. Test your mastery with the quiz below.' 
                : 'Mark as read to claim your XP, or take the interactive quiz directly.'}
            </p>
          </div>

          {!completed ? (
            <button
              onClick={handleMarkLessonComplete}
              className="w-full sm:w-auto inline-flex items-center justify-center px-6 py-2.5 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 font-semibold text-sm shadow-sm transition-colors"
            >
              <CheckCircle className="h-4 w-4 mr-2" /> Mark as Read (+{lesson.xp} XP)
            </button>
          ) : (
            <div className="inline-flex items-center px-4 py-2 bg-emerald-100 text-emerald-800 rounded-lg text-sm font-semibold">
              <CheckCircle className="h-4 w-4 mr-2 text-emerald-600" /> +{lesson.xp} XP Claimed
            </div>
          )}
        </div>
      </div>

      {/* Interactive Quiz Engine Section */}
      {quizQuestions.length > 0 && (
        <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
          {/* Quiz Header */}
          <div className="bg-slate-900 text-white p-6 flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="p-2.5 bg-emerald-500/20 rounded-xl text-emerald-400">
                <HelpCircle className="h-6 w-6" />
              </div>
              <div>
                <h2 className="text-lg font-bold">Interactive Knowledge Quiz</h2>
                <p className="text-xs text-slate-400">Earn up to +{quizQuestions.length * 10} extra bonus XP</p>
              </div>
            </div>
            {quizState === 'active' && (
              <span className="text-xs font-semibold px-3 py-1 bg-slate-800 text-emerald-400 rounded-full border border-slate-700">
                Question {currentQuestionIndex + 1} of {quizQuestions.length}
              </span>
            )}
          </div>

          {/* Quiz State: READY */}
          {quizState === 'ready' && (
            <div className="p-8 text-center">
              <div className="max-w-md mx-auto">
                <div className="w-16 h-16 bg-blue-50 text-blue-600 rounded-2xl flex items-center justify-center mx-auto mb-4">
                  <Sparkles className="h-8 w-8" />
                </div>
                <h3 className="text-xl font-bold text-slate-900 mb-2">Test Your Comprehension</h3>
                <p className="text-slate-600 text-sm mb-6">
                  Answer <strong>{quizQuestions.length} multiple-choice questions</strong> based on this lesson. Get instant explanations for each question and earn +10 XP for each correct answer!
                </p>
                <button
                  onClick={handleStartQuiz}
                  className="w-full inline-flex items-center justify-center px-6 py-3.5 bg-blue-600 text-white font-bold rounded-xl hover:bg-blue-700 shadow-md shadow-blue-600/20 transition-all text-sm"
                >
                  Start Knowledge Quiz (+{quizQuestions.length * 10} XP)
                  <ChevronRight className="h-4 w-4 ml-2" />
                </button>
              </div>
            </div>
          )}

          {/* Quiz State: ACTIVE */}
          {quizState === 'active' && currentQuestion && (
            <div className="p-6 sm:p-8">
              {/* Progress Bar */}
              <div className="w-full bg-slate-100 h-2 rounded-full mb-6 overflow-hidden">
                <div 
                  className="bg-emerald-500 h-2 rounded-full transition-all duration-300"
                  style={{ width: `${((currentQuestionIndex + (isAnswerSubmitted ? 1 : 0)) / quizQuestions.length) * 100}%` }}
                />
              </div>

              {/* Question Text */}
              <div className="mb-6">
                <span className="text-xs font-bold uppercase tracking-wider text-emerald-600 mb-1 block">
                  Question {currentQuestionIndex + 1}
                </span>
                <h3 className="text-lg sm:text-xl font-bold text-slate-900">
                  {currentQuestion.question}
                </h3>
              </div>

              {/* Options List */}
              <div className="space-y-3 mb-6">
                {currentQuestion.options.map((option, idx) => {
                  const isSelected = selectedOption === idx
                  const isCorrect = idx === currentQuestion.correctIndex
                  
                  let optionStyle = "border-slate-200 hover:border-slate-300 hover:bg-slate-50 text-slate-800"

                  if (isAnswerSubmitted) {
                    if (isCorrect) {
                      optionStyle = "border-emerald-500 bg-emerald-50 text-emerald-900 font-semibold"
                    } else if (isSelected && !isCorrect) {
                      optionStyle = "border-rose-500 bg-rose-50 text-rose-900 line-through"
                    } else {
                      optionStyle = "border-slate-200 text-slate-400 opacity-60"
                    }
                  } else if (isSelected) {
                    optionStyle = "border-blue-600 bg-blue-50 text-blue-900 font-medium ring-2 ring-blue-600/20"
                  }

                  return (
                    <button
                      key={idx}
                      onClick={() => handleSelectOption(idx)}
                      disabled={isAnswerSubmitted}
                      className={`w-full p-4 text-left rounded-xl border transition-all flex items-start justify-between ${optionStyle}`}
                    >
                      <div className="flex items-start space-x-3">
                        <span className={`inline-flex items-center justify-center w-6 h-6 rounded-full text-xs font-bold shrink-0 ${
                          isSelected && !isAnswerSubmitted ? 'bg-blue-600 text-white' :
                          isAnswerSubmitted && isCorrect ? 'bg-emerald-600 text-white' :
                          isAnswerSubmitted && isSelected && !isCorrect ? 'bg-rose-600 text-white' :
                          'bg-slate-100 text-slate-600'
                        }`}>
                          {String.fromCharCode(65 + idx)}
                        </span>
                        <span className="text-sm leading-relaxed">{option}</span>
                      </div>

                      {isAnswerSubmitted && isCorrect && (
                        <Check className="h-5 w-5 text-emerald-600 shrink-0 ml-2" />
                      )}
                      {isAnswerSubmitted && isSelected && !isCorrect && (
                        <X className="h-5 w-5 text-rose-600 shrink-0 ml-2" />
                      )}
                    </button>
                  )
                })}
              </div>

              {/* Instant Explanation Box */}
              {isAnswerSubmitted && (
                <div className={`p-4 rounded-xl border mb-6 animate-fadeIn ${
                  selectedOption === currentQuestion.correctIndex 
                    ? 'bg-emerald-50 border-emerald-200 text-emerald-900' 
                    : 'bg-amber-50 border-amber-200 text-amber-900'
                }`}>
                  <div className="flex items-start space-x-2.5">
                    <div className="shrink-0 mt-0.5">
                      {selectedOption === currentQuestion.correctIndex ? (
                        <CheckCircle className="h-5 w-5 text-emerald-600" />
                      ) : (
                        <AlertCircle className="h-5 w-5 text-amber-600" />
                      )}
                    </div>
                    <div>
                      <p className="text-xs font-bold uppercase tracking-wider mb-1">
                        {selectedOption === currentQuestion.correctIndex ? 'Correct! 🌟 (+10 XP)' : 'Explanation'}
                      </p>
                      <p className="text-sm leading-relaxed">
                        {currentQuestion.explanation}
                      </p>
                    </div>
                  </div>
                </div>
              )}

              {/* Action Buttons */}
              <div className="flex justify-end">
                {!isAnswerSubmitted ? (
                  <button
                    onClick={handleSubmitAnswer}
                    disabled={selectedOption === null}
                    className={`px-6 py-2.5 rounded-xl font-semibold text-sm transition-all ${
                      selectedOption !== null 
                        ? 'bg-emerald-600 text-white hover:bg-emerald-700 shadow-md shadow-emerald-600/20' 
                        : 'bg-slate-200 text-slate-400 cursor-not-allowed'
                    }`}
                  >
                    Check Answer
                  </button>
                ) : (
                  <button
                    onClick={handleNextQuestion}
                    className="px-6 py-2.5 bg-blue-600 text-white hover:bg-blue-700 font-semibold text-sm rounded-xl shadow-md shadow-blue-600/20 flex items-center transition-all"
                  >
                    <span>{currentQuestionIndex + 1 < quizQuestions.length ? 'Next Question' : 'View Results'}</span>
                    <ChevronRight className="h-4 w-4 ml-1" />
                  </button>
                )}
              </div>
            </div>
          )}

          {/* Quiz State: FINISHED */}
          {quizState === 'finished' && (
            <div className="p-8 text-center">
              <div className="max-w-md mx-auto">
                <div className="w-20 h-20 bg-amber-50 text-amber-500 rounded-3xl flex items-center justify-center mx-auto mb-4 ring-8 ring-amber-50">
                  <Award className="h-10 w-10" />
                </div>
                
                <h3 className="text-2xl font-black text-slate-900 mb-1">
                  Quiz Completed!
                </h3>
                <p className="text-slate-500 text-sm mb-6">
                  You scored <strong className="text-slate-900">{quizScore} out of {quizQuestions.length}</strong> correct ({Math.round((quizScore / quizQuestions.length) * 100)}%)
                </p>

                {/* Score & XP Rewards Banner */}
                <div className="bg-gradient-to-r from-emerald-50 to-teal-50 border border-emerald-200 rounded-2xl p-5 mb-6 text-left">
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-sm font-medium text-slate-700">Quiz Bonus XP Earned:</span>
                    <span className="text-lg font-black text-emerald-600">+{bonusEarned} XP</span>
                  </div>
                  <div className="flex items-center justify-between pt-2 border-t border-emerald-100">
                    <span className="text-xs text-slate-600">Lesson Mastery Status:</span>
                    <span className="text-xs font-bold text-emerald-700 bg-emerald-100 px-2 py-0.5 rounded-full">
                      {quizScore === quizQuestions.length ? '🌟 Perfect Score' : '✅ Verified'}
                    </span>
                  </div>
                </div>

                <div className="flex flex-col sm:flex-row gap-3 justify-center">
                  <button
                    onClick={handleRetakeQuiz}
                    className="inline-flex items-center justify-center px-4 py-2.5 border border-slate-300 text-slate-700 rounded-xl hover:bg-slate-50 font-medium text-sm transition-colors"
                  >
                    <RotateCcw className="h-4 w-4 mr-2" /> Retake Quiz
                  </button>
                  <button
                    onClick={() => navigate('/lessons')}
                    className="inline-flex items-center justify-center px-6 py-2.5 bg-green-600 text-white rounded-xl hover:bg-green-700 font-semibold text-sm shadow-md shadow-green-600/20 transition-colors"
                  >
                    Explore More Lessons
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  )
}