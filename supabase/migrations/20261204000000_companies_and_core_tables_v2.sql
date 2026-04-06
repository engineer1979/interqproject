-- Companies and Core Tables Migration
-- Handles existing tables by adding columns only if missing

-- Create companies table (if not exists)
CREATE TABLE IF NOT EXISTS companies (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  email TEXT,
  logo_url TEXT,
  website TEXT,
  industry TEXT,
  company_size TEXT,
  location TEXT,
  description TEXT,
  created_by UUID,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable RLS on companies
ALTER TABLE companies ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Companies are viewable by authenticated users" ON companies;
CREATE POLICY "Companies are viewable by authenticated users"
  ON companies FOR SELECT TO authenticated USING (true);

DROP POLICY IF EXISTS "Users can insert their own companies" ON companies;
CREATE POLICY "Users can insert their own companies"
  ON companies FOR INSERT TO authenticated WITH CHECK (auth.uid() = created_by);

DROP POLICY IF EXISTS "Users can update their own companies" ON companies;
CREATE POLICY "Users can update their own companies"
  ON companies FOR UPDATE TO authenticated USING (auth.uid() = created_by);

-- Create company_members table
CREATE TABLE IF NOT EXISTS company_members (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  company_id UUID,
  user_id UUID,
  role TEXT NOT NULL DEFAULT 'member',
  joined_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(company_id, user_id)
);

ALTER TABLE company_members ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Company members are viewable by authenticated users" ON company_members;
CREATE POLICY "Company members are viewable by authenticated users"
  ON company_members FOR SELECT TO authenticated USING (true);

DROP POLICY IF EXISTS "Users can insert themselves as members" ON company_members;
CREATE POLICY "Users can insert themselves as members"
  ON company_members FOR INSERT TO authenticated WITH CHECK (auth.uid() = user_id);

-- Create jobs table
CREATE TABLE IF NOT EXISTS jobs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  company_id UUID,
  title TEXT NOT NULL,
  department TEXT,
  location TEXT,
  employment_type TEXT,
  salary_min NUMERIC,
  salary_max NUMERIC,
  description TEXT,
  status TEXT DEFAULT 'open',
  created_by UUID,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE jobs ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Jobs are viewable by authenticated users" ON jobs;
CREATE POLICY "Jobs are viewable by authenticated users"
  ON jobs FOR SELECT TO authenticated USING (true);

DROP POLICY IF EXISTS "Recruiters can insert jobs for their company" ON jobs;
CREATE POLICY "Recruiters can insert jobs for their company"
  ON jobs FOR INSERT TO authenticated WITH CHECK (auth.uid() = created_by);

DROP POLICY IF EXISTS "Recruiters can update jobs for their company" ON jobs;
CREATE POLICY "Recruiters can update jobs for their company"
  ON jobs FOR UPDATE TO authenticated USING (auth.uid() = created_by);

-- Create candidates table (base columns only)
CREATE TABLE IF NOT EXISTS candidates (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  full_name TEXT,
  email TEXT,
  phone TEXT,
  current_title TEXT,
  location TEXT,
  status TEXT DEFAULT 'applied',
  source TEXT,
  skills TEXT[],
  rating NUMERIC DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Add company_id and job_id to candidates if not exists
DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'candidates' AND column_name = 'company_id') THEN
    ALTER TABLE candidates ADD COLUMN company_id UUID;
  END IF;
END $$;

DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'candidates' AND column_name = 'job_id') THEN
    ALTER TABLE candidates ADD COLUMN job_id UUID;
  END IF;
END $$;

ALTER TABLE candidates ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Candidates are viewable by authenticated users" ON candidates;
CREATE POLICY "Candidates are viewable by authenticated users"
  ON candidates FOR SELECT TO authenticated USING (true);

DROP POLICY IF EXISTS "Recruiters can insert candidates" ON candidates;
CREATE POLICY "Recruiters can insert candidates"
  ON candidates FOR INSERT TO authenticated WITH CHECK (true);

DROP POLICY IF EXISTS "Recruiters can update candidates" ON candidates;
CREATE POLICY "Recruiters can update candidates"
  ON candidates FOR UPDATE TO authenticated USING (true);

-- Create user_roles table
CREATE TABLE IF NOT EXISTS user_roles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID,
  role TEXT NOT NULL DEFAULT 'jobseeker',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(user_id)
);

ALTER TABLE user_roles ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "User roles are viewable by authenticated users" ON user_roles;
CREATE POLICY "User roles are viewable by authenticated users"
  ON user_roles FOR SELECT TO authenticated USING (true);

DROP POLICY IF EXISTS "Users can manage their own role" ON user_roles;
CREATE POLICY "Users can manage their own role"
  ON user_roles FOR ALL TO authenticated USING (auth.uid() = user_id);

