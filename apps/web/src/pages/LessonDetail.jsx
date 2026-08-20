import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { db } from '../firebase/config'
import { doc, getDoc } from 'firebase/firestore'
import { ArrowLeft, Clock, Target, CheckCircle, BookOpen } from 'lucide-react'

export default function LessonDetail() {
  const { id } = useParams()
  const navigate = useNavigate()
  const [lesson, setLesson] = useState(null)
  const [completed, setCompleted] = useState(false)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function fetchLesson() {
      try {
        const lessonDoc = await getDoc(doc(db, 'lessons', id))
        if (lessonDoc.exists()) {
          setLesson({ id: lessonDoc.id, ...lessonDoc.data() })
        } else {
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
                  <li>CO2 levels are at 420 ppm (highest in 800,000 years)</li>
                  <li>19 of the hottest 20 years have occurred since 2000</li>
                  <li>Arctic ice is declining 13% per decade</li>
                </ul>
                
                <h2>Primary Causes of Climate Change</h2>
                <h3>Burning Fossil Fuels (73% of emissions):</h3>
                <ul>
                  <li><strong>Electricity:</strong> Coal and natural gas power plants</li>
                  <li><strong>Transportation:</strong> Cars, planes, ships</li>
                  <li><strong>Industry:</strong> Manufacturing and construction</li>
                  <li><strong>Heating:</strong> Buildings and homes</li>
                </ul>
                
                <h3>Deforestation (11% of emissions):</h3>
                <p>Trees absorb CO2. When forests are cleared, stored carbon is released, and future absorption capacity is lost.</p>
                
                <h3>Agriculture (18% of emissions):</h3>
                <ul>
                  <li>Livestock methane production</li>
                  <li>Synthetic fertilizers</li>
                  <li>Rice paddies (methane)</li>
                  <li>Land use changes</li>
                </ul>
                
                <h2>Impacts of Climate Change</h2>
                <h3>Environmental Effects:</h3>
                <ul>
                  <li><strong>Rising seas:</strong> 3.3mm per year, threatening coastal cities</li>
                  <li><strong>Extreme weather:</strong> More frequent hurricanes, floods, droughts</li>
                  <li><strong>Ecosystem collapse:</strong> Coral reefs dying, species extinction</li>
                  <li><strong>Ocean acidification:</strong> Threatening marine life</li>
                </ul>
                
                <h3>Human Impacts:</h3>
                <ul>
                  <li><strong>Food security:</strong> Crop failures and changing growing seasons</li>
                  <li><strong>Water scarcity:</strong> Changing precipitation patterns</li>
                  <li><strong>Health risks:</strong> Heat waves, disease spread</li>
                  <li><strong>Economic damage:</strong> $210 billion annually in climate disasters</li>
                  <li><strong>Climate refugees:</strong> 30+ million displaced annually</li>
                </ul>
                
                <h2>Actionable Solutions: What You Can Do</h2>
                <h3>Immediate Actions (Today):</h3>
                <ul>
                  <li><strong>Reduce energy:</strong> Turn off lights, unplug devices</li>
                  <li><strong>Travel smart:</strong> Walk, bike, public transport, carpool</li>
                  <li><strong>Diet choices:</strong> Reduce meat consumption</li>
                  <li><strong>Reduce waste:</strong> Buy less, recycle more</li>
                </ul>
                
                <h3>Medium-term Actions (This Month):</h3>
                <ul>
                  <li><strong>Home energy audit:</strong> Identify efficiency improvements</li>
                  <li><strong>Switch to renewable energy:</strong> Green power options</li>
                  <li><strong>Plant trees:</strong> In your yard or community</li>
                  <li><strong>Support climate policies:</strong> Vote and advocate</li>
                </ul>
                
                <h3>Long-term Actions (This Year):</h3>
                <ul>
                  <li><strong>Electric vehicle:</strong> When replacing your car</li>
                  <li><strong>Solar panels:</strong> Generate your own clean energy</li>
                  <li><strong>Sustainable investments:</strong> Support green companies</li>
                  <li><strong>Community leadership:</strong> Organize local climate initiatives</li>
                </ul>
                
                <h2>Hope and Progress</h2>
                <p>Climate solutions are advancing rapidly. Renewable energy costs have fallen 85% in a decade. Electric vehicles are becoming mainstream. Countries are committing to net-zero targets. Individual actions combined with systemic change can still prevent the worst impacts.</p>
              `
            },
            '5': {
              id: '5',
              title: 'Energy Conservation: Power Your Home Sustainably',
              category: 'Energy Conservation',
              description: 'Master energy conservation with practical strategies for home, appliances, and daily habits that save money and planet.',
              duration: '25 min',
              difficulty: 'Beginner',
              xp: 20,
              content: `
                <h2>Why Energy Conservation Matters</h2>
                <p>Energy production is the largest source of greenhouse gas emissions. The average home uses 30% more energy than needed. Conserving energy reduces pollution, saves money, and decreases our dependence on fossil fuels.</p>
                
                <h2>Understanding Your Energy Use</h2>
                <p><strong>Home Energy Breakdown:</strong></p>
                <ul>
                  <li><strong>Heating & Cooling:</strong> 45% of home energy use</li>
                  <li><strong>Water Heating:</strong> 18%</li>
                  <li><strong>Lighting:</strong> 12%</li>
                  <li><strong>Appliances:</strong> 15%</li>
                  <li><strong>Electronics:</strong> 10%</li>
                </ul>
                
                <h2>Lighting Efficiency</h2>
                <h3>The LED Revolution:</h3>
                <ul>
                  <li><strong>LED bulbs use 75% less energy</strong> than incandescent</li>
                  <li><strong>Last 25x longer</strong> (25,000 hours vs 1,000)</li>
                  <li><strong>Save $80 per bulb</strong> over its lifetime</li>
                  <li><strong>Contain no mercury</strong> (unlike CFLs)</li>
                </ul>
                
                <h3>Smart Lighting Strategies:</h3>
                <ul>
                  <li>Use natural light whenever possible</li>
                  <li>Install motion sensors in low-traffic areas</li>
                  <li>Use dimmers to reduce light intensity</li>
                  <li>Turn off lights when leaving rooms (saves 10% annually)</li>
                </ul>
                
                <h2>Heating and Cooling Optimization</h2>
                <h3>Thermostat Management:</h3>
                <ul>
                  <li><strong>Winter:</strong> Set to 68°F (20°C) when home, 65°F (18°C) when away</li>
                  <li><strong>Summer:</strong> Set to 78°F (26°C) when home, 85°F (29°C) when away</li>
                  <li><strong>Programmable thermostats:</strong> Save 10% annually on heating/cooling</li>
                  <li><strong>Each degree adjustment:</strong> Saves 1-3% on energy bills</li>
                </ul>
                
                <h3>Passive Heating and Cooling:</h3>
                <ul>
                  <li><strong>Windows:</strong> Use curtains strategically (open in winter, close in summer)</li>
                  <li><strong>Sealing:</strong> Weather stripping around doors and windows</li>
                  <li><strong>Insulation:</strong> Proper insulation reduces heating needs by 30%</li>
                  <li><strong>Ceiling fans:</strong> Allow 4°F thermostat adjustment without comfort loss</li>
                </ul>
                
                <h2>Appliance Efficiency</h2>
                <h3>Energy Star Rating:</h3>
                <ul>
                  <li><strong>Refrigerators:</strong> Energy Star uses 20% less energy</li>
                  <li><strong>Washers:</strong> Use 25% less energy and 33% less water</li>
                  <li><strong>Dishwashers:</strong> Use 12% less energy and 30% less water</li>
                  <li><strong>Cost premium:</strong> Typically recovered in 3-5 years through savings</li>
                </ul>
                
                <h3>Smart Usage Habits:</h3>
                <ul>
                  <li><strong>Full loads only:</strong> For dishwashers and washing machines</li>
                  <li><strong>Cold water washing:</strong> Cleans equally well, saves heating energy</li>
                  <li><strong>Air drying:</strong> Skip dryer when possible (saves $100+ annually)</li>
                  <li><strong>Size matters:</strong> Buy appliances appropriate to your needs</li>
                </ul>
                
                <h2>Electronics and Phantom Load</h2>
                <p><strong>Phantom load:</strong> Electronics consume energy even when "off" - up to 10% of residential energy use!</p>
                
                <h3>Solutions:</h3>
                <ul>
                  <li><strong>Power strips:</strong> Turn off multiple devices at once</li>
                  <li><strong>Smart power strips:</strong> Cut power automatically when devices are off</li>
                  <li><strong>Unplug rarely used devices:</strong> Game consoles, spare chargers</li>
                  <li><strong>Energy-efficient devices:</strong> Look for Energy Star certification</li>
                </ul>
                
                <h2>Renewable Energy Options</h2>
                <h3>Home Solar:</h3>
                <ul>
                  <li><strong>Cost:</strong> Dropped 70% in the last decade</li>
                  <li><strong>Payback period:</strong> 5-8 years in most areas</li>
                  <li><strong>Incentives:</strong> Tax credits and rebates available</li>
                  <li><strong>Benefits:</strong> Lock in energy costs, increase home value</li>
                </ul>
                
                <h3>Green Power Programs:</h3>
                <ul>
                  <li>Many utilities offer renewable energy options</li>
                  <li>Typically costs $5-15 more monthly</li>
                  <li>Supports development of clean energy</li>
                </ul>
                
                <h2>Energy Audits and Monitoring</h2>
                <ul>
                  <li><strong>Professional audits:</strong> Many utilities offer free home energy audits</li>
                  <li><strong>Smart monitors:</strong> Track real-time energy use</li>
                  <li><strong>Apps:</strong> Many utility companies provide usage tracking apps</li>
                </ul>
                
                <h2>The Impact of Conservation</h2>
                <p>If every US household replaced just one light bulb with an LED, we'd save enough energy to light 3 million homes for a year, prevent greenhouse gas emissions equivalent to 800,000 cars, and save $600 million in energy costs annually.</p>
              `
            },
            '6': {
              id: '6',
              title: 'Biodiversity: The Web of Life',
              category: 'Biodiversity',
              description: 'Explore the intricate connections in ecosystems and discover why biodiversity is essential for human survival.',
              duration: '40 min',
              difficulty: 'Advanced',
              xp: 35,
              content: `
                <h2>What is Biodiversity?</h2>
                <p>Biodiversity refers to the variety of life on Earth at all its levels, from genes to ecosystems. It includes the evolutionary, ecological, and cultural processes that sustain life. Biodiversity is the foundation of ecosystem services that sustain human life.</p>
                
                <h2>The Three Levels of Biodiversity</h2>
                <h3>Genetic Diversity:</h3>
                <p>Variation within species - the reason some plants resist disease while others don't, or why some people can digest lactose while others can't.</p>
                
                <h3>Species Diversity:</h3>
                <p>Variety of species within an ecosystem - from bacteria to blue whales. Scientists estimate 8.7 million species on Earth, though only 1.2 million have been identified.</p>
                
                <h3>Ecosystem Diversity:</h3>
                <p>Variety of habitats and ecological processes - from coral reefs to deserts, each supporting unique communities of life.</p>
                
                <h2>Why Biodiversity Matters</h2>
                <h3>Ecosystem Services:</h3>
                <ul>
                  <li><strong>Provisioning:</strong> Food, medicine, materials, genetic resources</li>
                  <li><strong>Regulating:</strong> Climate regulation, water purification, disease control</li>
                  <li><strong>Cultural:</strong> Spiritual, recreational, educational value</li>
                  <li><strong>Supporting:</strong> Soil formation, nutrient cycling, photosynthesis</li>
                </ul>
                
                <h3>Economic Value:</h3>
                <p>Biodiversity provides an estimated $125 trillion in ecosystem services annually - more than global GDP. Key contributions include:</p>
                <ul>
                  <li><strong>Agriculture:</strong> 75% of food crops depend on animal pollination</li>
                  <li><strong>Medicine:</strong> 70% of cancer drugs are natural or derived from nature</li>
                  <li><strong>Tourism:</strong> Ecotourism generates $600 billion annually</li>
                </ul>
                
                <h2>The Biodiversity Crisis</h2>
                <p><strong>Current extinction rate:</strong> 100-1,000 times higher than natural background rate. We're losing species faster than they can evolve.</p>
                
                <h3>Key Threats:</h3>
                <ul>
                  <li><strong>Habitat destruction:</strong> 85% of species threatened by habitat loss (agriculture, urbanization)</li>
                  <li><strong>Climate change:</strong> Shifting conditions faster than species can adapt</li>
                  <li><strong>Pollution:</strong> Chemical contamination, plastic, light, noise pollution</li>
                  <li><strong>Overexploitation:</strong> Overfishing, hunting, poaching</li>
                  <li><strong>Invasive species:</strong> Outcompeting native species</li>
                </ul>
                
                <h2>Keystone Species and Ecosystem Engineers</h2>
                <p>Some species have disproportionate impacts on their ecosystems:</p>
                <ul>
                  <li><strong>Bees:</strong> Pollinate 80% of flowering plants</li>
                  <li><strong>Wolves:</strong> Control herbivore populations, protecting vegetation</li>
                  <li><strong>Coral:</strong> Foundation for 25% of marine species</li>
                  <li><strong>Beavers:</strong> Create wetlands that support diverse life</li>
                </ul>
                
                <h2>Biodiversity Hotspots</h2>
                <p>Areas with exceptional concentrations of endemic species experiencing habitat loss:</p>
                <ul>
                  <li><strong>Amazon Rainforest:</strong> 10% of all species</li>
                  <li><strong>Coral Triangle:</strong> 76% of coral species</li>
                  <li><strong>Madagascar:</strong> 90% of species found nowhere else</li>
                  <li><strong>Sundaland:</strong> 15,000 plant species (6,000 endemic)</li>
                </ul>
                
                <h2>Conservation Strategies</h2>
                <h3>In-situ Conservation:</h3>
                <ul>
                  <li><strong>Protected areas:</strong> National parks, wildlife reserves</li>
                  <li><strong>Habitat restoration:</strong> Reforestation, wetland restoration</li>
                  <li><strong>Wildlife corridors:</strong> Connecting fragmented habitats</li>
                </ul>
                
                <h3>Ex-situ Conservation:</h3>
                <ul>
                  <li><strong>Zoos and aquariums:</strong> Breeding programs for endangered species</li>
                  <li><strong>Seed banks:</strong> Storing genetic diversity for future use</li>
                  <li><strong>Botanical gardens:</strong> Preserving plant diversity</li>
                </ul>
                
                <h2>Individual Actions for Biodiversity</h2>
                <h3>At Home:</h3>
                <ul>
                  <li><strong>Native gardening:</strong> Plant local species to support local wildlife</li>
                  <li><strong>Pesticide-free:</strong> Avoid chemicals that harm beneficial insects</li>
                  <li><strong>Wildlife-friendly:</strong> Bird feeders, bee hotels, water sources</li>
                  <li><strong>Pet responsibility:</strong> Keep cats indoors (they kill billions of birds annually)</li>
                </ul>
                
                <h3>Consumption Choices:</h3>
                <ul>
                  <li><strong>Sustainable seafood:</strong> Choose certified sustainable options</li>
                  <li><strong>Palm oil:</strong> Avoid products driving deforestation</li>
                  <li><strong>Wood products:</strong> Choose FSC-certified sustainable sources</li>
                  <li><strong>Illegal wildlife products:</strong> Never purchase souvenirs from endangered species</li>
                </ul>
                
                <h3>Advocacy and Education:</h3>
                <ul>
                  <li>Support conservation organizations</li>
                  <li>Educate others about biodiversity importance</li>
                  <li>Advocate for policies protecting natural habitats</li>
                  <li>Participate in citizen science projects</li>
                </ul>
                
                <h2>Success Stories</h2>
                <p><strong>Bald Eagle Recovery:</strong> From near extinction to removed from endangered list through habitat protection and banning DDT. <strong>Gray Wolf Reintroduction:</strong> Restored ecological balance in Yellowstone. These examples show that conservation works when we commit to it.</p>
              `
            }
          }
          
          setLesson(enhancedLessons[id] || enhancedLessons['1'])
        }
      } catch (error) {
        console.error('Error fetching lesson:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchLesson()
  }, [id])

  function handleComplete() {
    setCompleted(true)
    // In production, this would update Firestore and award XP
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