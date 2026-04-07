-- Create IT Technical Interview System
-- Interview management for job seekers with 6 IT domains

-- Drop existing ai_interviews table if exists
DROP TABLE IF EXISTS public.interview_questions CASCADE;
DROP TABLE IF EXISTS public.ai_interviews CASCADE;

-- Create ai_interviews table for job seeker interviews
CREATE TABLE public.ai_interviews (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  title TEXT NOT NULL,
  category TEXT NOT NULL, -- 'Web Development', 'Data Structures', 'Databases', 'AI', 'DevOps', 'System Design'
  description TEXT,
  status TEXT DEFAULT 'upcoming' CHECK (status IN ('upcoming', 'in_progress', 'completed')),
  scheduled_at TIMESTAMPTZ DEFAULT NOW(),
  started_at TIMESTAMPTZ,
  completed_at TIMESTAMPTZ,
  score INTEGER,
  total_questions INTEGER DEFAULT 20,
  correct_answers INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create interview_questions table
CREATE TABLE public.interview_questions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  interview_id UUID REFERENCES public.ai_interviews(id) ON DELETE CASCADE NOT NULL,
  question_text TEXT NOT NULL,
  question_type TEXT DEFAULT 'technical',
  difficulty TEXT DEFAULT 'medium' CHECK (difficulty IN ('easy', 'medium', 'hard')),
  category TEXT NOT NULL,
  order_index INTEGER NOT NULL,
  user_answer TEXT,
  is_correct BOOLEAN,
  points INTEGER DEFAULT 5,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable RLS
ALTER TABLE public.ai_interviews ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.interview_questions ENABLE ROW LEVEL SECURITY;

-- RLS Policies for ai_interviews
CREATE POLICY "Users can view own interviews" ON public.ai_interviews
FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own interviews" ON public.ai_interviews
FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own interviews" ON public.ai_interviews
FOR UPDATE USING (auth.uid() = user_id);

-- RLS Policies for interview_questions
CREATE POLICY "Users can view own interview questions" ON public.interview_questions
FOR SELECT USING (
  EXISTS (
    SELECT 1 FROM public.ai_interviews
    WHERE public.ai_interviews.id = public.interview_questions.interview_id
    AND public.ai_interviews.user_id = auth.uid()
  )
);

CREATE POLICY "Users can insert own interview questions" ON public.interview_questions
FOR INSERT WITH CHECK (
  EXISTS (
    SELECT 1 FROM public.ai_interviews
    WHERE public.ai_interviews.id = public.interview_questions.interview_id
    AND public.ai_interviews.user_id = auth.uid()
  )
);

CREATE POLICY "Users can update own interview questions" ON public.interview_questions
FOR UPDATE USING (
  EXISTS (
    SELECT 1 FROM public.ai_interviews
    WHERE public.ai_interviews.id = public.interview_questions.interview_id
    AND public.ai_interviews.user_id = auth.uid()
  )
);

-- Create indexes
CREATE INDEX idx_ai_interviews_user ON public.ai_interviews(user_id);
CREATE INDEX idx_ai_interviews_status ON public.ai_interviews(status);
CREATE INDEX idx_ai_interviews_category ON public.ai_interviews(category);
CREATE INDEX idx_interview_questions_interview ON public.interview_questions(interview_id);

-- Create function to generate interviews after assessment completion
CREATE OR REPLACE FUNCTION public.generate_interviews_after_assessment(
  p_user_id UUID,
  p_assessment_id TEXT,
  p_score INTEGER
)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  v_interview_category TEXT;
  v_interview_title TEXT;
  v_interview_id UUID;
  v_question_count INTEGER := 20;
BEGIN
  -- Map assessment to interview category
  SELECT CASE 
    WHEN LOWER(p_assessment_id) LIKE '%javascript%' OR LOWER(p_assessment_id) LIKE '%react%' OR LOWER(p_assessment_id) LIKE '%web%' THEN 'Web Development'
    WHEN LOWER(p_assessment_id) LIKE '%data%structure%' OR LOWER(p_assessment_id) LIKE '%algorithm%' THEN 'Data Structures'
    WHEN LOWER(p_assessment_id) LIKE '%database%' OR LOWER(p_assessment_id) LIKE '%sql%' OR LOWER(p_assessment_id) LIKE '%postgresql%' THEN 'Databases'
    WHEN LOWER(p_assessment_id) LIKE '%ai%' OR LOWER(p_assessment_id) LIKE '%machine learning%' OR LOWER(p_assessment_id) LIKE '%ml%' THEN 'AI'
    WHEN LOWER(p_assessment_id) LIKE '%devops%' OR LOWER(p_assessment_id) LIKE '%cloud%' OR LOWER(p_assessment_id) LIKE '%docker%' THEN 'DevOps'
    WHEN LOWER(p_assessment_id) LIKE '%system design%' OR LOWER(p_assessment_id) LIKE '%architecture%' THEN 'System Design'
    ELSE 'Web Development'
  END INTO v_interview_category;

  -- Set title based on category
  v_interview_title := v_interview_category || ' Technical Interview';

  -- Create the interview
  INSERT INTO public.ai_interviews (user_id, title, category, description, status, total_questions)
  VALUES (p_user_id, v_interview_title, v_interview_category, 
          'Technical interview covering ' || v_interview_category || ' topics. ' || v_question_count || ' questions.',
          'upcoming', v_question_count)
  RETURNING id INTO v_interview_id;

  -- Insert sample questions (will be replaced with actual question bank)
  FOR i IN 1..v_question_count LOOP
    INSERT INTO public.interview_questions (interview_id, question_text, question_type, difficulty, category, order_index, points)
    VALUES (v_interview_id, 
            'Sample ' || v_interview_category || ' Question ' || i || ': Describe your understanding of key concepts in this area and provide an example.',
            'technical',
            CASE WHEN i <= 7 THEN 'easy' WHEN i <= 14 THEN 'medium' ELSE 'hard' END,
            v_interview_category,
            i,
            5);
  END LOOP;
END;
$$;

-- Create function to get user interviews
CREATE OR REPLACE FUNCTION public.get_user_interviews(p_user_id UUID)
RETURNS TABLE (
  id UUID,
  title TEXT,
  category TEXT,
  status TEXT,
  total_questions INTEGER,
  correct_answers INTEGER,
  score INTEGER,
  scheduled_at TIMESTAMPTZ,
  started_at TIMESTAMPTZ,
  completed_at TIMESTAMPTZ
)
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  RETURN QUERY
  SELECT 
    i.id,
    i.title,
    i.category,
    i.status,
    i.total_questions,
    i.correct_answers,
    i.score,
    i.scheduled_at,
    i.started_at,
    i.completed_at
  FROM public.ai_interviews i
  WHERE i.user_id = p_user_id
  ORDER BY i.created_at DESC;
END;
$$;