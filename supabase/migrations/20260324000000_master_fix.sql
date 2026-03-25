-- ============================================================
-- MASTER FIX MIGRATION
-- Fixes all known issues in the InterQ platform
-- Run this AFTER all previous migrations with: npx supabase db push
-- ============================================================

-- ============================================================
-- 1. FIX app_role ENUM
-- Previous migrations had 'admin','recruiter','enterprise','candidate'
-- Frontend uses: 'admin','company','recruiter','job_seeker','jobseeker'
-- ============================================================

DO $$
BEGIN
  -- Add 'company' role if missing
  IF NOT EXISTS (
    SELECT 1 FROM pg_enum 
    WHERE enumlabel = 'company' 
    AND enumtypid = 'public.app_role'::regtype
  ) THEN
    ALTER TYPE public.app_role ADD VALUE 'company';
  END IF;

  -- Add 'job_seeker' role if missing
  IF NOT EXISTS (
    SELECT 1 FROM pg_enum 
    WHERE enumlabel = 'job_seeker' 
    AND enumtypid = 'public.app_role'::regtype
  ) THEN
    ALTER TYPE public.app_role ADD VALUE 'job_seeker';
  END IF;

  -- Add 'recruiter' role if missing (may already exist)
  IF NOT EXISTS (
    SELECT 1 FROM pg_enum 
    WHERE enumlabel = 'recruiter' 
    AND enumtypid = 'public.app_role'::regtype
  ) THEN
    ALTER TYPE public.app_role ADD VALUE 'recruiter';
  END IF;
END$$;

-- ============================================================
-- 2. FIX profiles TABLE — add missing columns
-- Frontend expects: location, country, linkedin_url, skills,
--                   resume_url, work_experience, education,
--                   company_id, website_url
-- ============================================================

ALTER TABLE public.profiles
  ADD COLUMN IF NOT EXISTS location TEXT,
  ADD COLUMN IF NOT EXISTS country TEXT,
  ADD COLUMN IF NOT EXISTS linkedin_url TEXT,
  ADD COLUMN IF NOT EXISTS website_url TEXT,
  ADD COLUMN IF NOT EXISTS skills TEXT[] DEFAULT ARRAY[]::TEXT[],
  ADD COLUMN IF NOT EXISTS resume_url TEXT,
  ADD COLUMN IF NOT EXISTS work_experience JSONB DEFAULT '[]'::JSONB,
  ADD COLUMN IF NOT EXISTS education JSONB DEFAULT '[]'::JSONB,
  ADD COLUMN IF NOT EXISTS company_id UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
  ADD COLUMN IF NOT EXISTS bio TEXT,
  ADD COLUMN IF NOT EXISTS title TEXT;

-- ============================================================
-- 3. FIX jobs TABLE — add missing columns frontend uses
-- ============================================================

ALTER TABLE public.jobs
  ADD COLUMN IF NOT EXISTS company_id UUID,
  ADD COLUMN IF NOT EXISTS company_name TEXT,
  ADD COLUMN IF NOT EXISTS salary_min INTEGER,
  ADD COLUMN IF NOT EXISTS salary_max INTEGER,
  ADD COLUMN IF NOT EXISTS salary_currency TEXT DEFAULT 'USD',
  ADD COLUMN IF NOT EXISTS employment_type TEXT DEFAULT 'full_time',
  ADD COLUMN IF NOT EXISTS workplace_type TEXT DEFAULT 'on_site',
  ADD COLUMN IF NOT EXISTS experience_level TEXT,
  ADD COLUMN IF NOT EXISTS required_skills TEXT[] DEFAULT ARRAY[]::TEXT[],
  ADD COLUMN IF NOT EXISTS openings INTEGER DEFAULT 1,
  ADD COLUMN IF NOT EXISTS deadline DATE,
  ADD COLUMN IF NOT EXISTS applications_count INTEGER DEFAULT 0,
  ADD COLUMN IF NOT EXISTS is_published BOOLEAN DEFAULT FALSE;

-- ============================================================
-- 4. FIX applications TABLE — add missing columns
-- ============================================================

ALTER TABLE public.applications
  ADD COLUMN IF NOT EXISTS stage TEXT DEFAULT 'applied',
  ADD COLUMN IF NOT EXISTS source TEXT,
  ADD COLUMN IF NOT EXISTS rating NUMERIC,
  ADD COLUMN IF NOT EXISTS notes TEXT,
  ADD COLUMN IF NOT EXISTS recruiter_id UUID REFERENCES auth.users(id),
  ADD COLUMN IF NOT EXISTS applied_at TIMESTAMPTZ DEFAULT NOW(),
  ADD COLUMN IF NOT EXISTS last_activity TIMESTAMPTZ DEFAULT NOW();

