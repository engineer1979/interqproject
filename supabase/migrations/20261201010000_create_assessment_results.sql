-- Create assessment_results table
CREATE TABLE IF NOT EXISTS public.assessment_results (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  application_id UUID REFERENCES public.applications(id) ON DELETE CASCADE,
  assessment_id UUID REFERENCES public.assessments(id) ON DELETE CASCADE,
  candidate_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  score NUMERIC CHECK (score >= 0 AND score <= 100),
  time_taken_minutes INTEGER,
  completed_at TIMESTAMPTZ,
  answers JSONB,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE public.assessment_results ENABLE ROW LEVEL SECURITY;

DO $$
BEGIN
  IF EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_schema = 'public' 
    AND table_name = 'assessment_results' 
    AND column_name = 'candidate_id'
  ) THEN
    DROP POLICY IF EXISTS "Users can view own results" ON public.assessment_results;
    CREATE POLICY "Users can view own results" ON public.assessment_results 
    FOR SELECT USING (auth.uid()::uuid = candidate_id);
  END IF;
END $$;

DO $$
BEGIN
  IF EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_schema = 'public' 
    AND table_name = 'assessment_results' 
    AND column_name = 'application_id'
  ) THEN
    CREATE POLICY "Companies can view assessment results" ON public.assessment_results
    FOR SELECT USING (
      EXISTS (
        SELECT 1 FROM public.jobs 
        JOIN public.applications ON applications.job_id = jobs.id
        WHERE applications.id = assessment_results.application_id 
        AND jobs.created_by = auth.uid()
      )
    );
  END IF;
END $$;

DO $$
BEGIN
  IF EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_schema = 'public' 
    AND table_name = 'assessment_results' 
    AND column_name = 'candidate_id'
  ) THEN
    CREATE INDEX idx_assessment_results_candidate ON public.assessment_results(candidate_id);
  END IF;
END $$;
CREATE INDEX IF NOT EXISTS idx_assessment_results_assessment ON public.assessment_results(assessment_id);

