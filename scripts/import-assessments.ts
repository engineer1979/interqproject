
import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

// Load environment variables
const __dirname = path.dirname(fileURLToPath(import.meta.url));
dotenv.config({ path: path.resolve(__dirname, '../.env.local') });

const supabaseUrl = process.env.VITE_SUPABASE_URL;
const supabaseServiceKey = process.env.VITE_SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseServiceKey) {
    console.error('Missing VITE_SUPABASE_URL or VITE_SUPABASE_SERVICE_ROLE_KEY');
    process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseServiceKey);

async function importAssessments() {
    console.log('🚀 Starting Assessment Import...');

    // Get the first user to assign as creator
    const { data: users } = await supabase.auth.admin.listUsers({ page: 1, perPage: 1 });
    const userId = users?.users[0]?.id;

    if (!userId) {
        console.error('❌ No users found. Please create a user first.');
        return;
    }

    const assessmentsDir = path.resolve(__dirname, '../data/assessments');
    const files = fs.readdirSync(assessmentsDir).filter(f => f.endsWith('.json'));

    for (const file of files) {
        const filePath = path.join(assessmentsDir, file);
        let questions = JSON.parse(fs.readFileSync(filePath, 'utf8'));
        if (!Array.isArray(questions)) {
          console.log(`Skipping ${file} - not an array`);
          continue;
        }
        
        const title = file.replace('.json', '').split('-').map(s => s.charAt(0).toUpperCase() + s.slice(1)).join(' ');
        const domain = title.split(' ')[0];

        console.log(`📦 Importing: ${title} (${questions.length} questions)`);

        // 1. Create Assessment
        const { data: assessment, error: aError } = await supabase
            .from('assessments')
            .insert({
                title: title,
                domain: domain
            }).select()
            .select()
            .single();

        if (aError) {
            console.error(`❌ Error creating assessment ${title}:`, aError);
            continue;
        }

        // 2. Create Questions
        const questionsToInsert = questions.map((q: any, index: number) => ({
            assessment_id: assessment.id,
            question_text: q.question,
            question_type: 'multiple_choice',
            options: q.options,
            correct_answer: q.answer,
            difficulty: q.difficulty || 'easy',
            skill_tag: domain
        }));

        const { error: qError } = await supabase
            .from('questions')
            .insert(questionsToInsert);

        if (qError) {
            console.error(`❌ Error inserting questions for ${title}:`, qError);
        } else {
            console.log(`✅ Successfully imported ${title}`);
        }
    }

    console.log('🏁 Import Completed!');
}

importAssessments().catch(console.error);
