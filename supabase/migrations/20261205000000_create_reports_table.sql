-- Reports Table Migration
-- Simple reports table for candidate evaluation reports

CREATE TABLE IF NOT EXISTS reports (
  id TEXT PRIMARY KEY DEFAULT gen_random_uuid(),
  candidate_name TEXT NOT NULL,
  candidate_email TEXT,
  job_id TEXT,
  job_title TEXT,
  score NUMERIC DEFAULT 0,
  max_score NUMERIC DEFAULT 100,
  status TEXT DEFAULT 'pending',
  interview_date TIMESTAMPTZ DEFAULT NOW(),
  generated_by TEXT,
  details JSONB,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE reports ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Reports are viewable by authenticated users" ON reports;
CREATE POLICY "Reports are viewable by authenticated users"
  ON reports FOR SELECT TO authenticated USING (true);

DROP POLICY IF EXISTS "Users can insert reports" ON reports;
CREATE POLICY "Users can insert reports"
  ON reports FOR INSERT TO authenticated WITH CHECK (true);

DROP POLICY IF EXISTS "Users can update reports" ON reports;
CREATE POLICY "Users can update reports"
  ON reports FOR UPDATE TO authenticated USING (true);

DROP POLICY IF EXISTS "Users can delete reports" ON reports;
CREATE POLICY "Users can delete reports"
  ON reports FOR DELETE TO authenticated USING (true);

CREATE OR REPLACE FUNCTION update_reports_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS update_reports_updated_at ON reports;
CREATE TRIGGER update_reports_updated_at
  BEFORE UPDATE ON reports
  FOR EACH ROW EXECUTE FUNCTION update_reports_updated_at();

-- Insert demo reports
INSERT INTO reports (id, candidate_name, candidate_email, job_title, score, max_score, status, interview_date, details)
VALUES
  (gen_random_uuid(), 'John Doe', 'john@example.com', 'Senior Frontend Developer', 85, 100, 'pass', NOW() - INTERVAL '5 days', '{"strengths": ["React", "TypeScript"], "weaknesses": ["CSS animations"]}'),
  (gen_random_uuid(), 'Sarah Wilson', 'sarah@example.com', 'Backend Developer', 72, 100, 'pass', NOW() - INTERVAL '3 days', '{"strengths": ["Node.js", "PostgreSQL"], "weaknesses": ["Testing"]}'),
  (gen_random_uuid(), 'Mike Johnson', 'mike@example.com', 'Product Manager', 45, 100, 'fail', NOW() - INTERVAL '2 days', '{"strengths": [], "weaknesses": ["Communication", "Leadership"]}'),
  (gen_random_uuid(), 'Emily Davis', 'emily@example.com', 'UX Designer', 91, 100, 'pass', NOW() - INTERVAL '1 day', '{"strengths": ["Figma", "User Research"], "weaknesses": []}'),
  (gen_random_uuid(), 'David Kim', 'david@example.com', 'Software Engineer', 68, 100, 'pass', NOW() - INTERVAL '6 hours', '{"strengths": ["Java", "Spring Boot"], "weaknesses": ["Documentation"]}');
