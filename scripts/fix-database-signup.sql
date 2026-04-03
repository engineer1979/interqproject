-- FIX: Database error saving new user (RLS/policies on profiles/user_roles)
-- Run in Supabase SQL Editor

-- 1. Disable RLS temporarily
ALTER TABLE public.profiles DISABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_roles DISABLE ROW LEVEL SECURITY;

-- 2. Enable insert for anon/auth (signup)
CREATE POLICY "Allow anon signup profiles" ON public.profiles
  FOR INSERT TO anon WITH CHECK (true);

CREATE POLICY "Allow auth signup profiles" ON public.profiles
  FOR INSERT TO authenticated WITH CHECK (true);

CREATE POLICY "Allow anon signup roles" ON public.user_roles
  FOR INSERT TO anon WITH CHECK (true);

CREATE POLICY "Allow auth signup roles" ON public.user_roles
  FOR INSERT TO authenticated WITH CHECK (true);

-- 3. Read policies (login)
CREATE POLICY "Users view own profile" ON public.profiles
  FOR SELECT TO authenticated USING (auth.uid()::text = id);

CREATE POLICY "Users view own role" ON public.user_roles
  FOR SELECT TO authenticated USING (auth.uid()::text = user_id);

-- 4. Re-enable RLS
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;

-- Test
SELECT * FROM auth.users ORDER BY created_at DESC LIMIT 1;

