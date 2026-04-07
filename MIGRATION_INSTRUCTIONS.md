# Database Migration Instructions

## Apply the IT Interview System Migration

The migration file is located at:
`supabase/migrations/20261210000000_create_it_interview_system.sql`

### Option 1: Apply via Supabase Dashboard (Recommended)

1. Go to your Supabase project dashboard: https://supabase.com/dashboard
2. Navigate to your project
3. Go to **SQL Editor** in the left sidebar
4. Click **New Query**
5. Copy the contents of `supabase/migrations/20261210000000_create_it_interview_system.sql`
6. Paste it into the SQL Editor
7. Click **Run** to execute the migration

### Option 2: Apply via Supabase CLI (if installed)

```bash
supabase db push
```

### What the migration creates:

1. **ai_interviews table** - Stores interview records
   - id, user_id, title, category, status
   - scheduled_at, started_at, completed_at
   - score, total_questions, correct_answers

2. **interview_questions table** - Stores interview questions
   - id, interview_id, question_text, question_type
   - difficulty, category, order_index
   - user_answer, is_correct, points

3. **Row Level Security (RLS) policies** - Users can only access their own interviews

4. **Indexes** - For better query performance

### After Migration

Once the migration is applied, the interview system will be fully functional:

1. Complete an assessment
2. 6 IT interviews will be auto-generated (one for each domain)
3. Interviews will appear in the "Interviews" dashboard
4. Click "Start Interview" to begin taking interviews
5. Complete interviews and view results

### Verification

To verify the migration was successful, run this query in the SQL Editor:

```sql
SELECT table_name 
FROM information_schema.tables 
WHERE table_schema = 'public' 
AND table_name IN ('ai_interviews', 'interview_questions');
```

You should see both tables listed.