-- Create profiles table
CREATE TABLE IF NOT EXISTS profiles (
  id UUID PRIMARY KEY,
  email TEXT,
  full_name TEXT,
  avatar_url TEXT,
  role TEXT DEFAULT 'jobseeker',
  company_name TEXT,
  phone TEXT,
  location TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Profiles are viewable by authenticated users" ON profiles;
CREATE POLICY "Profiles are viewable by authenticated users"
  ON profiles FOR SELECT TO authenticated USING (true);

DROP POLICY IF EXISTS "Users can manage their own profile" ON profiles;
CREATE POLICY "Users can manage their own profile"
  ON profiles FOR ALL TO authenticated USING (auth.uid() = id);

-- Create audit_logs table
CREATE TABLE IF NOT EXISTS audit_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  company_id UUID,
  user_id UUID,
  action TEXT NOT NULL,
  entity_type TEXT,
  entity_id UUID,
  details JSONB,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE audit_logs ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Audit logs are viewable by authenticated users" ON audit_logs;
CREATE POLICY "Audit logs are viewable by authenticated users"
  ON audit_logs FOR SELECT TO authenticated USING (true);

DROP POLICY IF EXISTS "Users can insert audit logs" ON audit_logs;
CREATE POLICY "Users can insert audit logs"
  ON audit_logs FOR INSERT TO authenticated WITH CHECK (true);

-- Create job_seeker_notifications table
CREATE TABLE IF NOT EXISTS job_seeker_notifications (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID,
  title TEXT NOT NULL,
  message TEXT,
  type TEXT DEFAULT 'system',
  is_read BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE job_seeker_notifications ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Notifications are viewable by authenticated users" ON job_seeker_notifications;
CREATE POLICY "Notifications are viewable by authenticated users"
  ON job_seeker_notifications FOR SELECT TO authenticated USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can update their own notifications" ON job_seeker_notifications;
CREATE POLICY "Users can update their own notifications"
  ON job_seeker_notifications FOR UPDATE TO authenticated USING (auth.uid() = user_id);

-- Function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Triggers for updated_at
DROP TRIGGER IF EXISTS update_companies_updated_at ON companies;
CREATE TRIGGER update_companies_updated_at
  BEFORE UPDATE ON companies
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_jobs_updated_at ON jobs;
CREATE TRIGGER update_jobs_updated_at
  BEFORE UPDATE ON jobs
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_candidates_updated_at ON candidates;
CREATE TRIGGER update_candidates_updated_at
  BEFORE UPDATE ON candidates
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_profiles_updated_at ON profiles;
CREATE TRIGGER update_profiles_updated_at
  BEFORE UPDATE ON profiles
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Insert demo company for testing
INSERT INTO companies (id, name, email, industry, company_size, location, website, description, created_by)
VALUES (
  '00000000-0000-0000-0000-000000000001',
  'TechCorp Solutions',
  'contact@techcorp.com',
  'Technology',
  '500-1000',
  'San Francisco, CA',
  'https://techcorp.com',
  'Leading technology solutions provider',
  NULL
) ON CONFLICT (id) DO NOTHING;

-- Insert demo jobs
INSERT INTO jobs (company_id, title, department, location, employment_type, description, status, created_by)
VALUES
  ('00000000-0000-0000-0000-000000000001', 'Senior Frontend Developer', 'Engineering', 'San Francisco, CA', 'Full-time', 'React/Next.js expert needed', 'open', NULL),
  ('00000000-0000-0000-0000-000000000001', 'Backend Developer', 'Engineering', 'Remote', 'Full-time', 'Node.js/Python backend developer', 'open', NULL),
  ('00000000-0000-0000-0000-000000000001', 'Product Manager', 'Product', 'New York, NY', 'Full-time', 'Lead product strategy', 'open', NULL),
  ('00000000-0000-0000-0000-000000000001', 'UX Designer', 'Design', 'San Francisco, CA', 'Contract', 'Design user experiences', 'closed', NULL)
ON CONFLICT DO NOTHING;

-- Insert demo candidates
INSERT INTO candidates (company_id, job_id, full_name, email, phone, current_title, location, status, source, skills, rating)
VALUES
  ('00000000-0000-0000-0000-000000000001', (SELECT id FROM jobs WHERE title = 'Senior Frontend Developer' LIMIT 1), 'John Doe', 'john@example.com', '+1 555-0101', 'Frontend Developer', 'San Francisco, CA', 'interview', 'LinkedIn', ARRAY['React', 'TypeScript', 'Node.js'], 4.5),
  ('00000000-0000-0000-0000-000000000001', (SELECT id FROM jobs WHERE title = 'Senior Frontend Developer' LIMIT 1), 'Sarah Wilson', 'sarah@example.com', '+1 555-0102', 'Senior Developer', 'Austin, TX', 'applied', 'Website', ARRAY['Vue.js', 'Python', 'AWS'], 4.0),
  ('00000000-0000-0000-0000-000000000001', (SELECT id FROM jobs WHERE title = 'Backend Developer' LIMIT 1), 'Mike Johnson', 'mike@example.com', '+1 555-0103', 'Backend Engineer', 'Seattle, WA', 'screening', 'Referral', ARRAY['Node.js', 'PostgreSQL', 'Docker'], 3.8),
  ('00000000-0000-0000-0000-000000000001', (SELECT id FROM jobs WHERE title = 'Product Manager' LIMIT 1), 'Emily Davis', 'emily@example.com', '+1 555-0104', 'Product Manager', 'New York, NY', 'offer', 'LinkedIn', ARRAY['Agile', 'Scrum', 'Data Analysis'], 4.8),
  ('00000000-0000-0000-0000-000000000001', NULL, 'David Kim', 'david@example.com', '+1 555-0105', 'Software Engineer', 'Chicago, IL', 'applied', 'Indeed', ARRAY['Java', 'Spring Boot', 'Kubernetes'], 3.5)
ON CONFLICT DO NOTHING;
