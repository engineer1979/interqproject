-- Assessment Results Table
-- Stores assessment completion data for certificate generation

DROP TABLE IF EXISTS assessment_results CASCADE;

CREATE TABLE assessment_results (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  assessment_id TEXT,
  score INTEGER NOT NULL,
  total_questions INTEGER DEFAULT 20,
  correct_answers INTEGER DEFAULT 0,
  status TEXT DEFAULT 'completed' CHECK (status IN ('passed', 'failed', 'completed')),
  completed_at TIMESTAMPTZ DEFAULT NOW(),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE assessment_results ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own assessment results" ON assessment_results
FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own assessment results" ON assessment_results
FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE INDEX idx_assessment_results_user ON assessment_results(user_id);
CREATE INDEX idx_assessment_results_status ON assessment_results(status);