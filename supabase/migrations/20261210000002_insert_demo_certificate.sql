-- Insert Demo Certificate
-- First ensure we have a demo user, then insert certificate
DO $$
DECLARE
  demo_user_id UUID;
BEGIN
  -- Get or create demo user
  SELECT id INTO demo_user_id FROM auth.users WHERE email = 'demo@example.com' LIMIT 1;

  IF demo_user_id IS NULL THEN
    -- Insert demo user into auth.users (requires service role)
    INSERT INTO auth.users (id, email, encrypted_password, email_confirmed_at, raw_user_meta_data, created_at, updated_at)
    VALUES (
      gen_random_uuid(),
      'demo@example.com',
      crypt('demo123', gen_salt('bf')),
      NOW(),
      '{"full_name": "Demo Candidate"}',
      NOW(),
      NOW()
    )
    RETURNING id INTO demo_user_id;
  END IF;

  -- Insert demo certificate
  INSERT INTO certificates (user_id, name, title, assessment_score, interview_score, status, certificate_number)
  VALUES (
    demo_user_id,
    'Demo Candidate',
    'IT Technical Interview Certification',
    85,
    88,
    'issued',
    'CERT-DEMO-2026-001'
  )
  ON CONFLICT (certificate_number) DO NOTHING;
END $$;