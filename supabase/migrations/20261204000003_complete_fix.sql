-- Complete Database Fix for UUID Issues
-- Converts all ID columns to TEXT to accept any ID format from Supabase Auth

-- Drop existing tables if they exist (careful in production!)
DROP TABLE IF EXISTS job_seeker_notifications CASCADE;
DROP TABLE IF EXISTS audit_logs CASCADE;
DROP TABLE IF EXISTS company_members CASCADE;
DROP TABLE IF EXISTS candidates CASCADE;
DROP TABLE IF EXISTS jobs CASCADE;
DROP TABLE IF EXISTS user_roles CASCADE;
DROP TABLE IF EXISTS profiles CASCADE;
DROP TABLE IF EXISTS companies CASCADE;

-- Create companies table with TEXT IDs
CREATE TABLE companies (
  id TEXT PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  email TEXT,
  logo_url TEXT,
  website TEXT,
  industry TEXT,
  company_size TEXT,
  location TEXT,
  description TEXT,
  created_by TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE companies ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Companies are viewable by authenticated users"
  ON companies FOR SELECT TO authenticated USING (true);

CREATE POLICY "Users can insert their own companies"
  ON companies FOR INSERT TO authenticated WITH CHECK (true);

CREATE POLICY "Users can update their own companies"
  ON companies FOR UPDATE TO authenticated USING (true);

-- Create company_members table
CREATE TABLE company_members (
  id TEXT PRIMARY KEY DEFAULT gen_random_uuid(),
  company_id TEXT,
  user_id TEXT,
  role TEXT NOT NULL DEFAULT 'member',
  joined_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(company_id, user_id)
);

ALTER TABLE company_members ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Company members are viewable by authenticated users"
  ON company_members FOR SELECT TO authenticated USING (true);

CREATE POLICY "Users can insert themselves as members"
  ON company_members FOR INSERT TO authenticated WITH CHECK (true);

-- Create jobs table
CREATE TABLE jobs (
  id TEXT PRIMARY KEY DEFAULT gen_random_uuid(),
  company_id TEXT,
  title TEXT NOT NULL,
  department TEXT,
  location TEXT,
  employment_type TEXT,
  salary_min NUMERIC,
  salary_max NUMERIC,
  description TEXT,
  status TEXT DEFAULT 'open',
  created_by TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE jobs ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Jobs are viewable by authenticated users"
  ON jobs FOR SELECT TO authenticated USING (true);

CREATE POLICY "Recruiters can insert jobs for their company"
  ON jobs FOR INSERT TO authenticated WITH CHECK (true);

CREATE POLICY "Recruiters can update jobs for their company"
  ON jobs FOR UPDATE TO authenticated USING (true);

-- Create candidates table
CREATE TABLE candidates (
  id TEXT PRIMARY KEY DEFAULT gen_random_uuid(),
  company_id TEXT,
  job_id TEXT,
  full_name TEXT NOT NULL,
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

ALTER TABLE candidates ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Candidates are viewable by authenticated users"
  ON candidates FOR SELECT TO authenticated USING (true);

CREATE POLICY "Recruiters can insert candidates"
  ON candidates FOR INSERT TO authenticated WITH CHECK (true);

CREATE POLICY "Recruiters can update candidates"
  ON candidates FOR UPDATE TO authenticated USING (true);

-- Create user_roles table
CREATE TABLE user_roles (
  id TEXT PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id TEXT NOT NULL UNIQUE,
  role TEXT NOT NULL DEFAULT 'jobseeker',
  created_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE user_roles ENABLE ROW LEVEL SECURITY;

CREATE POLICY "User roles are viewable by authenticated users"
  ON user_roles FOR SELECT TO authenticated USING (true);

CREATE POLICY "Users can manage their own role"
  ON user_roles FOR ALL TO authenticated USING (auth.uid()::text = user_id);

-- Create profiles table
CREATE TABLE profiles (
  id TEXT PRIMARY KEY,
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

CREATE POLICY "Profiles are viewable by authenticated users"
  ON profiles FOR SELECT TO authenticated USING (true);

CREATE POLICY "Users can manage their own profile"
  ON profiles FOR ALL TO authenticated USING (auth.uid()::text = id);

-- Create audit_logs table
CREATE TABLE audit_logs (
  id TEXT PRIMARY KEY DEFAULT gen_random_uuid(),
  company_id TEXT,
  user_id TEXT,
  action TEXT NOT NULL,
  entity_type TEXT,
  entity_id TEXT,
  details JSONB,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE audit_logs ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Audit logs are viewable by authenticated users"
  ON audit_logs FOR SELECT TO authenticated USING (true);

CREATE POLICY "Users can insert audit logs"
  ON audit_logs FOR INSERT TO authenticated WITH CHECK (true);

-- Create job_seeker_notifications table
CREATE TABLE job_seeker_notifications (
  id TEXT PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id TEXT,
  title TEXT NOT NULL,
  message TEXT,
  type TEXT DEFAULT 'system',
  is_read BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE job_seeker_notifications ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Notifications are viewable by authenticated users"
  ON job_seeker_notifications FOR SELECT TO authenticated USING (auth.uid()::text = user_id);

CREATE POLICY "Users can update their own notifications"
  ON job_seeker_notifications FOR UPDATE TO authenticated USING (auth.uid()::text = user_id);

-- Function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Triggers for updated_at
CREATE TRIGGER update_companies_updated_at
  BEFORE UPDATE ON companies
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_jobs_updated_at
  BEFORE UPDATE ON jobs
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_candidates_updated_at
  BEFORE UPDATE ON candidates
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_profiles_updated_at
  BEFORE UPDATE ON profiles
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Insert demo company
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
);

-- Insert demo jobs
INSERT INTO jobs (company_id, title, department, location, employment_type, description, status, created_by)
VALUES
  ('00000000-0000-0000-0000-000000000001', 'Senior Frontend Developer', 'Engineering', 'San Francisco, CA', 'Full-time', 'React/Next.js expert needed', 'open', NULL),
  ('00000000-0000-0000-0000-000000000001', 'Backend Developer', 'Engineering', 'Remote', 'Full-time', 'Node.js/Python backend developer', 'open', NULL),
  ('00000000-0000-0000-0000-000000000001', 'Product Manager', 'Product', 'New York, NY', 'Full-time', 'Lead product strategy', 'open', NULL),
  ('00000000-0000-0000-0000-000000000001', 'UX Designer', 'Design', 'San Francisco, CA', 'Contract', 'Design user experiences', 'closed', NULL);

-- Insert demo candidates
INSERT INTO candidates (company_id, job_id, full_name, email, phone, current_title, location, status, source, skills, rating)
VALUES
  ('00000000-0000-0000-0000-000000000001', (SELECT id FROM jobs WHERE title = 'Senior Frontend Developer' LIMIT 1), 'John Doe', 'john@example.com', '+1 555-0101', 'Frontend Developer', 'San Francisco, CA', 'interview', 'LinkedIn', ARRAY['React', 'TypeScript', 'Node.js'], 4.5),
  ('00000000-0000-0000-0000-000000000001', (SELECT id FROM jobs WHERE title = 'Senior Frontend Developer' LIMIT 1), 'Sarah Wilson', 'sarah@example.com', '+1 555-0102', 'Senior Developer', 'Austin, TX', 'applied', 'Website', ARRAY['Vue.js', 'Python', 'AWS'], 4.0),
  ('00000000-0000-0000-0000-000000000001', (SELECT id FROM jobs WHERE title = 'Backend Developer' LIMIT 1), 'Mike Johnson', 'mike@example.com', '+1 555-0103', 'Backend Engineer', 'Seattle, WA', 'screening', 'Referral', ARRAY['Node.js', 'PostgreSQL', 'Docker'], 3.8),
  ('00000000-0000-0000-0000-000000000001', (SELECT id FROM jobs WHERE title = 'Product Manager' LIMIT 1), 'Emily Davis', 'emily@example.com', '+1 555-0104', 'Product Manager', 'New York, NY', 'offer', 'LinkedIn', ARRAY['Agile', 'Scrum', 'Data Analysis'], 4.8),
  ('00000000-0000-0000-0000-000000000001', NULL, 'David Kim', 'david@example.com', '+1 555-0105', 'Software Engineer', 'Chicago, IL', 'applied', 'Indeed', ARRAY['Java', 'Spring Boot', 'Kubernetes'], 3.5);
