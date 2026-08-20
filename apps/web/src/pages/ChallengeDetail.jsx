import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { db, storage } from '../firebase/config'
import { doc, getDoc, setDoc, collection } from 'firebase/firestore'
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage'
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
        const challengeDoc = await getDoc(doc(db, 'challenges', id))
        if (challengeDoc.exists()) {
          setChallenge({ id: challengeDoc.id, ...challengeDoc.data() })
        } else {
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
            },
            '5': {
              id: '5',
              title: 'E-Waste Warrior: Responsible Electronics Disposal',
              category: 'E-Waste',
              description: 'Collect and properly dispose of 5 electronic waste items from your home. E-waste is the fastest-growing waste stream and contains valuable, toxic materials.',
              difficulty: 'Easy',
              xp: 80,
              impactValue: 7,
              deadline: '2024-12-31',
              participants: 156,
              instructions: `
                <h3>Challenge Overview</h3>
                <p>Electronic waste (e-waste) is the fastest-growing waste stream globally, with 50 million tons generated annually. E-waste contains valuable metals but also toxic substances that require proper handling.</p>
                
                <h3>Challenge Instructions</h3>
                <ol>
                  <li><strong>Hunt:</strong> Find 5 e-waste items in your home (old electronics, cables, batteries)</li>
                  <li><strong>Research:</strong> Locate certified e-waste recyclers in your area</li>
                  <li><strong>Preparation:</strong> Prepare items for recycling (remove personal data)</li>
                  <li><strong>Disposal:</strong> Properly dispose of items at certified facility</li>
                </ol>
                
                <h3>Common E-Waste Items</h3>
                <ul>
                  <li><strong>Devices:</strong> Old phones, tablets, laptops, computers</li>
                  <li><strong>Accessories:</strong> Chargers, cables, headphones, keyboards</li>
                  <li><strong>Peripherals:</strong> Printers, scanners, monitors, external drives</li>
                  <li><strong>Small electronics:</strong> Digital cameras, GPS devices, e-readers</li>
                  <li><strong>Batteries:</strong> Rechargeable batteries, power banks</li>
                </ul>
                
                <h3>Finding Certified Recyclers</h3>
                <ul>
                  <li><strong>Manufacturer programs:</strong> Apple, Dell, HP offer take-back programs</li>
                  <li><strong>Retailers:</strong> Best Buy, Staples accept many electronics</li>
                  <li><strong>Local recycling centers:</strong> Many cities have e-waste facilities</li>
                  <li><strong>E-stewardship certified:</strong> Look for certified recyclers</li>
                </ul>
                
                <h3>Data Security Before Recycling</h3>
                <ul>
                  <li><strong>Back up important data</strong></li>
                  <li><strong>Factory reset devices</strong></li>
                  <li><strong>Remove SIM cards and memory cards</strong></li>
                  <li><strong>Destroy hard drives</strong> for computers (if necessary)</li>
                  <li><strong>Remove batteries</strong> from devices when possible</li>
                </ul>
                
                <h3>Evidence Requirements</h3>
                <ul>
                  <li><strong>Inventory:</strong> List of 5 e-waste items with descriptions</li>
                  <li><strong>Photos:</strong> Items before disposal, recycling facility</li>
                  <li><strong>Recycling receipt:</strong> From recycling facility (if available)</li>
                  <li><strong>Research:</strong> Information about chosen recycler's certifications</li>
                </ul>
                
                <h3>Environmental Impact</h3>
                <p>Properly recycling 5 electronic items recovers valuable metals (gold, silver, copper) while preventing toxic substances (lead, mercury) from contaminating soil and water. One recycled cell phone recovers enough materials to make 6 new phones!</p>
              `
            },
            '6': {
              id: '6',
              title: 'Zero Waste Week: Minimalist Living Challenge',
              category: 'Waste Management',
              description: 'Produce zero landfill waste for one week through composting, recycling, and conscious consumption. This challenge transforms your relationship with waste.',
              difficulty: 'Hard',
              xp: 250,
              impactValue: 12,
              deadline: '2024-12-31',
              participants: 67,
              instructions: `
                <h3>Challenge Overview</h3>
                <p>The average person generates 4.5 pounds of waste daily. Zero waste living challenges you to rethink consumption, maximize reuse, and minimize what you send to landfills.</p>
                
                <h3>Challenge Instructions</h3>
                <ol>
                  <li><strong>Preparation:</strong> Set up composting, recycling, and reuse systems</li>
                  <li><strong>Consumption:</strong> Plan meals and purchases to avoid waste</li>
                  <li><strong>Tracking:</strong> Record all waste generated and how it was handled</li>
                  <li><strong>Documentation:</strong> Document your zero waste journey</li>
                </ol>
                
                <h3>Waste Management Hierarchy</h3>
                <ol>
                  <li><strong>Refuse:</strong> Say no to unnecessary waste (straws, bags, flyers)</li>
                  <li><strong>Reduce:</strong> Buy less, choose quality over quantity</li>
                  <li><strong>Reuse:</strong> Find new purposes for items before recycling</li>
                  <li><strong>Repair:</strong> Fix broken items instead of replacing</li>
                  <li><strong>Rot:</strong> Compost organic waste</li>
                  <li><strong>Recycle:</strong> Last resort for materials that can't be reused</li>
                </ol>
                
                <h3>Setting Up Your Systems</h3>
                <h3>Composting:</h3>
                <ul>
                  <li><strong>Indoor:</strong> Worm bin, bokashi, or countertop composter</li>
                  <li><strong>Outdoor:</strong> Compost pile, tumbler, or bin</li>
                  <li><strong>Community:</strong> Find local composting services</li>
                </ul>
                
                <h3>Shopping Zero Waste:</h3>
                <ul>
                  <li><strong>Bulk bins:</strong> Bring reusable containers</li>
                  <li><strong>Farmers markets:</strong> Package-free produce</li>
                  <li><strong>Reusable everything:</strong> Bags, bottles, containers, utensils</li>
                  <li><strong>Minimal packaging:</strong> Choose products with sustainable packaging</li>
                </ul>
                
                <h3>Evidence Requirements</h3>
                <ul>
                  <li><strong>Daily log:</strong> Record all waste generated and how handled</li>
                  <li><strong>Photos:</strong> Show your zero waste systems (compost, recycling setup)</li>
                  <li><strong>Calculations:</strong> Compare normal weekly waste vs. challenge week</li>
                  <li><strong>Reflection:</strong> What was easy/difficult? What habits will continue?</li>
                </ul>
                
                <h3>Environmental Impact</h3>
                <p>Zero waste living can reduce your landfill contribution by 90%. If 100 people achieve zero waste for one week, that's 3,150 pounds of waste prevented from landfills - equivalent to the weight of a small car!</p>
              `
            },
            '7': {
              id: '7',
              title: 'Sustainable Transportation Week',
              category: 'Sustainable Transportation',
              description: 'Replace car trips with sustainable alternatives for one week. Transportation accounts for 29% of US greenhouse gas emissions.',
              difficulty: 'Medium',
              xp: 120,
              impactValue: 9,
              deadline: '2024-12-31',
              participants: 145,
              instructions: `
                <h3>Challenge Overview</h3>
                <p>Transportation is the largest source of greenhouse gas emissions in many countries. This challenge helps you discover sustainable alternatives while reducing your carbon footprint.</p>
                
                <h3>Challenge Instructions</h3>
                <ol>
                  <li><strong>Audit:</strong> Track your normal transportation for one week</li>
                  <li><strong>Alternatives:</strong> Replace car trips with sustainable options for one week</li>
                  <li><strong>Documentation:</strong> Record all trips and alternatives used</li>
                  <li><strong>Calculation:</strong> Estimate emissions saved from your changes</li>
                </ol>
                
                <h3>Sustainable Transportation Options</h3>
                <ul>
                  <li><strong>Walking:</strong> For trips under 1 mile (zero emissions, healthy)</li>
                  <li><strong>Cycling:</strong> For trips 1-5 miles (fast, zero emissions)</li>
                  <li><strong>Public transit:</strong> Buses, trains, subways (shared emissions)</li>
                  <li><strong>Carpooling:</strong> Share rides with others (reduce per-person emissions)</li>
                  <li><strong>Electric vehicles:</strong> If available (zero tailpipe emissions)</li>
                </ul>
                
                <h3>Trip Planning Strategies</h3>
                <ul>
                  <li><strong>Combine trips:</strong> Group errands to reduce total mileage</li>
                  <li><strong>Route optimization:</strong> Plan efficient routes to minimize distance</li>
                  <li><strong>Timing:</strong> Avoid peak traffic for more efficient trips</li>
                  <li><strong>Remote options:</strong> Virtual meetings instead of in-person when possible</li>
                </ul>
                
                <h3>Evidence Requirements</h3>
                <ul>
                  <li><strong>Trip log:</strong> All trips taken with alternatives used</li>
                  <li><strong>Before/after:</strong> Normal weekly emissions vs. challenge week</li>
                  <li><strong>Photos:</strong> Show your sustainable transportation methods</li>
                  <li><strong>Reflection:</strong> Benefits discovered, challenges faced, habits to continue</li>
                </ul>
                
                <h3>Environmental Impact</h3>
                <p>Replacing 10 car trips with sustainable alternatives saves approximately 40-60 lbs of CO2 emissions. If 100 people complete this challenge, that's 2-3 tons of CO2 prevented annually!</p>
              `
            },
            '8': {
              id: '8',
              title: 'Sustainable Shopping Challenge',
              category: 'Sustainable Consumption',
              description: 'Practice conscious consumption for one week by prioritizing second-hand, local, and sustainable products.',
              difficulty: 'Medium',
              xp: 100,
              impactValue: 7,
              deadline: '2024-12-31',
              participants: 178,
              instructions: `
                <h3>Challenge Overview</h3>
                <p>Fast fashion and consumer culture generate massive waste and pollution. This challenge helps you develop more sustainable shopping habits that benefit both the environment and your wallet.</p>
                
                <h3>Challenge Instructions</h3>
                <ol>
                  <li><strong>Audit:</strong> Understand your normal shopping patterns</li>
                  <li><strong>Alternatives:</strong> Apply sustainable shopping principles for one week</li>
                  <li><strong>Documentation:</strong> Record all purchases and sustainability considerations</li>
                  <li><strong>Reflection:</strong> Evaluate the impact and benefits of your choices</li>
                </ol>
                
                <h3>Sustainable Shopping Principles</h3>
                <ul>
                  <li><strong>Second-hand first:</strong> Thrift stores, consignment, online marketplaces</li>
                  <li><strong>Quality over quantity:</strong> Buy fewer, better items that last longer</li>
                  <li><strong>Local and small businesses:</strong> Support local economy, reduce shipping emissions</li>
                  <li><strong>Sustainable materials:</strong> Organic, recycled, upcycled materials</li>
                  <li><strong>Minimal packaging:</strong> Choose products with less waste</li>
                </ul>
                
                <h3>Shopping Categories to Consider</h3>
                <ul>
                  <li><strong>Clothing:</strong> Thrift stores, sustainable brands, clothing swaps</li>
                  <li><strong>Household items:</strong> Second-hand furniture, kitchenware, decor</li>
                  <li><strong>Food:</strong> Local farmers markets, bulk bins, minimal packaging</li>
                  <li><strong>Electronics:</strong> Refurbished instead of new, extend device life</li>
                </ul>
                
                <h3>Evidence Requirements</h3>
                <ul>
                  <li><strong>Purchase log:</strong> All purchases with sustainability justifications</li>
                  <li><strong>Photos:</strong> Show second-hand finds, local businesses, sustainable products</li>
                  <li><strong>Cost comparison:</strong> Sustainable vs. conventional shopping costs</li>
                  <li><strong>Impact calculation:</strong> Estimated environmental benefits of your choices</li>
                </ul>
                
                <h3>Environmental Impact</h3>
                <p>Buying second-hand clothing extends product life by 2+ years, reducing its environmental impact by 60-70%. Every sustainable purchase supports better practices and reduces demand for wasteful production.</p>
              `
            },
            '9': {
              id: '9',
              title: 'Carbon Footprint Audit and Reduction',
              category: 'Climate Change',
              description: 'Calculate your carbon footprint and implement strategies to reduce it by 20% over one month.',
              difficulty: 'Hard',
              xp: 200,
              impactValue: 14,
              deadline: '2024-12-31',
              participants: 92,
              instructions: `
                <h3>Challenge Overview</h3>
                <p>Understanding your carbon footprint is the first step toward reducing it. This challenge combines measurement with action to help you make meaningful climate impact.</p>
                
                <h3>Challenge Instructions</h3>
                <ol>
                  <li><strong>Calculate:</strong> Use carbon calculator to determine your baseline footprint</li>
                  <li><strong>Analyze:</strong> Identify biggest contributors to your emissions</li>
                  <li><strong>Implement:</strong> Apply reduction strategies for one month</li>
                  <li><strong>Measure:</strong> Recalculate to verify 20% reduction</li>
                </ol>
                
                <h3>Carbon Footprint Categories</h3>
                <ul>
                  <li><strong>Home energy:</strong> Electricity, heating, cooling (typically 20-30%)</li>
                  <li><strong>Transportation:</strong> Car, flights, public transit (typically 15-25%)</li>
                  <li><strong>Food:</strong> Diet choices, food waste (typically 15-20%)</li>
                  <li><strong>Shopping:</strong> Clothing, electronics, household goods (typically 10-15%)</li>
                  <li><strong>Services:</strong> Healthcare, banking, entertainment (typically 10-15%)</li>
                </ul>
                
                <h3>Reduction Strategies</h3>
                <h3>Energy:</h3>
                <ul>
                  <li>Switch to renewable energy provider</li>
                  <li>Improve home insulation and weatherization</li>
                  <li>Upgrade to energy-efficient appliances</li>
                  <li>Reduce heating/cooling usage</li>
                </ul>
                
                <h3>Transportation:</h3>
                <ul>
                  <li>Drive less, use public transit, bike, walk</li>
                  <li>Choose fuel-efficient vehicle or EV</li>
                  <li>Reduce air travel when possible</li>
                  <li>Combine trips and optimize routes</li>
                </ul>
                
                <h3>Food:</h3>
                <ul>
                  <li>Reduce meat consumption (especially beef)</li>
                  <li>Minimize food waste</li>
                  <li>Choose local and seasonal foods</li>
                  <li>Grow some of your own food</li>
                </ul>
                
                <h3>Evidence Requirements</h3>
                <ul>
                  <li><strong>Baseline calculation:</strong> Initial carbon footprint results</li>
                  <li><strong>Implementation plan:</strong> Specific strategies you chose and why</li>
                  <li><strong>Action log:</strong> Daily/weekly progress on implementation</li>
                  <li><strong>Final calculation:</strong> Verification of 20% reduction achieved</li>
                  <li><strong>Reflection:</strong> What was most effective? What will you continue?</li>
                </ul>
                
                <h3>Environmental Impact</h3>
                <p>Achieving a 20% carbon footprint reduction for an average American saves approximately 4 tons of CO2 annually - equivalent to planting 185 trees or taking 1 car off the road for a year!</p>
              `
            }
          }
          
          setChallenge(enhancedChallenges[id] || enhancedChallenges['1'])
        }
      } catch (error) {
        console.error('Error fetching challenge:', error)
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

    setSubmitting(true)

    try {
      let imageUrl = null

      if (imageFile) {
        const storageRef = ref(storage, `evidence/${currentUser.uid}/${Date.now()}_${imageFile.name}`)
        await uploadBytes(storageRef, imageFile)
        imageUrl = await getDownloadURL(storageRef)
      }

      // Create submission
      const submissionData = {
        userId: currentUser.uid,
        challengeId: challenge.id,
        challengeTitle: challenge.title,
        evidence,
        imageUrl,
        status: 'pending',
        submittedAt: new Date().toISOString(),
        xpReward: challenge.xp,
        impactValue: challenge.impactValue
      }

      await setDoc(doc(collection(db, 'submissions')), submissionData)

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
                    Upload evidence (optional)
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