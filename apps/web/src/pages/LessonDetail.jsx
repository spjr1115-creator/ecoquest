import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { supabase } from '../supabase/supabaseClient'
import { ArrowLeft, Clock, Target, CheckCircle, BookOpen } from 'lucide-react'

export default function LessonDetail() {
  const { id } = useParams()
  const navigate = useNavigate()
  const { currentUser } = useAuth()
  const [lesson, setLesson] = useState(null)
  const [completed, setCompleted] = useState(false)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function fetchLesson() {
      try {
        const { data, error } = await supabase
          .from('lessons')
          .select('*')
          .eq('id', id)
          .maybeSingle()

        if (error) console.error('Supabase lesson query error:', error)
        if (data) {
          setLesson(data)
          return
        }
      } catch (error) {
        console.error('Error fetching lesson:', error)
        // Import enhanced lesson content
        const enhancedLessons = {
          '1': {
            id: '1',
            title: 'Introduction to Waste Management',
            category: 'Waste Management',
            description: 'Learn the fundamentals of waste management and discover how your daily choices impact our environment.',
            duration: '20 min',
            difficulty: 'Beginner',
            xp: 15,
            content: `
              <h2>What is Waste Management?</h2>
              <p>Waste management refers to the collection, transport, processing, recycling, and disposal of waste materials. It's a crucial aspect of environmental protection and public health that affects every single person on Earth.</p>
              
              <h2>The Global Waste Crisis</h2>
              <p>Every year, the world generates over 2 billion tons of waste. That's equivalent to the weight of 3,000 Empire State Buildings! If current trends continue, this could increase by 70% by 2050.</p>
              
              <h2>Why is Waste Management Important?</h2>
              <p>Proper waste management is critical because:</p>
              <ul>
                <li><strong>Environmental Protection:</strong> Prevents pollution of air, water, and soil</li>
                <li><strong>Resource Conservation:</strong> Recovers valuable materials for reuse</li>
                <li><strong>Climate Action:</strong> Reduces greenhouse gas emissions from landfills</li>
                <li><strong>Public Health:</strong> Prevents disease spread and contamination</li>
                <li><strong>Economic Benefits:</strong> Creates jobs in recycling and waste management</li>
              </ul>
              
              <h2>The 5Rs of Waste Management</h2>
              <p>Building on the traditional 3Rs, modern waste management follows 5 principles:</p>
              <ol>
                <li><strong>Refuse:</strong> Say no to unnecessary waste (straws, plastic bags)</li>
                <li><strong>Reduce:</strong> Minimize waste generation at the source</li>
                <li><strong>Reuse:</strong> Find new ways to use items instead of discarding</li>
                <li><strong>Repurpose:</strong> Transform waste into new useful items</li>
                <li><strong>Recycle:</strong> Process materials into new products</li>
              </ol>
              
              <h2>Types of Waste and Their Impact</h2>
              <ul>
                <li><strong>Municipal Solid Waste:</strong> Household waste (60% of global waste)</li>
                <li><strong>Hazardous Waste:</strong> Chemicals, batteries, medical waste (requires special handling)</li>
                <li><strong>Industrial Waste:</strong> Manufacturing byproducts (often toxic)</li>
                <li><strong>Electronic Waste:</strong> Fastest growing waste stream (50 million tons annually)</li>
                <li><strong>Organic Waste:</strong> Food scraps, yard waste (can be composted)</li>
              </ul>
              
              <h2>Real-World Impact</h2>
              <p><strong>Did you know?</strong> The average person generates 4.5 pounds of waste per day. Over a lifetime, that's equivalent to the weight of 3 elephants!</p>
              
              <h2>What Can You Do Starting Today?</h2>
              <p>Everyone can contribute to better waste management through simple daily actions:</p>
              <ul>
                <li>Set up a home recycling system with separate bins</li>
                <li>Start composting organic kitchen waste</li>
                <li>Carry reusable bags, bottles, and containers</li>
                <li>Choose products with minimal or recyclable packaging</li>
                <li>Repair items instead of immediately replacing them</li>
                <li>Support businesses with sustainable packaging practices</li>
              </ul>
              
              <h2>Case Study: Zero Waste Communities</h2>
              <p>Cities like San Francisco and Kamikatsu, Japan have achieved over 80% waste diversion rates through comprehensive recycling programs and community education. These communities prove that dramatic waste reduction is possible with commitment and proper systems.</p>
            `
          },
          '2': {
            id: '2',
            title: 'The Art of Recycling: Beyond the Basics',
            category: 'Recycling',
            description: 'Master the art of recycling with detailed guidance on materials, processes, and common mistakes.',
            duration: '25 min',
            difficulty: 'Beginner',
            xp: 20,
            content: `
              <h2>Understanding Recycling</h2>
              <p>Recycling is the process of converting waste materials into new materials and objects. It's one of the most effective ways to reduce waste, conserve natural resources, and decrease greenhouse gas emissions.</p>
              
              <h2>The Environmental Impact of Recycling</h2>
              <p><strong>Recycling one aluminum can:</strong> Saves enough energy to run a TV for 3 hours. If everyone recycled one aluminum can, we'd save the equivalent energy of 500 million gallons of gasoline!</p>
              
              <h2>What Can (and Can't) Be Recycled?</h2>
              <h3>✅ Easily Recyclable:</h3>
              <ul>
                <li><strong>Paper:</strong> Office paper, newspapers, cardboard, magazines</li>
                <li><strong>Plastics:</strong> #1 (PET), #2 (HDPE), #5 (PP) - check bottom of containers</li>
                <li><strong>Glass:</strong> Bottles and jars (any color)</li>
                <li><strong>Metal:</strong> Aluminum cans, steel cans, foil</li>
              </ul>
              
              <h3>❌ Common Recycling Mistakes:</h3>
              <ul>
                <li><strong>Pizza boxes with grease:</strong> Contaminate entire recycling batches</li>
                <li><strong>Plastic bags:</strong> Jam recycling machinery (take to grocery stores instead)</li>
                <li><strong>Styrofoam:</strong> Most facilities don't accept it</li>
                <li><strong>Broken glass:</strong> Safety hazard for workers</li>
                <li><strong>Food-contaminated items:</strong> Must be cleaned first</li>
              </ul>
              
              <h2>The Recycling Journey</h2>
              <ol>
                <li><strong>Collection:</strong> Materials are collected from homes and businesses</li>
                <li><strong>Sorting:</strong> Materials are separated by type (manual and automated)</li>
                <li><strong>Processing:</strong> Materials are cleaned, shredded, and prepared</li>
                <li><strong>Manufacturing:</strong> Processed materials become new products</li>
                <li><strong>Purchasing:</strong> Consumers buy products made from recycled materials</li>
              </ol>
              
              <h2>Advanced Recycling: The Future</h2>
              <p>New technologies are revolutionizing recycling:</p>
              <ul>
                <li><strong>Chemical Recycling:</strong> Breaking down plastics at molecular level</li>
                <li><strong>AI Sorting:</strong> Advanced systems identify and separate materials</li>
                <li><strong>Upcycling:</strong> Converting waste into higher-value products</li>
              </ul>
              
              <h2>Tips for Effective Recycling</h2>
              <ul>
                <li><strong>Know your local rules:</strong> Recycling varies by location</li>
                <li><strong>Clean it:</strong> Rinse containers before recycling</li>
                <li><strong>Don't bag it:</strong> Put recyclables loose in bins</li>
                <li><strong>When in doubt, throw it out:</strong> Better to waste one item than contaminate a batch</li>
              </ul>
              
              <h2>The Economic Case for Recycling</h2>
              <p>The recycling industry creates 10x more jobs than landfill disposal. In the US alone, recycling supports over 1 million jobs and generates $236 billion in annual revenue.</p>
            `
          },
          '3': {
            id: '3',
            title: 'Water Conservation: Every Drop Counts',
            category: 'Water Conservation',
            description: 'Master water conservation techniques with practical solutions for home, garden, and daily life.',
            duration: '30 min',
            difficulty: 'Intermediate',
            xp: 25,
            content: `
              <h2>The Global Water Crisis</h2>
              <p>Water is the most precious resource on Earth, yet 2.2 billion people lack access to safe drinking water. By 2050, half the world's population could face water scarcity.</p>
              
              <h2>Understanding Water Scarcity</h2>
              <p>Only 2.5% of Earth's water is freshwater, and only 1% is easily accessible. The average American uses 80-100 gallons of water daily, while the recommended minimum is 13 gallons.</p>
              
              <h2>Indoor Water Conservation Strategies</h2>
              <h3>Bathroom (Largest Water User):</h3>
              <ul>
                <li><strong>Fix leaks immediately:</strong> A dripping faucet wastes 20+ gallons daily</li>
                <li><strong>Install low-flow fixtures:</strong> Can reduce water use by 30-50%</li>
                <li><strong>Shower smarter:</strong> 5-minute showers use 25 gallons vs 75 for baths</li>
                <li><strong>Turn off taps:</strong> Save 8 gallons per minute while brushing teeth</li>
                <li><strong>Toilet tips:</strong> "If it's yellow, let it mellow" saves significant water</li>
              </ul>
              
              <h3>Kitchen Solutions:</h3>
              <ul>
                <li><strong>Full loads only:</strong> Dishwashers are more efficient than hand washing</li>
                <li><strong>Smart cooking:</strong> Steam vegetables instead of boiling</li>
                <li><strong>Keep water cold:</strong> Keep pitcher in fridge instead of running tap</li>
                <li><strong>Wash produce in bowls:</strong> Instead of running water</li>
              </ul>
              
              <h3>Laundry Room:</h3>
              <ul>
                <li><strong>Full loads:</strong> Wait until you have full laundry loads</li>
                <li><strong>Cold water washing:</strong> Heats water uses 90% of washer energy</li>
                <li><strong>Energy Star appliances:</strong> Use 40% less water than standard models</li>
              </ul>
              
              <h2>Outdoor Water Conservation</h2>
              <h3>Smart Gardening:</h3>
              <ul>
                <li><strong>Water timing:</strong> Early morning or late evening reduces evaporation</li>
                <li><strong>Native plants:</strong> Require 50% less water than exotic species</li>
                <li><strong>Drip irrigation:</strong> 90% efficient vs 50% for sprinklers</li>
                <li><strong>Mulching:</strong> Reduces evaporation by 70%</li>
                <li><strong>Rain barrels:</strong> Collect rainwater for garden use</li>
              </ul>
              
              <h2>Water Footprint: The Hidden Impact</h2>
              <p>Everything we consume has a water footprint:</p>
              <ul>
                <li><strong>Beef burger:</strong> 660 gallons of water</li>
                <li><strong>Cotton t-shirt:</strong> 2,700 gallons</li>
                <li><strong>Smartphone:</strong> 3,190 gallons</li>
                <li><strong>Car:</strong> 39,000 gallons</li>
              </ul>
              
              <h2>Advanced Conservation Techniques</h2>
              <ul>
                <li><strong>Greywater systems:</strong> Reuse sink water for irrigation</li>
                <li><strong>Rainwater harvesting:</strong> Collect and store rainwater</li>
                <li><strong>Xeriscaping:</strong> Landscaping designed for low water use</li>
                <li><strong>Smart irrigation controllers:</strong> Weather-based watering</li>
              </ul>
              
              <h2>Real-World Success Stories</h2>
              <p><strong>Singapore:</strong> Recycles 40% of water through advanced treatment. <strong>Israel:</strong> 80% of wastewater is recycled for agriculture. These examples show what's possible with commitment and technology.</p>
            `
          },
          '4': {
            id: '4',
            title: 'Climate Change: Understanding Our Impact',
            category: 'Climate Change',
            description: 'Comprehensive guide to climate change science, impacts, and actionable solutions for individuals.',
            duration: '35 min',
            difficulty: 'Intermediate',
            xp: 30,
            content: `
              <h2>What is Climate Change?</h2>
              <p>Climate change refers to long-term shifts in global temperatures and weather patterns. While natural factors have influenced Earth's climate throughout history, human activities have been the dominant driver since the Industrial Revolution.</p>
              
              <h2>The Science Behind Climate Change</h2>
              <p><strong>Greenhouse Effect:</strong> Gases like CO2, methane, and nitrous oxide trap heat in Earth's atmosphere. Human activities have increased these gases by 40% since pre-industrial times.</p>
              
              <p><strong>Key Statistics:</strong></p>
              <ul>
                <li>Global temperature has risen 1.1°C since 1880</li>
                <li>CO2 levels are at 420 ppm</li>
              </ul>
            `
          }
        }
        setLesson(enhancedLessons[id] || enhancedLessons['1'])
      } finally {
        setLoading(false)
      }
    }

    fetchLesson()
  }, [id])

  async function handleComplete() {
    if (!currentUser || !lesson) return

    try {
      const { data: existing } = await supabase
        .from('user_lessons')
        .select('*')
        .eq('user_id', currentUser.id)
        .eq('lesson_id', lesson.id)
        .maybeSingle()

      if (!existing) {
        await supabase.from('user_lessons').insert({
          user_id: currentUser.id,
          lesson_id: lesson.id,
          completed: true
        })

        const xpGain = Number(lesson.xp) || 0
        const { data: userDoc } = await supabase
          .from('users')
          .select('xp, level, badges')
          .eq('id', currentUser.id)
          .maybeSingle()

        if (userDoc) {
          const newXp = (userDoc.xp || 0) + xpGain
          const newLevel = Math.max(1, Math.floor(newXp / 200) + 1)
          const currentBadges = userDoc.badges || []
          const newBadges = currentBadges.length > 0 ? [...currentBadges] : []

          if (!currentBadges.some(b => b.name === 'Knowledge Seeker')) {
            newBadges.push({ name: 'Knowledge Seeker', emoji: '📚' })
          }

          await supabase
            .from('users')
            .update({ xp: newXp, level: newLevel, badges: newBadges })
            .eq('id', currentUser.id)
        }
      }

      setCompleted(true)
    } catch (error) {
      console.error('Error completing lesson:', error)
    }
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
        <div className="text-center">
          <BookOpen className="h-12 w-12 text-slate-300 mx-auto mb-3" />
          <p className="text-slate-500">Lesson not found</p>
        </div>
      </div>
    )
  }

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <button
        onClick={() => navigate('/lessons')}
        className="flex items-center text-slate-600 hover:text-green-600 mb-6 transition-colors"
      >
        <ArrowLeft className="h-5 w-5 mr-2" />
        Back to Lessons
      </button>

      <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
        {/* Header */}
        <div className="bg-gradient-to-r from-green-50 to-emerald-50 p-6 border-b border-slate-200">
          <div className="flex items-start justify-between">
            <div>
              <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800 mb-3">
                {lesson.category}
              </span>
              <h1 className="text-3xl font-bold text-slate-900 mb-2">
                {lesson.title}
              </h1>
              <p className="text-slate-600">{lesson.description}</p>
            </div>
          </div>

          <div className="flex items-center space-x-6 mt-4">
            <div className="flex items-center text-slate-600">
              <Clock className="h-5 w-5 mr-2" />
              {lesson.duration}
            </div>
            <div className="flex items-center text-yellow-600">
              <Target className="h-5 w-5 mr-2" />
              {lesson.xp} XP
            </div>
            <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
              lesson.difficulty === 'Beginner' ? 'bg-green-100 text-green-800' :
              lesson.difficulty === 'Intermediate' ? 'bg-yellow-100 text-yellow-800' :
              'bg-red-100 text-red-800'
            }`}>
              {lesson.difficulty}
            </span>
          </div>
        </div>

        {/* Content */}
        <div className="p-6">
          <div 
            className="prose prose-slate max-w-none"
            dangerouslySetInnerHTML={{ __html: lesson.content }}
          />
        </div>

        {/* Footer */}
        <div className="bg-slate-50 p-6 border-t border-slate-200">
          {completed ? (
            <div className="flex items-center justify-center text-green-600">
              <CheckCircle className="h-6 w-6 mr-2" />
              <span className="font-semibold">Lesson Completed! +{lesson.xp} XP earned</span>
            </div>
          ) : (
            <button
              onClick={handleComplete}
              className="w-full bg-green-600 text-white py-3 px-4 rounded-lg hover:bg-green-700 transition-colors font-semibold"
            >
              Mark as Complete
            </button>
          )}
        </div>
      </div>

      {/* Quiz Section */}
      {!completed && (
        <div className="mt-6 bg-white rounded-xl shadow-sm border border-slate-200 p-6">
          <h2 className="text-xl font-semibold text-slate-900 mb-4">
            Quick Quiz
          </h2>
          <p className="text-slate-600 mb-4">
            Test your knowledge to earn additional XP!
          </p>
          <button className="w-full bg-blue-600 text-white py-3 px-4 rounded-lg hover:bg-blue-700 transition-colors font-semibold">
            Start Quiz (+{Math.round(lesson.xp * 0.5)} XP)
          </button>
        </div>
      )}
    </div>
  )
}