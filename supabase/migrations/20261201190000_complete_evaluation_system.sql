-- Complete Candidate Evaluation Reports Database Schema
-- Supabase Migration Script

-- Create enum types
CREATE TYPE evaluation_status AS ENUM ('pending', 'advance', 'advance_reserve', 'reject');
CREATE TYPE feature_category AS ENUM ('technical', 'behavioral', 'interview', 'soft_skills');

-- Candidate Profiles Table
CREATE TABLE candidate_profiles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  full_name TEXT NOT NULL,
  email TEXT UNIQUE NOT NULL,
  phone TEXT,
  current_title TEXT,
  location TEXT,
  avatar_url TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Jobs Table (for reference)
CREATE TABLE jobs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  department TEXT,
  company_id UUID,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Evaluation Reports Table
CREATE TABLE evaluation_reports (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  candidate_id UUID REFERENCES candidate_profiles(id) ON DELETE CASCADE,
  job_id UUID REFERENCES jobs(id) ON DELETE SET NULL,
  interviewer_id UUID REFERENCES auth.users(id),
  
  -- Basic Info
  position_applied TEXT NOT NULL,
  interviewer_name TEXT NOT NULL,
  interview_date DATE NOT NULL,
  
  -- Overall Score (calculated)
  overall_score DECIMAL(5,2) DEFAULT 0,
  overall_score_max DECIMAL(5,2) DEFAULT 100,
  
  -- Status
  status evaluation_status DEFAULT 'pending',
  
  -- Scores (individual components)
  technical_score DECIMAL(5,2) DEFAULT 0,
  technical_max DECIMAL(5,2) DEFAULT 5,
  behavioral_score DECIMAL(5,2) DEFAULT 0,
  behavioral_max DECIMAL(5,2) DEFAULT 5,
  communication_score DECIMAL(5,2) DEFAULT 0,
  communication_max DECIMAL(5,2) DEFAULT 5,
  problem_solving_score DECIMAL(5,2) DEFAULT 0,
  problem_solving_max DECIMAL(5,2) DEFAULT 5,
  cultural_fit_score DECIMAL(5,2) DEFAULT 0,
  cultural_fit_max DECIMAL(5,2) DEFAULT 5,
  experience_score DECIMAL(5,2) DEFAULT 0,
  experience_max DECIMAL(5,2) DEFAULT 5,
  
  -- Detailed Features (JSONB for flexibility)
  features JSONB DEFAULT '[]'::jsonb,
  
  -- Recommendation
  recommendation TEXT,
  final_comments TEXT,
  
  -- Timestamps
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  
  -- Soft delete
  deleted_at TIMESTAMPTZ
);

