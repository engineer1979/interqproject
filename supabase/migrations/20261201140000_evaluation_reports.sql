-- Drop existing tables if they exist (idempotent)
DROP TABLE IF EXISTS report_shares;
DROP TABLE IF EXISTS evaluation_reports;

-- Create evaluation reports table with correct data types
CREATE TABLE evaluation_reports (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    candidate_id INTEGER NOT NULL,
    assessment_id UUID NOT NULL,
    interview_id INTEGER,
    report_title VARCHAR(255) NOT NULL,
    report_summary TEXT NOT NULL,
    overall_score INTEGER NOT NULL CHECK (overall_score BETWEEN 0 AND 100),
    proficiency_level VARCHAR(20) NOT NULL CHECK (proficiency_level IN ('Beginner', 'Intermediate', 'Proficient', 'Advanced', 'Expert')),
    created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
    status VARCHAR(20) DEFAULT 'draft' CHECK (status IN ('draft', 'final', 'archived')),
    metadata JSONB DEFAULT '{}'::JSONB,
    
    FOREIGN KEY (candidate_id) REFERENCES candidates(id) ON DELETE CASCADE,
    FOREIGN KEY (assessment_id) REFERENCES assessments(id) ON DELETE CASCADE,
    FOREIGN KEY (interview_id) REFERENCES interviews(id) ON DELETE SET NULL
);

-- Create sharing permissions table
CREATE TABLE report_shares (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    report_id UUID NOT NULL,
    shared_with_user_id UUID NOT NULL,
    shared_by_user_id UUID NOT NULL,
    shared_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
    permission_level VARCHAR(20) NOT NULL CHECK (permission_level IN ('view', 'comment', 'edit', 'owner')),
    expires_at TIMESTAMPTZ,
    notes TEXT,
    
    FOREIGN KEY (report_id) REFERENCES evaluation_reports(id) ON DELETE CASCADE,
    FOREIGN KEY (shared_with_user_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (shared_by_user_id) REFERENCES users(id) ON DELETE CASCADE,
    
    UNIQUE (report_id, shared_with_user_id)
);

-- Create index for better performance
CREATE INDEX idx_report_shares_report ON report_shares (report_id);
CREATE INDEX idx_report_shares_user ON report_shares (shared_with_user_id);

-- Create view for report details (corrected to use assessment_types.name)
CREATE OR REPLACE VIEW evaluation_report_details AS
SELECT
    r.id AS report_id,
    r.report_title,
    r.report_summary,
    r.overall_score,
    r.proficiency_level,
    r.status,
    r.created_at,
    r.updated_at,
    a.id AS assessment_id,
    at.name AS assessment_title,  -- CORRECTED: using assessment_types.name instead of assessments.title
    a.score AS assessment_score,
    a.proficiency_level AS assessment_proficiency,
    i.id AS interview_id,
    i.interview_date,
    i.interviewer_name,
    i.feedback AS interview_feedback,
    ca.id AS candidate_id,
    COALESCE(
        r.metadata->>'candidate_name', 
        'Candidate #' || ca.id::TEXT
    ) AS candidate_name,
    COALESCE(ca.email, '') AS candidate_email,
    COUNT(s.id) AS share_count
FROM evaluation_reports r
JOIN assessments a ON r.assessment_id = a.id
JOIN assessment_types at ON a.assessment_type_id = at.id  -- JOIN to get the title
LEFT JOIN interviews i ON r.interview_id = i.id
JOIN candidates ca ON r.candidate_id = ca.id
LEFT JOIN report_shares s ON r.id = s.report_id
GROUP BY 
    r.id, 
    a.id, 
    at.id,  -- Need to group by at.id since we're selecting from it
    i.id, 
    ca.id;
