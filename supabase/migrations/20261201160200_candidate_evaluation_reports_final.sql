-- FINAL Fixed Migration - No Concurrent Indexes, Transaction Safe
-- Standalone, No FK, 10 Data Records

CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Table (safe IF NOT)
CREATE TABLE IF NOT EXISTS candidate_evaluations (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  candidate_name TEXT NOT NULL,
  candidate_email TEXT,
  role TEXT NOT NULL,
  assessment_title TEXT DEFAULT 'General Assessment',
  overallScore INTEGER DEFAULT 0 CHECK (overallScore BETWEEN 0 AND 100),
  status TEXT DEFAULT 'Pending' CHECK (status IN ('Pending', 'Partial', 'Complete', 'Reviewed')),
  technical_score INTEGER DEFAULT 0,
  communication_score INTEGER DEFAULT 0,
  problem_solving_score INTEGER DEFAULT 0,
  culture_fit_score INTEGER DEFAULT 0,
  recruiter_notes TEXT DEFAULT '',
  recruiter_id UUID DEFAULT NULL,
  company_id UUID DEFAULT NULL,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- RLS safe
ALTER TABLE candidate_evaluations ENABLE ROW LEVEL SECURITY;

DO $$
BEGIN
  CREATE POLICY "recruiter access" ON candidate_evaluations
    FOR ALL USING (auth.uid()::text = recruiter_id::text OR auth.role() = 'service_role');
EXCEPTION WHEN duplicate_object THEN
  NULL;
END $$;

-- Indexes (regular, no concurrent)
DROP INDEX IF EXISTS idx_ce_status;
CREATE INDEX IF NOT EXISTS idx_ce_status ON candidate_evaluations(status);
DROP INDEX IF EXISTS idx_ce_score;
CREATE INDEX IF NOT EXISTS idx_ce_score ON candidate_evaluations(overallScore);
DROP INDEX IF EXISTS idx_ce_created;
CREATE INDEX IF NOT EXISTS idx_ce_created ON candidate_evaluations(created_at DESC);

-- View safe
DROP VIEW IF EXISTS evaluation_reports_view;
CREATE VIEW evaluation_reports_view AS SELECT * FROM candidate_evaluations;

-- Trigger safe
DROP FUNCTION IF EXISTS update_updated_at_column();
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS IF EXISTS update_candidate_evaluations_updated_at ON candidate_evaluations;
CREATE TRIGGER update_candidate_evaluations_updated_at 
  BEFORE UPDATE ON candidate_evaluations 
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Clear + Seed 10
DELETE FROM candidate_evaluations;
INSERT INTO candidate_evaluations (candidate_name, role, assessment_title, overallScore, status, technical_score, communication_score, recruiter_notes) VALUES
  ('John Doe', 'DevOps Engineer', 'AWS DevOps', 92, 'Complete', 95, 88, 'Hire now'),
  ('Sarah Wilson', 'Product Manager', 'Leadership', 87, 'Complete', 82, 92, 'Great PM'),
  ('Mike Johnson', 'Frontend Dev', 'React', 78, 'Partial', 85, 70, 'Comms work'),
  ('Emily Chen', 'Data Scientist', 'ML Python', 94, 'Complete', 98, 90, 'Top talent'),
  ('David Rodriguez', 'Network Engineer', 'CCNA', 81, 'Complete', 88, 74, 'Solid'),
  ('Lisa Patel', 'UX Designer', 'Design', 89, 'Complete', 92, 86, 'Creative'),
  ('Robert Kim', 'Backend Dev', 'Node.js', 76, 'Partial', 80, 72, 'Optimize'),
  ('Anna Müller', 'QA Engineer', 'Testing', 85, 'Complete', 90, 80, 'Reliable'),
  ('Carlos Lopez', 'DevOps', 'Kubernetes', 91, 'Complete', 94, 88, 'Expert'),
  ('Jennifer Lee', 'Full Stack', 'Full Stack', 83, 'Complete', 87, 79, 'Versatile');

-- Verify
SELECT COUNT(*) FROM candidate_evaluations; -- 10

COMMENT ON TABLE candidate_evaluations IS '✅ 10 evaluation reports seeded! View: evaluation_reports_view';

