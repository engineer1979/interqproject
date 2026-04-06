-- Create candidate evaluation reports table with 10 features
-- Migration: 20261201170000_candidate_evaluation_reports.sql

-- Enable UUID extension if not already enabled
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Main evaluation reports table
CREATE TABLE IF NOT EXISTS candidate_evaluation_reports (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  candidate_id UUID REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
  interviewer_id UUID REFERENCES profiles(id) ON DELETE SET NULL,
  position VARCHAR(255) NOT NULL,
  overall_score NUMERIC(3,2) CHECK (overall_score >= 0 AND overall_score <= 5) NOT NULL,
  status VARCHAR(50) DEFAULT 'pending' CHECK (status IN ('pending', 'advance', 'advance-reserve', 'reject')) NOT NULL,
  recommendation TEXT,
  
  -- Timestamps
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  interview_date DATE,
  
  -- Audit
  created_by UUID REFERENCES profiles(id),
  updated_by UUID REFERENCES profiles(id)
);

-- Individual feature scores (normalized)
CREATE TABLE IF NOT EXISTS evaluation_features (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  report_id UUID REFERENCES candidate_evaluation_reports(id) ON DELETE CASCADE NOT NULL,
  feature_name VARCHAR(100) NOT NULL,
  score NUMERIC(3,2) CHECK (score >= 0 AND score <= 5) NOT NULL,
  comments TEXT,
  category VARCHAR(20) CHECK (category IN ('technical', 'behavioral', 'interview')) NOT NULL,
  
  UNIQUE(report_id, feature_name)
);

-- Standard 10 features (reference table for consistency)
CREATE TABLE evaluation_feature_definitions (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  name VARCHAR(100) UNIQUE NOT NULL,
  category VARCHAR(20) CHECK (category IN ('technical', 'behavioral', 'interview')) NOT NULL,
  description TEXT,
  weight NUMERIC(3,2) DEFAULT 1.0 CHECK (weight > 0)
);

-- Insert standard 10 features
INSERT INTO evaluation_feature_definitions (name, category, description, weight) VALUES
  ('Overall Score', 'interview', 'Holistic assessment score', 1.0),
  ('Technical Skills', 'technical', 'Domain-specific technical competency', 1.2),
  ('Behavioral Fit', 'behavioral', 'Alignment with company values and behaviors', 1.1),
  ('Communication Skills', 'interview', 'Clarity, conciseness, and effectiveness', 1.0),
  ('Problem Solving', 'technical', 'Analytical thinking and solution design', 1.2),
  ('Cultural Fit', 'behavioral', 'Team compatibility and organizational alignment', 1.1),
  ('Experience Match', 'technical', 'Relevance of past experience to role requirements', 1.0),
  ('Growth Potential', 'behavioral', 'Long-term development capacity', 1.0),
  ('Team Collaboration', 'behavioral', 'Ability to work effectively with others', 1.0),
  ('Recommendation', 'interview', 'Final hiring recommendation', 1.0)
ON CONFLICT (name) DO NOTHING;

-- RLS policies
ALTER TABLE candidate_evaluation_reports ENABLE ROW LEVEL SECURITY;
ALTER TABLE evaluation_features ENABLE ROW LEVEL SECURITY;

-- Recruiters can view/create their own reports
CREATE POLICY "Recruiters can manage own reports" ON candidate_evaluation_reports
  FOR ALL USING (auth.uid() = interviewer_id OR auth.uid() = created_by);

CREATE POLICY "Recruiters can manage own features" ON evaluation_features
  FOR ALL USING (EXISTS (SELECT 1 FROM candidate_evaluation_reports WHERE id = report_id AND (auth.uid() = interviewer_id OR auth.uid() = created_by)));

-- Admins/Companies can view all
CREATE POLICY "Admins view all reports" ON candidate_evaluation_reports
  FOR SELECT USING ((SELECT role FROM profiles WHERE id = auth.uid()) IN ('admin', 'company'));

CREATE POLICY "Admins view all features" ON evaluation_features
  FOR SELECT USING (
    EXISTS (SELECT 1 FROM candidate_evaluation_reports WHERE id = report_id AND 
      (SELECT role FROM profiles WHERE id = auth.uid()) IN ('admin', 'company'))
  );

-- Indexes
CREATE INDEX idx_candidate_evaluation_reports_candidate_id ON candidate_evaluation_reports (candidate_id);
CREATE INDEX idx_candidate_evaluation_reports_status ON candidate_evaluation_reports (status);
CREATE INDEX idx_candidate_evaluation_reports_interview_date ON candidate_evaluation_reports (interview_date);
CREATE INDEX idx_evaluation_features_report_id ON evaluation_features (report_id);
CREATE INDEX idx_evaluation_features_feature_name ON evaluation_features (feature_name);

-- Trigger for updated_at
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_candidate_evaluation_reports_updated_at BEFORE UPDATE
  ON candidate_evaluation_reports FOR EACH ROW EXECUTE PROCEDURE update_updated_at_column();

-- View for easy querying
CREATE OR REPLACE VIEW candidate_evaluation_summary AS
  SELECT 
    r.id,
    r.candidate_id,
    p.name as candidate_name,
    r.position,
    r.overall_score,
    r.status,
    r.recommendation,
    r.interview_date,
    COUNT(f.id) as feature_count,
    AVG(f.score) as avg_feature_score,
    r.created_at
  FROM candidate_evaluation_reports r
  LEFT JOIN profiles p ON r.candidate_id = p.id
  LEFT JOIN evaluation_features f ON r.id = f.report_id
  GROUP BY r.id, p.name;

-- RPC for recruiter notes
CREATE OR REPLACE FUNCTION add_recruiter_note(report_id UUID, notes TEXT)
RETURNS candidate_evaluation_reports
LANGUAGE plpgsql SECURITY DEFINER AS $$
BEGIN
  UPDATE candidate_evaluation_reports 
  SET recommendation = notes, updated_by = auth.uid()
  WHERE id = report_id AND (auth.uid() = interviewer_id OR (SELECT role FROM profiles WHERE id = auth.uid()) = 'admin');
  
  RETURN (SELECT * FROM candidate_evaluation_reports WHERE id = report_id);
END;
$$;

COMMENT ON FUNCTION add_recruiter_note IS 'Add recruiter notes to evaluation report';

COMMIT;

