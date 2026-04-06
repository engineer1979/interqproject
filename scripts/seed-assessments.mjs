import { createClient } from '@supabase/supabase-js';
import { assessmentsData } from '../src/data/assessments.ts';
import { assessmentQuestions } from '../src/data/assessmentQuestions.ts';

const supabaseUrl = process.env.VITE_SUPABASE_URL;
const supabaseKey = process.env.VITE_SUPABASE_ANON_KEY || process.env.SUPABASE_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.error('Missing Supabase credentials. Set VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

async function seedAssessments() {
  console.log('🌱 Seeding assessments...');

  try {
    // Insert assessments
    const { data: insertedAssessments, error: assessmentsError } = await supabase
      .from('assessments')
      .upsert(assessmentsData.map(a => ({
        id: a.id,
        title: a.title,
        description: a.description,
        category: a.category,
        difficulty: a.difficulty,
        duration: a.duration,
        questions_count: a.questions_count,
        status: a.status,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      })))
      .select();

    if (assessmentsError) {
      console.error('Error seeding assessments:', assessmentsError);
      return;
    }

    console.log(`✅ Inserted ${insertedAssessments?.length || 0} assessments`);

    // Insert questions (limit to prevent timeout)
    const questionsToInsert = assessmentQuestions.slice(0, 200); // Insert first 200 questions

    const { data: insertedQuestions, error: questionsError } = await supabase
      .from('assessment_questions')
      .upsert(questionsToInsert.map(q => ({
        id: q.id,
        assessment_id: q.assessment_id,
        question: q.question,
        option_a: q.option_a,
        option_b: q.option_b,
        option_c: q.option_c,
        option_d: q.option_d,
        correct_answer: q.correct_answer,
        difficulty: q.difficulty,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      })))
      .select();

    if (questionsError) {
      console.error('Error seeding questions:', questionsError);
      return;
    }

    console.log(`✅ Inserted ${insertedQuestions?.length || 0} questions`);
    console.log('🎉 Seeding completed successfully!');

  } catch (error) {
    console.error('Seeding failed:', error);
  }
}

seedAssessments();