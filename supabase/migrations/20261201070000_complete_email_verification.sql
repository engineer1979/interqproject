-- Complete Email Verification System
-- 1. Post-signup profile creation (unverified)
-- 2. Verification trigger (auto profile update)
-- 3. Manual RPC verify + resend

-- 1. Post-signup RPC (runs unverified)
DROP FUNCTION IF EXISTS public.create_unverified_user_profile(UUID, TEXT, TEXT, TEXT, TEXT) CASCADE;
CREATE OR REPLACE FUNCTION public.create_unverified_user_profile(
  p_user_id UUID,
  p_email TEXT,
  p_name TEXT,
  p_role TEXT DEFAULT 'jobseeker',
  p_company_name TEXT DEFAULT NULL
)
RETURNS JSON
LANGUAGE plpgsql SECURITY DEFINER AS $$
BEGIN
  INSERT INTO public.profiles (
    id, email, full_name, role, company_name, updated_at
  ) VALUES (
    p_user_id, p_email, p_name, p_role, p_company_name, NOW()
  ) ON CONFLICT (id) DO NOTHING;
  
  INSERT INTO public.user_roles (user_id, role)
  VALUES (p_user_id, p_role)
  ON CONFLICT (user_id) DO NOTHING;
  
  RETURN json_build_object('success', true, 'profile_pending_verification', true);
EXCEPTION WHEN OTHERS THEN
  RETURN json_build_object('success', false, 'error', SQLERRM);
END;
$$;
GRANT EXECUTE ON FUNCTION public.create_unverified_user_profile TO anon, authenticated;

-- 2. Verification Trigger (runs when email confirmed)
DROP FUNCTION IF EXISTS public.on_user_email_verified CASCADE;
CREATE OR REPLACE FUNCTION public.on_user_email_verified()
RETURNS TRIGGER AS $$
BEGIN
  UPDATE public.profiles 
  SET updated_at = NOW(), is_verified = true 
  WHERE id = NEW.id;
  
  -- Optional: Log verification
  INSERT INTO public.audit_logs (user_id, action, entity_type)
  VALUES (NEW.id, 'email_verified', 'auth');
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Attach trigger to auth.users
DROP TRIGGER IF EXISTS on_email_verified ON auth.users;
CREATE TRIGGER on_email_verified
  AFTER UPDATE OF email_confirmed_at ON auth.users
  FOR EACH ROW WHEN (OLD.email_confirmed_at IS NULL AND NEW.email_confirmed_at IS NOT NULL)
  EXECUTE FUNCTION public.on_user_email_verified();

-- 3. Manual verify RPC
DROP FUNCTION IF EXISTS public.manual_verify_email CASCADE;
CREATE OR REPLACE FUNCTION public.manual_verify_email(p_user_id UUID)
RETURNS JSON
LANGUAGE plpgsql SECURITY DEFINER AS $$
BEGIN
  UPDATE auth.users SET email_confirmed_at = NOW() WHERE id = p_user_id;
  RETURN json_build_object('success', true, 'manually_verified', true);
END;
$$;
GRANT EXECUTE ON FUNCTION public.manual_verify_email TO authenticated;

-- 4. Resend verification RPC
DROP FUNCTION IF EXISTS public.resend_verification_email CASCADE;
CREATE OR REPLACE FUNCTION public.resend_verification_email(p_email TEXT)
RETURNS JSON
LANGUAGE plpgsql SECURITY DEFINER AS $$
DECLARE
  v_user RECORD;
BEGIN
  SELECT * INTO v_user FROM auth.users WHERE email = p_email;
  IF v_user.id IS NULL THEN
    RETURN json_build_object('success', false, 'error', 'User not found');
  END IF;
  
  -- Supabase handles resend
  PERFORM auth.resend_email_confirmation(v_user.id::text);
  RETURN json_build_object('success', true, 'sent_to', p_email);
END;
$$;
GRANT EXECUTE ON FUNCTION public.resend_verification_email TO authenticated;

COMMENT ON SCHEMA public IS 'Complete email verification system ready';

-- Update supabase types (manual)
-- Run: npx supabase gen types typescript --local > src/types/supabase.ts
