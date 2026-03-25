import { createClient } from '@supabase/supabase-js';
import fs from 'fs';
import path from 'path';

// Supabase URL & Key
const SUPABASE_URL = "https://lenltzlsnlbzwlizmijc.supabase.co";
const SUPABASE_ANON_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imxlbmx0emxzbmxiendsaXptaWpjIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjQzMzQxNDgsImV4cCI6MjA3OTkxMDE0OH0.O0y6JNNuUo9WOdd-Yq12M9sTwTc8YduaY1p_AG3NpCE";

const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

async function seed() {
  console.log("Starting seed process...");
  
  const { data: authData, error: authError } = await supabase.auth.signInWithPassword({
    email: 'admin.demo@interq.com',
    password: 'Admin@123'
  });

  if (authError) {
    console.error('Login failed:', authError.message);
    return;
  }

  const userId = authData.user.id;
  console.log('Logged in as Admin:', userId);

  const dir = './data/assessments';
  const files = fs.readdirSync(dir).filter(f => f.endsWith('.json'));

  let assessmentCounter = 1;

  for (const file of files) {
    const rawData = fs.readFileSync(path.join(dir, file), 'utf-8');
    const questions = JSON.parse(rawData);

    // Create 5 variations
    for (let variant = 1; variant <= 5; variant++) {
      let titlePrefix = file.replace('.json', '').replace(/-01/, '').split('-').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ');
      
      let title = `${titlePrefix} Assessment`;
      if (variant === 2) title = `Advanced ${titlePrefix} Assessment`;
      if (variant === 3) title = `${titlePrefix} Foundation Certification`;
      if (variant === 4) title = `Senior ${titlePrefix} Test`;
      if (variant === 5) title = `${titlePrefix} Practitioner Exam`;

      const domain = titlePrefix.split(' ')[0];

      console.log(`[${assessmentCounter}/50] Inserting: ${title}`);

      // Insert Assessment
      const { data: assessment, error: aError } = await supabase
        .from('assessments')
        .insert({
          title,
          description: `Comprehensive evaluation covering ${titlePrefix} methodologies and practical implementation details. Designed for professionals seeking validation of their skills.`,
          category: domain,
          difficulty: variant > 3 ? 'Hard' : (variant > 1 ? 'Medium' : 'Easy'),
          duration_minutes: 60,
          created_by: userId,
          is_published: true
        })
        .select()
        .single();
      
      if (aError) {
        console.error('Error inserting assessment:', aError.message);
        continue;
      }

      // Insert Questions
      const questionsToInsert = questions.map((q, idx) => ({
        assessment_id: assessment.id,
        question_text: q.question,
        question_type: 'multiple_choice',
        options: q.options,
        correct_answer: q.answer,
        points: q.difficulty === 'Hard' ? 3 : (q.difficulty === 'Medium' ? 2 : 1),
        order_index: idx + 1
      }));

      const { error: qError } = await supabase
        .from('assessment_questions')
        .insert(questionsToInsert);

      if (qError) {
        console.error('Error inserting questions:', qError.message);
      }
      
      assessmentCounter++;
    }
  }

  console.log(`Successfully seeded ${assessmentCounter - 1} assessments!`);
}

seed();
