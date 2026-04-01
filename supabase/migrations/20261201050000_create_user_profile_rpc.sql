-- Clean RPC for signup profile/role (no schema prefix issues)
-- SECURITY DEFINER for RLS bypass + trigger-safe

DROP FUNCTION IF EXISTS public.create_user_profile(UUID, TEXT, TEXT, TEXT, TEXT) CASCADE;

CREATE OR REPLACE FUNCTION public.create_user_profile(
  p_user_id UUID,
  p_email TEXT,
  p_name TEXT,
  p_role TEXT,
  p_company_name TEXT DEFAULT NULL
)
RETURNS JSON
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  v_result JSON;
BEGIN
  INSERT INTO public.profiles (id, email, full_name, role, company_name)
  VALUES (p_user_id, p_email, p_name, p_role, p_company_name)
  ON CONFLICT (id) DO UPDATE SET
    full_name = EXCLUDED.full_name,
    role = EXCLUDED.role,
    company_name = EXCLUDED.company_name;

  INSERT INTO public.user_roles (user_id, role)
  VALUES (p_user_id, p_role)
  ON CONFLICT (user_id) DO UPDATE SET role = EXCLUDED.role;

  SELECT json_build_object('success', true, 'user_id', p_user_id) INTO v_result;
  RETURN v_result;
EXCEPTION WHEN OTHERS THEN
  SELECT json_build_object('success', false, 'error', SQLERRM) INTO v_result;
  RETURN v_result;
END;
$$;

GRANT EXECUTE ON FUNCTION public.create_user_profile TO authenticated, anon;

COMMENT ON FUNCTION public.create_user_profile IS 'Atomic post-signup profiles/user_roles creator - RLS safe';
