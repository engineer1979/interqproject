-- Add missing columns to assessments table and seed demo data

-- Add difficulty column if not exists
DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'assessments' AND column_name = 'difficulty') THEN
    ALTER TABLE assessments ADD COLUMN difficulty TEXT DEFAULT 'medium';
  END IF;
END $$;

-- Add domain column if not exists
DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'assessments' AND column_name = 'domain') THEN
    ALTER TABLE assessments ADD COLUMN domain TEXT;
  END IF;
END $$;

-- Add duration column if not exists (for compatibility)
DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'assessments' AND column_name = 'duration') THEN
    ALTER TABLE assessments ADD COLUMN duration INTEGER DEFAULT 30;
  END IF;
END $$;

-- Insert demo assessments with proper difficulty and domain
INSERT INTO assessments (title, description, category, domain, difficulty, duration_minutes, total_questions, passing_score, is_active)
SELECT 'Python Programming', 'Test your Python programming skills from basics to advanced concepts', 'Programming', 'Python', 'easy', 30, 20, 70, true
WHERE NOT EXISTS (SELECT 1 FROM assessments WHERE title = 'Python Programming');

INSERT INTO assessments (title, description, category, domain, difficulty, duration_minutes, total_questions, passing_score, is_active)
SELECT 'Advanced Python', 'Advanced Python topics including decorators, generators, and metaclasses', 'Programming', 'Python', 'hard', 45, 15, 75, true
WHERE NOT EXISTS (SELECT 1 FROM assessments WHERE title = 'Advanced Python');

INSERT INTO assessments (title, description, category, domain, difficulty, duration_minutes, total_questions, passing_score, is_active)
SELECT 'AWS Fundamentals', 'Cloud computing basics with Amazon Web Services', 'Cloud', 'AWS', 'easy', 25, 15, 70, true
WHERE NOT EXISTS (SELECT 1 FROM assessments WHERE title = 'AWS Fundamentals');

INSERT INTO assessments (title, description, category, domain, difficulty, duration_minutes, total_questions, passing_score, is_active)
SELECT 'AWS Solutions Architect', 'Design and deploy scalable systems on AWS', 'Cloud', 'AWS', 'hard', 60, 20, 80, true
WHERE NOT EXISTS (SELECT 1 FROM assessments WHERE title = 'AWS Solutions Architect');

INSERT INTO assessments (title, description, category, domain, difficulty, duration_minutes, total_questions, passing_score, is_active)
SELECT 'SQL Basics', 'Introduction to SQL queries and database concepts', 'Database', 'SQL', 'easy', 20, 15, 70, true
WHERE NOT EXISTS (SELECT 1 FROM assessments WHERE title = 'SQL Basics');

INSERT INTO assessments (title, description, category, domain, difficulty, duration_minutes, total_questions, passing_score, is_active)
SELECT 'Advanced SQL', 'Complex queries, joins, subqueries, and optimization', 'Database', 'SQL', 'hard', 45, 15, 75, true
WHERE NOT EXISTS (SELECT 1 FROM assessments WHERE title = 'Advanced SQL');

INSERT INTO assessments (title, description, category, domain, difficulty, duration_minutes, total_questions, passing_score, is_active)
SELECT 'JavaScript Essentials', 'Core JavaScript concepts and DOM manipulation', 'Programming', 'JavaScript', 'easy', 30, 20, 70, true
WHERE NOT EXISTS (SELECT 1 FROM assessments WHERE title = 'JavaScript Essentials');

INSERT INTO assessments (title, description, category, domain, difficulty, duration_minutes, total_questions, passing_score, is_active)
SELECT 'React Development', 'Modern React with hooks and state management', 'Programming', 'React', 'medium', 40, 15, 75, true
WHERE NOT EXISTS (SELECT 1 FROM assessments WHERE title = 'React Development');

INSERT INTO assessments (title, description, category, domain, difficulty, duration_minutes, total_questions, passing_score, is_active)
SELECT 'Linux Administration', 'Linux commands, file system, and system management', 'Operating Systems', 'Linux', 'medium', 35, 15, 70, true
WHERE NOT EXISTS (SELECT 1 FROM assessments WHERE title = 'Linux Administration');

INSERT INTO assessments (title, description, category, domain, difficulty, duration_minutes, total_questions, passing_score, is_active)
SELECT 'Cybersecurity Basics', 'Introduction to security principles and best practices', 'Security', 'Security', 'easy', 25, 15, 70, true
WHERE NOT EXISTS (SELECT 1 FROM assessments WHERE title = 'Cybersecurity Basics');

INSERT INTO assessments (title, description, category, domain, difficulty, duration_minutes, total_questions, passing_score, is_active)
SELECT 'Penetration Testing', 'Ethical hacking and vulnerability assessment', 'Security', 'Security', 'hard', 60, 12, 80, true
WHERE NOT EXISTS (SELECT 1 FROM assessments WHERE title = 'Penetration Testing');

INSERT INTO assessments (title, description, category, domain, difficulty, duration_minutes, total_questions, passing_score, is_active)
SELECT 'Docker & Containers', 'Container technology and Docker fundamentals', 'DevOps', 'Docker', 'medium', 30, 15, 75, true
WHERE NOT EXISTS (SELECT 1 FROM assessments WHERE title = 'Docker & Containers');

INSERT INTO assessments (title, description, category, domain, difficulty, duration_minutes, total_questions, passing_score, is_active)
SELECT 'Git Version Control', 'Version control with Git and GitHub workflows', 'DevOps', 'Git', 'easy', 20, 12, 70, true
WHERE NOT EXISTS (SELECT 1 FROM assessments WHERE title = 'Git Version Control');
