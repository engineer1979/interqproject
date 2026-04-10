-- Create coding_tests table
CREATE TABLE IF NOT EXISTS public.coding_tests (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    title TEXT NOT NULL,
    description TEXT,
    category TEXT NOT NULL,
    difficulty TEXT CHECK (difficulty IN ('easy', 'medium', 'hard')),
    duration_minutes INTEGER DEFAULT 25,
    status TEXT DEFAULT 'active' CHECK (status IN ('active', 'inactive', 'draft')),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create coding_test_questions table
CREATE TABLE IF NOT EXISTS public.coding_test_questions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    assessment_id UUID REFERENCES public.coding_tests(id) ON DELETE CASCADE,
    question TEXT NOT NULL,
    option_a TEXT NOT NULL,
    option_b TEXT NOT NULL,
    option_c TEXT NOT NULL,
    option_d TEXT NOT NULL,
    correct_answer TEXT CHECK (correct_answer IN ('A', 'B', 'C', 'D')),
    difficulty TEXT DEFAULT 'medium',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create live_interviews table
CREATE TABLE IF NOT EXISTS public.live_interviews (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    candidate_id UUID, -- usually references auth.users(id)
    recruiter_id UUID,
    title TEXT NOT NULL,
    platform TEXT CHECK (platform IN ('google_meet', 'zoom', 'teams')),
    meeting_link TEXT,
    scheduled_time TIMESTAMP WITH TIME ZONE,
    status TEXT DEFAULT 'scheduled' CHECK (status IN ('scheduled', 'ongoing', 'completed', 'cancelled')),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Add Row Level Security (RLS) policies
ALTER TABLE public.coding_tests ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.coding_test_questions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.live_interviews ENABLE ROW LEVEL SECURITY;

-- Coding Tests policies (Read-only for everyone for now)
CREATE POLICY "Enable read access for all users on coding_tests"
    ON public.coding_tests FOR SELECT
    USING (true);

-- Coding Test Questions policies
CREATE POLICY "Enable read access for all users on coding_test_questions"
    ON public.coding_test_questions FOR SELECT
    USING (true);

-- Live Interviews policies (Allow authenticated access)
CREATE POLICY "Enable read access for all users on live_interviews"
    ON public.live_interviews FOR SELECT
    USING (true);
CREATE POLICY "Enable insert for authenticated users" 
    ON public.live_interviews FOR INSERT
    WITH CHECK (auth.role() = 'authenticated');
CREATE POLICY "Enable update for authenticated users"
    ON public.live_interviews FOR UPDATE
    USING (auth.role() = 'authenticated');

-- Insert Initial Coding Tests records
INSERT INTO public.coding_tests (id, title, description, category, difficulty, duration_minutes)
VALUES
    ('c1111111-1111-1111-1111-111111111111', 'Frontend UI/UX Challenges', 'Complex scenario-based challenges for React and DOM manipulation.', 'Frontend', 'medium', 25),
    ('c2222222-2222-2222-2222-222222222222', 'Backend API Logic', 'Design scalable API logic and solve performance bottlenecks.', 'Backend', 'hard', 25),
    ('c3333333-3333-3333-3333-333333333333', 'AI Model Fine-tuning Scenarios', 'Answer scenario logic questions on data pipelining and AI optimization.', 'AI', 'medium', 25),
    ('c4444444-4444-4444-4444-444444444444', 'Data Structures & Algorithms', 'Core algorithm scenario tests utilizing optimal time/space complexity.', 'Data Structures', 'hard', 25)
ON CONFLICT DO NOTHING;

-- Insert 10 pseudo-random logic questions for the Frontend Test
INSERT INTO public.coding_test_questions (assessment_id, question, option_a, option_b, option_c, option_d, correct_answer)
SELECT 
    'c1111111-1111-1111-1111-111111111111',
    'Scenario ' || generate_series || ': You are tasked with optimizing a function that currently runs in O(n^2) time. Which of the following approaches is most likely to reduce the time complexity to O(n log n)?',
    'Applying a nested loop structure to carefully index elements.',
    'Utilizing a hash map to count frequencies in O(1) time.',
    'Implementing a divide-and-conquer algorithm like Merge Sort.',
    'Caching all results indiscriminately into memory.',
    'C'
FROM generate_series(1, 10);
