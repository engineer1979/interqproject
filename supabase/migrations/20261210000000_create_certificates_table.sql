-- Certificates Table Migration - Updated for Assessment + Interview Completion
-- Auto-generate certificate when candidate completes both assessment AND interview

DROP TABLE IF EXISTS certificates CASCADE;

CREATE TABLE certificates (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  name TEXT NOT NULL,
  title TEXT NOT NULL DEFAULT 'IT Technical Interview Certification',
  assessment_score INTEGER,
  interview_score INTEGER,
  status TEXT DEFAULT 'issued' CHECK (status IN ('pending', 'issued', 'revoked')),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  certificate_number TEXT UNIQUE DEFAULT 'CERT-' || UPPER(substr(md5(random()::text), 1, 8))
);

ALTER TABLE certificates ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own certificates" ON certificates
FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own certificates" ON certificates
FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE INDEX idx_certificates_user ON certificates(user_id);
CREATE INDEX idx_certificates_status ON certificates(status);

-- Function to generate certificate after assessment + interview completion
CREATE OR REPLACE FUNCTION generate_certificate_after_completion(
  p_user_id UUID,
  p_user_name TEXT,
  p_assessment_score INTEGER,
  p_interview_score INTEGER
)
RETURNS UUID
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  v_certificate_id UUID;
  v_passed BOOLEAN;
BEGIN
  -- Check if both assessment and interview are passed (score >= 70)
  v_passed := (p_assessment_score >= 70) AND (p_interview_score >= 70);
  
  IF NOT v_passed THEN
    RETURN NULL;
  END IF;
  
  -- Check if certificate already exists
  SELECT id INTO v_certificate_id
  FROM certificates
  WHERE user_id = p_user_id
  LIMIT 1;
  
  IF v_certificate_id IS NOT NULL THEN
    RETURN v_certificate_id;
  END IF;
  
  -- Generate new certificate
  INSERT INTO certificates (user_id, name, title, assessment_score, interview_score, status)
  VALUES (p_user_id, p_user_name, 'IT Technical Interview Certification', p_assessment_score, p_interview_score, 'issued')
  RETURNING id INTO v_certificate_id;
  
  RETURN v_certificate_id;
END;
$$;