-- Add recruiter role support
ALTER TYPE public.app_role ADD VALUE IF NOT EXISTS 'recruiter';

-- Add recruiter_company_id to user_roles
ALTER TABLE public.user_roles 
ADD COLUMN IF NOT EXISTS recruiter_company_id UUID REFERENCES public.profiles(id) ON DELETE SET NULL;

-- Update handle_new_user for default role (keep job_seeker, recruiters assigned by company)
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, email, full_name)
  VALUES (NEW.id, NEW.email, NEW.raw_user_meta_data->>'full_name');
  
  INSERT INTO public.user_roles (user_id, role)
  VALUES (NEW.id, 'job_seeker');  -- Default for new users
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Update get_user_role RPC to handle recruiter (DROP first if signature conflict)
DROP FUNCTION IF EXISTS public.get_user_role(uuid);
CREATE OR REPLACE FUNCTION public.get_user_role(_user_id uuid)
RETURNS public.app_role AS $$
  SELECT role FROM public.user_roles
  WHERE user_id = _user_id
  ORDER BY
    CASE role
      WHEN 'admin' THEN 1
      WHEN 'company' THEN 2
      WHEN 'recruiter' THEN 3
      WHEN 'job_seeker' THEN 4
    END
  LIMIT 1;
$$ LANGUAGE sql SECURITY DEFINER;

-- Skip module_permissions if not exist or handle separately
-- Module permissions for recruiter (commented if table not exist)
-- INSERT INTO public.module_permissions (role, module, view, create, update, delete)
-- VALUES
--   ('recruiter', 'jobs', true, true, true, true),
--   ('recruiter', 'applications', true, true, true, false),
--   ('recruiter', 'candidates', true, true, true, true),
--   ('recruiter', 'assessments', true, true, true, true),
--   ('recruiter', 'ai_interviews', true, true, true, true),
--   ('recruiter', 'pipeline', true, true, true, true),
--   ('recruiter', 'messaging', true, true, true, true),
--   ('recruiter', 'analytics', true, false, false, false),
--   ('recruiter', 'settings', true, false, true, false)
-- ON CONFLICT DO NOTHING;

-- RLS policies for recruiters (company-scoped)
CREATE POLICY "Recruiters can manage own company jobs/applications" ON public.jobs
FOR ALL USING (
  EXISTS (
    SELECT 1 FROM public.user_roles ur
    JOIN public.profiles p ON p.id = ur.recruiter_company_id
  WHERE ur.user_id = auth.uid() AND ur.role = 'recruiter'::public.app_role 
    AND jobs.created_by::text = p.id::text

  )
);

CREATE POLICY "Recruiters can view company applications" ON public.applications
FOR SELECT USING (
  EXISTS (
    SELECT 1 FROM public.jobs j
    JOIN public.user_roles ur ON ur.recruiter_company_id = j.created_by
WHERE j.id = applications.job_id AND ur.user_id = auth.uid() AND ur.role = 'recruiter'::public.app_role
  )
);

-- Messaging system tables
CREATE TABLE IF NOT EXISTS public.conversations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  participants UUID[] NOT NULL,  -- array of user IDs
  job_id UUID REFERENCES public.jobs(id) ON DELETE CASCADE,
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

-- RLS for conversations/messages (participants only)
ALTER TABLE public.conversations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.messages ENABLE ROW LEVEL SECURITY;

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

CREATE INDEX IF NOT EXISTS idx_conversations_participants ON public.conversations USING GIN(participants);
CREATE INDEX IF NOT EXISTS idx_messages_conversation ON public.messages(conversation_id);
CREATE INDEX IF NOT EXISTS idx_messages_sender ON public.messages(sender_id);
CREATE INDEX IF NOT EXISTS idx_messages_read_by ON public.messages USING GIN(read_by);

-- RPC to create/find conversation
CREATE OR REPLACE FUNCTION public.upsert_conversation(
  p_participants UUID[],
  p_job_id UUID DEFAULT NULL
)
RETURNS UUID AS $$
DECLARE
  conv_id UUID;
BEGIN
  SELECT id INTO conv_id 
  FROM public.conversations 
  WHERE participants @> p_participants AND cardinality(participants) = cardinality(p_participants)
  LIMIT 1;
  
  IF conv_id IS NULL THEN
    INSERT INTO public.conversations (participants, job_id)
    VALUES (p_participants, p_job_id)
    RETURNING id INTO conv_id;
  END IF;
  
  RETURN conv_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Notifications table
CREATE TABLE IF NOT EXISTS public.notifications (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  type TEXT NOT NULL,  -- 'application_status', 'new_message', 'interview_scheduled', etc.
  title TEXT NOT NULL,
  message TEXT NOT NULL,
  related_id UUID,  -- application_id, message_id, etc.
  read_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE public.notifications ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Users can manage own notifications" ON public.notifications;
CREATE POLICY "Users can manage own notifications" ON public.notifications
FOR ALL USING (auth.uid() = user_id);

CREATE INDEX IF NOT EXISTS idx_notifications_user ON public.notifications(user_id);
CREATE INDEX IF NOT EXISTS idx_notifications_read ON public.notifications(read_at);
CREATE INDEX IF NOT EXISTS idx_notifications_type ON public.notifications(type);

-- Auto-notif trigger example: on application status change
CREATE OR REPLACE FUNCTION public.notify_application_status_change()
RETURNS TRIGGER AS $$
BEGIN
  IF OLD.status IS DISTINCT FROM NEW.status THEN
    INSERT INTO public.notifications (user_id, type, title, message, related_id)
    SELECT 
      j.created_by,  -- company/recruiter
      'application_status',
      'Application Status Updated',
      'Application #' || NEW.id || ' status changed to: ' || NEW.status,
      NEW.id
    FROM public.jobs j WHERE j.id = NEW.job_id;
    
    -- Also notify candidate
    INSERT INTO public.notifications (user_id, type, title, message, related_id)
    VALUES (
      NEW.candidate_id,
      'application_status',
      'Your Application Status',
      'Status updated to: ' || NEW.status,
      NEW.id
    );
  END IF;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

DROP TRIGGER IF EXISTS trg_notify_app_status ON public.applications;
CREATE TRIGGER trg_notify_app_status
  AFTER UPDATE OF status ON public.applications
  FOR EACH ROW EXECUTE FUNCTION public.notify_application_status_change();

-- Resume storage (if not exists)
INSERT INTO storage.buckets (id, name, public) 
VALUES ('resumes', 'resumes', false) 
ON CONFLICT DO NOTHING;

CREATE POLICY "Job seekers upload own resumes" ON storage.objects FOR INSERT 
WITH CHECK (bucket_id = 'resumes' AND auth.uid()::text = owner);

CREATE POLICY "Companies view resumes" ON storage.objects FOR SELECT 
USING (bucket_id = 'resumes');

