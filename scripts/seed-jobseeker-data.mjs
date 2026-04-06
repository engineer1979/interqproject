/*
  Seeder for Job Seeker demo data
  Usage:
    node --loader ts-node/esm scripts/seed-jobseeker-data.mjs
  or set env vars and run with node (plain JS):
    SUPABASE_URL=https://... SUPABASE_KEY=your_service_role_or_anon_key node scripts/seed-jobseeker-data.mjs

  This script will create a demo user (if not exists) and insert related rows:
    - profiles
    - assessments
    - assessment_results
    - ai_interviews
    - certificates
    - jobs and job_applications
*/

import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = process.env.SUPABASE_URL || process.env.VITE_SUPABASE_URL || 'https://lenltzlsnlbzwlizmijc.supabase.co';
const SUPABASE_KEY = process.env.SUPABASE_KEY || process.env.SUPABASE_ANON_KEY || process.env.VITE_SUPABASE_ANON_KEY || '';

if (!SUPABASE_KEY) {
  console.error('Missing SUPABASE_KEY. Set SUPABASE_KEY or VITE_SUPABASE_ANON_KEY env var.');
  process.exit(1);
}

const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);

async function upsertDemo() {
  try {
    // Create or find a demo user in auth.users (requires service_role key for direct auth API)
    const demoEmail = 'demo.jobseeker@interq.com';
    let userId = null;

    // Try to find a profile row first
    const { data: existingProfiles } = await supabase.from('profiles').select('*').eq('email', demoEmail).limit(1);
    if (existingProfiles && existingProfiles.length > 0) {
      userId = existingProfiles[0].id;
      console.log('Found existing demo profile with id', userId);
    }

    if (!userId) {
      // Create a lightweight profile entry
      const newId = 'demo_js_' + Math.random().toString(36).slice(2, 10);
      const { data: profileData, error: profileError } = await supabase.from('profiles').insert([
        {
          id: newId,
          full_name: 'Demo Jobseeker',
          email: demoEmail,
          resume_url: null,
          skills: ['JavaScript', 'React', 'Node.js'],
          headline: 'Fullstack Developer',
          avatar_url: null,
          created_at: new Date().toISOString(),
        },
      ]).select().single();

      if (profileError) throw profileError;
      userId = profileData.id;
      console.log('Inserted demo profile with id', userId);
    }

    // Insert assessments
    const assessments = [
      { id: 'assess_js_1', title: 'JavaScript Fundamentals', category: 'js', difficulty: 'medium', status: 'active', created_at: new Date().toISOString() },
      { id: 'assess_react_1', title: 'React Core', category: 'react', difficulty: 'medium', status: 'active', created_at: new Date().toISOString() },
    ];
    for (const a of assessments) {
      await supabase.from('assessments').upsert(a).eq('id', a.id);
    }
    console.log('Upserted assessments');

    // Insert assessment_results
    const results = [
      { id: 'res_js_1', user_id: userId, assessment_id: 'assess_js_1', score: 85, completed_at: new Date().toISOString(), created_at: new Date().toISOString() },
      { id: 'res_react_1', user_id: userId, assessment_id: 'assess_react_1', score: 72, completed_at: new Date().toISOString(), created_at: new Date().toISOString() },
    ];
    for (const r of results) {
      await supabase.from('assessment_results').upsert(r).eq('id', r.id);
    }
    console.log('Upserted assessment_results');

    // Insert ai_interviews
    const interviews = [
      { id: 'int_1', user_id: userId, title: 'Screening Interview', status: 'completed', created_at: new Date().toISOString(), completed_at: new Date().toISOString() },
    ];
    for (const i of interviews) {
      await supabase.from('ai_interviews').upsert(i).eq('id', i.id);
    }
    console.log('Upserted ai_interviews');

    // Insert certificates
    const certificates = [
      { id: 'cert_1', user_id: userId, assessment_id: 'assess_js_1', title: 'JavaScript Fundamentals Certificate', status: 'issued', issued_at: new Date().toISOString(), created_at: new Date().toISOString() },
    ];
    for (const c of certificates) {
      await supabase.from('certificates').upsert(c).eq('id', c.id);
    }
    console.log('Upserted certificates');

    // Insert a job and job_application
    const job = { id: 'job_demo_1', title: 'Frontend Engineer', company_id: 'comp_demo_1', created_at: new Date().toISOString() };
    await supabase.from('jobs').upsert(job).eq('id', job.id);
    await supabase.from('job_applications').upsert({ id: 'app_1', user_id: userId, job_id: job.id, status: 'applied', created_at: new Date().toISOString() }).eq('id', 'app_1');
    console.log('Upserted job and job_application');

    console.log('Seeder finished successfully');
  } catch (err) {
    console.error('Seeder error:', err);
    process.exit(1);
  }
}

upsertDemo().then(() => process.exit(0));
