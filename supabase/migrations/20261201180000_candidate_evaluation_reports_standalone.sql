-- Standalone Evaluation Reports Schema (No Dependencies)
-- Migration: 20261201180000_candidate_evaluation_reports_standalone.sql
-- Works without profiles table

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Candidates table (standalone)
CREATE TABLE IF NOT EXISTS candidate_evaluations (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  candidate_name VARCHAR(255) NOT NULL,
  candidate_email VARCHAR(255),
  position VARCHAR(255) NOT NULL,
  interviewer_name VARCHAR(255),
  interviewer_email VARCHAR(255),
  overall_score NUMERIC(3,2) CHECK (overall_score >= 0 AND overall_score <= 5) NOT NULL DEFAULT 0,
  status VARCHAR(50) DEFAULT 'pending' CHECK (status IN ('pending', 'advance', 'advance-reserve', 'reject')) NOT NULL,
  recommendation TEXT,
  interview_date DATE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 10 Features table
CREATE TABLE IF NOT EXISTS evaluation_features (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  report_id UUID REFERENCES candidate_evaluations(id) ON DELETE CASCADE NOT NULL,
  feature_name VARCHAR(100) NOT NULL,
  score NUMERIC(3,2) CHECK (score >= 0 AND score <= 5) NOT NULL DEFAULT 0,
  comments TEXT,
  weight NUMERIC(3,2) DEFAULT 1.0 CHECK (weight > 0),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Skip orphaned features insert (add later after candidates)
-- Standard 10 features will be inserted when reports are created

-- Basic indexes
CREATE INDEX IF NOT EXISTS idx_evaluations_status ON candidate_evaluations (status);
CREATE INDEX IF NOT EXISTS idx_evaluations_date ON candidate_evaluations (interview_date);
CREATE INDEX IF NOT EXISTS idx_features_report ON evaluation_features (report_id);

-- Update trigger
CREATE OR REPLACE FUNCTION update_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS update_evaluations_updated_at ON candidate_evaluations;
CREATE TRIGGER update_evaluations_updated_at BEFORE UPDATE ON candidate_evaluations 
FOR EACH ROW EXECUTE FUNCTION update_updated_at();

-- View: Complete reports with feature averages
CREATE OR REPLACE VIEW evaluation_reports_complete AS
SELECT 
  e.id,
  e.candidate_name,
  e.position,
  e.interviewer_name,
  e.overall_score,
  e.status,
  e.recommendation,
  e.interview_date,
  COUNT(f.id) as num_features,
  AVG(f.score) as avg_feature_score,
  SUM(f.score * f.weight) / SUM(f.weight) as weighted_score,
  STRING_AGG(f.feature_name || ': ' || f.score, '; ' ORDER BY f.feature_name) as features_summary
FROM candidate_evaluations e
LEFT JOIN evaluation_features f ON e.id = f.report_id
GROUP BY e.id;

-- Test data insert
INSERT INTO candidate_evaluations (candidate_name, position, interviewer_name, overall_score, status, recommendation, interview_date)
VALUES 
  ('John Doe', 'Senior React Developer', 'Sarah Admin', 4.5, 'advance', 'Strong candidate - hire immediately', '2024-12-01'),
  ('Mike Johnson', 'DevOps Engineer', 'Alex Manager', 3.8, 'advance-reserve', 'Good technical skills but needs behavioral coaching', '2024-11-28'),
  ('Lisa Chen', 'Data Scientist', 'John Recruiter', 2.9, 'reject', 'Lacking in problem-solving and cultural fit', '2024-11-25')
ON CONFLICT DO NOTHING;

-- Sample features
INSERT INTO evaluation_features (report_id, feature_name, score, comments, weight)
SELECT 
  (SELECT id FROM candidate_evaluations WHERE candidate_name = 'John Doe' LIMIT 1),
  unnest(ARRAY['Overall Score', 'Technical Skills', 'Behavioral Fit', 'Communication', 'Problem Solving']),
  (4.5 + random() * 0.5)::numeric(3,2),
  'Excellent in all areas',
  1.0
ON CONFLICT DO NOTHING;

COMMIT;

