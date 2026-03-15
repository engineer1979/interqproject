from fastapi import FastAPI, UploadFile, File, Form, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
from pydantic import BaseModel
import pdfplumber
from docx import Document
import spacy
import re
import nltk
from nltk.corpus import stopwords
from nltk.tokenize import word_tokenize
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.metrics.pairwise import cosine_similarity
import numpy as np
import os
from typing import List, Dict
import uuid
import sqlite3
from datetime import datetime

nltk.download('punkt')
nltk.download('stopwords')

# Load spaCy model (download with python -m spacy download en_core_web_sm)
try:
    nlp = spacy.load("en_core_web_sm")
except OSError:
    print("Download spaCy model: python -m spacy download en_core_web_sm")
    nlp = None

app = FastAPI(title="ATS Resume Screener API")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# DB setup
DB_PATH = "ats.db"

def init_db():
    conn = sqlite3.connect(DB_PATH)
    c = conn.cursor()
    c.execute('''CREATE TABLE IF NOT EXISTS screenings
                 (id TEXT PRIMARY KEY, job_desc TEXT, resume_file TEXT, resume_text TEXT, 
                  score REAL, extracted_data TEXT, created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP)''')
    conn.commit()
    conn.close()

init_db()

class ScreeningRequest(BaseModel):
    job_description: str

class ScreeningResponse(BaseModel):
    score: float
    name: str
    email: str
    phone: str
    skills: List[str]
    experience_years: float
    education: List[str]
    match_reasons: List[str]
    missing_keywords: List[str]
    ats_score: float

@app.post("/screen_resume/", response_model=Dict)
async def screen_resume(
    resume: UploadFile = File(...),
    job_description: str = Form(...)
):
    if not nlp:
        return JSONResponse(status_code=500, content={"error": "spaCy model not loaded"})
    
    # Save resume
    resume_id = str(uuid.uuid4())
    resume_path = f"uploads/{resume_id}_{resume.filename}"
    os.makedirs("uploads", exist_ok=True)
    
    content = await resume.read()
    with open(resume_path, "wb") as f:
        f.write(content)
    
    # Extract text
    resume_text = extract_text(resume_path, resume.content_type)
    
    # Screen
    result = analyze_resume(resume_text, job_description)
    
    # Save to DB
    conn = sqlite3.connect(DB_PATH)
    c = conn.cursor()
    c.execute(
        "INSERT INTO screenings VALUES (?, ?, ?, ?, ?, ?, ?)",
        (resume_id, job_description, resume.filename, resume_text, result['score'], str(result), datetime.now())
    )
    conn.commit()
    conn.close()
    
    return {"screening_id": resume_id, **result}

def extract_text(file_path: str, content_type: str) -> str:
    text = ""
    if 'pdf' in content_type:
        with pdfplumber.open(file_path) as pdf:
            text = "\n".join(page.extract_text() or [] for page in pdf.pages)
    elif 'docx' in content_type:
        doc = Document(file_path)
        text = "\n".join(para.text for para in doc.paragraphs)
    return text

def preprocess_text(text: str) -> str:
    text = re.sub(r'\W', ' ', text.lower())
    tokens = word_tokenize(text)
    stop_words = set(stopwords.words('english'))
    tokens = [w for w in tokens if w not in stop_words and len(w) > 2]
    return ' '.join(tokens)

def analyze_resume(resume_text: str, job_desc: str) -> Dict:
    if not nlp:
        return {"score": 0.0, "error": "NLP not available"}
    
    resume_doc = nlp(resume_text)
    job_doc = nlp(job_desc)
    
    # Extract entities
    name = " ".join(ent.text for ent in resume_doc.ents if ent.label_ == "PERSON")[:50]
    email = re.search(r'\b[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Z|a-z]{2,}\b', resume_text)
    phone = re.search(r'\b\d{3}[-.]? \d{3}[-.]? \d{4}\b', resume_text)
    
    # Skills from job desc
    job_skills = [token.lemma_ for token in job_doc if token.pos_ in ['NOUN', 'PROPN'] and token.is_alpha]
    
    # Resume skills
    resume_skills = [token.lemma_ for token in resume_doc if token.pos_ in ['NOUN', 'PROPN'] and token.is_alpha and len(token.text) > 2]
    
    # TF-IDF matching
    vectorizer = TfidfVectorizer()
    tfidf_matrix = vectorizer.fit_transform([preprocess_text(job_desc), preprocess_text(resume_text)])
    similarity = cosine_similarity(tfidf_matrix[0:1], tfidf_matrix[1:2])[0][0]
    
    # Skill match score
    skill_match = len(set(job_skills) & set(resume_skills)) / len(set(job_skills)) if job_skills else 0
    
    # Experience estimation (simple)
    experience_keywords = ['year', 'years', 'experience']
    exp_mentions = sum(1 for kw in experience_keywords if kw in resume_text.lower())
    exp_score = min(exp_mentions * 25, 25)
    
    # Education score
    edu_score = 25 if any(word in resume_text.lower() for word in ['bachelor', 'master', 'phd']) else 0
    
    # Total score
    score = min((similarity * 30 + skill_match * 30 + exp_score + edu_score), 100)
    
    # Missing keywords
    missing_keywords = [skill for skill in job_skills[:10] if skill not in resume_skills]
    
    return {
        "score": float(score),
        "name": name or "Not found",
        "email": email.group() if email else "Not found",
        "phone": phone.group() if phone else "Not found",
        "skills": list(set(resume_skills))[:10],
        "experience_years": exp_mentions,
        "education": [ent.text for ent in resume_doc.ents if ent.label_ == "ORG" or "university" in ent.text.lower()],
        "match_reasons": ["Good skill overlap" if skill_match > 0.5 else "Limited skills"],
        "missing_keywords": missing_keywords[:5],
        "ats_score": float(95 - len(re.findall(r'[Tt]able|[Ii]mage|[Cc]hart', resume_text)) * 5)
    }

@app.get("/screenings/")
async def get_screenings():
    conn = sqlite3.connect(DB_PATH)
    c = conn.cursor()
    c.execute("SELECT * FROM screenings ORDER BY created_at DESC LIMIT 20")
    rows = c.fetchall()
    conn.close()
    return [{"id": row[0], "filename": row[2], "score": row[4], "created_at": row[6]} for row in rows]

@app.get("/download/{screening_id}")
async def download_result(screening_id: str):
    conn = sqlite3.connect(DB_PATH)
    c = conn.cursor()
    c.execute("SELECT extracted_data FROM screenings WHERE id = ?", (screening_id,))
    row = c.fetchone()
    conn.close()
    if not row:
        raise HTTPException(status_code=404, detail="Screening not found")
    return {"result": row[0]}

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
