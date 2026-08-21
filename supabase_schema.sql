-- EcoQuest Supabase PostgreSQL Database Schema
-- Run this SQL in your Supabase SQL Editor

-- 1. Users Table
CREATE TABLE IF NOT EXISTS public.users (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT NOT NULL,
  name TEXT NOT NULL,
  role TEXT NOT NULL DEFAULT 'student',
  institution_id TEXT,
  xp INTEGER DEFAULT 0,
  level INTEGER DEFAULT 1,
  impact_score INTEGER DEFAULT 0,
  streak INTEGER DEFAULT 0,
  badges JSONB DEFAULT '[]'::jsonb,
  is_blocked BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 2. Lessons Table
CREATE TABLE IF NOT EXISTS public.lessons (
  id TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text,
  title TEXT NOT NULL,
  category TEXT NOT NULL,
  description TEXT,
  duration TEXT,
  difficulty TEXT,
  xp INTEGER DEFAULT 0,
  content TEXT,
  quiz JSONB DEFAULT '[]'::jsonb,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Migration safety for existing deployments
ALTER TABLE public.lessons ADD COLUMN IF NOT EXISTS quiz JSONB DEFAULT '[]'::jsonb;

-- 3. Challenges Table
CREATE TABLE IF NOT EXISTS public.challenges (
  id TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text,
  title TEXT NOT NULL,
  category TEXT NOT NULL,
  description TEXT,
  difficulty TEXT,
  xp INTEGER DEFAULT 0,
  impact_value INTEGER DEFAULT 0,
  deadline TEXT,
  participants INTEGER DEFAULT 0,
  status TEXT DEFAULT 'active',
  instructions TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 4. User Lessons Table (Track Progress)
CREATE TABLE IF NOT EXISTS public.user_lessons (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES public.users(id) ON DELETE CASCADE,
  lesson_id TEXT REFERENCES public.lessons(id) ON DELETE CASCADE,
  completed BOOLEAN DEFAULT FALSE,
  completed_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(user_id, lesson_id)
);

-- 5. Submissions / User Challenges Table
CREATE TABLE IF NOT EXISTS public.user_challenges (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES public.users(id) ON DELETE CASCADE,
  challenge_id TEXT REFERENCES public.challenges(id) ON DELETE CASCADE,
  status TEXT NOT NULL DEFAULT 'pending',
  proof_text TEXT,
  proof_url TEXT,
  submitted_at TIMESTAMPTZ DEFAULT NOW()
);

-- Comprehensive Curriculum Seed Data (10 Categories with Detailed Content & Quizzes)
INSERT INTO public.lessons (id, title, category, description, duration, difficulty, xp, content, quiz) VALUES
  (
    'lesson-waste-mgmt-101',
    'Zero Waste Principles & 5Rs Mastery',
    'Waste Management',
    'Explore the circular economy hierarchy and master the 5Rs (Refuse, Reduce, Reuse, Repurpose, Recycle) to eliminate landfill waste.',
    '20 min',
    'Beginner',
    30,
    '<h2>1. The Global Waste Dilemma</h2><p>Humanity currently generates over 2.01 billion metric tons of municipal solid waste annually. Linear models ("Take-Make-Dispose") pollute ecosystems.</p><h2>The 5Rs Hierarchy</h2><ul><li><strong>Refuse:</strong> Say no to disposables.</li><li><strong>Reduce:</strong> Buy only what you need.</li><li><strong>Reuse:</strong> Choose durable items.</li><li><strong>Repurpose:</strong> Upcycle creatively.</li><li><strong>Recycle:</strong> Process cleanly as a last resort.</li></ul>',
    '[{"id":"q1","question":"Which of the 5Rs is considered the FIRST and most effective step in waste prevention?","options":["Recycle","Refuse","Repurpose","Reuse"],"correctIndex":1,"explanation":"Refusing unnecessary items at the source prevents waste from ever being created."},{"id":"q2","question":"Why is organic waste in airtight landfills particularly harmful to the climate?","options":["It turns into radioactive residue","Anaerobic decomposition generates potent methane gas (CH4)","It absorbs too much carbon from the sky","It freezes the surrounding soil"],"correctIndex":1,"explanation":"In oxygen-deprived landfills, organic matter decomposes anaerobically to produce potent methane."},{"id":"q3","question":"What is the primary difference between a linear economy and a circular economy?","options":["Linear economies produce no goods","Linear follows Take-Make-Dispose while circular designs out waste","Linear relies only on solar","No difference"],"correctIndex":1,"explanation":"Circular economies keep resources in continuous use and regenerate natural systems."}]'::jsonb
  ),
  (
    'lesson-recycling-mastery',
    'Advanced Material Recycling & Contamination Prevention',
    'Recycling',
    'Learn resin identification codes, how to prevent "wishcycling", and how proper sorting preserves high-grade recyclable polymers.',
    '22 min',
    'Beginner',
    35,
    '<h2>Resin Codes & Infinite Recycling</h2><p>Plastics have codes #1 to #7. Aluminum and glass can be recycled infinitely with 95% energy savings.</p><h2>Avoid Wishcycling</h2><p>Never put greasy cardboard or plastic bags into single-stream recycling bins.</p>',
    '[{"id":"q1","question":"What is wishcycling?","options":["Wishing before buying plastic","Throwing non-recyclables into the bin hoping they get recycled, causing contamination and damage","Trading plastic for cash","Recycling only on holidays"],"correctIndex":1,"explanation":"Wishcycling introduces contaminants that can ruin entire batches of recyclable materials."},{"id":"q2","question":"How much energy is saved by recycling aluminum cans vs virgin ore smelting?","options":["20%","50%","95%","0%"],"correctIndex":2,"explanation":"Recycling aluminum saves 95% of energy and emissions compared to primary bauxite smelting."}]'::jsonb
  ),
  (
    'lesson-water-conservation',
    'Hydrology & Water Footprint Reduction',
    'Water Conservation',
    'Understand accessible freshwater limits, calculate embedded virtual water in everyday commodities, and implement residential conservation.',
    '25 min',
    'Intermediate',
    40,
    '<h2>Freshwater Limits</h2><p>Less than 1% of planetary water is accessible freshwater. Virtual water accounts for thousands of liters in clothes, food, and electronics.</p><h2>Smart Conservation</h2><p>Install faucet aerators and fix silent toilet leaks to save thousands of liters annually.</p>',
    '[{"id":"q1","question":"What percentage of planetary water is accessible liquid freshwater?","options":["25%","10%","Less than 1%","50%"],"correctIndex":2,"explanation":"Over 97% is ocean saltwater and most freshwater is locked in polar ice."},{"id":"q2","question":"What is virtual water?","options":["Water in video games","The hidden volume of freshwater consumed in the production of goods","Bottled water online","Air conditioner condensation"],"correctIndex":1,"explanation":"Virtual water measures all embedded water used throughout a product lifecycle."}]'::jsonb
  ),
  (
    'lesson-clean-energy',
    'Energy Efficiency, Grid Dynamics & Clean Power',
    'Energy Conservation',
    'Master power auditing, eliminate vampire loads, and understand the transition from fossil base-load generation to distributed renewable microgrids.',
    '22 min',
    'Beginner',
    35,
    '<h2>Grid Decarbonization</h2><p>Power generation accounts for over 30% of emissions. Eliminating phantom vampire loads and switching to LEDs saves power immediately.</p>',
    '[{"id":"q1","question":"What is vampire power?","options":["Electricity at night","Power drawn by electronics while in standby mode or turned off","Solar stored underground","Lightning strikes"],"correctIndex":1,"explanation":"Vampire power or phantom load is idle power drawn by dormant plugged-in appliances."},{"id":"q2","question":"How much less power do LEDs use compared to incandescent bulbs?","options":["10%","40%","80-90%","They use more"],"correctIndex":2,"explanation":"LEDs convert up to 90% of electricity into visible light rather than heat."}]'::jsonb
  ),
  (
    'lesson-climate-action',
    'Climate Science, Carbon Budgets & Tipping Points',
    'Climate Change',
    'Examine radiative forcing, IPCC global warming projections, critical planetary tipping elements, and paths to Net Zero.',
    '30 min',
    'Intermediate',
    45,
    '<h2>Climate Physics</h2><p>Atmospheric CO2 has increased past 420 ppm. Meeting the 1.5°C goal requires global Net Zero emissions by 2050.</p>',
    '[{"id":"q1","question":"What is the current atmospheric CO2 concentration compared to pre-industrial 280 ppm?","options":["310 ppm","350 ppm","Over 420 ppm","800 ppm"],"correctIndex":2,"explanation":"Atmospheric CO2 has passed 420 ppm due to fossil combustion and land-use change."},{"id":"q2","question":"By when must global emissions reach Net Zero for 1.5°C warming threshold?","options":["2030","2050","2100","2150"],"correctIndex":1,"explanation":"IPCC models indicate global net zero CO2 emissions by 2050 are vital."}]'::jsonb
  ),
  (
    'lesson-biodiversity-protection',
    'Ecosystem Services, Keystone Species & Rewilding',
    'Biodiversity',
    'Discover trophic cascades, the critical roles of pollinator networks, and how native rewilding restores ecological equilibrium.',
    '24 min',
    'Intermediate',
    35,
    '<h2>The Web of Life</h2><p>Over 75% of leading food crops depend on insect pollinators. Keystone species anchor entire ecological communities.</p>',
    '[{"id":"q1","question":"What is a keystone species?","options":["The most abundant animal","A species with a disproportionately large impact on ecosystem balance","An animal that builds stone nests","Invasive pest"],"correctIndex":1,"explanation":"Keystone species hold ecological communities together; their removal causes ecosystem shifts."}]'::jsonb
  ),
  (
    'lesson-sustainable-transport',
    'Low-Carbon Mobility, Active Transit & 15-Minute Cities',
    'Sustainable Transportation',
    'Compare well-to-wheel transport emissions, analyze urban micro-mobility, and discover how 15-minute city designs decarbonize transit.',
    '20 min',
    'Beginner',
    30,
    '<h2>Decarbonizing Mobility</h2><p>Transport causes ~25% of energy emissions. Shifting short urban trips to walking, cycling, and electric transit slashes emissions.</p>',
    '[{"id":"q1","question":"What is the core premise of a 15-Minute City?","options":["Car trips are limited to 15 min","All essential daily amenities are accessible within a 15-minute walk or bike ride","Transit runs 15 min daily","Speed limit 15 km/h"],"correctIndex":1,"explanation":"15-minute cities prioritize compact urban design so daily needs are reached actively without cars."}]'::jsonb
  ),
  (
    'lesson-ewaste-crisis',
    'Electronic Waste & Circular Hardware',
    'E-Waste',
    'Investigate the growing e-waste stream, toxic heavy metal leakage, urban mining of critical minerals, and the Right to Repair movement.',
    '22 min',
    'Intermediate',
    35,
    '<h2>Electronic Waste Challenges</h2><p>Over 62 million metric tons of e-waste are produced annually. Urban mining recovers gold and rare earths without destructive open-pit mining.</p>',
    '[{"id":"q1","question":"What does the Right to Repair movement advocate for?","options":["Everyone must become an electrician","Fair access to replacement parts, manuals, and diagnostic tools","Banning computers","Stopping second-hand sales"],"correctIndex":1,"explanation":"Right to Repair enables users to fix and maintain equipment to reduce electronic waste."}]'::jsonb
  ),
  (
    'lesson-plastic-pollution',
    'Microplastics, Ocean Gyres & Plastic-Free Living',
    'Plastic Pollution',
    'Examine primary vs secondary microplastics, marine trophic accumulation, ocean gyres, and scalable plastic-free alternatives.',
    '25 min',
    'Intermediate',
    40,
    '<h2>The Microplastic Challenge</h2><p>Particles under 5mm persist in water and food webs for centuries. Eliminate single-use plastics and filter synthetic laundry fibers.</p>',
    '[{"id":"q1","question":"What is a microplastic?","options":["Any bottle under 1 liter","Plastic particles under 5 millimeters in diameter","Plastics in nano labs","Cornstarch bags"],"correctIndex":1,"explanation":"Microplastics are defined as synthetic polymer particles smaller than 5 mm."}]'::jsonb
  ),
  (
    'lesson-sustainable-living',
    'Ethical Sourcing, Fast Fashion & Conscious Consumerism',
    'Sustainable Consumption',
    'Learn life cycle assessments, uncover fast fashion supply chain impacts, detect greenwashing, and embrace conscious consumerism.',
    '22 min',
    'Intermediate',
    35,
    '<h2>Conscious Consumerism</h2><p>Fashion accounts for ~10% of global carbon emissions. Spot greenwashing, adopt the 30-wear rule, and support Cradle-to-Cradle designs.</p>',
    '[{"id":"q1","question":"What is Greenwashing?","options":["Cleaning panels with soap","Deceptive marketing that exaggerates or fakes environmental credentials","Washing in cold water","Painting buildings green"],"correctIndex":1,"explanation":"Greenwashing falsely portrays products or organizations as sustainable without evidence."}]'::jsonb
  )
ON CONFLICT (id) DO UPDATE SET
  title = EXCLUDED.title,
  category = EXCLUDED.category,
  description = EXCLUDED.description,
  duration = EXCLUDED.duration,
  difficulty = EXCLUDED.difficulty,
  xp = EXCLUDED.xp,
  content = EXCLUDED.content,
  quiz = EXCLUDED.quiz;

INSERT INTO public.challenges (id, title, category, description, difficulty, xp, impact_value, deadline, status, instructions) VALUES
  ('challenge-plastic-free', 'Plastic-Free Day', 'Plastic Pollution', 'Avoid single-use plastic for a day and document your reusable alternatives.', 'Medium', 100, 5, '2027-12-31', 'active', '<h2>Your mission</h2><ol><li>Carry a reusable bottle and bag.</li><li>Avoid disposable cutlery and packaging.</li><li>Submit a short reflection and optional photo.</li></ol>'),
  ('challenge-water-saver', 'Water Saver Week', 'Water Conservation', 'Maintain three water-saving habits during the week.', 'Easy', 75, 4, '2027-12-31', 'active', '<h2>Your mission</h2><ol><li>Keep showers under five minutes.</li><li>Turn off taps while brushing.</li><li>Tell us which habits you maintained.</li></ol>')
ON CONFLICT (id) DO NOTHING;

-- Enable Row Level Security (RLS)
ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.lessons ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.challenges ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_lessons ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_challenges ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Users can view their own profile" ON public.users;
DROP POLICY IF EXISTS "Users can update their own profile" ON public.users;
DROP POLICY IF EXISTS "Users can create their own profile" ON public.users;
DROP POLICY IF EXISTS "Public can read users for leaderboard" ON public.users;
DROP POLICY IF EXISTS "Anyone can read lessons" ON public.lessons;
DROP POLICY IF EXISTS "Teachers and admins can insert lessons" ON public.lessons;
DROP POLICY IF EXISTS "Teachers and admins can update lessons" ON public.lessons;
DROP POLICY IF EXISTS "Anyone can read challenges" ON public.challenges;
DROP POLICY IF EXISTS "Teachers and admins can insert challenges" ON public.challenges;
DROP POLICY IF EXISTS "Teachers and admins can update challenges" ON public.challenges;
DROP POLICY IF EXISTS "Users can view their own lesson progress" ON public.user_lessons;
DROP POLICY IF EXISTS "Users can insert their own lesson progress" ON public.user_lessons;
DROP POLICY IF EXISTS "Users can update their own lesson progress" ON public.user_lessons;
DROP POLICY IF EXISTS "Users can view their own submissions" ON public.user_challenges;
DROP POLICY IF EXISTS "Users can insert their own submissions" ON public.user_challenges;
DROP POLICY IF EXISTS "Teachers and admins can view submissions" ON public.user_challenges;
DROP POLICY IF EXISTS "Teachers and admins can update submissions" ON public.user_challenges;

-- Users policies
CREATE POLICY "Users can view their own profile" ON public.users FOR SELECT USING (auth.uid() = id);
CREATE POLICY "Users can update their own profile" ON public.users FOR UPDATE USING (auth.uid() = id);
CREATE POLICY "Users can create their own profile" ON public.users FOR INSERT WITH CHECK (auth.uid() = id);
CREATE POLICY "Public can read users for leaderboard" ON public.users FOR SELECT USING (true);

-- Lessons policies
CREATE POLICY "Anyone can read lessons" ON public.lessons FOR SELECT USING (true);
CREATE POLICY "Teachers and admins can insert lessons" ON public.lessons FOR INSERT WITH CHECK (
  EXISTS (SELECT 1 FROM public.users WHERE id = auth.uid() AND role IN ('teacher', 'admin'))
);
CREATE POLICY "Teachers and admins can update lessons" ON public.lessons FOR UPDATE USING (
  EXISTS (SELECT 1 FROM public.users WHERE id = auth.uid() AND role IN ('teacher', 'admin'))
);

-- Challenges policies
CREATE POLICY "Anyone can read challenges" ON public.challenges FOR SELECT USING (true);
CREATE POLICY "Teachers and admins can insert challenges" ON public.challenges FOR INSERT WITH CHECK (
  EXISTS (SELECT 1 FROM public.users WHERE id = auth.uid() AND role IN ('teacher', 'admin'))
);
CREATE POLICY "Teachers and admins can update challenges" ON public.challenges FOR UPDATE USING (
  EXISTS (SELECT 1 FROM public.users WHERE id = auth.uid() AND role IN ('teacher', 'admin'))
);

-- User lessons policies
CREATE POLICY "Users can view their own lesson progress" ON public.user_lessons FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert their own lesson progress" ON public.user_lessons FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update their own lesson progress" ON public.user_lessons FOR UPDATE USING (auth.uid() = user_id);

-- User challenges policies
CREATE POLICY "Users can view their own submissions" ON public.user_challenges FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert their own submissions" ON public.user_challenges FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Teachers and admins can view submissions" ON public.user_challenges FOR SELECT USING (
  EXISTS (SELECT 1 FROM public.users WHERE id = auth.uid() AND role IN ('teacher', 'admin'))
);
CREATE POLICY "Teachers and admins can update submissions" ON public.user_challenges FOR UPDATE USING (
  EXISTS (SELECT 1 FROM public.users WHERE id = auth.uid() AND role IN ('teacher', 'admin'))
);

CREATE OR REPLACE FUNCTION public.review_submission(p_submission_id UUID, p_status TEXT)
RETURNS JSONB
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  submission public.user_challenges;
  reward_xp INTEGER;
  reward_impact INTEGER;
  updated_xp INTEGER;
BEGIN
  IF p_status NOT IN ('approved', 'rejected') THEN RAISE EXCEPTION 'Invalid review status'; END IF;
  IF NOT EXISTS (SELECT 1 FROM public.users WHERE id = auth.uid() AND role IN ('teacher', 'admin')) THEN RAISE EXCEPTION 'Only teachers and administrators can review submissions'; END IF;
  SELECT * INTO submission FROM public.user_challenges WHERE id = p_submission_id FOR UPDATE;
  IF NOT FOUND THEN RAISE EXCEPTION 'Submission not found'; END IF;
  IF submission.status <> 'pending' THEN RAISE EXCEPTION 'This submission has already been reviewed'; END IF;
  UPDATE public.user_challenges SET status = p_status WHERE id = p_submission_id;
  IF p_status = 'approved' THEN
    SELECT COALESCE(xp, 0), COALESCE(impact_value, 0) INTO reward_xp, reward_impact FROM public.challenges WHERE id = submission.challenge_id;
    UPDATE public.users
      SET xp = COALESCE(xp, 0) + reward_xp,
          impact_score = COALESCE(impact_score, 0) + reward_impact,
          streak = COALESCE(streak, 0) + 1,
          level = GREATEST(1, FLOOR((COALESCE(xp, 0) + reward_xp) / 200.0)::INTEGER + 1)
      WHERE id = submission.user_id RETURNING xp INTO updated_xp;
  END IF;
  RETURN jsonb_build_object('id', p_submission_id, 'status', p_status, 'xp', COALESCE(updated_xp, 0));
END;
$$;

GRANT EXECUTE ON FUNCTION public.review_submission(UUID, TEXT) TO authenticated;

-- Function to securely update user roles
CREATE OR REPLACE FUNCTION public.update_user_role(p_user_id UUID, p_new_role TEXT)
RETURNS JSONB
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  IF p_new_role NOT IN ('student', 'teacher', 'admin') THEN
    RAISE EXCEPTION 'Invalid role specified';
  END IF;

  -- Ensure the caller is an admin
  IF NOT EXISTS (SELECT 1 FROM public.users WHERE id = auth.uid() AND role = 'admin') THEN
    RAISE EXCEPTION 'Only administrators can change user roles';
  END IF;

  -- Prevent an admin from accidentally revoking their own admin rights
  IF p_user_id = auth.uid() AND p_new_role <> 'admin' THEN
    RAISE EXCEPTION 'Administrators cannot demote themselves. Ask another admin to do it.';
  END IF;

  UPDATE public.users SET role = p_new_role WHERE id = p_user_id;
  
  IF NOT FOUND THEN
    RAISE EXCEPTION 'User not found';
  END IF;

  RETURN jsonb_build_object('success', true, 'user_id', p_user_id, 'new_role', p_new_role);
END;
$$;

GRANT EXECUTE ON FUNCTION public.update_user_role(UUID, TEXT) TO authenticated;

-- Function to securely block/unblock users
CREATE OR REPLACE FUNCTION public.admin_block_user(p_user_id UUID, p_blocked BOOLEAN)
RETURNS JSONB
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  -- Ensure the caller is an admin
  IF NOT EXISTS (SELECT 1 FROM public.users WHERE id = auth.uid() AND role = 'admin') THEN
    RAISE EXCEPTION 'Only administrators can block or unblock users';
  END IF;

  -- Prevent an admin from blocking themselves
  IF p_user_id = auth.uid() THEN
    RAISE EXCEPTION 'Administrators cannot block themselves.';
  END IF;

  UPDATE public.users SET is_blocked = p_blocked WHERE id = p_user_id;
  
  IF NOT FOUND THEN
    RAISE EXCEPTION 'User not found';
  END IF;

  RETURN jsonb_build_object('success', true, 'user_id', p_user_id, 'is_blocked', p_blocked);
END;
$$;

GRANT EXECUTE ON FUNCTION public.admin_block_user(UUID, BOOLEAN) TO authenticated;

-- Function to securely delete (hard delete) users
CREATE OR REPLACE FUNCTION public.admin_delete_user(p_user_id UUID)
RETURNS JSONB
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  -- Ensure the caller is an admin
  IF NOT EXISTS (SELECT 1 FROM public.users WHERE id = auth.uid() AND role = 'admin') THEN
    RAISE EXCEPTION 'Only administrators can delete users';
  END IF;

  -- Prevent an admin from deleting themselves
  IF p_user_id = auth.uid() THEN
    RAISE EXCEPTION 'Administrators cannot delete themselves.';
  END IF;

  -- Hard delete from auth.users (This requires the function to be run by a superuser like postgres)
  -- Because of ON DELETE CASCADE, this will also delete the public.users record and related data.
  DELETE FROM auth.users WHERE id = p_user_id;
  
  RETURN jsonb_build_object('success', true, 'user_id', p_user_id, 'deleted', true);
END;
$$;

GRANT EXECUTE ON FUNCTION public.admin_delete_user(UUID) TO authenticated;
