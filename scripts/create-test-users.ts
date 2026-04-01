import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
import { fileURLToPath } from 'url';
import path from 'path';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
dotenv.config({ path: path.resolve(__dirname, '../.env.local') });

const supabaseUrl = process.env.VITE_SUPABASE_URL!;
const supabaseServiceKey = process.env.VITE_SUPABASE_SERVICE_ROLE_KEY!;

if (!supabaseUrl || !supabaseServiceKey) {
  console.error('Missing VITE_SUPABASE_URL or VITE_SUPABASE_SERVICE_ROLE_KEY in .env.local');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseServiceKey, {
  auth: { autoRefreshToken: false, persistSession: false }
});

async function createTestUsers() {
  console.log('🚀 Creating Test Users...');

  const testUsers = [
    {
      email: 'test.admin@interq.com',
      password: 'TestAdmin123!',
      name: 'Test Admin',
      role: 'admin'
    },
    {
      email: 'test.company@interq.com',
      password: 'TestCompany123!',
      name: 'Test Company Manager',
      role: 'company',
      companyName: 'TestCorp Inc.'
    },
    {
      email: 'test.recruiter@interq.com',
      password: 'TestRecruiter123!',
      name: 'Test Recruiter',
      role: 'recruiter'
    },
    {
      email: 'test.jobseeker@interq.com',
      password: 'TestJobseeker123!',
      name: 'Test Job Seeker',
      role: 'jobseeker'
    }
  ];

  for (const userData of testUsers) {
    try {
      // Create auth user
      const { data: user, error } = await supabase.auth.admin.createUser({
        email: userData.email,
        password: userData.password,
        email_confirm: true,
        user_metadata: {
          name: userData.name,
          role: userData.role
        }
      });

      if (error) throw error;

      // Create profile and role via RPC
      const { data: rpcResult, error: rpcError } = await supabase.rpc('create_user_profile', {
        p_user_id: user.user.id,
        p_email: userData.email,
        p_name: userData.name,
        p_role: userData.role,
        p_company_name: (userData as any).companyName
      });

      console.log(`✅ Created ${userData.role}: ${userData.email} (${rpcResult?.success ? 'profile OK' : 'RPC warning'})`);
    } catch (err: any) {
      console.error(`❌ Error creating ${userData.email}:`, err.message);
    }
  }

  console.log('🏁 Test Users Creation Complete!');
  console.log('Login with: test.admin@interq.com / TestAdmin123! etc.');
}

createTestUsers().catch(console.error);

