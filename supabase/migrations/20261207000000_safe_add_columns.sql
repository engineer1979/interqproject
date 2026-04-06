-- Safe migration that adds missing columns to existing tables

-- Add missing columns to interviews table if they don't exist
DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'interviews' AND column_name = 'title') THEN
    ALTER TABLE interviews ADD COLUMN title TEXT;
  END IF;
END $$;

DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'interviews' AND column_name = 'job_role') THEN
    ALTER TABLE interviews ADD COLUMN job_role TEXT;
  END IF;
END $$;

DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'interviews' AND column_name = 'duration_minutes') THEN
    ALTER TABLE interviews ADD COLUMN duration_minutes INTEGER DEFAULT 30;
  END IF;
END $$;

DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'interviews' AND column_name = 'is_published') THEN
    ALTER TABLE interviews ADD COLUMN is_published BOOLEAN DEFAULT false;
  END IF;
END $$;

DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'interviews' AND column_name = 'meeting_link') THEN
    ALTER TABLE interviews ADD COLUMN meeting_link TEXT;
  END IF;
END $$;

DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'interviews' AND column_name = 'scheduled_at') THEN
    ALTER TABLE interviews ADD COLUMN scheduled_at TIMESTAMPTZ;
  END IF;
END $$;

-- Create interview_sessions table if it doesn't exist
CREATE TABLE IF NOT EXISTS interview_sessions (
  id TEXT PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id TEXT,
  interview_id TEXT,
  title TEXT,
  job_role TEXT,
  duration_minutes INTEGER DEFAULT 30,
  status TEXT DEFAULT 'scheduled',
  completed BOOLEAN DEFAULT false,
  score INTEGER,
  feedback TEXT,
  notes TEXT,
  meeting_link TEXT,
  scheduled_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE interview_sessions ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Interview sessions viewable by authenticated users" ON interview_sessions;
CREATE POLICY "Interview sessions viewable by authenticated users"
  ON interview_sessions FOR SELECT TO authenticated USING (true);

DROP POLICY IF EXISTS "Users can insert interview sessions" ON interview_sessions;
CREATE POLICY "Users can insert interview sessions"
  ON interview_sessions FOR INSERT TO authenticated WITH CHECK (true);

DROP POLICY IF EXISTS "Users can update interview sessions" ON interview_sessions;
CREATE POLICY "Users can update interview sessions"
  ON interview_sessions FOR UPDATE TO authenticated USING (true);

-- Create assessments table if it doesn't exist
CREATE TABLE IF NOT EXISTS assessments (
  id TEXT PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  description TEXT,
  category TEXT,
  duration_minutes INTEGER DEFAULT 30,
  total_questions INTEGER DEFAULT 10,
  passing_score INTEGER DEFAULT 70,
  is_active BOOLEAN DEFAULT true,
  created_by TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE assessments ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Assessments viewable by authenticated users" ON assessments;
CREATE POLICY "Assessments viewable by authenticated users"
  ON assessments FOR SELECT TO authenticated USING (true);

DROP POLICY IF EXISTS "Users can insert assessments" ON assessments;
CREATE POLICY "Users can insert assessments"
  ON assessments FOR INSERT TO authenticated WITH CHECK (true);

DROP POLICY IF EXISTS "Users can update assessments" ON assessments;
CREATE POLICY "Users can update assessments"
  ON assessments FOR UPDATE TO authenticated USING (true);

-- Create assessment_results table if it doesn't exist
CREATE TABLE IF NOT EXISTS assessment_results (
  id TEXT PRIMARY KEY DEFAULT gen_random_uuid(),
  assessment_id TEXT,
  user_id TEXT,
  score INTEGER,
  max_score INTEGER DEFAULT 100,
  percentage NUMERIC,
  status TEXT DEFAULT 'pending',
  time_taken INTEGER,
  answers JSONB,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE assessment_results ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Assessment results viewable by authenticated users" ON assessment_results;
CREATE POLICY "Assessment results viewable by authenticated users"
  ON assessment_results FOR SELECT TO authenticated USING (true);

DROP POLICY IF EXISTS "Users can insert assessment results" ON assessment_results;
CREATE POLICY "Users can insert assessment results"
  ON assessment_results FOR INSERT TO authenticated WITH CHECK (true);

DROP POLICY IF EXISTS "Users can update assessment results" ON assessment_results;
CREATE POLICY "Users can update assessment results"
  ON assessment_results FOR UPDATE TO authenticated USING (true);

-- Create results table if it doesn't exist
CREATE TABLE IF NOT EXISTS results (
  id TEXT PRIMARY KEY DEFAULT gen_random_uuid(),
  candidate_id TEXT,
  job_id TEXT,
  interview_id TEXT,
  assessment_id TEXT,
  overall_score NUMERIC DEFAULT 0,
  max_score NUMERIC DEFAULT 100,
  status TEXT DEFAULT 'pending',
  recommendation TEXT,
  notes TEXT,
  evaluated_by TEXT,
  evaluated_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE results ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Results viewable by authenticated users" ON results;
CREATE POLICY "Results viewable by authenticated users"
  ON results FOR SELECT TO authenticated USING (true);

DROP POLICY IF EXISTS "Users can insert results" ON results;
CREATE POLICY "Users can insert results"
  ON results FOR INSERT TO authenticated WITH CHECK (true);

DROP POLICY IF EXISTS "Users can update results" ON results;
CREATE POLICY "Users can update results"
  ON results FOR UPDATE TO authenticated USING (true);

-- Create trigger function
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create triggers
DROP TRIGGER IF EXISTS update_interview_sessions_updated_at ON interview_sessions;
CREATE TRIGGER update_interview_sessions_updated_at
  BEFORE UPDATE ON interview_sessions
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_assessments_updated_at ON assessments;
CREATE TRIGGER update_assessments_updated_at
  BEFORE UPDATE ON assessments
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_assessment_results_updated_at ON assessment_results;
CREATE TRIGGER update_assessment_results_updated_at
  BEFORE UPDATE ON assessment_results
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_results_updated_at ON results;
CREATE TRIGGER update_results_updated_at
  BEFORE UPDATE ON results
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Insert demo data (only if tables are empty)
INSERT INTO interview_sessions (user_id, title, job_role, duration_minutes, status, completed, scheduled_at, meeting_link)
SELECT 'user-demo-1', 'Technical Interview - Frontend', 'Senior Frontend Developer', 45, 'scheduled', false, NOW() + INTERVAL '2 days', 'https://meet.example.com/session-1'
WHERE NOT EXISTS (SELECT 1 FROM interview_sessions WHERE title = 'Technical Interview - Frontend');

INSERT INTO interview_sessions (user_id, title, job_role, duration_minutes, status, completed, scheduled_at, meeting_link)
SELECT 'user-demo-1', 'Behavioral Interview', 'Senior Frontend Developer', 30, 'scheduled', false, NOW() + INTERVAL '3 days', 'https://meet.example.com/session-2'
WHERE NOT EXISTS (SELECT 1 FROM interview_sessions WHERE title = 'Behavioral Interview');

INSERT INTO interview_sessions (user_id, title, job_role, duration_minutes, status, completed, scheduled_at, meeting_link)
SELECT 'user-demo-2', 'System Design Interview', 'Backend Developer', 60, 'scheduled', false, NOW() + INTERVAL '5 days', 'https://meet.example.com/session-3'
WHERE NOT EXISTS (SELECT 1 FROM interview_sessions WHERE title = 'System Design Interview');

INSERT INTO interview_sessions (user_id, title, job_role, duration_minutes, status, completed, scheduled_at, meeting_link)
SELECT 'user-demo-1', 'Frontend Initial Screen', 'Frontend Developer', 30, 'completed', true, NOW() - INTERVAL '1 day', 'https://meet.example.com/session-4'
WHERE NOT EXISTS (SELECT 1 FROM interview_sessions WHERE title = 'Frontend Initial Screen');

INSERT INTO interview_sessions (user_id, title, job_role, duration_minutes, status, completed, scheduled_at, meeting_link)
SELECT 'user-demo-2', 'Technical Deep Dive', 'Full Stack Developer', 45, 'completed', true, NOW() - INTERVAL '2 days', 'https://meet.example.com/session-5'
WHERE NOT EXISTS (SELECT 1 FROM interview_sessions WHERE title = 'Technical Deep Dive');

INSERT INTO assessments (title, description, category, duration_minutes, total_questions, passing_score, is_active)
SELECT 'JavaScript Fundamentals', 'Test your core JavaScript knowledge', 'Technical', 30, 20, 70, true
WHERE NOT EXISTS (SELECT 1 FROM assessments WHERE title = 'JavaScript Fundamentals');

INSERT INTO assessments (title, description, category, duration_minutes, total_questions, passing_score, is_active)
SELECT 'React Proficiency Test', 'Evaluate React.js skills', 'Technical', 45, 25, 75, true
WHERE NOT EXISTS (SELECT 1 FROM assessments WHERE title = 'React Proficiency Test');

INSERT INTO assessments (title, description, category, duration_minutes, total_questions, passing_score, is_active)
SELECT 'Behavioral Assessment', 'Evaluate soft skills and culture fit', 'Behavioral', 20, 15, 60, true
WHERE NOT EXISTS (SELECT 1 FROM assessments WHERE title = 'Behavioral Assessment');

INSERT INTO assessments (title, description, category, duration_minutes, total_questions, passing_score, is_active)
SELECT 'Problem Solving Test', 'Algorithm and data structure challenges', 'Technical', 60, 10, 80, true
WHERE NOT EXISTS (SELECT 1 FROM assessments WHERE title = 'Problem Solving Test');

INSERT INTO assessments (title, description, category, duration_minutes, total_questions, passing_score, is_active)
SELECT 'Communication Skills', 'Evaluate written and verbal communication', 'Soft Skills', 25, 12, 70, true
WHERE NOT EXISTS (SELECT 1 FROM assessments WHERE title = 'Communication Skills');

INSERT INTO assessment_results (assessment_id, user_id, score, max_score, percentage, status, time_taken)
SELECT (SELECT id FROM assessments WHERE title = 'JavaScript Fundamentals' LIMIT 1), 'user-demo-1', 85, 100, 85, 'passed', 25
WHERE EXISTS (SELECT 1 FROM assessments WHERE title = 'JavaScript Fundamentals')
AND NOT EXISTS (SELECT 1 FROM assessment_results WHERE user_id = 'user-demo-1' AND assessment_id = (SELECT id FROM assessments WHERE title = 'JavaScript Fundamentals' LIMIT 1));

INSERT INTO assessment_results (assessment_id, user_id, score, max_score, percentage, status, time_taken)
SELECT (SELECT id FROM assessments WHERE title = 'React Proficiency Test' LIMIT 1), 'user-demo-1', 78, 100, 78, 'passed', 40
WHERE EXISTS (SELECT 1 FROM assessments WHERE title = 'React Proficiency Test')
AND NOT EXISTS (SELECT 1 FROM assessment_results WHERE user_id = 'user-demo-1' AND assessment_id = (SELECT id FROM assessments WHERE title = 'React Proficiency Test' LIMIT 1));

INSERT INTO assessment_results (assessment_id, user_id, score, max_score, percentage, status, time_taken)
SELECT (SELECT id FROM assessments WHERE title = 'Behavioral Assessment' LIMIT 1), 'user-demo-1', 92, 100, 92, 'passed', 18
WHERE EXISTS (SELECT 1 FROM assessments WHERE title = 'Behavioral Assessment')
AND NOT EXISTS (SELECT 1 FROM assessment_results WHERE user_id = 'user-demo-1' AND assessment_id = (SELECT id FROM assessments WHERE title = 'Behavioral Assessment' LIMIT 1));

INSERT INTO assessment_results (assessment_id, user_id, score, max_score, percentage, status, time_taken)
SELECT (SELECT id FROM assessments WHERE title = 'Problem Solving Test' LIMIT 1), 'user-demo-2', 65, 100, 65, 'failed', 55
WHERE EXISTS (SELECT 1 FROM assessments WHERE title = 'Problem Solving Test')
AND NOT EXISTS (SELECT 1 FROM assessment_results WHERE user_id = 'user-demo-2' AND assessment_id = (SELECT id FROM assessments WHERE title = 'Problem Solving Test' LIMIT 1));

INSERT INTO assessment_results (assessment_id, user_id, score, max_score, percentage, status, time_taken)
SELECT (SELECT id FROM assessments WHERE title = 'Communication Skills' LIMIT 1), 'user-demo-2', 88, 100, 88, 'passed', 22
WHERE EXISTS (SELECT 1 FROM assessments WHERE title = 'Communication Skills')
AND NOT EXISTS (SELECT 1 FROM assessment_results WHERE user_id = 'user-demo-2' AND assessment_id = (SELECT id FROM assessments WHERE title = 'Communication Skills' LIMIT 1));
