-- RPC for role-based signup
CREATE OR REPLACE FUNCTION public.signup_user_with_role(
  p_email TEXT, 
  p_password TEXT, 
  p_full_name TEXT, 
  p_role public.app_role DEFAULT 'job_seeker'
)
RETURNS json AS $$
DECLARE
  auth_user json;
BEGIN
  -- Create auth user
  SELECT * INTO auth_user FROM auth.sign_up(
    json_build_object(
      'email', p_email,
      'password', p_password,
      'options', json_build_object(
        'data', json_build_object('full_name', p_full_name),
        'emailRedirectTo', ''
      )
    )
  ) as auth_response;
  
  IF auth_user->>'error' IS NOT NULL THEN
    RETURN json_build_object('error', auth_user->>'error');
  END IF;
  
  -- Update role in user_roles (override default)
  UPDATE public.user_roles 
  SET role = p_role 
  WHERE user_id = (auth_user->>'user'->>'id')::UUID;
  
  RETURN json_build_object('success', true, 'user', auth_user->>'user');
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Update handle_new_user trigger to be role-aware (called by RPC)
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE PROCEDURE public.handle_new_user();
