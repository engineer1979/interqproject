-- Certificates Table Migration
-- For assessment and interview completion certificates

CREATE TABLE IF NOT EXISTS certificates (
  id TEXT PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id TEXT NOT NULL,
  type TEXT NOT NULL,
  related_id TEXT,
  assessment_name TEXT,
  interview_title TEXT,
  candidate_name TEXT NOT NULL,
  score INTEGER,
  proficiency_level TEXT,
  assessment_date TIMESTAMPTZ DEFAULT NOW(),
  valid_until TIMESTAMPTZ,
  certificate_number TEXT UNIQUE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE certificates ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Certificates viewable by owner" ON certificates;
CREATE POLICY "Certificates viewable by owner" ON certificates
  FOR SELECT TO authenticated USING (true);

DROP POLICY IF EXISTS "Certificates insertable by authenticated" ON certificates;
CREATE POLICY "Certificates insertable by authenticated" ON certificates
  FOR INSERT TO authenticated WITH CHECK (true);

DROP POLICY IF EXISTS "Certificates updatable by owner" ON certificates;
CREATE POLICY "Certificates updatable by owner" ON certificates
  FOR UPDATE TO authenticated USING (true);

CREATE OR REPLACE FUNCTION update_certificates_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS update_certificates_updated_at ON certificates;
CREATE TRIGGER update_certificates_updated_at
  BEFORE UPDATE ON certificates
  FOR EACH ROW EXECUTE FUNCTION update_certificates_updated_at();

-- Insert demo certificates
INSERT INTO certificates (user_id, type, related_id, assessment_name, candidate_name, score, proficiency_level, assessment_date, valid_until, certificate_number)
VALUES
  ('user-demo-1', 'assessment', NULL, 'JavaScript Fundamentals', 'John Doe', 85, 'Proficient', NOW() - INTERVAL '10 days', NOW() + INTERVAL '355 days', 'CERT-JS-2024-001'),
  ('user-demo-1', 'assessment', NULL, 'React Proficiency Test', 'John Doe', 92, 'Advanced', NOW() - INTERVAL '5 days', NOW() + INTERVAL '360 days', 'CERT-REACT-2024-001'),
  ('user-demo-1', 'interview', NULL, 'Technical Interview - Frontend', 'John Doe', 88, 'Proficient', NOW() - INTERVAL '3 days', NULL, 'CERT-INT-2024-001'),
  ('user-demo-2', 'assessment', NULL, 'Problem Solving Test', 'Sarah Wilson', 78, 'Proficient', NOW() - INTERVAL '7 days', NOW() + INTERVAL '358 days', 'CERT-PS-2024-001'),
  ('user-demo-2', 'interview', NULL, 'Behavioral Interview', 'Sarah Wilson', 95, 'Advanced', NOW() - INTERVAL '1 day', NULL, 'CERT-INT-2024-002');
