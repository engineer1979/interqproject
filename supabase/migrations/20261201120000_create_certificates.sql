-- Create certificates table for InterQ assessment certificates
CREATE TABLE IF NOT EXISTS public.certificates (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  candidate_name TEXT NOT NULL,
  candidate_id TEXT NOT NULL UNIQUE,
  test_name TEXT NOT NULL,
  assessment_date DATE NOT NULL,
  duration_minutes INTEGER,
  test_version TEXT,
  overall
