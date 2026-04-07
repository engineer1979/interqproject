-- Insert Demo Certificate
INSERT INTO certificates (user_id, name, title, assessment_score, interview_score, status, certificate_number)
VALUES (
  (SELECT id FROM auth.users LIMIT 1),
  'Demo Candidate',
  'IT Technical Interview Certification',
  85,
  88,
  'issued',
  'CERT-DEMO-2026-001'
)
ON CONFLICT (certificate_number) DO NOTHING;