# ATS Resume Screener

## Backend
```bash
cd ats-resume-screener/backend
# Activate venv if created, or use global
uvicorn main:app --reload --port 8000
```
API at http://localhost:8000/docs

## Frontend
```bash
cd ats-resume-screener/frontend
npm install
npm run dev
```

## Features
- PDF/DOCX parsing
- Skill/keyword extraction (spaCy)
- TF-IDF matching score
- SQLite persistence
- Frontend upload + dashboard

## Usage
POST /screen_resume/ with resume file + job_description text.
