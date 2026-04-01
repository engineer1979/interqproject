-- Create candidates table
CREATE TABLE IF NOT EXISTS candidates (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  position TEXT NOT NULL,
  interviewer UUID REFERENCES auth.users(id),
  date TIMESTAMPTZ DEFAULT now(),
  created_at TIMESTAMPTZ DEFAULT now()
);

-- Create evaluations table
CREATE TABLE IF NOT EXISTS evaluations (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  candidate_id UUID REFERENCES candidates(id) ON DELETE CASCADE,
  category TEXT NOT NULL,
  rating INTEGER CHECK (rating >= 1 AND rating <= 5),
  comments TEXT,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- Create final_decision table
CREATE TABLE IF NOT EXISTS final_decision (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  candidate_id UUID UNIQUE REFERENCES candidates(id) ON DELETE CASCADE,
  education BOOLEAN,
  recommendation TEXT CHECK (recommendation IN ('Advance', 'Advance with Reservations', 'Do Not Advance')),
  overall_comments TEXT,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- RLS policies for admin access
ALTER TABLE candidates ENABLE ROW LEVEL SECURITY;
ALTER TABLE evaluations ENABLE ROW LEVEL SECURITY;
ALTER TABLE final_decision ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Admin can view candidates" ON candidates FOR SELECT USING (true);
CREATE POLICY "Admin can insert candidates" ON candidates FOR INSERT WITH CHECK (true);
CREATE POLICY "Admin can update candidates" ON candidates FOR UPDATE USING (true);

CREATE POLICY "Admin can view evaluations" ON evaluations FOR ALL USING (true);
CREATE POLICY "Admin can view final_decision" ON final_decision FOR ALL USING (true);

-- Function to calculate overall score
CREATE OR REPLACE FUNCTION get_candidate_score(candidate_id UUID)
RETURNS DECIMAL AS $$
DECLARE
  avg_score DECIMAL;
BEGIN
  SELECT AVG(rating)::DECIMAL FROM evaluations WHERE candidate_id = $1 INTO avg_score;
  RETURN COALESCE(avg_score, 0);
END;
$$ LANGUAGE plpgsql;

-- View for dashboard with score
CREATE OR REPLACE VIEW candidate_dashboard AS
SELECT 
  c.*,
  get_candidate_score(c.id) as overall_score,
  fd.recommendation,
  CASE 
    WHEN get_candidate_score(c.id) >= 4 THEN 'advance'
    WHEN get_candidate_score(c.id) >= 3 THEN 'advance-reserve'
    ELSE 'reject'
  END as status
FROM candidates c
LEFT JOIN final_decision fd ON c.id = fd.candidate_id;

