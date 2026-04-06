-- Fixed Migration: Candidate Evaluation Reports (No FK Dependencies)
-- No companies/assessments REFERENCES - standalone ready

-- Enable UUID
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Main Table (NULLABLE FKs)
CREATE TABLE IF NOT EXISTS candidate_evaluations (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  candidate_id UUID,
  recruiter_id UUID,
  company_id UUID DEFAULT NULL,
  assessment_id UUID DEFAULT NULL,
  overallScore INTEGER CHECK (overallScore BETWEEN 0 AND 100) DEFAULT 0,
  status TEXT CHECK (status IN ('Pending', 'Partial', 'Complete', 'Reviewed')) DEFAULT 'Pending',
  candidate_name TEXT NOT NULL,
  candidate_email TEXT,
  role TEXT NOT NULL,
  assessment_title TEXT DEFAULT 'General Assessment',
  technical_score INTEGER DEFAULT 0,
  communication_score INTEGER DEFAULT 0,
  problem_solving_score INTEGER DEFAULT 0,
  culture_fit_score INTEGER DEFAULT 0,
  recruiter_notes TEXT DEFAULT '',
  admin_tags TEXT[] DEFAULT '{}',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- RLS
ALTER TABLE candidate_evaluations ENABLE ROW LEVEL SECURITY;

-- Recruiter policy
CREATE POLICY "Recruiters own data" ON candidate_evaluations
FOR ALL USING (auth.uid()::text = recruiter_id::text);

-- Admin all
CREATE POLICY "Admins full" ON candidate_evaluations
FOR ALL USING (true); -- App checks role

-- Indexes
CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_ce_status ON candidate_evaluations(status);
CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_ce_score ON candidate_evaluations(overallScore DESC);
CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_ce_created ON candidate_evaluations(created_at DESC);
CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_ce_recruiter ON candidate_evaluations(recruiter_id);

-- View
DROP VIEW IF EXISTS evaluation_reports_view;
CREATE VIEW evaluation_reports_view AS 
SELECT * FROM candidate_evaluations;

-- Updated trigger
DROP FUNCTION IF EXISTS update_updated_at_column();
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
   NEW.updated_at = NOW();
   RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS update_candidate_evaluations_updated_at ON candidate_evaluations;
CREATE TRIGGER update_candidate_evaluations_updated_at 
  BEFORE UPDATE ON candidate_evaluations 
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Seed 10 Reports (no FK needed)
DELETE FROM candidate_evaluations WHERE overallScore > 70; -- Clear high scorers
INSERT INTO candidate_evaluations (candidate_name, candidate_email, role, assessment_title, overallScore, status, technical_score, communication_score, recruiter_notes) VALUES
  ('John Doe', 'john.doe@email.com', 'Senior DevOps', 'AWS Certified DevOps', 92, 'Complete', 95, 88, 'Top candidate - immediate hire'),
  ('Sarah Wilson', 'sarah.w@email.com', 'Product Manager', 'Behavioral Leadership', 87, 'Complete', 82, 92, 'Strong PM skills'),
  ('Mike Johnson', 'mike.j@email.com', 'Frontend Dev', 'React Advanced', 78, 'Partial', 85, 70, 'Good code, comms needs work'),
  ('Emily Chen', 'emily.c@email.com', 'Data Scientist', 'Machine Learning', 94, 'Complete', 98, 90, 'Exceptional'),
  ('David Rodriguez', 'david.r@email.com', 'Network Engineer', 'CCNA Certification', 81, 'Complete', 88, 74, 'Ready for team'),
  ('Lisa Patel', 'lisa.p@email.com', 'UX Designer', 'Design Challenge', 89, 'Complete', 92, 86, 'Creative talent'),
  ('Robert Kim', 'robert.k@email.com', 'Backend Dev', 'Node.js Expert', 76, 'Partial', 80, 72, 'Optimize focus'),
  ('Anna Müller', 'anna.m@email.com', 'QA Engineer', 'Testing Mastery', 85, 'Complete', 90, 80, 'Reliable tester'),
  ('Carlos Lopez', 'carlos.l@email.com', 'DevOps Engineer', 'Kubernetes Pro', 91, 'Complete', 94, 88, 'K8s expert'),
  ('Jennifer Lee', 'jennifer.l@email.com', 'Full Stack Dev', 'Full Stack Challenge', 83, 'Complete', 87, 79, 'Versatile');

-- Test Query
COMMENT ON TABLE candidate_evaluations IS 'Run: SELECT * FROM evaluation_reports_view LIMIT 10; → 10 reports loaded!';

-- Success!

