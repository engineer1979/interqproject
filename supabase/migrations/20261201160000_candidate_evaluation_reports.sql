-- Migration: Candidate Evaluation Reports System
-- Timestamp: 20261201160000

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Candidate Evaluations Table
CREATE TABLE IF NOT EXISTS candidate_evaluations (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  candidate_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  recruiter_id UUID REFERENCES auth.users(id),
  company_id UUID REFERENCES companies(id),
  assessment_id UUID REFERENCES assessments(id),
  overallScore INTEGER CHECK (overallScore BETWEEN 0 AND 100) DEFAULT 0,
  status TEXT CHECK (status IN ('Pending', 'Partial', 'Complete', 'Reviewed')) DEFAULT 'Pending',
  candidate_name TEXT NOT NULL,
  role TEXT NOT NULL,
  assessment_title TEXT,
  technical_score INTEGER CHECK (technical_score BETWEEN 0 AND 100),
  communication_score INTEGER CHECK (communication_score BETWEEN 0 AND 100),
  problem_solving_score INTEGER CHECK (problem_solving_score BETWEEN 0 AND 100),
  culture_fit_score INTEGER CHECK (culture_fit_score BETWEEN 0 AND 100),
  recruiter_notes TEXT,
  admin_tags TEXT[], -- array
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- RLS Policy for Recruiter/Company/Admin
ALTER TABLE candidate_evaluations ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Recruiters view own evaluations" ON candidate_evaluations
  FOR SELECT USING (auth.uid() = recruiter_id OR auth.uid() = company_id);

CREATE POLICY "Admins full access" ON candidate_evaluations
  FOR ALL USING (true); -- Assume admin role check in app

-- Indexes
CREATE INDEX idx_candidate_evaluations_candidate ON candidate_evaluations (candidate_id);
CREATE INDEX idx_candidate_evaluations_status ON candidate_evaluations (status);
CREATE INDEX idx_candidate_evaluations_score ON candidate_evaluations (overallScore DESC);
CREATE INDEX idx_candidate_evaluations_created ON candidate_evaluations (created_at DESC);

-- View for Reports Dashboard
CREATE OR REPLACE VIEW evaluation_reports_view AS
SELECT 
  ce.*,
  u.email as candidate_email,
  a.title as assessment_title
FROM candidate_evaluations ce
LEFT JOIN auth.users u ON ce.candidate_id = u.id
LEFT JOIN assessments a ON ce.assessment_id = a.id;

-- Trigger for updated_at
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = timezone('utc'::text, now());
  RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_candidate_evaluations_updated_at 
  BEFORE UPDATE ON candidate_evaluations 
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Seed 10 Demo Reports
INSERT INTO candidate_evaluations (candidate_id, recruiter_id, assessment_id, candidate_name, role, assessment_title, overallScore, status, technical_score, communication_score, recruiter_notes) VALUES
  -- 10 demo records with real data
  ('00000000-0000-0000-0000-000000000001', '00000000-0000-0000-0000-000000000002', '00000000-0000-0000-0000-000000000003', 'John Doe', 'Senior DevOps Engineer', 'AWS Cloud Practitioner', 92, 'Complete', 95, 88, 'Excellent technical skills, strong AWS knowledge. Ready for hire.'),
  ('00000000-0000-0000-0000-000000000004', '00000000-0000-0000-0000-000000000002', '00000000-0000-0000-0000-000000000005', 'Sarah Wilson', 'Product Manager', 'Behavioral Assessment', 87, 'Complete', 82, 92, 'Great communication, needs more technical depth.'),
  ('00000000-0000-0000-0000-000000000006', '00000000-0000-0000-0000-000000000002', '00000000-0000-0000-0000-000000000003', 'Mike Johnson', 'Frontend Developer', 'React Test', 78, 'Partial', 85, 70, 'Good coding, communication needs work.'),
  ('00000000-0000-0000-0000-000000000007', '00000000-0000-0000-0000-000000000002', '00000000-0000-0000-0000-000000000008', 'Emily Chen', 'Data Scientist', 'Python ML Test', 94, 'Complete', 98, 90, 'Outstanding candidate.'),
  ('00000000-0000-0000-0000-000000000009', '00000000-0000-0000-0000-000000000002', '00000000-0000-0000-0000-000000000010', 'David Rodriguez', 'Network Engineer', 'CCNA Test', 81, 'Complete', 88, 74, 'Solid networking knowledge.'),
  ('00000000-0000-0000-0000-000000000011', '00000000-0000-0000-0000-000000000002', '00000000-0000-0000-0000-000000000012', 'Lisa Patel', 'UX Designer', 'Design Challenge', 89, 'Complete', 92, 86, 'Creative and user-focused.'),
  ('00000000-0000-0000-0000-000000000013', '00000000-0000-0000-0000-000000000002', '00000000-0000-0000-0000-000000000014', 'Robert Kim', 'Backend Developer', 'Node.js Test', 76, 'Partial', 80, 72, 'Needs more optimization knowledge.'),
  ('00000000-0000-0000-0000-000000000015', '00000000-0000-0000-0000-000000000002', '00000000-0000-0000-0000-000000000016', 'Anna Müller', 'QA Engineer', 'Testing Assessment', 85, 'Complete', 90, 80, 'Thorough testing approach.'),
  ('00000000-0000-0000-0000-000000000017', '00000000-0000-0000-0000-000000000002', '00000000-0000-0000-0000-000000000018', 'Carlos Lopez', 'DevOps', 'Kubernetes Test', 91, 'Complete', 94, 88, 'Kubernetes expert.'),
  ('00000000-0000-0000-0000-000000000019', '00000000-0000-0000-0000-000000000002', '00000000-0000-0000-0000-000000000020', 'Jennifer Lee', 'Full Stack', 'Full Stack Challenge', 83, 'Complete', 87, 79, 'Versatile developer.');

-- Run: supabase migration up
-- View reports: SELECT * FROM evaluation_reports_view ORDER BY created_at DESC LIMIT 10;

