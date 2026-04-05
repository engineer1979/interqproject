-- =====================================================
-- RECRUITER PORTAL DATABASE SCHEMA
-- Database: PostgreSQL (Supabase)
-- =====================================================

-- =====================================================
-- DROP EXISTING TABLES (Safe reset)
-- =====================================================

DROP TABLE IF EXISTS final_decisions CASCADE;
DROP TABLE IF EXISTS interview_evaluations CASCADE;
DROP TABLE IF EXISTS job_seeker_certificates CASCADE;
DROP TABLE IF EXISTS job_assessments CASCADE;
DROP TABLE IF EXISTS interview_sessions CASCADE;
DROP TABLE IF EXISTS interview_responses CASCADE;
DROP TABLE IF EXISTS interview_questions CASCADE;
DROP TABLE IF EXISTS interview_results CASCADE;
DROP TABLE IF EXISTS offers CASCADE;
DROP TABLE IF EXISTS interviews CASCADE;
DROP TABLE IF EXISTS candidates CASCADE;
DROP TABLE IF EXISTS job_openings CASCADE;
DROP TABLE IF EXISTS users CASCADE;

-- =====================================================
-- CREATE TABLES
-- =====================================================

-- 1. USERS TABLE
CREATE TABLE users (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    role VARCHAR(50) DEFAULT 'Recruiter',
    avatar_url TEXT,
    preferences JSONB,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 2. JOB OPENINGS TABLE
CREATE TABLE job_openings (
    id SERIAL PRIMARY KEY,
    user_id INTEGER REFERENCES users(id),
    title VARCHAR(255) NOT NULL,
    department VARCHAR(100) NOT NULL,
    location VARCHAR(100),
    salary_range VARCHAR(50),
    description TEXT,
    employment_type VARCHAR(50) DEFAULT 'Full-time',
    status VARCHAR(50) DEFAULT 'Draft',
    posted_date DATE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 3. CANDIDATES TABLE
CREATE TABLE candidates (
    id SERIAL PRIMARY KEY,
    job_id INTEGER NOT NULL REFERENCES job_openings(id),
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255) NOT NULL,
    phone VARCHAR(20),
    resume_url TEXT,
    applied_date DATE NOT NULL,
    current_stage VARCHAR(50) DEFAULT 'Applied',
    rating DECIMAL(3,2) DEFAULT 0.00,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 4. INTERVIEWS TABLE
CREATE TABLE interviews (
    id SERIAL PRIMARY KEY,
    candidate_id INTEGER NOT NULL REFERENCES candidates(id),
    job_id INTEGER NOT NULL REFERENCES job_openings(id),
    interview_date TIMESTAMP NOT NULL,
    interview_type VARCHAR(50) DEFAULT 'Video',
    status VARCHAR(50) DEFAULT 'Scheduled',
    interviewer_name VARCHAR(255),
    notes TEXT,
    feedback TEXT,
    rating DECIMAL(3,2),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 5. OFFERS TABLE
CREATE TABLE offers (
    id SERIAL PRIMARY KEY,
    candidate_id INTEGER NOT NULL REFERENCES candidates(id),
    job_id INTEGER NOT NULL REFERENCES job_openings(id),
    salary_offered DECIMAL(15,2),
    benefits TEXT,
    start_date DATE,
    status VARCHAR(50) DEFAULT 'Pending',
    offered_date DATE NOT NULL,
    response_date DATE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- =====================================================
-- SAMPLE DATA
-- =====================================================

INSERT INTO users (name, email, password_hash, role) VALUES 
('Admin User', 'admin@interq.com', '$2b$10$K8vX9yZ0W1pQ2rS3tU4v5u6V7wX8yZ9A0B1C2D3E4F5G6H7I8J9K0L1', 'Admin'),
('John Recruiter', 'john@interq.com', '$2b$10$K8vX9yZ0W1pQ2rS3tU4v5u6V7wX8yZ9A0B1C2D3E4F5G6H7I8J9K0L1', 'Recruiter'),
('Sarah Manager', 'sarah@interq.com', '$2b$10$K8vX9yZ0W1pQ2rS3tU4v5u6V7wX8yZ9A0B1C2D3E4F5G6H7I8J9K0L1', 'Hiring Manager');

INSERT INTO job_openings (user_id, title, department, location, salary_range, description, employment_type, status, posted_date) VALUES 
(2, 'Senior React Developer', 'Engineering', 'Remote', '$120k - $150k', 'React/Next.js, TypeScript, Node.js required', 'Full-time', 'Open', '2024-01-10'),
(2, 'DevOps Engineer', 'DevOps', 'New York', '$130k - $160k', 'AWS, Kubernetes, CI/CD', 'Full-time', 'Open', '2024-01-12'),
(3, 'Senior Product Manager', 'Product', 'London', '£85k - £110k', 'SaaS experience required', 'Full-time', 'Open', '2024-01-15');

INSERT INTO candidates (job_id, name, email, phone, applied_date, current_stage, rating) VALUES 
(1, 'Alice Johnson', 'alice.j@email.com', '+1-555-1234', '2024-01-15', 'Interviewed', 4.8),
(1, 'Bob Smith', 'bob.s@email.com', '+1-555-5678', '2024-01-18', 'Screened', 4.5),
(2, 'Carol Davis', 'carol.d@email.com', '+1-555-9012', '2024-01-20', 'Applied', 4.2),
(1, 'David Wilson', 'david.w@email.com', '+1-555-3456', '2024-01-22', 'Hired', 4.9);

INSERT INTO interviews (candidate_id, job_id, interview_date, interview_type, status, interviewer_name, rating) VALUES 
(1, 1, '2024-01-25 10:00:00', 'Technical', 'Completed', 'John Recruiter', 4.8),
(2, 1, '2024-01-28 14:00:00', 'Behavioral', 'Completed', 'Sarah Manager', 4.5);

INSERT INTO offers (candidate_id, job_id, salary_offered, benefits, status, offered_date) VALUES 
(1, 1, 140000, 'Full benefits, remote', 'Accepted', '2024-01-30'),
(4, 1, 125000, 'Full benefits', 'Accepted', '2024-01-31');

-- =====================================================
-- RLS + INDEXES
-- =====================================================

-- Row Level Security
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE job_openings ENABLE ROW LEVEL SECURITY;
ALTER TABLE candidates ENABLE ROW LEVEL SECURITY;
ALTER TABLE interviews ENABLE ROW LEVEL SECURITY;
ALTER TABLE offers ENABLE ROW LEVEL SECURITY;

-- Indexes for performance
CREATE INDEX idx_candidates_job_id ON candidates(job_id);
CREATE INDEX idx_candidates_stage ON candidates(current_stage);
CREATE INDEX idx_interviews_candidate_id ON interviews(candidate_id);
CREATE INDEX idx_offers_status ON offers(status);

-- =====================================================
-- VIEWS FOR REPORTS
-- =====================================================

CREATE VIEW candidate_pipeline AS
SELECT 
  j.title as job_title,
  c.name,
  c.email,
  c.current_stage,
  c.rating,
  c.applied_date,
  o.status as offer_status
FROM candidates c
JOIN job_openings j ON c.job_id = j.id
LEFT JOIN offers o ON c.id = o.candidate_id;

CREATE VIEW hiring_metrics AS
SELECT 
  COUNT(*) as total_candidates,
  COUNT(CASE WHEN current_stage = 'Hired' THEN 1 END)::DECIMAL as hired,
  AVG(rating) as avg_rating,
  COUNT(CASE WHEN current_stage = 'Interviewed' THEN 1 END) as interviews
FROM candidates;

COMMIT;

