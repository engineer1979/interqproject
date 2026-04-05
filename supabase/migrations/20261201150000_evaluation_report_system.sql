CREATE TABLE IF NOT EXISTS evaluation_reports (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  candidate_id UUID NOT NULL REFERENCES candidates(id),
  assessment_id UUID REFERENCES assessments(id),
  interview_id UUID REFERENCES interviews(id),
  title TEXT NOT NULL,
  summary TEXT,
  role_suitability_score INTEGER CHECK (role_suitability_score BETWEEN 0 AND 100),
  competencies JSONB DEFAULT '{}',
  strengths_areas JSONB DEFAULT '{}',
  recommendations JSONB DEFAULT '{}',
  status VARCHAR(20) DEFAULT 'draft' CHECK (status IN ('draft', 'final', 'archived')),
  version INTEGER DEFAULT 1,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- report_collaborations table
CREATE TABLE IF NOT EXISTS report_collaborations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  report_id UUID NOT NULL REFERENCES evaluation_reports(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES auth.users(id),
  permission VARCHAR(20) CHECK (permission IN ('view', 'comment', 'edit', 'owner')),
  comment_text TEXT,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- Enable RLS
ALTER TABLE evaluation_reports ENABLE ROW LEVEL SECURITY;
ALTER TABLE report_collaborations ENABLE ROW LEVEL SECURITY;

-- RLS Policies (RBAC)
CREATE POLICY "Users can view own reports" ON evaluation_reports FOR SELECT USING (candidate_id = auth.uid());
CREATE POLICY "Recruiters can view company reports" ON evaluation_reports FOR SELECT USING (true); -- Adjust per role
CREATE POLICY "Users can comment on shared reports" ON report_collaborations FOR ALL USING (true);

-- Auto-generation Trigger
CREATE OR REPLACE FUNCTION trigger_evaluation_report()
RETURNS TRIGGER AS $$
DECLARE
  report record;
BEGIN
  IF NEW.assessment_score IS NOT NULL AND NEW.interview_score IS NOT NULL AND NEW.status = 'completed' THEN
    INSERT INTO evaluation_reports (candidate_id, assessment_id, ...)
      VALUES (NEW.candidate_id, NEW.assessment_id, NEW.interview_id, 'Auto-Generated Report', ...)
      ON CONFLICT DO NOTHING;
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Performance Indexes
CREATE INDEX idx_eval_reports_candidate ON evaluation_reports (candidate_id);
CREATE INDEX idx_eval_reports_status ON evaluation_reports (status);

-- Dashboard View
CREATE OR REPLACE VIEW evaluation_report_dashboard AS
SELECT 
  r.*,
  COUNT(c.id) as collaboration_count
FROM evaluation_reports r
LEFT JOIN report_collaborations c ON r.id = c.report_id
GROUP BY r.id;