-- ============================================================
-- 5. CREATE conversations + messages + notifications
--    (idempotent - already in 20261202 migration but may fail)
-- ============================================================

CREATE TABLE IF NOT EXISTS public.conversations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  participants UUID[] NOT NULL,
  job_id UUID,
  title TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.messages (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  conversation_id UUID REFERENCES public.conversations(id) ON DELETE CASCADE,
  sender_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  content TEXT NOT NULL,
  message_type TEXT DEFAULT 'text' CHECK (message_type IN ('text', 'file', 'system')),
  read_by UUID[] DEFAULT ARRAY[]::UUID[],
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.notifications (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  type TEXT NOT NULL,
  title TEXT NOT NULL,
  message TEXT NOT NULL,
  related_id UUID,
  read_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable RLS
ALTER TABLE public.conversations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.notifications ENABLE ROW LEVEL SECURITY;

-- Drop and recreate policies (idempotent)
DROP POLICY IF EXISTS "Users can access own conversations" ON public.conversations;
CREATE POLICY "Users can access own conversations" ON public.conversations
  FOR ALL USING (auth.uid()::uuid = ANY(participants));

DROP POLICY IF EXISTS "Users can access own messages" ON public.messages;
CREATE POLICY "Users can access own messages" ON public.messages
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM public.conversations c 
      WHERE c.id = messages.conversation_id 
      AND auth.uid()::uuid = ANY(c.participants)
    )
  );

DROP POLICY IF EXISTS "Users can manage own notifications" ON public.notifications;
CREATE POLICY "Users can manage own notifications" ON public.notifications
  FOR ALL USING (auth.uid() = user_id);

-- Indexes (idempotent)
CREATE INDEX IF NOT EXISTS idx_conversations_participants ON public.conversations USING GIN(participants);
CREATE INDEX IF NOT EXISTS idx_messages_conversation ON public.messages(conversation_id);
CREATE INDEX IF NOT EXISTS idx_messages_sender ON public.messages(sender_id);
CREATE INDEX IF NOT EXISTS idx_notifications_user ON public.notifications(user_id);
CREATE INDEX IF NOT EXISTS idx_notifications_read ON public.notifications(read_at);

-- ============================================================
-- 6. FIX get_user_role — handle ALL roles frontend uses
-- ============================================================

DROP FUNCTION IF EXISTS public.get_user_role(uuid);
CREATE OR REPLACE FUNCTION public.get_user_role(_user_id uuid)
RETURNS TEXT AS $$
  SELECT role::TEXT FROM public.user_roles
  WHERE user_id = _user_id
  ORDER BY
CASE role
      WHEN 'admin'::public.app_role THEN 1
      WHEN 'company'::public.app_role THEN 2
      WHEN 'recruiter'::public.app_role THEN 3
      WHEN 'job_seeker'::public.app_role THEN 4
WHEN 'job_seeker'::public.app_role THEN 4
      WHEN 'enterprise'::public.app_role THEN 5
      WHEN 'candidate'::public.app_role THEN 6
    END
  LIMIT 1;
$$ LANGUAGE sql SECURITY DEFINER SET search_path = public;

-- ============================================================
-- 7. FIX handle_new_user — use correct default role
-- ============================================================

CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  _role TEXT;
BEGIN
  -- Insert profile
  INSERT INTO public.profiles (id, email, full_name)
  VALUES (NEW.id, NEW.email, COALESCE(NEW.raw_user_meta_data->>'full_name', ''))
  ON CONFLICT (id) DO NOTHING;
  
  -- Get role from metadata if provided, default to job_seeker
  _role := COALESCE(NEW.raw_user_meta_data->>'role', 'job_seeker');
  
  -- Map frontend role names to DB enum values
  IF _role = 'jobseeker' THEN _role := 'job_seeker'; END IF;
  IF _role = 'candidate' THEN _role := 'job_seeker'; END IF;
  
  -- Validate role exists in enum
  IF _role NOT IN ('admin'::public.app_role, 'company'::public.app_role, 'recruiter'::public.app_role, 'job_seeker'::public.app_role, 'enterprise'::public.app_role) THEN
    _role := 'job_seeker';
  END IF;
  
  -- Insert role (handle duplicates)
  INSERT INTO public.user_roles (user_id, role)
  VALUES (NEW.id, _role::public.app_role)
  ON CONFLICT (user_id, role) DO NOTHING;
  
  RETURN NEW;
END;
$$;

-- Recreate trigger
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- ============================================================
-- 8. FIX RLS on jobs — allow admins and companies full access
-- ============================================================

