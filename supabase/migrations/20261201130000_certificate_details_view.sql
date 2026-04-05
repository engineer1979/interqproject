-- Drop the problematic view first
DROP VIEW IF EXISTS certificate_details;

-- Create a robust view that works with any candidate table structure
CREATE OR REPLACE VIEW certificate_details AS
SELECT
    c.id AS certificate_id,
    c.certificate_number,
    c.verification_code,
    c.issue_date,
    c.valid_until,
    c.status,
    a.id AS assessment_id,
    a.assessment_date,
    a.score,
    a.percentile_rank,
    a.proficiency_level,
    at.name AS assessment_type_name,
    at.description AS assessment_description,
    at.version AS assessment_version,
    ca.id AS candidate_id,
    -- Get candidate name from certificate metadata first, then fallback
    COALESCE(
        c.metadata->>'candidate_name', 
        'Candidate #' || ca.id::TEXT
    ) AS candidate_name
FROM certificates c
JOIN assessments a ON c.assessment_id = a.id
JOIN assessment_types at ON a.assessment_type_id = at.id
JOIN candidates ca ON c.candidate_id = ca.id;
