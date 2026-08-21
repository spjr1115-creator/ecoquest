import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { supabase } from '../supabase/supabaseClient'
import { ArrowLeft, Target, Zap, Clock, Upload, CheckCircle, AlertCircle } from 'lucide-react'

export default function ChallengeDetail() {
  const { id } = useParams()
  const navigate = useNavigate()
  const { currentUser } = useAuth()
  const [challenge, setChallenge] = useState(null)
  const [submitted, setSubmitted] = useState(false)
  const [loading, setLoading] = useState(true)
  const [submitting, setSubmitting] = useState(false)
  const [evidence, setEvidence] = useState('')
  const [imageFile, setImageFile] = useState(null)
  const [error, setError] = useState('')

  useEffect(() => {
    async function fetchChallenge() {
      try {
        const { data, error } = await supabase
          .from('challenges')
          .select('*')
          .eq('id', id)
          .maybeSingle()

        if (error) console.error('Supabase challenge fetch error:', error)
        if (data) {
          setChallenge(data)
          return
        }
      } catch (error) {
        console.error('Error fetching challenge:', error)
        // Import enhanced challenge content
        const enhancedChallenges = {
          '1': {
            id: '1',
            title: 'Plastic-Free Day Challenge',
            category: 'Plastic Pollution',
            description: 'Eliminate all single-use plastics for 24 hours. This challenge raises awareness about plastic pollution and helps you discover sustainable alternatives.',
            difficulty: 'Medium',
            xp: 100,
            impactValue: 5,
            deadline: '2024-12-31',
            participants: 234,
            instructions: `
              <h3>Challenge Overview</h3>
              <p>Single-use plastics are a major environmental pollutant, with 8 million tons entering our oceans annually. This challenge helps you understand your plastic usage and discover practical alternatives.</p>
              
              <h3>Challenge Instructions</h3>
              <ol>
                <li><strong>Preparation (Day Before):</strong> Gather your reusable alternatives - water bottle, coffee cup, shopping bags, food containers, utensils</li>
                <li><strong>The Challenge Day:</strong> Avoid ALL single-use plastics for 24 hours</li>
                <li><strong>Documentation:</strong> Take photos of your plastic-free alternatives throughout the day</li>
                <li><strong>Reflection:</strong> Note any challenges faced and creative solutions you discovered</li>
              </ol>
              
              <h3>What Counts as Single-Use Plastic?</h3>
              <ul>
                <li><strong>Shopping bags:</strong> Plastic grocery bags, produce bags</li>
                <li><strong>Bottles:</strong> Water bottles, soda bottles, juice boxes</li>
                <li><strong>Food packaging:</strong> Wrap, containers, straws, cutlery</li>
                <li><strong>Personal care:</strong> Mini shampoo bottles, floss picks, cotton swabs</li>
                <li><strong>Other:</strong> Bubble wrap, plastic packaging, takeout containers</li>
              </ul>
              
              <h3>Plastic-Free Alternatives</h3>
              <ul>
                <li><strong>Shopping:</strong> Reusable bags, glass jars, mesh produce bags</li>
                <li><strong>Drinks:</strong> Reusable water bottle, travel mug, glass straws</li>
                <li><strong>Food:</strong> Beeswax wraps, glass containers, silicone bags</li>
                <li><strong>Personal care:</strong> Bar soap, bamboo toothbrush, safety razor</li>
              </ul>
              
              <h3>Evidence Requirements</h3>
              <ul>
                <li><strong>Photos:</strong> At least 3 photos showing your plastic-free alternatives in use</li>
                <li><strong>Description:</strong> 200+ words describing your experience, challenges, and insights</li>
                <li><strong>Impact statement:</strong> How much plastic you typically use vs. this challenge</li>
                <li><strong>Optional:</strong> Video documenting your plastic-free day</li>
              </ul>
              
              <h3>Environmental Impact</h3>
              <p>By completing this challenge, you prevent approximately 15-20 plastic items from entering landfills. If everyone did this once monthly, we'd eliminate 2.4 billion plastic items annually!</p>
            `
          },
          '2': {
            id: '2',
            title: 'Water Warrior: 7-Day Conservation Challenge',
            category: 'Water Conservation',
            description: 'Reduce your water consumption by 30% for one week through conscious habits and practical water-saving techniques.',
            difficulty: 'Medium',
            xp: 150,
            impactValue: 8,
            deadline: '2024-12-31',
            participants: 189,
            instructions: `
              <h3>Challenge Overview</h3>
              <p>The average person uses 80-100 gallons of water daily, while much of the world survives on less than 5 gallons. This challenge helps you become water-conscious and develop lasting conservation habits.</p>
              
              <h3>Challenge Instructions</h3>
              <ol>
                <li><strong>Baseline:</strong> Check your water meter or bill to understand normal usage</li>
                <li><strong>Implementation:</strong> Apply water-saving strategies for 7 consecutive days</li>
                <li><strong>Tracking:</strong> Record water-saving actions taken each day</li>
                <li><strong>Measurement:</strong> Compare water usage before and after the challenge</li>
              </ol>
              
              <h3>Water-Saving Strategies</h3>
              <h3>Bathroom (Biggest Water User):</h3>
              <ul>
                <li><strong>Shower timer:</strong> Limit showers to 5 minutes (saves 10-15 gallons)</li>
                <li><strong>Turn off taps:</strong> While brushing teeth/shaving (saves 8 gallons/day)</li>
                <li><strong>Toilet habits:</strong> "If it's yellow, let it mellow" (saves 5-7 gallons/flush)</li>
                <li><strong>Fix leaks:</strong> One dripping faucet wastes 20+ gallons daily</li>
              </ul>
              
              <h3>Kitchen and Laundry:</h3>
              <ul>
                <li><strong>Full loads only:</strong> Dishwashers and washing machines</li>
                <li><strong>Cold water:</strong> Most clothes don't need hot water</li>
                <li><strong>Smart cooking:</strong> Steam vegetables instead of boiling</li>
                <li><strong>Wash produce in bowls:</strong> Instead of running water</li>
              </ul>
              
              <h3>Evidence Requirements</h3>
              <ul>
                <li><strong>Daily log:</strong> List of water-saving actions taken each day</li>
                <li><strong>Before/after comparison:</strong> Water usage data (meter reading or bill comparison)</li>
                <li><strong>Photos:</strong> Show water-saving measures in action (timer, low-flow fixtures, etc.)</li>
                <li><strong>Reflection:</strong> What was easy/difficult? What habits will you continue?</li>
              </ul>
              
              <h3>Environmental Impact</h3>
              <p>Reducing water use by 30% saves approximately 700-900 gallons weekly. That's enough to fill 16 bathtubs! If 100 people complete this challenge, that's 4.6 million gallons saved annually.</p>
            `
          },
          '3': {
            id: '3',
            title: 'Energy Saver: Phantom Load Elimination',
            category: 'Energy Conservation',
            description: 'Identify and eliminate phantom energy loads in your home. Electronics consume energy even when "off" - costing you money and increasing your carbon footprint.',
            difficulty: 'Easy',
            xp: 75,
            impactValue: 6,
            deadline: '2024-12-31',
            participants: 312,
            instructions: `
              <h3>Challenge Overview</h3>
              <p>Phantom load (vampire power) accounts for 10% of residential energy use. Devices continue drawing power when turned off, costing the average household $100-200 annually.</p>
              
              <h3>Challenge Instructions</h3>
              <ol>
                <li><strong>Audit:</strong> Identify all devices that consume standby power</li>
                <li><strong>Measurement:</strong> If possible, use a power meter to measure consumption</li>
                <li><strong>Elimination:</strong> Implement solutions to eliminate phantom loads</li>
                <li><strong>Documentation:</strong> Record findings and improvements</li>
              </ol>
              
              <h3>Common Phantom Load Culprits</h3>
              <ul>
                <li><strong>Entertainment:</strong> TVs, game consoles, cable boxes, DVD players</li>
                <li><strong>Computers:</strong> Desktops, monitors, printers, chargers</li>
                <li><strong>Kitchen:</strong> Microwaves, coffee makers, toasters with digital displays</li>
                <li><strong>Other:</strong> Phone chargers, power adapters, digital clocks</li>
              </ul>
              
              <h3>Solutions to Eliminate Phantom Load</h3>
              <ul>
                <li><strong>Power strips:</strong> Group devices and turn off entire strips</li>
                <li><strong>Smart power strips:</strong> Automatically cut power when devices are off</li>
                <li><strong>Timer switches:</strong> Automatically turn off devices at set times</li>
                <li><strong>Unplug completely:</strong> For rarely used devices</li>
                <li><strong>Energy Star devices:</strong> Choose products with low standby consumption</li>
              </ul>
              
              <h3>Evidence Requirements</h3>
              <ul>
                <li><strong>Inventory list:</strong> All devices identified with standby power consumption</li>
                <li><strong>Photos:</strong> Show before (plugged in) and after (power strips, etc.)</li>
                <li><strong>Calculations:</strong> Estimated energy savings based on device wattage</li>
                <li><strong>Implementation:</strong> Describe which solutions you implemented</li>
              </ul>
              
              <h3>Environmental Impact</h3>
              <p>Eliminating phantom load can save 200-500 kWh annually per household. That's equivalent to planting 15-40 trees or preventing 300-700 lbs of CO2 emissions annually!</p>
            `
          },
          '4': {
            id: '4',
            title: 'Community Tree Planting Initiative',
            category: 'Biodiversity',
            description: 'Plant a native tree in your community and commit to its care for the first year. Trees provide countless environmental benefits from carbon sequestration to habitat creation.',
            difficulty: 'Hard',
            xp: 200,
            impactValue: 15,
            deadline: '2024-12-31',
            participants: 87,
            instructions: `
              <h3>Challenge Overview</h3>
              <p>Trees are nature's carbon capture machines. One mature tree absorbs 48 pounds of CO2 annually while providing oxygen, habitat, and countless other ecosystem services.</p>
              
              <h3>Challenge Instructions</h3>
              <ol>
                <li><strong>Research:</strong> Identify appropriate native tree species for your region</li>
                <li><strong>Location:</strong> Find suitable planting location (with permission if needed)</li>
                <li><strong>Planting:</strong> Plant tree using proper techniques</li>
                <li><strong>Commitment:</strong> Commit to caring for the tree for at least one year</li>
              </ol>
              
              <h3>Choosing the Right Tree</h3>
              <ul>
                <li><strong>Native species:</strong> Adapted to local conditions, support local wildlife</li>
                <li><strong>Space considerations:</strong> Consider mature size (roots, canopy)</li>
                <li><strong>Site conditions:</strong> Sun exposure, soil type, drainage</li>
                <li><strong>Purpose:</strong> Shade, fruit, wildlife habitat, carbon capture</li>
              </ul>
              
              <h3>Proper Planting Technique</h3>
              <ol>
                <li>Dig hole 2-3x wider than root ball, same depth</li>
                <li>Remove container/gently loosen roots</li>
                <li>Place tree in hole, ensure root flare is at surface level</li>
                <li>Backfill with native soil, no fertilizer needed initially</li>
                <li>Water thoroughly, apply 2-3 inch mulch ring</li>
                <li>Stake if necessary (remove after first year)</li>
              </ol>
              
              <h3>Tree Care Commitment</h3>
              <ul>
                <li><strong>Watering:</strong> Weekly for first year, more during drought</li>
                <li><strong>Mulching:</strong> Maintain 2-3 inch layer, keep away from trunk</li>
                <li><strong>Monitoring:</strong> Watch for pests, diseases, stress signs</li>
                <li><strong>Protection:</strong> Guard against deer, rabbits, mechanical damage</li>
              </ul>
              
              <h3>Evidence Requirements</h3>
              <ul>
                <li><strong>Tree species:</strong> Scientific name and why chosen</li>
                <li><strong>Location:</strong> Where planted (address or general area)</li>
                <li><strong>Photos:</strong> Before/during/after planting, tree care activities</li>
                <li><strong>Care plan:</strong> Your ongoing care schedule and commitment</li>
                <li><strong>Permission:</strong> If planted on public/commercial property</li>
              </ul>
              
              <h3>Environmental Impact</h3>
              <p>Over its lifetime, one tree can absorb 1 ton of CO2, provide oxygen for 2 people, and support hundreds of species. Your tree will benefit the environment for decades to come!</p>
            `
          }
        }
        setChallenge(enhancedChallenges[id] || enhancedChallenges['1'])
      } finally {
        setLoading(false)
      }
    }

    fetchChallenge()
  }, [id])

  async function handleSubmit(e) {
    e.preventDefault()
    setError('')

    if (!evidence.trim()) {
      setError('Please provide a description of your activity')
      return
    }

    if (!imageFile) {
      setError('Please upload photographic evidence of your activity')
      return
    }

    setSubmitting(true)

    try {
      let imageUrl = null

      if (imageFile) {
        // Upload image to Supabase Storage bucket 'evidence' if available
        const fileExt = imageFile.name.split('.').pop()
        const fileName = `${currentUser.id}_${Date.now()}.${fileExt}`
        const { data: uploadData, error: uploadError } = await supabase.storage
          .from('evidence')
          .upload(fileName, imageFile)

        if (!uploadError && uploadData) {
          const { data: publicUrlData } = supabase.storage
            .from('evidence')
            .getPublicUrl(fileName)
          imageUrl = publicUrlData?.publicUrl
        }
      }

      // Create submission in Supabase
      const { error: insertError } = await supabase
        .from('user_challenges')
        .insert({
          user_id: currentUser.id,
          challenge_id: challenge.id,
          proof_text: evidence,
          proof_url: imageUrl,
          status: 'pending'
        })

      if (insertError) throw insertError

      setImageFile(null)
      setSubmitted(true)
    } catch (error) {
      setError('Failed to submit evidence. Please try again.')
      console.error('Error submitting:', error)
    } finally {
      setSubmitting(false)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600"></div>
      </div>
    )
  }

  if (!challenge) {
    return (
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="text-center">
          <Target className="h-12 w-12 text-slate-300 mx-auto mb-3" />
          <p className="text-slate-500">Challenge not found</p>
        </div>
      </div>
    )
  }

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <button
        onClick={() => navigate('/challenges')}
        className="flex items-center text-slate-600 hover:text-green-600 mb-6 transition-colors"
      >
        <ArrowLeft className="h-5 w-5 mr-2" />
        Back to Challenges
      </button>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-6">
          {/* Challenge Details */}
          <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
            <div className="bg-gradient-to-r from-green-50 to-emerald-50 p-6 border-b border-slate-200">
              <div className="flex items-start justify-between">
                <div>
                  <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800 mb-3">
                    {challenge.category}
                  </span>
                  <h1 className="text-3xl font-bold text-slate-900 mb-2">
                    {challenge.title}
                  </h1>
                  <p className="text-slate-600">{challenge.description}</p>
                </div>
              </div>

              <div className="flex items-center space-x-6 mt-4">
                <div className="flex items-center text-slate-600">
                  <Clock className="h-5 w-5 mr-2" />
                  Deadline: {new Date(challenge.deadline).toLocaleDateString()}
                </div>
                <div className="flex items-center text-yellow-600">
                  <Zap className="h-5 w-5 mr-2" />
                  {challenge.xp} XP
                </div>
                <div className="flex items-center text-green-600">
                  <Target className="h-5 w-5 mr-2" />
                  +{challenge.impactValue} Impact
                </div>
              </div>
            </div>

            <div className="p-6">
              <div 
                className="prose prose-slate max-w-none"
                dangerouslySetInnerHTML={{ __html: challenge.instructions }}
              />
            </div>
          </div>

          {/* Submission Form */}
          {!submitted ? (
            <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
              <h2 className="text-xl font-semibold text-slate-900 mb-4">
                Submit Evidence
              </h2>

              {error && (
                <div className="mb-4 rounded-md bg-red-50 p-4">
                  <div className="flex">
                    <AlertCircle className="h-5 w-5 text-red-400" />
                    <div className="ml-3">
                      <p className="text-sm text-red-800">{error}</p>
                    </div>
                  </div>
                </div>
              )}

              <form onSubmit={handleSubmit}>
                <div className="mb-4">
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    Describe your activity
                  </label>
                  <textarea
                    value={evidence}
                    onChange={(e) => setEvidence(e.target.value)}
                    rows={4}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
                    placeholder="Describe what you did, how it went, and any observations..."
                    required
                  />
                </div>

                <div className="mb-4">
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    Upload evidence (required)
                  </label>
                  <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-slate-300 border-dashed rounded-lg hover:border-green-400 transition-colors">
                    <div className="space-y-1 text-center">
                      <Upload className="mx-auto h-12 w-12 text-slate-400" />
                      <div className="flex text-sm text-slate-600">
                        <label className="relative cursor-pointer bg-white rounded-md font-medium text-green-600 hover:text-green-500 focus-within:outline-none">
                          <span>Upload a file</span>
                          <input
                            type="file"
                            className="sr-only"
                            accept="image/*"
                            onChange={(e) => setImageFile(e.target.files[0])}
                          />
                        </label>
                        <p className="pl-1">or drag and drop</p>
                      </div>
                      <p className="text-xs text-slate-500">
                        PNG, JPG, GIF up to 10MB
                      </p>
                      {imageFile && (
                        <p className="text-sm text-green-600 mt-2">
                          Selected: {imageFile.name}
                        </p>
                      )}
                    </div>
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={submitting}
                  className="w-full bg-green-600 text-white py-3 px-4 rounded-lg hover:bg-green-700 transition-colors font-semibold disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {submitting ? 'Submitting...' : 'Submit Evidence'}
                </button>
              </form>
            </div>
          ) : (
            <div className="bg-green-50 rounded-xl border border-green-200 p-6">
              <div className="flex items-center justify-center text-green-600 mb-4">
                <CheckCircle className="h-12 w-12" />
              </div>
              <h3 className="text-xl font-semibold text-center text-green-900 mb-2">
                Evidence Submitted!
              </h3>
              <p className="text-center text-green-700 mb-4">
                Your submission is pending verification. You'll receive {challenge.xp} XP once approved.
              </p>
              <button
                onClick={() => navigate('/dashboard/student')}
                className="w-full bg-green-600 text-white py-3 px-4 rounded-lg hover:bg-green-700 transition-colors font-semibold"
              >
                Return to Dashboard
              </button>
            </div>
          )}
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Challenge Stats */}
          <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
            <h3 className="font-semibold text-slate-900 mb-4">Challenge Stats</h3>
            <div className="space-y-3">
              <div className="flex justify-between">
                <span className="text-slate-600">Participants</span>
                <span className="font-semibold">{challenge.participants}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-600">Difficulty</span>
                <span className="font-semibold">{challenge.difficulty}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-600">Time Remaining</span>
                <span className="font-semibold">
                  {Math.ceil((new Date(challenge.deadline) - new Date()) / (1000 * 60 * 60 * 24))} days
                </span>
              </div>
            </div>
          </div>

          {/* Tips */}
          <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-xl border border-blue-200 p-6">
            <h3 className="font-semibold text-slate-900 mb-3">💡 Tips for Success</h3>
            <ul className="text-sm text-slate-700 space-y-2">
              <li>• Take clear photos of your activity</li>
              <li>• Be specific in your description</li>
              <li>• Submit before the deadline</li>
              <li>• Check verification status regularly</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  )
}