-- Feature Scores Table (for detailed tracking)
CREATE TABLE evaluation_features (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  report_id UUID REFERENCES evaluation_reports(id) ON DELETE CASCADE,
  feature_name TEXT NOT NULL,
  score DECIMAL(5,2) DEFAULT 0,
  max_score DECIMAL(5,2) DEFAULT 5,
  comments TEXT,
  category feature_category DEFAULT 'technical',
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Interview Rounds Table
CREATE TABLE interview_rounds (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  report_id UUID REFERENCES evaluation_reports(id) ON DELETE CASCADE,
  round_number INTEGER NOT NULL,
  interviewer_name TEXT NOT NULL,
  interview_date DATE,
  duration TEXT,
  feedback JSONB DEFAULT '{}',
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Strengths & Weaknesses Table
CREATE TABLE evaluation_strengths_weaknesses (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  report_id UUID REFERENCES evaluation_reports(id) ON DELETE CASCADE,
  type TEXT CHECK (type IN ('strength', 'weakness')),
  description TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Activity Logs for Real-time Updates
CREATE TABLE evaluation_activity_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  report_id UUID REFERENCES evaluation_reports(id) ON DELETE CASCADE,
  user_id UUID REFERENCES auth.users(id),
  action TEXT NOT NULL,
  old_value TEXT,
  new_value TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create indexes for better performance
CREATE INDEX idx_reports_candidate ON evaluation_reports(candidate_id);
CREATE INDEX idx_reports_status ON evaluation_reports(status);
CREATE INDEX idx_reports_interview_date ON evaluation_reports(interview_date);
CREATE INDEX idx_reports_created ON evaluation_reports(created_at);
CREATE INDEX idx_features_report ON evaluation_features(report_id);

-- Enable Row Level Security
ALTER TABLE candidate_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE evaluation_reports ENABLE ROW LEVEL SECURITY;
ALTER TABLE evaluation_features ENABLE ROW LEVEL SECURITY;
ALTER TABLE interview_rounds ENABLE ROW LEVEL SECURITY;
ALTER TABLE evaluation_strengths_weaknesses ENABLE ROW LEVEL SECURITY;
ALTER TABLE evaluation_activity_logs ENABLE ROW LEVEL SECURITY;

-- RLS Policies for Candidate Profiles
CREATE POLICY "Public profiles are viewable by authenticated users"
  ON candidate_profiles FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Users can insert own profile"
  ON candidate_profiles FOR INSERT
  TO authenticated
  WITH CHECK (true);

CREATE POLICY "Users can update own profile"
  ON candidate_profiles FOR UPDATE
  TO authenticated
  USING (true);

-- RLS Policies for Evaluation Reports
CREATE POLICY "Reports viewable by authenticated users"
  ON evaluation_reports FOR SELECT
  TO authenticated
  USING (deleted_at IS NULL);

CREATE POLICY "Recruiters can insert reports"
  ON evaluation_reports FOR INSERT
  TO authenticated
  WITH CHECK (true);

CREATE POLICY "Recruiters can update reports"
  ON evaluation_reports FOR UPDATE
  TO authenticated
  USING (true);

CREATE POLICY "Admins can delete reports"
  ON evaluation_reports FOR DELETE
  TO authenticated
  USING (true);

-- Function to automatically update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Triggers for updated_at
CREATE TRIGGER update_evaluation_reports_updated_at
  BEFORE UPDATE ON evaluation_reports
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_candidate_profiles_updated_at
  BEFORE UPDATE ON candidate_profiles
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- Function to log activity
CREATE OR REPLACE FUNCTION log_evaluation_activity(
  p_report_id UUID,
  p_user_id UUID,
  p_action TEXT,
  p_old_value TEXT DEFAULT NULL,
  p_new_value TEXT DEFAULT NULL
)
RETURNS UUID AS $$
DECLARE
  v_log_id UUID;
BEGIN
  INSERT INTO evaluation_activity_logs (report_id, user_id, action, old_value, new_value)
  VALUES (p_report_id, p_user_id, p_action, p_old_value, p_new_value)
  RETURNING id INTO v_log_id;
  
  RETURN v_log_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to calculate overall score
-- Formula: (Technical * 0.4) + (Behavioral * 0.2) + (Communication * 0.2) + (Problem Solving * 0.2)
CREATE OR REPLACE FUNCTION calculate_overall_score(
  p_technical DECIMAL,
  p_behavioral DECIMAL,
  p_communication DECIMAL,
  p_problem_solving DECIMAL
)
RETURNS DECIMAL AS $$
DECLARE
  v_technical_norm DECIMAL;
  v_behavioral_norm DECIMAL;
  v_communication_norm DECIMAL;
  v_problem_norm DECIMAL;
BEGIN
  -- Normalize scores to 100 scale
  v_technical_norm := (p_technical / 5) * 100;
  v_behavioral_norm := (p_behavioral / 5) * 100;
  v_communication_norm := (p_communication / 5) * 100;
  v_problem_norm := (p_problem_solving / 5) * 100;
  
  -- Calculate weighted overall
  RETURN (v_technical_norm * 0.4) + 
         (v_behavioral_norm * 0.2) + 
         (v_communication_norm * 0.2) + 
         (v_problem_norm * 0.2);
END;
$$ LANGUAGE plpgsql;

-- Function to determine status based on score
-- >= 80: advance, 60-79: advance_reserve, < 60: reject
CREATE OR REPLACE FUNCTION determine_evaluation_status(p_score DECIMAL)
RETURNS evaluation_status AS $$
BEGIN
  IF p_score >= 80 THEN
    RETURN 'advance';
  ELSIF p_score >= 60 THEN
    RETURN 'advance_reserve';
  ELSE
    RETURN 'reject';
  END IF;
END;
$$ LANGUAGE plpgsql;

-- Function to auto-update status when score changes
CREATE OR REPLACE FUNCTION update_report_status()
RETURNS TRIGGER AS $$
DECLARE
  v_overall DECIMAL;
BEGIN
  -- Calculate overall score
  v_overall := calculate_overall_score(
    COALESCE(NEW.technical_score, 0),
    COALESCE(NEW.behavioral_score, 0),
    COALESCE(NEW.communication_score, 0),
    COALESCE(NEW.problem_solving_score, 0)
  );
  
  -- Update overall score
  NEW.overall_score := v_overall;
  
  -- Auto-update status based on new score
  NEW.status := determine_evaluation_status(v_overall);
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger to auto-update status
CREATE TRIGGER auto_update_report_status
  BEFORE UPDATE ON evaluation_reports
  FOR EACH ROW
  EXECUTE FUNCTION update_report_status();

-- View for combined report data (for easier querying)
CREATE OR REPLACE VIEW evaluation_reports_with_details AS
SELECT 
  er.*,
  cp.full_name,
  cp.email,
  cp.avatar_url,
  j.title as job_title,
  j.department as job_department,
  (
    SELECT json_agg(json_build_object(
      'feature', feature_name,
      'score', score,
      'max_score', max_score,
      'comments', comments,
      'category', category
    ))
    FROM evaluation_features ef
    WHERE ef.report_id = er.id
  ) as features_list,
  (
    SELECT json_agg(json_build_object(
      'type', type,
      'description', description
    ))
    FROM evaluation_strengths_weaknesses esw
    WHERE esw.report_id = er.id
  ) as strengths_weaknesses_list
FROM evaluation_reports er
LEFT JOIN candidate_profiles cp ON er.candidate_id = cp.id
LEFT JOIN jobs j ON er.job_id = j.id
WHERE er.deleted_at IS NULL;

-- Insert sample data for testing
INSERT INTO candidate_profiles (id, full_name, email, phone, current_title, location)
VALUES 
  ('a1b2c3d4-e5f6-7890-abcd-ef1234567890', 'John Doe', 'john.doe@tech.com', '+1 555-0123', 'Senior Frontend Developer', 'San Francisco, CA'),
  ('b2c3d4e5-f6a7-8901-bcde-f23456789012', 'Sarah Wilson', 'sarah.wilson@cloud.com', '+1 555-0124', 'DevOps Engineer', 'Austin, TX'),
  ('c3d4e5f6-a7b8-9012-cdef-345678901234', 'Mike Johnson', 'mike.j@startup.io', '+1 555-0125', 'Backend Developer', 'Seattle, WA'),
  ('d4e5f6a7-b8c9-0123-defa-456789012345', 'Emily Davis', 'emily.d@enterprise.com', '+1 555-0126', 'Data Analyst', 'New York, NY');

INSERT INTO jobs (id, title, department, company_id)
VALUES 
  ('f5a6b7c8-d9e0-1234-efab-567890123456', 'Senior Frontend Developer', 'Engineering', NULL),
  ('a6b7c8d9-e0f1-2345-fabc-678901234567', 'DevOps Engineer', 'Engineering', NULL),
  ('b7c8d9e0-f1a2-3456-abcd-789012345678', 'Backend Developer', 'Engineering', NULL);

INSERT INTO evaluation_reports (candidate_id, job_id, position_applied, interviewer_name, interview_date, technical_score, behavioral_score, communication_score, problem_solving_score, cultural_fit_score, experience_score)
VALUES 
  ('a1b2c3d4-e5f6-7890-abcd-ef1234567890', 'f5a6b7c8-d9e0-1234-efab-567890123456', 'Senior Frontend Developer', 'Jane Smith', '2025-01-15', 5, 4, 4, 5, 4, 4),
  ('b2c3d4e5-f6a7-8901-bcde-f23456789012', 'a6b7c8d9-e0f1-2345-fabc-678901234567', 'DevOps Engineer', 'Bob Wilson', '2025-01-14', 5, 3, 3, 4, 3, 4),
  ('c3d4e5f6-a7b8-9012-cdef-345678901234', 'b7c8d9e0-f1a2-3456-abcd-789012345678', 'Backend Developer', 'Alice Brown', '2025-01-13', 3, 2, 3, 2, 4, 2);

INSERT INTO evaluation_features (report_id, feature_name, score, max_score, comments, category)
SELECT 
  er.id,
  'Technical Skills',
  5,
  5,
  'React/Next.js expert',
  'technical'
FROM evaluation_reports er WHERE er.position_applied = 'Senior Frontend Developer';

INSERT INTO evaluation_strengths_weaknesses (report_id, type, description)
SELECT er.id, 'strength', 'Excellent problem-solving abilities'
FROM evaluation_reports er WHERE er.position_applied = 'Senior Frontend Developer';
