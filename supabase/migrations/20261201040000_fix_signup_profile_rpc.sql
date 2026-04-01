-- Fix signup profile creation - RPC bypasses RLS for post-auth.signup profile/role setup
-- SECURITY DEFINER runs as owner (service_role privileges)

DROP FUNCTION IF EXISTS create_user_profile CASCADE;

CREATE OR REPLACE FUNCTION create_user_profile(
  p_user_id UUID,
  p_email TEXT,
  p_name TEXT,
  p_role TEXT,
  p_company_name TEXT DEFAULT NULL
)
RETURNS JSON
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_result JSON;
BEGIN
  -- Insert profile (refs auth.users)
  INSERT INTO public.profiles (id, email, full_name, role, company_name)
  VALUES (p_user_id, p_email, p_name, p_role, p_company_name)
  ON CONFLICT (id) DO UPDATE SET
    full_name = EXCLUDED.full_name,
    role = EXCLUDED.role,
    company_name = EXCLUDED.company_name;

  -- Insert role
  INSERT INTO public.user_roles (user_id, role)
  VALUES (p_user_id, p_role)
  ON CONFLICT (user_id) DO UPDATE SET
    role = EXCLUDED.role;

  SELECT json_build_object(
    'success', true,
    'user_id', p_user_id,
    'profile_created', true
  ) INTO v_result;

  RETURN v_result;
EXCEPTION
  WHEN OTHERS THEN
    SELECT json_build_object(
      'success', false,
      'error', SQLERRM
    ) INTO v_result;
    RETURN v_result;
END;
$$;

-- Grant execute to authenticated + anon (signup anon call)
GRANT EXECUTE ON FUNCTION create_user_profile TO authenticated, anon;

-- RPC callable from client
COMMENT ON FUNCTION create_user_profile IS 'Post-signup profile/role creator - bypasses RLS safely';
