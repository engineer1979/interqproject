-- Create candidate_evaluations table for weighted scoring
CREATE TABLE IF NOT EXISTS public.candidate_evaluations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  application_id UUID REFERENCES public.applications(id) ON DELETE CASCADE,
  candidate_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  job_id UUID REFERENCES public.jobs(id) ON DELETE CASCADE,
  ats_score NUMERIC CHECK (ats_score >= 0 AND ats_score <= 100),
  assessment_score NUMERIC CHECK (assessment_score >= 0 AND assessment_score <= 100),
  ai_interview_score NUMERIC CHECK (ai_interview_score >= 0 AND ai_interview_score <= 100),
  final_score NUMERIC GENERATED ALWAYS AS (
    (COALESCE(ats_score, 0) * 0.3) + 
    (COALESCE(assessment_score, 0) * 0.4) + 
    (COALESCE(ai_interview_score, 0) * 0.3)
  ) STORED CHECK (final_score >= 0 AND final_score <= 100),
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'ats_complete', 'assessment_complete', 'ai_complete', 'review', 'offer', 'rejected')),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable RLS
ALTER TABLE public.candidate_evaluations ENABLE ROW LEVEL SECURITY;

-- Policies
-- Skip duplicate policy
-- CREATE POLICY IF NOT EXISTS "Users can view own evaluations" ON public.candidate_evaluations
-- FOR SELECT USING (auth.uid() = candidate_id);

-- Skip duplicate policy
-- CREATE POLICY IF NOT EXISTS "Companies can view job evaluations" ON public.candidate_evaluations
-- FOR ALL USING (
--   EXISTS (
--     SELECT 1 FROM public.jobs WHERE id = candidate_evaluations.job_id
--     AND created_by = auth.uid()
--   )
-- );

-- Skip duplicate indexes
-- CREATE INDEX idx_candidate_evaluations_job ON public.candidate_evaluations(job_id);
-- CREATE INDEX idx_candidate_evaluations_final_score ON public.candidate_evaluations(final_score DESC);
-- CREATE INDEX idx_candidate_evaluations_status ON public.candidate_evaluations(status);

