-- Create ai_interviews table
CREATE TABLE IF NOT EXISTS public.ai_interviews (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  application_id UUID REFERENCES public.applications(id) ON DELETE CASCADE,
  candidate_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  job_id UUID REFERENCES public.jobs(id) ON DELETE CASCADE,
  video_url TEXT,
  transcript TEXT,
  score NUMERIC CHECK (score >= 0 AND score <= 100),
  analysis_data JSONB, -- {communication: 85, confidence: 78, technical: 90, sentiment: 'positive'}
  completed_at TIMESTAMPTZ,
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'scheduled', 'recording', 'processing', 'completed', 'failed')),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE public.ai_interviews ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Users can view own AI interviews" ON public.ai_interviews;
DO $$
BEGIN
  IF EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_schema = 'public' 
    AND table_name = 'ai_interviews' 
    AND column_name = 'candidate_id'
  ) THEN
    DROP POLICY IF EXISTS "Users can view own AI interviews" ON public.ai_interviews;
    CREATE POLICY "Users can view own AI interviews" ON public.ai_interviews 
    FOR SELECT USING (auth.uid()::uuid = candidate_id);
  END IF;
END $$;

DROP POLICY IF EXISTS "Companies can view AI interviews" ON public.ai_interviews;
CREATE POLICY "Companies can view AI interviews" ON public.ai_interviews
FOR SELECT USING (
  EXISTS (
    SELECT 1 FROM public.jobs 
    JOIN public.applications ON applications.job_id = jobs.id
    WHERE applications.id = ai_interviews.application_id 
    AND jobs.created_by = auth.uid()::uuid
  )
);

DO $$
BEGIN
  IF EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_schema = 'public' 
    AND table_name = 'ai_interviews' 
    AND column_name = 'candidate_id'
  ) THEN
    CREATE INDEX IF NOT EXISTS idx_ai_interviews_candidate ON public.ai_interviews(candidate_id);
  END IF;
END $$;
CREATE INDEX IF NOT EXISTS idx_ai_interviews_job ON public.ai_interviews(job_id);
CREATE INDEX IF NOT EXISTS idx_ai_interviews_status ON public.ai_interviews(status);

