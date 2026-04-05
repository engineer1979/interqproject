import { createClient } from '@supabase/supabase-js';
import { faker } from '@faker-js/faker';

const supabaseUrl = 'https://lenltzlsnlbzwlizmijc.supabase.co';
const supabaseKey = 'your-anon-key-here'; // Replace or use env

const supabase = createClient(supabaseUrl, supabaseKey);

async function seedJobSeekerInterviews() {
  console.log('🌟 Seeding Job Seeker Interviews...');

  // Get jobseeker user (demo user)
  const { data: jobseeker } = await supabase
    .from('profiles')
    .select('id')
    .eq('email', 'jobseeker.demo@interq.com')
    .single();

  if (!jobseeker) {
    console.log('❌ No jobseeker.demo@interq.com found. Run create-test-users.ts first');
    return;
  }

  const technicalInterviews = [
    {
      title: 'Senior Frontend Interview - React/Next.js',
      job_role: 'Senior Frontend Engineer',
      duration_minutes: 60,
      description: 'Advanced React patterns, Next.js App Router, performance optimization',
      status: 'completed',
      final_score: 88,
      completed_at: faker.date.recent().toISOString()
    },
    {
      title: 'Full Stack Node/React Interview',
      job_role: 'Full Stack Developer',
      duration_minutes: 75,
      description: 'Node.js APIs, React state management, Prisma/PostgreSQL, testing',
      status: 'scheduled',
      final_score: null
    },
    {
      title: 'DevOps Interview - AWS/Docker/K8s',
      job_role: 'DevOps Engineer',
      duration_minutes: 90,
      description: 'CI/CD pipelines, Kubernetes, Terraform, AWS architecture',
      status: 'completed',
      final_score: 92,
      completed_at: faker.date.recent().toISOString()
    },
    {
      title: 'Python Django Backend Interview',
      job_role: 'Backend Engineer',
      duration_minutes: 60,
      description: 'Django REST Framework, PostgreSQL, Celery, Docker deployment',
      status: 'completed',
      final_score: 85,
      completed_at: faker.date.recent().toISOString()
    },
    {
      title: 'Mobile Flutter Interview',
      job_role: 'Mobile Developer',
      duration_minutes: 60,
      description: 'Flutter state management, Firebase integration, iOS/Android deployment',
      status: 'available',
      final_score: null
    }
  ];

  // Insert interviews (if not published, create)
  for (const interview of technicalInterviews) {
    const { data: existing } = await supabase
      .from('interviews')
      .select('id')
      .eq('title', interview.title)
      .single();

    const interviewId = existing?.id || (await supabase.from('interviews').insert(interview).select('id').single()).data.id;
    
    // Create session for jobseeker
    await supabase.from('interview_sessions').upsert({
      id: faker.datatype.uuid(),
      user_id: jobseeker.id,
      interview_id: interviewId,
      status: interview.status,
      completed: interview.status === 'completed',
      final_score: interview.final_score,
      completed_at: interview.completed_at,
      created_at: faker.date.recent().toISOString()
    });
  }

  console.log('✅ 5 technical interviews seeded for jobseeker.demo@interq.com');
  console.log('🔗 Test: localhost:8085/jobseeker/interviews');
}

seedJobSeekerInterviews().catch(console.error);