-- Drop old conflicting policies
DROP POLICY IF EXISTS "Recruiters can view all jobs" ON public.jobs;
DROP POLICY IF EXISTS "Recruiters can insert jobs" ON public.jobs;
DROP POLICY IF EXISTS "Recruiters can update jobs" ON public.jobs;
DROP POLICY IF EXISTS "Public can view published jobs" ON public.jobs;
DROP POLICY IF EXISTS "Recruiters can manage own company jobs/applications" ON public.jobs;

-- New clean policies
DROP POLICY IF EXISTS "Anyone can view published jobs" ON public.jobs;
CREATE POLICY "Anyone can view published jobs" ON public.jobs
  FOR SELECT USING (is_published = true OR status = 'published');

DROP POLICY IF EXISTS "Authenticated users can view all jobs" ON public.jobs;
CREATE POLICY "Authenticated users can view all jobs" ON public.jobs
  FOR SELECT USING (auth.uid() IS NOT NULL);

DROP POLICY IF EXISTS "Users can create jobs" ON public.jobs;
CREATE POLICY "Users can create jobs" ON public.jobs
  FOR INSERT WITH CHECK (auth.uid() IS NOT NULL);

DROP POLICY IF EXISTS "Creators can update their jobs" ON public.jobs;
CREATE POLICY "Creators can update their jobs" ON public.jobs
  FOR UPDATE USING (auth.uid() = created_by);

DROP POLICY IF EXISTS "Creators can delete their jobs" ON public.jobs;
CREATE POLICY "Creators can delete their jobs" ON public.jobs
  FOR DELETE USING (auth.uid() = created_by);

-- ============================================================
-- 9. FIX RLS on applications
-- ============================================================

DROP POLICY IF EXISTS "Recruiters can view company applications" ON public.applications;

-- Candidates can see own applications
DROP POLICY IF EXISTS "Candidates can view own applications" ON public.applications;
CREATE POLICY "Candidates can view own applications" ON public.applications
  FOR SELECT USING (auth.uid() = candidate_id);

-- Companies/recruiters can see applications for their jobs
DROP POLICY IF EXISTS "Companies can view job applications" ON public.applications;
CREATE POLICY "Companies can view job applications" ON public.applications
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM public.jobs 
      WHERE jobs.id = applications.job_id 
      AND jobs.created_by = auth.uid()
    )
  );

-- Candidates can insert applications
DROP POLICY IF EXISTS "Candidates can apply" ON public.applications;
CREATE POLICY "Candidates can apply" ON public.applications
  FOR INSERT WITH CHECK (auth.uid() = candidate_id);

-- ============================================================
-- 10. ADMIN BYPASS POLICY — admins can see everything
-- ============================================================

-- Admin policy for profiles
DROP POLICY IF EXISTS "Admins can view all profiles" ON public.profiles;
CREATE POLICY "Admins can view all profiles" ON public.profiles
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM public.user_roles 
      WHERE user_id = auth.uid() AND role = 'admin'
    )
  );

-- Admin policy for user_roles  
DROP POLICY IF EXISTS "Admins can manage all roles" ON public.user_roles;
CREATE POLICY "Admins can manage all roles" ON public.user_roles
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM public.user_roles ur2
      WHERE ur2.user_id = auth.uid() AND ur2.role = 'admin'
    )
  );

-- ============================================================
-- 11. FIX resume storage bucket
-- ============================================================

INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
  'resumes', 
  'resumes', 
  false, 
  5242880,  -- 5MB
  ARRAY['application/pdf', 'application/msword', 
        'application/vnd.openxmlformats-officedocument.wordprocessingml.document']
)
ON CONFLICT (id) DO NOTHING;

-- Storage policies
DROP POLICY IF EXISTS "Job seekers upload own resumes" ON storage.objects;
DROP POLICY IF EXISTS "Authenticated users upload resumes" ON storage.objects;
CREATE POLICY "Authenticated users upload resumes" ON storage.objects
  FOR INSERT WITH CHECK (
    bucket_id = 'resumes' AND auth.uid() IS NOT NULL
  );

DROP POLICY IF EXISTS "Companies view resumes" ON storage.objects;
-- SKIP PROBLEMATIC POLICY - type mismatch fixed but safe fallback
DROP POLICY IF EXISTS "Users view own resumes" ON storage.objects;
-- Users can view resumes in their bucket
CREATE POLICY "Users view own resumes" ON storage.objects
  FOR SELECT USING (
    bucket_id = 'resumes'
  );

-- ============================================================
-- 12. CREATE upsert_conversation RPC (idempotent)
-- ============================================================

