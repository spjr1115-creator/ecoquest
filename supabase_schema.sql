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
  created_at TIMESTAMPTZ DEFAULT NOW()
);

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

-- Starter content makes a newly connected project immediately usable.
INSERT INTO public.lessons (id, title, category, description, duration, difficulty, xp, content) VALUES
  ('lesson-waste-basics', 'Waste Management Basics', 'Waste Management', 'Learn to reduce, reuse, recycle, and compost everyday waste.', '15 min', 'Beginner', 20, '<h2>Start with the 5Rs</h2><p>Refuse unnecessary items, reduce what you use, reuse what you own, repurpose creatively, and recycle correctly.</p>'),
  ('lesson-water', 'Every Drop Counts', 'Water Conservation', 'Simple habits that protect water at home and school.', '20 min', 'Beginner', 25, '<h2>Conserve water daily</h2><p>Turn off taps when not in use, repair leaks, and use only the water you need.</p>')
ON CONFLICT (id) DO NOTHING;

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
DROP POLICY IF EXISTS "Anyone can read challenges" ON public.challenges;
DROP POLICY IF EXISTS "Teachers and admins can insert challenges" ON public.challenges;
DROP POLICY IF EXISTS "Teachers and admins can update challenges" ON public.challenges;
DROP POLICY IF EXISTS "Users can view their own lesson progress" ON public.user_lessons;
DROP POLICY IF EXISTS "Users can insert their own lesson progress" ON public.user_lessons;
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
