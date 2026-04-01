-- Make assessments public readable (prevents RLS loading errors)
-- Keep write restrictions for security

ALTER TABLE public.assessments ENABLE ROW LEVEL SECURITY;

-- Public read access (no auth required)
DROP POLICY IF EXISTS "Users can view public assessments" ON public.assessments;
DROP POLICY IF EXISTS "Public read access to assessments" ON public.assessments;

CREATE POLICY "Public read access to assessments"
ON public.assessments
FOR SELECT
USING (true);

-- Questions public read (questions belong to public assessments)
ALTER TABLE public.questions ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Public read access to questions" ON public.questions;
DROP POLICY IF EXISTS "Public read questions" ON public.questions;

CREATE POLICY "Public read access to questions"
ON public.questions
FOR SELECT
USING (true);

-- Comment for clarity
COMMENT ON POLICY "Public read access to assessments"
ON public.assessments
IS 'Allows unauthenticated users to view assessments for guest taking';
