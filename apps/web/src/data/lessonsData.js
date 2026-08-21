export const LESSONS_DATA = [
  {
    id: 'lesson-waste-mgmt-101',
    title: 'Zero Waste Principles & 5Rs Mastery',
    category: 'Waste Management',
    description: 'Explore the circular economy hierarchy and master the 5Rs (Refuse, Reduce, Reuse, Repurpose, Recycle) to eliminate landfill waste.',
    duration: '20 min',
    difficulty: 'Beginner',
    xp: 30,
    content: `
      <div class="space-y-6">
        <section>
          <h2 class="text-2xl font-bold text-slate-900 mb-3">1. The Global Waste Dilemma</h2>
          <p class="text-slate-700 leading-relaxed">
            Humanity currently generates over <strong>2.01 billion metric tons</strong> of municipal solid waste annually, with at least 33% not managed in an environmentally safe manner. Traditional linear economic models follow a destructive <em>"Take-Make-Dispose"</em> pattern, depleting natural resources and releasing toxic leachate and methane gas into landfills.
          </p>
        </section>

        <section class="bg-emerald-50 border-l-4 border-emerald-500 p-4 rounded-r-lg">
          <h3 class="text-lg font-semibold text-emerald-900 mb-1">The 5Rs Waste Hierarchy (In Order of Priority):</h3>
          <ul class="list-disc list-inside space-y-1 text-emerald-800 text-sm">
            <li><strong>1. Refuse:</strong> Politely decline single-use items, junk flyers, and excessive packaging.</li>
            <li><strong>2. Reduce:</strong> Minimize consumption; choose durable, high-utility necessities.</li>
            <li><strong>3. Reuse:</strong> Opt for refillable containers, cloth tote bags, and repairable goods.</li>
            <li><strong>4. Repurpose (Upcycle):</strong> Convert discarded materials into planters, cleaning rags, or storage.</li>
            <li><strong>5. Recycle:</strong> The last resort before disposal—processing materials into raw resources.</li>
          </ul>
        </section>

        <section>
          <h2 class="text-2xl font-bold text-slate-900 mb-3">2. Landfill Dynamics & Methane Emissions</h2>
          <p class="text-slate-700 leading-relaxed">
            When organic matter (such as food scraps and cardboard) is trapped under compacted layers in landfills without oxygen, anaerobic decomposition occurs. This produces <strong>methane (CH₄)</strong>, a potent greenhouse gas with a global warming potential <strong>28 to 36 times higher than CO₂</strong> over a 100-year timescale.
          </p>
        </section>

        <section>
          <h2 class="text-2xl font-bold text-slate-900 mb-3">3. Case Study: Kamikatsu, Japan</h2>
          <p class="text-slate-700 leading-relaxed">
            The town of Kamikatsu in Japan separates its garbage into <strong>45 distinct categories</strong> across 13 collection stations. Through strong community stewardship and zero-waste education, the town achieves a waste recycling rate exceeding <strong>80%</strong>, proving that zero-waste living is viable on a community scale.
          </p>
        </section>

        <section class="bg-slate-100 p-4 rounded-lg">
          <h3 class="text-base font-semibold text-slate-900 mb-2">⚡ Practical Takeaways for Your Daily Routine:</h3>
          <ol class="list-decimal list-inside space-y-1 text-slate-700 text-sm">
            <li>Conduct a 3-day personal waste audit by cataloging what you discard.</li>
            <li>Implement kitchen countertop composting for fruit peels and vegetable ends.</li>
            <li>Carry a compact zero-waste kit: stainless steel bottle, utensils, and cloth bag.</li>
          </ol>
        </section>
      </div>
    `,
    quiz: [
      {
        id: 'q1',
        question: 'Which of the 5Rs is considered the FIRST and most effective step in waste prevention?',
        options: ['Recycle', 'Refuse', 'Repurpose', 'Reuse'],
        correctIndex: 1,
        explanation: 'Refusing unnecessary items at the source prevents waste from ever being generated or entering the manufacturing/disposal cycle.'
      },
      {
        id: 'q2',
        question: 'Why is organic waste in airtight landfills particularly harmful to the climate?',
        options: [
          'It turns into radioactive residue',
          'Anaerobic decomposition generates potent methane gas (CH₄)',
          'It absorbs too much carbon from the sky',
          'It freezes the surrounding soil temperature'
        ],
        correctIndex: 1,
        explanation: 'In oxygen-deprived landfills, microbes decompose organics anaerobically, generating methane gas which is significantly more potent at trapping heat than CO₂.'
      },
      {
        id: 'q3',
        question: 'What is the primary difference between a linear economy and a circular economy?',
        options: [
          'Linear economies produce no goods, whereas circular economies only sell services',
          'Linear economies follow "Take-Make-Dispose", whereas circular economies design out waste through reuse and regeneration',
          'Linear economies rely entirely on solar power',
          'There is no functional difference'
        ],
        correctIndex: 1,
        explanation: 'A circular economy keeps resources in use for as long as possible, extracts the maximum value, and regenerates natural systems, unlike the linear "Take-Make-Dispose" model.'
      }
    ]
  },
  {
    id: 'lesson-recycling-mastery',
    title: 'Advanced Material Recycling & Contamination Prevention',
    category: 'Recycling',
    description: 'Learn resin identification codes, how to prevent "wishcycling", and how proper sorting preserves high-grade recyclable polymers.',
    duration: '22 min',
    difficulty: 'Beginner',
    xp: 35,
    content: `
      <div class="space-y-6">
        <section>
          <h2 class="text-2xl font-bold text-slate-900 mb-3">1. The Science of Recycling & Resin Codes</h2>
          <p class="text-slate-700 leading-relaxed">
            Plastics are stamped with Resin Identification Codes (RIC 1 through 7) inside a chasing-arrows symbol. However, the presence of this symbol <em>does not automatically mean</em> an item can be accepted by your local curbside program.
          </p>
          <div class="grid grid-cols-1 md:grid-cols-2 gap-3 mt-3 text-sm">
            <div class="p-3 bg-slate-50 border rounded">
              <strong class="text-emerald-700">#1 PET (Polyethylene Terephthalate):</strong> Water/soda bottles. High recycling value; spun into polyester fibers or new bottles.
            </div>
            <div class="p-3 bg-slate-50 border rounded">
              <strong class="text-emerald-700">#2 HDPE (High-Density Polyethylene):</strong> Milk jugs, shampoo bottles. Highly durable, widely recycled into piping and lumber.
            </div>
            <div class="p-3 bg-slate-50 border rounded">
              <strong class="text-amber-700">#5 PP (Polypropylene):</strong> Yogurt tubs, bottle caps. Heat-resistant; increasingly accepted in modern facilities.
            </div>
            <div class="p-3 bg-slate-50 border rounded">
              <strong class="text-rose-700">#6 PS (Polystyrene) & #7 Other:</strong> Styrofoam and multi-layer pouches. Extremely difficult to recycle curbside.
            </div>
          </div>
        </section>

        <section>
          <h2 class="text-2xl font-bold text-slate-900 mb-3">2. The Danger of "Wishcycling"</h2>
          <p class="text-slate-700 leading-relaxed">
            <strong>Wishcycling</strong> is the practice of tossing questionable items into the recycling bin hoping they will be recycled. Items like greasy pizza boxes, plastic film bags, and garden hoses jam sorting facility optical sorters and star-screens, risking the rejection of entire bales of otherwise clean paper and aluminum.
          </p>
        </section>

        <section>
          <h2 class="text-2xl font-bold text-slate-900 mb-3">3. Infinite Recycling: Aluminum & Glass</h2>
          <p class="text-slate-700 leading-relaxed">
            Unlike plastics (which downcycle and degrade in polymer chain length after 1-2 cycles), <strong>aluminum and glass can be recycled indefinitely</strong> without loss of purity or quality. Recycling an aluminum beverage can saves <strong>95% of the energy</strong> needed to extract primary bauxite ore.
          </p>
        </section>

        <section class="bg-slate-100 p-4 rounded-lg">
          <h3 class="text-base font-semibold text-slate-900 mb-2">⚡ 3 Golden Rules of Recycling:</h3>
          <ul class="list-disc list-inside space-y-1 text-slate-700 text-sm">
            <li><strong>Empty, Clean, and Dry:</strong> Rinse out food residues to avoid contaminating paper fibers.</li>
            <li><strong>No Plastic Bags in Bins:</strong> Keep recyclables loose; bags wrap around sorting gears.</li>
            <li><strong>When in Doubt, Check or Throw Out:</strong> Preventing contamination is better than contaminating a whole load.</li>
          </ul>
        </section>
      </div>
    `,
    quiz: [
      {
        id: 'q1',
        question: 'What is "wishcycling" and why is it problematic?',
        options: [
          'Making a wish before buying plastic bottles',
          'Throwing non-recyclables into the bin hoping they get recycled, which contaminates real recyclables and breaks sorting machinery',
          'Trading recycled plastic for cash rewards',
          'Recycling only during national holidays'
        ],
        correctIndex: 1,
        explanation: 'Wishcycling contaminates recyclable loads and causes equipment jams at Materials Recovery Facilities (MRFs).'
      },
      {
        id: 'q2',
        question: 'How much energy is saved by recycling an aluminum can compared to producing virgin aluminum from bauxite ore?',
        options: ['Approximately 20%', 'Approximately 50%', 'Approximately 95%', '0% — it uses more energy'],
        correctIndex: 2,
        explanation: 'Recycling aluminum preserves 95% of the energy required for virgin smelting and produces 95% fewer greenhouse gas emissions.'
      },
      {
        id: 'q3',
        question: 'Which of the following items should NEVER be placed in a standard single-stream recycling bin?',
        options: [
          'Clean aluminum soda cans',
          'Dry corrugated cardboard boxes',
          'Greasy food-soaked pizza box bottoms and thin plastic shopping bags',
          'Rinsed PET #1 clear water bottles'
        ],
        correctIndex: 2,
        explanation: 'Grease saturates cardboard fibers making pulping impossible, and thin plastic film jams automated mechanical sorters.'
      }
    ]
  },
  {
    id: 'lesson-water-conservation',
    title: 'Hydrology & Water Footprint Reduction',
    category: 'Water Conservation',
    description: 'Understand accessible freshwater limits, calculate embedded virtual water in everyday commodities, and implement residential conservation.',
    duration: '25 min',
    difficulty: 'Intermediate',
    xp: 40,
    content: `
      <div class="space-y-6">
        <section>
          <h2 class="text-2xl font-bold text-slate-900 mb-3">1. The Global Freshwater Scarcity Reality</h2>
          <p class="text-slate-700 leading-relaxed">
            While water covers roughly 71% of Earth\'s surface, <strong>97.5% is saltwater</strong>. Of the remaining 2.5% freshwater, over two-thirds is locked in polar glaciers and permanent snow caps. Less than <strong>1% of all planetary water</strong> is accessible for human consumption, agriculture, and sanitation.
          </p>
        </section>

        <section>
          <h2 class="text-2xl font-bold text-slate-900 mb-3">2. Direct vs. "Virtual" Water Footprint</h2>
          <p class="text-slate-700 leading-relaxed">
            Your water footprint includes both <em>direct consumption</em> (showers, sinks, cooking) and <em>virtual/embedded water</em>—the freshwater consumed to grow crops, raise livestock, and manufacture goods.
          </p>
          <div class="overflow-x-auto mt-3">
            <table class="min-w-full text-left text-sm border border-slate-200">
              <thead class="bg-slate-100 font-semibold text-slate-900">
                <tr>
                  <th class="p-2 border">Item</th>
                  <th class="p-2 border">Embedded Water Volume</th>
                </tr>
              </thead>
              <tbody class="divide-y text-slate-700">
                <tr><td class="p-2 border">1 Cotton T-Shirt</td><td class="p-2 border">~2,700 Liters (enough for 1 person to drink for 3 years)</td></tr>
                <tr><td class="p-2 border">1 kg of Beef</td><td class="p-2 border">~15,400 Liters</td></tr>
                <tr><td class="p-2 border">1 Cup of Coffee</td><td class="p-2 border">~140 Liters</td></tr>
                <tr><td class="p-2 border">1 Sheet of A4 Paper</td><td class="p-2 border">~10 Liters</td></tr>
              </tbody>
            </table>
          </div>
        </section>

        <section>
          <h2 class="text-2xl font-bold text-slate-900 mb-3">3. Smart Conservation Tech: Aerators & Greywater</h2>
          <p class="text-slate-700 leading-relaxed">
            Standard bathroom faucets flow at 8-12 liters per minute. Installing an inexpensive <strong>faucet aerator</strong> mixes ambient air into the water stream, cutting volume to 3.5-5 liters per minute without sacrificing perceived pressure. <strong>Greywater systems</strong> safely route gently used water from bathroom sinks and washing machines to landscape irrigation.
          </p>
        </section>

        <section class="bg-slate-100 p-4 rounded-lg">
          <h3 class="text-base font-semibold text-slate-900 mb-2">⚡ Actionable Water-Saving Protocols:</h3>
          <ul class="list-disc list-inside space-y-1 text-slate-700 text-sm">
            <li>Cap daily showers at 5 minutes (saves up to 45 liters per shower).</li>
            <li>Turn off running taps when brushing teeth or lathering dishes.</li>
            <li>Audit toilets for silent flapper leaks using food coloring in the tank.</li>
          </ul>
        </section>
      </div>
    `,
    quiz: [
      {
        id: 'q1',
        question: 'Approximately what fraction of all water on planet Earth is accessible liquid freshwater for human use?',
        options: ['About 25%', 'About 10%', 'Less than 1%', 'Over 50%'],
        correctIndex: 2,
        explanation: '97.5% of water is saline ocean water, and ~68.7% of freshwater is locked in ice caps/glaciers, leaving under 1% accessible.'
      },
      {
        id: 'q2',
        question: 'What is meant by the term "virtual water"?',
        options: [
          'Water simulated inside computer video games',
          'The total volume of freshwater utilized during the agricultural or industrial production of a product',
          'Bottled water sold online',
          'Water vapor condensed from air conditioners'
        ],
        correctIndex: 1,
        explanation: 'Virtual water represents the hidden volume of water consumed and polluted throughout the supply chain of goods like clothes, food, and electronics.'
      },
      {
        id: 'q3',
        question: 'How do faucet aerators reduce household water consumption?',
        options: [
          'By chilling the water to near-freezing',
          'By mixing micro-air bubbles into the water stream to maintain high pressure while using up to 50% less liquid volume',
          'By shutting off the water every 10 seconds',
          'By converting tap water into mineral steam'
        ],
        correctIndex: 1,
        explanation: 'Aerators mix air into the flow, creating a wider, splash-free stream that feels vigorous while dramatically cutting water usage.'
      }
    ]
  },
  {
    id: 'lesson-clean-energy',
    title: 'Energy Efficiency, Grid Dynamics & Clean Power',
    category: 'Energy Conservation',
    description: 'Master power auditing, eliminate vampire loads, and understand the transition from fossil base-load generation to distributed renewable microgrids.',
    duration: '22 min',
    difficulty: 'Beginner',
    xp: 35,
    content: `
      <div class="space-y-6">
        <section>
          <h2 class="text-2xl font-bold text-slate-900 mb-3">1. Power Generation & The Energy Transition</h2>
          <p class="text-slate-700 leading-relaxed">
            The electricity sector contributes over <strong>30% of global greenhouse gas emissions</strong> due to the combustion of coal, oil, and natural gas. Transitioning to renewable sources—such as Solar Photovoltaics (PV), onshore/offshore wind turbines, and utility-scale battery storage—is essential for grid decarbonization.
          </p>
        </section>

        <section>
          <h2 class="text-2xl font-bold text-slate-900 mb-3">2. Eliminating "Vampire Power" (Phantom Loads)</h2>
          <p class="text-slate-700 leading-relaxed">
            <strong>Phantom load</strong> refers to electric power consumed by electronic devices while they are turned off or in standby mode. Gaming consoles, microwave clocks, laptop bricks, and TV standby circuits account for up to <strong>10% of residential electric bills</strong>.
          </p>
        </section>

        <section>
          <h2 class="text-2xl font-bold text-slate-900 mb-3">3. Lighting & Thermal Envelope Efficiency</h2>
          <p class="text-slate-700 leading-relaxed">
            Replacing incandescent bulbs with modern <strong>Light Emitting Diodes (LEDs)</strong> yields an <strong>80-90% reduction</strong> in power consumption for equivalent luminous flux (lumens) while lasting 25 times longer. In buildings, proper insulation and draft sealing reduce heating and HVAC energy demands by up to 30%.
          </p>
        </section>

        <section class="bg-slate-100 p-4 rounded-lg">
          <h3 class="text-base font-semibold text-slate-900 mb-2">⚡ Home & Campus Energy Efficiency Checklist:</h3>
          <ul class="list-disc list-inside space-y-1 text-slate-700 text-sm">
            <li>Use smart power strips that cut power to peripheral accessories when the primary appliance is off.</li>
            <li>Set thermostat settings to 24-25°C (75-77°F) during cooling seasons to optimize compressor cycles.</li>
            <li>Maximize daylight harvesting by positioning study desks near natural window light.</li>
          </ul>
        </section>
      </div>
    `,
    quiz: [
      {
        id: 'q1',
        question: 'What is "vampire power" or a "phantom load"?',
        options: [
          'Electricity generated exclusively during nighttime hours',
          'Power consumed by electronics while plugged in but powered off or in standby mode',
          'Solar energy stored in deep subterranean caves',
          'An electric surge caused by lightning strikes'
        ],
        correctIndex: 1,
        explanation: 'Standby electronics and power transformers draw continuous idle wattage (phantom load) even when unused.'
      },
      {
        id: 'q2',
        question: 'How much less energy do modern LED bulbs consume compared to traditional incandescent lighting?',
        options: ['Around 10-15%', 'Around 30-40%', 'Around 80-90%', 'LEDs actually use more energy'],
        correctIndex: 2,
        explanation: 'LEDs convert up to 90% of energy directly into light rather than wasting it as heat, unlike incandescent filaments.'
      },
      {
        id: 'q3',
        question: 'Which device is most effective at automatically cutting phantom power to multiple dormant computer accessories?',
        options: [
          'A smart/master-controlled power strip',
          'An extra extension cord',
          'A copper grounding wire',
          'An analog volt meter'
        ],
        correctIndex: 0,
        explanation: 'Smart power strips detect when the main device (e.g. computer) enters sleep mode and cut voltage to peripheral outlets.'
      }
    ]
  },
  {
    id: 'lesson-climate-action',
    title: 'Climate Science, Carbon Budgets & Tipping Points',
    category: 'Climate Change',
    description: 'Examine radiative forcing, IPCC global warming projections, critical planetary tipping elements, and paths to Net Zero.',
    duration: '30 min',
    difficulty: 'Intermediate',
    xp: 45,
    content: `
      <div class="space-y-6">
        <section>
          <h2 class="text-2xl font-bold text-slate-900 mb-3">1. Greenhouse Effect & Radiative Forcing</h2>
          <p class="text-slate-700 leading-relaxed">
            The greenhouse effect is a natural planetary mechanism that keeps Earth hospitable (~15°C average). However, anthropogenic emissions have increased atmospheric Carbon Dioxide (CO₂) concentrations from pre-industrial levels of <strong>280 ppm to over 420 ppm</strong>, trapping surplus thermal infrared radiation and driving global heating.
          </p>
        </section>

        <section>
          <h2 class="text-2xl font-bold text-slate-900 mb-3">2. Planetary Tipping Elements</h2>
          <p class="text-slate-700 leading-relaxed">
            Climate tipping points are thresholds where a slight change in forcing can push an ecosystem into a self-reinforcing, irreversible state change:
          </p>
          <ul class="list-disc list-inside space-y-1 text-slate-700 text-sm mt-2">
            <li><strong>Arctic Permafrost Thaw:</strong> Releases ancient trapped methane and CO₂ in a positive feedback loop.</li>
            <li><strong>Ice-Albedo Feedback:</strong> Melting reflective white ice exposes dark ocean water, accelerating solar heat absorption.</li>
            <li><strong>Amazon Rainforest Dieback:</strong> Transitioning from a net planetary carbon sink to a carbon source.</li>
            <li><strong>Atlantic Meridional Overturning Circulation (AMOC) Slowdown:</strong> Disrupting planetary heat distribution.</li>
          </ul>
        </section>

        <section>
          <h2 class="text-2xl font-bold text-slate-900 mb-3">3. The 1.5°C Carbon Budget & Mitigation</h2>
          <p class="text-slate-700 leading-relaxed">
            The Intergovernmental Panel on Climate Change (IPCC) emphasizes that limiting warming to <strong>1.5°C above pre-industrial levels</strong> requires reaching global <strong>Net-Zero emissions by 2050</strong>, accompanied by deep emissions cuts across transportation, energy, heavy industry, and agriculture.
          </p>
        </section>

        <section class="bg-slate-100 p-4 rounded-lg">
          <h3 class="text-base font-semibold text-slate-900 mb-2">⚡ Individual & Collective Climate Levers:</h3>
          <ul class="list-disc list-inside space-y-1 text-slate-700 text-sm">
            <li>Adopt a plant-rich diet to reduce high agricultural land and methane footprints.</li>
            <li>Prioritize electrified transit, bicycles, or public rail over internal combustion vehicles.</li>
            <li>Advocate for campus rooftop solar installations and institutional green procurement.</li>
          </ul>
        </section>
      </div>
    `,
    quiz: [
      {
        id: 'q1',
        question: 'What is atmospheric CO₂ concentration today compared to pre-industrial levels (~280 ppm)?',
        options: ['Around 310 ppm', 'Around 350 ppm', 'Over 420 ppm', 'Over 800 ppm'],
        correctIndex: 2,
        explanation: 'Atmospheric CO₂ has surged from ~280 ppm prior to the Industrial Revolution to over 420 ppm due to fossil fuel combustion and deforestation.'
      },
      {
        id: 'q2',
        question: 'What is the "Ice-Albedo Feedback" mechanism?',
        options: [
          'Ice reflecting all radio frequencies back to satellites',
          'Melting white ice reveals dark ocean water, which absorbs more solar radiation and accelerates further melting',
          'Ice freezing warmer ocean currents into solid ground',
          'Artificial snow machines cooling the poles'
        ],
        correctIndex: 1,
        explanation: 'White ice has high albedo (reflectivity); when it melts into dark sea water, solar absorption increases, creating a warming feedback loop.'
      },
      {
        id: 'q3',
        question: 'According to IPCC recommendations, by when must the world reach Net-Zero emissions to limit warming to 1.5°C?',
        options: ['2030', '2050', '2100', '2150'],
        correctIndex: 1,
        explanation: 'The IPCC assessment shows global greenhouse gas emissions must reach net zero by approximately 2050 to preserve a 1.5°C target.'
      }
    ]
  },
  {
    id: 'lesson-biodiversity-protection',
    title: 'Ecosystem Services, Keystone Species & Rewilding',
    category: 'Biodiversity',
    description: 'Discover trophic cascades, the critical roles of pollinator networks, and how native rewilding restores ecological equilibrium.',
    duration: '24 min',
    difficulty: 'Intermediate',
    xp: 35,
    content: `
      <div class="space-y-6">
        <section>
          <h2 class="text-2xl font-bold text-slate-900 mb-3">1. The Sixth Mass Extinction & Ecosystem Services</h2>
          <p class="text-slate-700 leading-relaxed">
            Biodiversity encompasses the variety of genes, species, and ecosystems across the planet. Human activities (habitat destruction, invasive species, pollution, climate change) have driven extinction rates to <strong>100 to 1,000 times</strong> the natural background rate. Biodiversity provides indispensable <em>ecosystem services</em>: water filtration, soil formation, carbon sequestration, and crop pollination.
          </p>
        </section>

        <section>
          <h2 class="text-2xl font-bold text-slate-900 mb-3">2. Keystone Species & Trophic Cascades</h2>
          <p class="text-slate-700 leading-relaxed">
            A <strong>keystone species</strong> has a disproportionately large effect on its natural environment relative to its abundance. When grey wolves were reintroduced to Yellowstone National Park in 1995, they regulated overpopulated elk herds, allowing overgrazed riverbanks to regenerate. This brought back beavers, songbirds, and reduced riverbank erosion—a phenomenon known as a <strong>top-down trophic cascade</strong>.
          </p>
        </section>

        <section>
          <h2 class="text-2xl font-bold text-slate-900 mb-3">3. Pollinator Security & Urban Rewilding</h2>
          <p class="text-slate-700 leading-relaxed">
            Over <strong>75% of global food crop types</strong> rely to some degree on animal pollination (bees, butterflies, birds, bats). Urban sprawl and monoculture lawns disrupt pollinator corridors. Replacing manicured grass lawns with native wildflower meadows, bug hotels, and pesticide-free green belts restores essential habitat connectivity.
          </p>
        </section>

        <section class="bg-slate-100 p-4 rounded-lg">
          <h3 class="text-base font-semibold text-slate-900 mb-2">⚡ How You Can Support Local Biodiversity:</h3>
          <ul class="list-disc list-inside space-y-1 text-slate-700 text-sm">
            <li>Plant native flowering plants that provide nectar throughout all four seasons.</li>
            <li>Avoid chemical synthetic pesticides and herbicides that harm non-target insects.</li>
            <li>Support wildlife corridors and protected conservation reserves.</li>
          </ul>
        </section>
      </div>
    `,
    quiz: [
      {
        id: 'q1',
        question: 'What is a "keystone species"?',
        options: [
          'The most numerous animal species in a forest',
          'A species that has a disproportionately large impact on maintaining ecosystem structure relative to its population size',
          'Any animal that builds stone structures',
          'An introduced invasive predator'
        ],
        correctIndex: 1,
        explanation: 'Keystone species (like sea otters, wolves, and bees) anchor their ecosystems; their removal often causes ecosystem collapse.'
      },
      {
        id: 'q2',
        question: 'What percentage of the world\'s leading food crop types depend partially or fully on pollinators like bees and insects?',
        options: ['Less than 5%', 'Around 25%', 'Over 75%', '100%'],
        correctIndex: 2,
        explanation: 'According to the FAO and IPBES, over 75% of global food crop types rely on animal pollinators for yield and quality.'
      },
      {
        id: 'q3',
        question: 'Why are native wildflower gardens superior to manicured monoculture grass lawns for biodiversity?',
        options: [
          'They require zero sunlight to grow',
          'They provide native food, shelter, and breeding corridors for local insects and birds without synthetic chemicals',
          'Grass lawns produce too much oxygen',
          'Wildflowers poison all insects'
        ],
        correctIndex: 1,
        explanation: 'Native plants co-evolved with local wildlife, offering authentic sustenance, continuous pollen, and resilient micro-habitats.'
      }
    ]
  },
  {
    id: 'lesson-sustainable-transport',
    title: 'Low-Carbon Mobility, Active Transit & 15-Minute Cities',
    category: 'Sustainable Transportation',
    description: 'Compare well-to-wheel transport emissions, analyze urban micro-mobility, and discover how 15-minute city designs decarbonize transit.',
    duration: '20 min',
    difficulty: 'Beginner',
    xp: 30,
    content: `
      <div class="space-y-6">
        <section>
          <h2 class="text-2xl font-bold text-slate-900 mb-3">1. Transport Emissions: The Well-to-Wheel View</h2>
          <p class="text-slate-700 leading-relaxed">
            The transport sector accounts for nearly <strong>one-quarter of global energy-related CO₂ emissions</strong>, with road vehicles (passenger cars, buses, trucks) contributing nearly 75% of that total. Single-occupancy gasoline cars emit approximately <strong>150-200g of CO₂ per passenger-kilometer</strong>, compared to under <strong>30-40g</strong> for electrified urban trains or buses, and <strong>0g</strong> for walking and cycling.
          </p>
        </section>

        <section>
          <h2 class="text-2xl font-bold text-slate-900 mb-3">2. Active Mobility & Electric Micro-Mobility</h2>
          <p class="text-slate-700 leading-relaxed">
            Over 50% of urban car trips globally are under 5 kilometers. Shifting these short trips to <strong>active transport</strong> (walking, traditional cycling) or <strong>micro-mobility</strong> (e-bikes, e-scooters) drastically reduces traffic congestion, urban particulate smog (PM2.5), and noise pollution while improving cardiovascular health.
          </p>
        </section>

        <section>
          <h2 class="text-2xl font-bold text-slate-900 mb-3">3. The 15-Minute City Urban Design</h2>
          <p class="text-slate-700 leading-relaxed">
            Pioneered in cities like Paris and Barcelona, the <strong>"15-Minute City"</strong> concept reorganizes urban density so that residents can access essential daily needs (work, groceries, education, healthcare, leisure) within a 15-minute walk or bike ride from their homes, eliminating car dependency by design.
          </p>
        </section>

        <section class="bg-slate-100 p-4 rounded-lg">
          <h3 class="text-base font-semibold text-slate-900 mb-2">⚡ Everyday Commuter Decarbonization Tips:</h3>
          <ul class="list-disc list-inside space-y-1 text-slate-700 text-sm">
            <li>Designate 2 days a week as active transit days (walk, cycle, or take metro).</li>
            <li>Utilize carpooling or shared rides for essential long-distance commutes.</li>
            <li>Maintain proper tire pressure on vehicles to preserve fuel efficiency by up to 3%.</li>
          </ul>
        </section>
      </div>
    `,
    quiz: [
      {
        id: 'q1',
        question: 'Which transportation method produces the highest average CO₂ emissions per passenger-kilometer for urban trips?',
        options: [
          'High-speed electric passenger train',
          'Single-occupancy internal combustion gasoline SUV',
          'Double-decker public electric bus',
          'Bicycle / E-bike'
        ],
        correctIndex: 1,
        explanation: 'Single-occupancy passenger vehicles carry the highest carbon footprint per passenger-km compared to mass and active transit.'
      },
      {
        id: 'q2',
        question: 'What is the core premise of a "15-Minute City"?',
        options: [
          'All car journeys must be completed in under 15 minutes',
          'All resident daily necessities (schools, groceries, clinics, parks) are accessible within a 15-minute walk or bike ride',
          'Public transport shuts down after 15 minutes of operation',
          'City highway speed limits are fixed at 15 km/h'
        ],
        correctIndex: 1,
        explanation: '15-minute cities prioritize urban proximity and active mobility to minimize vehicle travel distances.'
      },
      {
        id: 'q3',
        question: 'What proportion of global energy-related CO₂ emissions originates from the transportation sector?',
        options: ['Under 2%', 'Roughly 25%', 'Over 90%', 'Less than 0.5%'],
        correctIndex: 1,
        explanation: 'The transportation sector contributes nearly a quarter (24-25%) of global energy-related greenhouse emissions.'
      }
    ]
  },
  {
    id: 'lesson-ewaste-crisis',
    title: 'Electronic Waste & Circular Hardware',
    category: 'E-Waste',
    description: 'Investigate the growing e-waste stream, toxic heavy metal leakage, urban mining of critical minerals, and the Right to Repair movement.',
    duration: '22 min',
    difficulty: 'Intermediate',
    xp: 35,
    content: `
      <div class="space-y-6">
        <section>
          <h2 class="text-2xl font-bold text-slate-900 mb-3">1. The World\'s Fastest-Growing Waste Stream</h2>
          <p class="text-slate-700 leading-relaxed">
            The world generates over <strong>62 million metric tons of electronic waste (e-waste)</strong> annually. E-waste includes discarded phones, laptops, TVs, cables, and home appliances. Less than <strong>23% is formally documented and recycled</strong>, with the remainder dumped into landfills or exported illegally to developing nations.
          </p>
        </section>

        <section>
          <h2 class="text-2xl font-bold text-slate-900 mb-3">2. Toxic Hazards vs. Urban Mining Potential</h2>
          <p class="text-slate-700 leading-relaxed">
            E-waste represents a major paradox:
          </p>
          <div class="grid grid-cols-1 md:grid-cols-2 gap-3 mt-2 text-sm">
            <div class="p-3 bg-rose-50 border border-rose-200 rounded">
              <strong class="text-rose-900">Toxic Heavy Metals:</strong> Circuit boards and displays contain lead, cadmium, mercury, and brominated flame retardants that leach into groundwater supplies.
            </div>
            <div class="p-3 bg-amber-50 border border-amber-200 rounded">
              <strong class="text-amber-900">Urban Mining Value:</strong> 1 metric ton of discarded smartphones contains up to <strong>300x more gold</strong> and 10x more silver than 1 ton of raw mined gold ore.
            </div>
          </div>
        </section>

        <section>
          <h2 class="text-2xl font-bold text-slate-900 mb-3">3. Planned Obsolescence & Right to Repair</h2>
          <p class="text-slate-700 leading-relaxed">
            Many electronics manufacturers utilize proprietary screws, glued batteries, and software lockouts that hinder repairs—a practice known as <strong>planned obsolescence</strong>. The <strong>Right to Repair</strong> movement advocates for accessible replacement parts, schematics, and modular designs (e.g. Framework laptops, Fairphone) so devices can be easily serviced for years.
          </p>
        </section>

        <section class="bg-slate-100 p-4 rounded-lg">
          <h3 class="text-base font-semibold text-slate-900 mb-2">⚡ Safe E-Waste Management Guidelines:</h3>
          <ul class="list-disc list-inside space-y-1 text-slate-700 text-sm">
            <li>Never dispose of electronics or lithium-ion batteries in standard household trash.</li>
            <li>Utilize certified e-Stewards or R2-certified e-waste collection drives.</li>
            <li>Extend the lifecycle of existing gadgets via battery replacement and software cleanup.</li>
          </ul>
        </section>
      </div>
    `,
    quiz: [
      {
        id: 'q1',
        question: 'Why is standard mining for raw gold ore often less resource-dense than "urban mining" of discarded smartphones?',
        options: [
          'Gold ore is artificially colored rock',
          'One ton of circuit boards contains significantly higher concentrations of gold and rare earth elements per ton than virgin ore',
          'Smartphones produce their own gold while powered on',
          'Urban mining uses zero water'
        ],
        correctIndex: 1,
        explanation: 'Smartphones contain high concentrations of precious and critical minerals (gold, silver, palladium) per ton compared to extracted raw rock ore.'
      },
      {
        id: 'q2',
        question: 'What is the main goal of the global "Right to Repair" legislation movement?',
        options: [
          'Requiring every citizen to become an electrical engineer',
          'Mandating that manufacturers provide fair access to diagnostic tools, genuine spare parts, and schematics to consumers and independent repair shops',
          'Banning all new computer manufacturing',
          'Making it illegal to purchase second-hand electronics'
        ],
        correctIndex: 1,
        explanation: 'Right to Repair ensures electronic equipment can be repaired economically instead of prematurely discarded into landfills.'
      },
      {
        id: 'q3',
        question: 'Which toxic heavy metals commonly found in discarded electronics can leach into soil and groundwater if landfilled?',
        options: [
          'Lead, Mercury, and Cadmium',
          'Helium and Argon',
          'Pure table salt and baking soda',
          'Calcium and Magnesium'
        ],
        correctIndex: 0,
        explanation: 'Lead solders, mercury backlights, and cadmium battery chemistries represent persistent environmental hazards when incinerated or landfilled.'
      }
    ]
  },
  {
    id: 'lesson-plastic-pollution',
    title: 'Microplastics, Ocean Gyres & Plastic-Free Living',
    category: 'Plastic Pollution',
    description: 'Examine primary vs secondary microplastics, marine trophic accumulation, ocean gyres, and scalable plastic-free alternatives.',
    duration: '25 min',
    difficulty: 'Intermediate',
    xp: 40,
    content: `
      <div class="space-y-6">
        <section>
          <h2 class="text-2xl font-bold text-slate-900 mb-3">1. The Synthetic Age: Scale of the Plastic Crisis</h2>
          <p class="text-slate-700 leading-relaxed">
            Since mass commercial production began in the 1950s, over <strong>9 billion metric tons of virgin plastic</strong> have been manufactured. Because synthetic polymers are designed for durability, petroleum-based plastics do not biodegrade—they simply fragment into smaller pieces, persisting in ecosystems for <strong>400 to 1,000 years</strong>.
          </p>
        </section>

        <section>
          <h2 class="text-2xl font-bold text-slate-900 mb-3">2. Primary vs. Secondary Microplastics</h2>
          <p class="text-slate-700 leading-relaxed">
            Microplastics are particles smaller than 5 millimeters in diameter:
          </p>
          <ul class="list-disc list-inside space-y-1 text-slate-700 text-sm mt-2">
            <li><strong>Primary Microplastics:</strong> Manufactured intentionally at microscopic scale (cosmetic microbeads, industrial abrasive nurdles, synthetic clothing microfibers).</li>
            <li><strong>Secondary Microplastics:</strong> Fragmented pieces derived from larger plastic debris (sunlight photodegradation and wave abrasion of bottles, nets, bags).</li>
          </ul>
          <p class="text-slate-700 leading-relaxed mt-2">
            These particles absorb persistent organic pollutants (POPs) and bioaccumulate up marine food webs, reaching seafood consumed by humans.
          </p>
        </section>

        <section>
          <h2 class="text-2xl font-bold text-slate-900 mb-3">3. Ocean Gyres & The Great Pacific Garbage Patch</h2>
          <p class="text-slate-700 leading-relaxed">
            Circulating ocean currents (gyres) draw floating plastic waste into dense convergence zones. The <strong>Great Pacific Garbage Patch</strong> spans an estimated 1.6 million square kilometers (more than twice the landmass of Texas), composed primarily of abandoned ghost fishing gear and billions of microplastic fragments.
          </p>
        </section>

        <section class="bg-slate-100 p-4 rounded-lg">
          <h3 class="text-base font-semibold text-slate-900 mb-2">⚡ Everyday Action Steps to Reduce Single-Use Plastic:</h3>
          <ul class="list-disc list-inside space-y-1 text-slate-700 text-sm">
            <li>Wash synthetic garments (polyester, nylon) using a microfiber-catching laundry bag or filter.</li>
            <li>Opt for solid shampoo/soap bars instead of liquid plastic pump bottles.</li>
            <li>Refuse disposable plastic straws, plastic cutlery, and expanded polystyrene containers.</li>
          </ul>
        </section>
      </div>
    `,
    quiz: [
      {
        id: 'q1',
        question: 'What is the standard scientific definition of a "microplastic"?',
        options: [
          'Any plastic container smaller than 1 liter',
          'Plastic synthetic fragments or beads less than 5 millimeters in diameter',
          'Plastics manufactured only in microscopic nanotechnology labs',
          'Biodegradable cornstarch wrappers'
        ],
        correctIndex: 1,
        explanation: 'By international environmental definition, microplastics are particles of plastic debris smaller than 5 mm.'
      },
      {
        id: 'q2',
        question: 'What is the difference between primary and secondary microplastics?',
        options: [
          'Primary are blue, secondary are red',
          'Primary are intentionally manufactured small (nurdles, microfibers), while secondary form from the breakdown of larger plastic debris',
          'Primary come from plants, secondary from fossil fuels',
          'There is no scientific distinction'
        ],
        correctIndex: 1,
        explanation: 'Primary microplastics enter the environment in microscopic form; secondary microplastics arise from mechanical weathering and photodegradation of larger items.'
      },
      {
        id: 'q3',
        question: 'Why do conventional petroleum-based plastics persist in the environment for hundreds of years?',
        options: [
          'They are made of magnetic metals',
          'Their long synthetic hydrocarbon polymer chains lack chemical bonds that most natural bacteria can easily break down',
          'Saltwater acts as a preservative for plastic',
          'Sunlight makes plastic grow larger over time'
        ],
        correctIndex: 1,
        explanation: 'Petrochemical plastics have synthetic carbon-carbon backbones that natural decomposers have not evolved to rapidly digest, causing physical fragmentation rather than biochemical decomposition.'
      }
    ]
  },
  {
    id: 'lesson-sustainable-living',
    title: 'Ethical Sourcing, Fast Fashion & Conscious Consumerism',
    category: 'Sustainable Consumption',
    description: 'Learn life cycle assessments, uncover fast fashion supply chain impacts, detect greenwashing, and embrace conscious consumerism.',
    duration: '22 min',
    difficulty: 'Intermediate',
    xp: 35,
    content: `
      <div class="space-y-6">
        <section>
          <h2 class="text-2xl font-bold text-slate-900 mb-3">1. The Fast Fashion Carbon & Water Footprint</h2>
          <p class="text-slate-700 leading-relaxed">
            The fashion industry produces <strong>10% of all global carbon emissions</strong>—more than international flights and maritime shipping combined. The rise of ultra-fast fashion has accelerated garment production, releasing cheap synthetic textiles (polyester) that shed plastic microfibers and generate millions of tons of textile waste discarded in desert landfills every year.
          </p>
        </section>

        <section>
          <h2 class="text-2xl font-bold text-slate-900 mb-3">2. Spotting Corporate "Greenwashing"</h2>
          <p class="text-slate-700 leading-relaxed">
            <strong>Greenwashing</strong> is the practice of conveying a misleading impression or providing unsubstantiated claims about how environmentally sound a company\'s products are. Look out for:
          </p>
          <ul class="list-disc list-inside space-y-1 text-slate-700 text-sm mt-2">
            <li><strong>Vague Buzzwords:</strong> Labels claiming "Eco-friendly", "Natural", or "Green" without third-party certification.</li>
            <li><strong>Hidden Trade-Offs:</strong> Promoting recycled packaging on a product with a destructive toxic chemical supply chain.</li>
            <li><strong>No Proof / Verification:</strong> Lack of published lifecycle metrics or transparent supply chain auditing.</li>
          </ul>
        </section>

        <section>
          <h2 class="text-2xl font-bold text-slate-900 mb-3">3. Cradle-to-Cradle (C2C) Product Design</h2>
          <p class="text-slate-700 leading-relaxed">
            <strong>Cradle-to-Cradle</strong> design is a biomimetic approach where all product materials are viewed as continuous nutrients. Biological materials safely biodegrade back into the soil, while technical materials (metals, polymers) circulate continuously in closed-loop industrial cycles without downcycling.
          </p>
        </section>

        <section class="bg-slate-100 p-4 rounded-lg">
          <h3 class="text-base font-semibold text-slate-900 mb-2">⚡ Conscious Consumer Habits:</h3>
          <ul class="list-disc list-inside space-y-1 text-slate-700 text-sm">
            <li>Adopt the "30-Wear Rule": Before buying any garment, ask if you will wear it at least 30 times.</li>
            <li>Thrift, swap, and repair clothing before purchasing new items.</li>
            <li>Seek trustworthy third-party sustainability certifications (e.g. Fair Trade, GOTS Organic Cotton, B-Corp).</li>
          </ul>
        </section>
      </div>
    `,
    quiz: [
      {
        id: 'q1',
        question: 'What is "Greenwashing"?',
        options: [
          'Cleaning solar panels with biodegradable soap',
          'Deceptive marketing that exaggerates or falsely portrays an organization\'s environmental credentials',
          'Washing clothes in cold water to save power',
          'Painting industrial factories green'
        ],
        correctIndex: 1,
        explanation: 'Greenwashing tricks consumers into believing a product is sustainable when its core practices remain harmful.'
      },
      {
        id: 'q2',
        question: 'What is the core philosophy of "Cradle-to-Cradle" (C2C) design?',
        options: [
          'Products are designed to be thrown away immediately after one use',
          'Products are designed such that all components circulate infinitely as biological or technical nutrients in closed loops',
          'Only wooden products may be manufactured',
          'Products must be made exclusively for infants'
        ],
        correctIndex: 1,
        explanation: 'Cradle-to-Cradle eliminates the concept of waste by designing products for safe biological decomposition or infinite technical recycling.'
      },
      {
        id: 'q3',
        question: 'What proportion of global greenhouse gas emissions is generated by the fashion and textile industry?',
        options: ['Less than 0.1%', 'Approximately 10%', 'Over 75%', '50%'],
        correctIndex: 1,
        explanation: 'The fashion industry contributes roughly 10% of total global carbon emissions due to intensive energy, dyeing, and synthetic fiber manufacturing.'
      }
    ]
  }
]
