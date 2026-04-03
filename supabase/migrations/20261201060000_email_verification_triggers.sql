-- Email Verification Auto-Profile Trigger
-- Runs AFTER auth.email confirmation

CREATE OR REPLACE FUNCTION public.handle_new_user_email_verification()
RETURNS TRIGGER AS $$
DECLARE
  v_role TEXT := COALESCE((NEW.raw_user_meta_data->>'role')::text, 'jobseeker');
  v_name TEXT := COALESCE((NEW.raw_user_meta_data->>'full_name')::text, split_part(NEW.email, '@', 1));
BEGIN
  INSERT INTO public.profiles (id, email, full_name, role)
  VALUES (NEW.id, NEW.email, v_name, v_role)
  ON CONFLICT (id) DO UPDATE SET
    full_name = EXCLUDED.full_name,
    role = EXCLUDED.role,
    updated_at = NOW();

  INSERT INTO public.user_roles (user_id, role)
  VALUES (NEW.id, v_role)
  ON CONFLICT (user_id) DO UPDATE SET role = EXCLUDED.role;

  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger on auth.users email_confirmed_at update
DROP TRIGGER IF EXISTS on_auth_user_email_verified ON auth.users;
CREATE TRIGGER on_auth_user_email_verified
  AFTER UPDATE OF email_confirmed_at ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user_email_verified();

COMMENT ON FUNCTION public.handle_new_user_email_verification IS 'Auto-creates profile/role on email verification';

-- Manual verification RPC (bypass email)
CREATE OR REPLACE FUNCTION public.verify_user_email(p_user_id UUID)
RETURNS JSON
LANGUAGE plpgsql SECURITY DEFINER AS $$
BEGIN
  UPDATE auth.users SET email_confirmed_at = NOW() WHERE id = p_user_id;
  PERFORM public.handle_new_user_email_verification(); -- Trigger fires
  RETURN json_build_object('success', true);
END;
$$;

GRANT EXECUTE ON FUNCTION public.verify_user_email TO authenticated, anon;
