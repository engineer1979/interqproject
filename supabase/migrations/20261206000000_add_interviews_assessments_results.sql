-- Comprehensive Database Migration for All Modules
-- Adds: interviews, assessments, results, interview_sessions tables

-- Create interviews table
CREATE TABLE IF NOT EXISTS interviews (
  id TEXT PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  job_role TEXT,
  description TEXT,
  duration_minutes INTEGER DEFAULT 30,
  is_published BOOLEAN DEFAULT false,
  meeting_link TEXT,
  scheduled_at TIMESTAMPTZ,
  status TEXT DEFAULT 'upcoming',
  candidate_id TEXT,
  job_id TEXT,
  interviewer_id TEXT,
  feedback TEXT,
  score INTEGER,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE interviews ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Interviews are viewable by authenticated users" ON interviews;
CREATE POLICY "Interviews are viewable by authenticated users"
  ON interviews FOR SELECT TO authenticated USING (true);

DROP POLICY IF EXISTS "Users can insert interviews" ON interviews;
CREATE POLICY "Users can insert interviews"
  ON interviews FOR INSERT TO authenticated WITH CHECK (true);

DROP POLICY IF EXISTS "Users can update interviews" ON interviews;
CREATE POLICY "Users can update interviews"
  ON interviews FOR UPDATE TO authenticated USING (true);

-- Create interview_sessions table
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

-- Create assessments table
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

-- Create assessment_results table
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

-- Create results table (final candidate results)
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

-- Create triggers for all tables
DROP TRIGGER IF EXISTS update_interviews_updated_at ON interviews;
CREATE TRIGGER update_interviews_updated_at
  BEFORE UPDATE ON interviews
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

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

-- Insert demo interviews
INSERT INTO interviews (id, title, job_role, description, duration_minutes, is_published, status, scheduled_at, meeting_link)
VALUES
  (gen_random_uuid(), 'Technical Interview - Frontend', 'Senior Frontend Developer', 'React and TypeScript technical assessment', 45, true, 'upcoming', NOW() + INTERVAL '2 days', 'https://meet.example.com/interview-1'),
  (gen_random_uuid(), 'Behavioral Interview', 'Senior Frontend Developer', 'Cultural fit and soft skills evaluation', 30, true, 'upcoming', NOW() + INTERVAL '3 days', 'https://meet.example.com/interview-2'),
  (gen_random_uuid(), 'System Design Interview', 'Backend Developer', 'System design and architecture discussion', 60, true, 'upcoming', NOW() + INTERVAL '5 days', 'https://meet.example.com/interview-3'),
  (gen_random_uuid(), 'Frontend Initial Screen', 'Frontend Developer', 'Initial screening round', 30, true, 'completed', NOW() - INTERVAL '1 day', 'https://meet.example.com/interview-4'),
  (gen_random_uuid(), 'Technical Deep Dive', 'Full Stack Developer', 'Deep dive into JavaScript and frameworks', 45, true, 'completed', NOW() - INTERVAL '2 days', 'https://meet.example.com/interview-5');

-- Insert demo interview_sessions
INSERT INTO interview_sessions (user_id, interview_id, title, job_role, duration_minutes, status, completed, scheduled_at, meeting_link)
VALUES
  ('user-demo-1', (SELECT id FROM interviews WHERE title LIKE '%Frontend%' LIMIT 1), 'Technical Interview - Frontend', 'Senior Frontend Developer', 45, 'scheduled', false, NOW() + INTERVAL '2 days', 'https://meet.example.com/session-1'),
  ('user-demo-1', (SELECT id FROM interviews WHERE title LIKE '%Behavioral%' LIMIT 1), 'Behavioral Interview', 'Senior Frontend Developer', 30, 'scheduled', false, NOW() + INTERVAL '3 days', 'https://meet.example.com/session-2'),
  ('user-demo-2', (SELECT id FROM interviews WHERE title LIKE '%System Design%' LIMIT 1), 'System Design Interview', 'Backend Developer', 60, 'scheduled', false, NOW() + INTERVAL '5 days', 'https://meet.example.com/session-3'),
  ('user-demo-1', (SELECT id FROM interviews WHERE title LIKE '%Initial Screen%' LIMIT 1), 'Frontend Initial Screen', 'Frontend Developer', 30, 'completed', true, NOW() - INTERVAL '1 day', 'https://meet.example.com/session-4'),
  ('user-demo-2', (SELECT id FROM interviews WHERE title LIKE '%Deep Dive%' LIMIT 1), 'Technical Deep Dive', 'Full Stack Developer', 45, 'completed', true, NOW() - INTERVAL '2 days', 'https://meet.example.com/session-5');

-- Insert demo assessments
INSERT INTO assessments (id, title, description, category, duration_minutes, total_questions, passing_score, is_active)
VALUES
  (gen_random_uuid(), 'JavaScript Fundamentals', 'Test your core JavaScript knowledge', 'Technical', 30, 20, 70, true),
  (gen_random_uuid(), 'React Proficiency Test', 'Evaluate React.js skills', 'Technical', 45, 25, 75, true),
  (gen_random_uuid(), 'Behavioral Assessment', 'Evaluate soft skills and culture fit', 'Behavioral', 20, 15, 60, true),
  (gen_random_uuid(), 'Problem Solving Test', 'Algorithm and data structure challenges', 'Technical', 60, 10, 80, true),
  (gen_random_uuid(), 'Communication Skills', 'Evaluate written and verbal communication', 'Soft Skills', 25, 12, 70, true);

-- Insert demo assessment_results
INSERT INTO assessment_results (assessment_id, user_id, score, max_score, percentage, status, time_taken)
VALUES
  ((SELECT id FROM assessments WHERE title = 'JavaScript Fundamentals' LIMIT 1), 'user-demo-1', 85, 100, 85, 'passed', 25),
  ((SELECT id FROM assessments WHERE title = 'React Proficiency Test' LIMIT 1), 'user-demo-1', 78, 100, 78, 'passed', 40),
  ((SELECT id FROM assessments WHERE title = 'Behavioral Assessment' LIMIT 1), 'user-demo-1', 92, 100, 92, 'passed', 18),
  ((SELECT id FROM assessments WHERE title = 'Problem Solving Test' LIMIT 1), 'user-demo-2', 65, 100, 65, 'failed', 55),
  ((SELECT id FROM assessments WHERE title = 'Communication Skills' LIMIT 1), 'user-demo-2', 88, 100, 88, 'passed', 22);

-- Insert demo results
INSERT INTO results (candidate_id, job_id, interview_id, overall_score, max_score, status, recommendation, notes)
VALUES
  ('user-demo-1', (SELECT id FROM jobs WHERE title LIKE '%Frontend%' LIMIT 1), (SELECT id FROM interviews WHERE title LIKE '%Technical%' LIMIT 1), 85, 100, 'pass', 'Strong hire', 'Excellent technical skills, good communication'),
  ('user-demo-1', (SELECT id FROM jobs WHERE title LIKE '%Frontend%' LIMIT 1), (SELECT id FROM interviews WHERE title LIKE '%Behavioral%' LIMIT 1), 90, 100, 'pass', 'Highly recommended', 'Great cultural fit, strong leadership potential'),
  ('user-demo-2', (SELECT id FROM jobs WHERE title LIKE '%Backend%' LIMIT 1), (SELECT id FROM interviews WHERE title LIKE '%System Design%' LIMIT 1), 70, 100, 'pass', 'Consider', 'Good problem solving, needs more experience'),
  ('user-demo-2', (SELECT id FROM jobs WHERE title LIKE '%Full Stack%' LIMIT 1), (SELECT id FROM interviews WHERE title LIKE '%Deep Dive%' LIMIT 1), 55, 100, 'fail', 'Not recommended', 'Insufficient technical depth');
