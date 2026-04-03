const { createClient } = require('@supabase/supabase-js');

const supabase = createClient(
  'https://lenltzlsnlbzwlizmijc.supabase.co',
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imxlbmx0emxzbmxiendsaXptaWpjIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjQzMzQxNDgsImV4cCI6MjA3OTkxMDE0OH0.O0y6JNNuUo9WOdd-Yq12M9sTwTc8YduaY1p_AG3NpCE'
);

async function testSignup() {
  try {
    const { data, error } = await supabase.auth.signUp({
      email: 'test-' + Date.now() + '@example.com',
      password: '12345678'
    });
    console.log('SIGNUP RESULT:', { data, error });
    
    if (data.user) {
      // Call RPC
      const rpc = await supabase.rpc('create_user_profile', {
        p_user_id: data.user.id,
        p_email: data.user.email,
        p_name: 'Test User',
        p_role: 'jobseeker'
      });
      console.log('PROFILE RPC:', rpc);
    }
  } catch (err) {
    console.error('ERROR:', err);
  }
}

testSignup();

