import { db } from '../firebase/config'
import { collection, doc, setDoc } from 'firebase/firestore'

// Sample lessons data
const lessons = [
  {
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
  {
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
  {
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
  {
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
  {
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
  {
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
]

// Sample challenges data
const challenges = [
  {
    title: 'Plastic-Free Day Challenge',
    category: 'Plastic Pollution',
    description: 'Eliminate all single-use plastics for 24 hours. This challenge raises awareness about plastic pollution and helps you discover sustainable alternatives.',
    difficulty: 'Medium',
    xp: 100,
    impactValue: 5,
    deadline: '2024-12-31',
    participants: 234,
    status: 'active',
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
  {
    title: 'Water Warrior: 7-Day Conservation Challenge',
    category: 'Water Conservation',
    description: 'Reduce your water consumption by 30% for one week through conscious habits and practical water-saving techniques.',
    difficulty: 'Medium',
    xp: 150,
    impactValue: 8,
    deadline: '2024-12-31',
    participants: 189,
    status: 'active',
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
  {
    title: 'Energy Saver: Phantom Load Elimination',
    category: 'Energy Conservation',
    description: 'Identify and eliminate phantom energy loads in your home. Electronics consume energy even when "off" - costing you money and increasing your carbon footprint.',
    difficulty: 'Easy',
    xp: 75,
    impactValue: 6,
    deadline: '2024-12-31',
    participants: 312,
    status: 'active',
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
  {
    title: 'Community Tree Planting Initiative',
    category: 'Biodiversity',
    description: 'Plant a native tree in your community and commit to its care for the first year. Trees provide countless environmental benefits from carbon sequestration to habitat creation.',
    difficulty: 'Hard',
    xp: 200,
    impactValue: 15,
    deadline: '2024-12-31',
    participants: 87,
    status: 'active',
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
  {
    title: 'E-Waste Warrior: Responsible Electronics Disposal',
    category: 'E-Waste',
    description: 'Collect and properly dispose of 5 electronic waste items from your home. E-waste is the fastest-growing waste stream and contains valuable, toxic materials.',
    difficulty: 'Easy',
    xp: 80,
    impactValue: 7,
    deadline: '2024-12-31',
    participants: 156,
    status: 'active',
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
  {
    title: 'Zero Waste Week: Minimalist Living Challenge',
    category: 'Waste Management',
    description: 'Produce zero landfill waste for one week through composting, recycling, and conscious consumption. This challenge transforms your relationship with waste.',
    difficulty: 'Hard',
    xp: 250,
    impactValue: 12,
    deadline: '2024-12-31',
    participants: 67,
    status: 'active',
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
  {
    title: 'Sustainable Transportation Week',
    category: 'Sustainable Transportation',
    description: 'Replace car trips with sustainable alternatives for one week. Transportation accounts for 29% of US greenhouse gas emissions.',
    difficulty: 'Medium',
    xp: 120,
    impactValue: 9,
    deadline: '2024-12-31',
    participants: 145,
    status: 'active',
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
  {
    title: 'Sustainable Shopping Challenge',
    category: 'Sustainable Consumption',
    description: 'Practice conscious consumption for one week by prioritizing second-hand, local, and sustainable products.',
    difficulty: 'Medium',
    xp: 100,
    impactValue: 7,
    deadline: '2024-12-31',
    participants: 178,
    status: 'active',
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
  {
    title: 'Carbon Footprint Audit and Reduction',
    category: 'Climate Change',
    description: 'Calculate your carbon footprint and implement strategies to reduce it by 20% over one month.',
    difficulty: 'Hard',
    xp: 200,
    impactValue: 14,
    deadline: '2024-12-31',
    participants: 92,
    status: 'active',
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
]

// Sample institution data
const institutions = [
  {
    name: 'Green Valley High School',
    location: 'California, USA',
    totalStudents: 1200,
    activeStudents: 950
  },
  {
    name: 'Eco Academy',
    location: 'New York, USA',
    totalStudents: 800,
    activeStudents: 650
  }
]

// Function to seed data
export async function seedDatabase() {
  try {
    console.log('Seeding database...')

    // Seed lessons
    for (const lesson of lessons) {
      const lessonRef = doc(collection(db, 'lessons'))
      await setDoc(lessonRef, lesson)
      console.log('Added lesson:', lesson.title)
    }

    // Seed challenges
    for (const challenge of challenges) {
      const challengeRef = doc(collection(db, 'challenges'))
      await setDoc(challengeRef, challenge)
      console.log('Added challenge:', challenge.title)
    }

    // Seed institutions
    for (const institution of institutions) {
      const institutionRef = doc(collection(db, 'institutions'))
      await setDoc(institutionRef, institution)
      console.log('Added institution:', institution.name)
    }

    console.log('Database seeded successfully!')
  } catch (error) {
    console.error('Error seeding database:', error)
  }
}

// Export data for use in components
export { lessons, challenges, institutions }