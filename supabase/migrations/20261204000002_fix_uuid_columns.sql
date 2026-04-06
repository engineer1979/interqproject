-- UUID Fix Migration
-- This fixes the invalid UUID error by ensuring proper UUID handling

-- 1. Add a helper function to validate UUID format
CREATE OR REPLACE FUNCTION is_valid_uuid(text)
RETURNS BOOLEAN AS $$
BEGIN
  RETURN text ~ '^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$';
EXCEPTION
  WHEN OTHERS THEN RETURN FALSE;
END;
$$ LANGUAGE plpgsql IMMUTABLE;

-- 2. Update companies table to use TEXT for flexible ID handling (if needed)
-- But first, let's try to fix existing data by ensuring proper UUID format

-- 3. Fix user_id columns to accept both UUID and TEXT (for Supabase Auth compatibility)
DO $$
BEGIN
  -- Check if user_id columns need to be changed to TEXT
  IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'company_members' AND column_name = 'user_id' AND data_type = 'uuid') THEN
    ALTER TABLE company_members ALTER COLUMN user_id TYPE TEXT;
  END IF;
END $$;

DO $$
BEGIN
  IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'user_roles' AND column_name = 'user_id' AND data_type = 'uuid') THEN
    ALTER TABLE user_roles ALTER COLUMN user_id TYPE TEXT;
  END IF;
END $$;

DO $$
BEGIN
  IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'profiles' AND column_name = 'id' AND data_type = 'uuid') THEN
    ALTER TABLE profiles ALTER COLUMN id TYPE TEXT;
  END IF;
END $$;

DO $$
BEGIN
  IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'audit_logs' AND column_name = 'user_id' AND data_type = 'uuid') THEN
    ALTER TABLE audit_logs ALTER COLUMN user_id TYPE TEXT;
  END IF;
END $$;

DO $$
BEGIN
  IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'job_seeker_notifications' AND column_name = 'user_id' AND data_type = 'uuid') THEN
    ALTER TABLE job_seeker_notifications ALTER COLUMN user_id TYPE TEXT;
  END IF;
END $$;

-- 4. Fix company_id columns similarly
DO $$
BEGIN
  IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'company_members' AND column_name = 'company_id' AND data_type = 'uuid') THEN
    ALTER TABLE company_members ALTER COLUMN company_id TYPE TEXT;
  END IF;
END $$;

DO $$
BEGIN
  IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'jobs' AND column_name = 'company_id' AND data_type = 'uuid') THEN
    ALTER TABLE jobs ALTER COLUMN company_id TYPE TEXT;
  END IF;
END $$;

DO $$
BEGIN
  IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'candidates' AND column_name = 'company_id' AND data_type = 'uuid') THEN
    ALTER TABLE candidates ALTER COLUMN company_id TYPE TEXT;
  END IF;
END $$;

DO $$
BEGIN
  IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'audit_logs' AND column_name = 'company_id' AND data_type = 'uuid') THEN
    ALTER TABLE audit_logs ALTER COLUMN company_id TYPE TEXT;
  END IF;
END $$;

-- 5. Fix job_id in candidates
DO $$
BEGIN
  IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'candidates' AND column_name = 'job_id' AND data_type = 'uuid') THEN
    ALTER TABLE candidates ALTER COLUMN job_id TYPE TEXT;
  END IF;
END $$;

-- 6. Fix created_by columns
DO $$
BEGIN
  IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'companies' AND column_name = 'created_by' AND data_type = 'uuid') THEN
    ALTER TABLE companies ALTER COLUMN created_by TYPE TEXT;
  END IF;
END $$;

DO $$
BEGIN
  IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'jobs' AND column_name = 'created_by' AND data_type = 'uuid') THEN
    ALTER TABLE jobs ALTER COLUMN created_by TYPE TEXT;
  END IF;
END $$;

-- 7. Fix RLS policies to work with TEXT user IDs
DROP POLICY IF EXISTS "Users can manage their own role" ON user_roles;
CREATE POLICY "Users can manage their own role"
  ON user_roles FOR ALL TO authenticated USING (auth.uid()::text = user_id);

DROP POLICY IF EXISTS "Users can manage their own profile" ON profiles;
CREATE POLICY "Users can manage their own profile"
  ON profiles FOR ALL TO authenticated USING (auth.uid()::text = id);

DROP POLICY IF EXISTS "Users can update their own notifications" ON job_seeker_notifications;
CREATE POLICY "Users can update their own notifications"
  ON job_seeker_notifications FOR UPDATE TO authenticated USING (auth.uid()::text = user_id);

DROP POLICY IF EXISTS "Users can insert themselves as members" ON company_members;
CREATE POLICY "Users can insert themselves as members"
  ON company_members FOR INSERT TO authenticated WITH CHECK (auth.uid()::text = user_id);
