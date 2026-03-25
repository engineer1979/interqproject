import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.39.3'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

// These match DEMO_USERS in SimpleAuthContext.tsx exactly
const demoUsers = [
  { email: 'admin.demo@interq.com', password: 'Admin@123', fullName: 'Sarah Admin', role: 'admin' },
  { email: 'company.demo@interq.com', password: 'Company@123', fullName: 'Alex Manager', role: 'company' },
  { email: 'recruiter.demo@interq.com', password: 'Recruiter@123', fullName: 'John Recruiter', role: 'recruiter' },
  { email: 'jobseeker.demo@interq.com', password: 'JobSeeker@123', fullName: 'Emily Jobseeker', role: 'job_seeker' },
];

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabaseAdmin = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? '',
      { auth: { autoRefreshToken: false, persistSession: false } }
    );

    const results = [];

    for (const user of demoUsers) {
      // Check if user already exists
      const { data: existingUsers } = await supabaseAdmin.auth.admin.listUsers();
      const userExists = existingUsers?.users?.some(u => u.email === user.email);

      if (userExists) {
        results.push({ email: user.email, status: 'already_exists' });
        continue;
      }

      // Create auth user
      const { data: authData, error: authError } = await supabaseAdmin.auth.admin.createUser({
        email: user.email,
        password: user.password,
        email_confirm: true,
        user_metadata: { full_name: user.fullName, role: user.role },
      });

      if (authError) {
        results.push({ email: user.email, status: 'error', error: authError.message });
        continue;
      }

      // Update profile
      await supabaseAdmin.from('profiles').upsert({
        id: authData.user.id,
        email: user.email,
        full_name: user.fullName,
        role: user.role,
      }, { onConflict: 'id' });

      // Update role in user_roles
      await supabaseAdmin.from('user_roles').upsert({
        user_id: authData.user.id,
        role: user.role,
      }, { onConflict: 'user_id,role' });

      results.push({ email: user.email, status: 'created', id: authData.user.id });
    }

    return new Response(
      JSON.stringify({ success: true, results }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 200 }
    );

  } catch (error) {
    return new Response(
      JSON.stringify({ error: error.message }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 500 }
    );
  }
});