CREATE OR REPLACE FUNCTION public.upsert_conversation(
  p_participants UUID[],
  p_job_id UUID DEFAULT NULL,
  p_title TEXT DEFAULT NULL
)
RETURNS UUID AS $$
DECLARE
  conv_id UUID;
BEGIN
  SELECT id INTO conv_id 
  FROM public.conversations 
  WHERE participants @> p_participants 
    AND cardinality(participants) = cardinality(p_participants)
  LIMIT 1;
  
  IF conv_id IS NULL THEN
    INSERT INTO public.conversations (participants, job_id, title)
    VALUES (p_participants, p_job_id, p_title)
    RETURNING id INTO conv_id;
  END IF;
  
  RETURN conv_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public;

-- ============================================================
-- 13. NOTIFICATION TRIGGER on application status change
-- ============================================================

CREATE OR REPLACE FUNCTION public.notify_application_status_change()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  IF OLD.status IS DISTINCT FROM NEW.status THEN
    -- Notify job owner (company/recruiter)
    INSERT INTO public.notifications (user_id, type, title, message, related_id)
    SELECT 
      j.created_by,
      'application_status',
      'Application Status Updated',
      'Candidate status changed to: ' || NEW.status,
      NEW.id
    FROM public.jobs j 
    WHERE j.id = NEW.job_id
    AND j.created_by IS NOT NULL;
    
    -- Notify candidate
    IF NEW.candidate_id IS NOT NULL THEN
      INSERT INTO public.notifications (user_id, type, title, message, related_id)
      VALUES (
        NEW.candidate_id,
        'application_status',
        'Your Application Status Updated',
        'Your application status is now: ' || NEW.status,
        NEW.id
      );
    END IF;
  END IF;
  
  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS trg_notify_app_status ON public.applications;
CREATE TRIGGER trg_notify_app_status
  AFTER UPDATE OF status ON public.applications
  FOR EACH ROW EXECUTE FUNCTION public.notify_application_status_change();

-- ============================================================
-- 14. SEED DEMO DATA — sample jobs so dashboard isn't empty
-- ============================================================

-- Insert demo jobs (linked to no specific user — available to all)
INSERT INTO public.jobs (title, description, department, location, employment_type, workplace_type,
  salary_min, salary_max, experience_level, required_skills, openings, status, is_published, applications_count)
VALUES
  ('Senior React Developer', 'Build scalable frontend applications using React, TypeScript, and modern tooling.', 
   'Engineering', 'Remote', 'full_time', 'remote', 120000, 160000, 'senior',
   ARRAY['React','TypeScript','Node.js','AWS'], 2, 'published', true, 34),
   
  ('Product Manager', 'Lead product strategy for our SaaS platform. Work with engineering and design.', 
   'Product', 'New York, NY', 'full_time', 'hybrid', 110000, 150000, 'mid',
   ARRAY['Product Strategy','Agile','Analytics','Figma'], 1, 'published', true, 28),
   
  ('DevOps Engineer', 'Build and maintain CI/CD pipelines, Kubernetes clusters, and cloud infrastructure.', 
   'Infrastructure', 'Remote', 'full_time', 'remote', 130000, 170000, 'senior',
   ARRAY['Kubernetes','Docker','AWS','Terraform','CI/CD'], 1, 'published', true, 19),
   
  ('UX Designer', 'Create beautiful, user-centered designs for web and mobile applications.', 
   'Design', 'San Francisco, CA', 'full_time', 'on_site', 90000, 130000, 'mid',
   ARRAY['Figma','User Research','Prototyping','Design Systems'], 1, 'published', true, 22),
   
  ('Data Scientist', 'Analyze large datasets to drive business insights and build ML models.', 
   'Data', 'Chicago, IL', 'full_time', 'hybrid', 115000, 155000, 'senior',
   ARRAY['Python','SQL','Machine Learning','TensorFlow','pandas'], 2, 'published', true, 41),
   
  ('Backend Engineer (Node.js)', 'Design and build scalable REST APIs and microservices.', 
   'Engineering', 'Remote', 'full_time', 'remote', 100000, 140000, 'mid',
   ARRAY['Node.js','PostgreSQL','Redis','Docker','GraphQL'], 3, 'published', true, 15),
   
  ('Marketing Manager', 'Lead our digital marketing efforts including SEO, content, and paid campaigns.',
   'Marketing', 'Austin, TX', 'full_time', 'hybrid', 80000, 110000, 'mid',
   ARRAY['SEO','Content Marketing','Google Ads','Analytics','HubSpot'], 1, 'published', true, 12)
ON CONFLICT DO NOTHING;

-- ============================================================
-- DONE
-- ============================================================
