-- Core Assessment Schema
-- Creates/updates base tables: users, assessments, questions, results
-- Compatible with existing advanced assessment tables

-- Enable uuid-ossp extension if needed
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- USERS TABLE
CREATE TABLE IF NOT EXISTS public.users (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  email text UNIQUE NOT NULL,
  role text NOT NULL CHECK (role IN ('jobseeker','recruiter','company','admin')),
  created_at timestamp with time zone DEFAULT now()
);

-- Indexes for users
CREATE INDEX IF NOT EXISTS idx_users_email ON public.users(email);
CREATE INDEX IF NOT EXISTS idx_users_role ON public.users(role);

-- RLS for users
ALTER TABLE IF EXISTS public.users ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Users can view own user data" ON public.users;
DROP POLICY IF EXISTS "Enable insert for authenticated users only" ON public.users;
DROP POLICY IF EXISTS "Enable update for users based on email" ON public.users;
DROP POLICY IF EXISTS "Enable delete for users based on email" ON public.users;
CREATE POLICY "Users can view own user data" ON public.users FOR SELECT USING (auth.uid() = id);
CREATE POLICY "Enable insert for authenticated users only" ON public.users FOR INSERT WITH CHECK (auth.uid() = id);
CREATE POLICY "Enable update for users based on email" ON public.users FOR UPDATE USING (auth.uid() = id) WITH CHECK (auth.uid() = id);
CREATE POLICY "Enable delete for users based on email" ON public.users FOR DELETE USING (auth.uid() = id);

-- ASSESSMENTS TABLE
CREATE TABLE IF NOT EXISTS public.assessments (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL,
  domain text,
  created_by uuid REFERENCES public.users(id),
  created_at timestamp with time zone DEFAULT now()
);

-- Safe indexes for assessments
CREATE INDEX IF NOT EXISTS idx_assessments_domain ON public.assessments(domain);


-- RLS for assessments
ALTER TABLE IF EXISTS public.assessments ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Users can view public assessments" ON public.assessments;
CREATE POLICY "Users can view public assessments" ON public.assessments FOR SELECT USING (true);
-- CREATE POLICY "Owners can insert assessments" ON public.assessments FOR INSERT WITH CHECK (auth.uid() = created_by); -- skipped, column missing
-- CREATE POLICY "Owners can update own assessments" ON public.assessments FOR UPDATE USING (created_by = auth.uid()) WITH CHECK (created_by = auth.uid()); -- skipped, column missing
-- CREATE POLICY "Owners can delete own assessments" ON public.assessments FOR DELETE USING (created_by = auth.uid()); -- skipped, column missing

-- QUESTIONS TABLE
CREATE TABLE IF NOT EXISTS public.questions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  assessment_id uuid NOT NULL REFERENCES public.assessments(id) ON DELETE CASCADE,
  question_text text NOT NULL,
  question_type text,
  options jsonb,
  correct_answer text,
  explanation text,
  difficulty text CHECK (difficulty IN ('easy', 'medium', 'hard')),
  skill_tag text
);

-- Indexes for questions
CREATE INDEX IF NOT EXISTS idx_questions_assessment_id ON public.questions(assessment_id);
CREATE INDEX IF NOT EXISTS idx_questions_difficulty ON public.questions(difficulty);
CREATE INDEX IF NOT EXISTS idx_questions_skill_tag ON public.questions(skill_tag);

-- RLS for questions
ALTER TABLE IF EXISTS public.questions ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Public read access to questions" ON public.questions;
CREATE POLICY "Public read access to questions" ON public.questions FOR SELECT USING (true);
-- CREATE POLICY "Assessment owners can manage questions" ON public.questions FOR ALL USING (
  -- EXISTS (
  --   SELECT 1 FROM public.assessments WHERE id = questions.assessment_id AND created_by = auth.uid()
  -- )
-- ); -- skipped, column missing

-- RESULTS TABLE (simple version, coexists with advanced assessment_results)
CREATE TABLE IF NOT EXISTS public.results (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES public.users(id),
  assessment_id uuid NOT NULL REFERENCES public.assessments(id),
  score int NOT NULL CHECK (score >= 0),
  created_at timestamp with time zone DEFAULT now()
);

-- Indexes for results
CREATE INDEX IF NOT EXISTS idx_results_user_id ON public.results(user_id);
CREATE INDEX IF NOT EXISTS idx_results_assessment_id ON public.results(assessment_id);
CREATE INDEX IF NOT EXISTS idx_results_created_at ON public.results(created_at);

-- RLS for results
ALTER TABLE IF EXISTS public.results ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Users can view own results" ON public.results;
DROP POLICY IF EXISTS "Users can insert own results" ON public.results;
DROP POLICY IF EXISTS "Users can update own results" ON public.results;
CREATE POLICY "Users can view own results" ON public.results FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert own results" ON public.results FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update own results" ON public.results FOR UPDATE USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);
