# InterQ Platform — Setup Guide

## Demo Accounts (Work Immediately — No Setup Required)

| Role | Email | Password | Accesses |
|------|-------|----------|---------|
| Admin | admin.demo@interq.com | Admin@123 | Full platform, all companies, reports |
| Company | company.demo@interq.com | Company@123 | Jobs, candidates, interviews, team |
| Recruiter | recruiter.demo@interq.com | Recruiter@123 | Pipeline, candidates, assessments |
| Job Seeker | jobseeker.demo@interq.com | JobSeeker@123 | Applications, interviews, profile |

> Demo sessions last 1 hour. Use the "Try Demo" button on the login page.

---

## Quick Start (Local Development)

```bash
# 1. Install dependencies
npm install

# 2. Start dev server
npm run dev

# 3. Open browser
# http://localhost:5173
```

---

## Database Setup (For Real User Accounts)

The demo accounts work without any database setup. To enable real user registration and live data:

### Step 1 — Create Supabase Project
1. Go to [supabase.com](https://supabase.com) and create a free project
2. Note your **Project URL** and **Anon Key**

### Step 2 — Configure Environment
Create a `.env` file in the project root:
```env
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-key-here
```

### Step 3 — Push Database Migrations
```bash
# Link to your Supabase project
npx supabase login
npx supabase link --project-ref your-project-ref

# Push all migrations (creates all tables, RLS policies, triggers)
npx supabase db push
```

This creates:
- `profiles` — user profiles
- `assessments` / `assessment_questions` / `assessment_results` — assessment system
- `jobs` / `applications` — job board
- `interviews` — interview scheduling
- `conversations` / `messages` — messaging system
- `notifications` — notification center
- `user_roles` — role-based access control

### Step 4 — Enable Email Auth (optional)
In Supabase Dashboard → Authentication → Settings:
- Enable email confirmations (or disable for testing)
- Configure SMTP for real email delivery

---

## Deployment (Vercel)

```bash
# Install Vercel CLI
npm i -g vercel

# Deploy
vercel --prod
```

Set environment variables in Vercel Dashboard:
- `VITE_SUPABASE_URL`
- `VITE_SUPABASE_ANON_KEY`

---

## Features by Role

### Admin Dashboard (`/admin`)
- Platform analytics, company management, user management
- Assessment management, question bank, results
- Role & permission management, audit logs
- Reports, integrations, billing

### Company Dashboard (`/company`)
- Post and manage jobs, view applicants
- Candidate pipeline, interview scheduling
- Team management, notifications, audit logs

### Recruiter Dashboard (`/recruiter`)
- Assigned jobs, candidate pipeline (Kanban board)
- Assessment assignment, interview management
- Messaging with candidates

### Job Seeker Dashboard (`/jobseeker`)
- Browse and apply to jobs, save jobs
- Track applications, interview schedule
- Profile & resume management, certificates

---

## Pages Fixed in This Update

| Category | Fixed |
|----------|-------|
| Stub routes → real pages | 20 routes |
| New feature pages | 17 pages (Jobs, Candidates, Interviews, Messaging, Reports, Billing, Team, Profile, SavedJobs, TalentPool, Pipeline, Companies, Users, Security, Integrations, AuditLogs, Settings) |
| Broken quick-action buttons | All fixed |
| Notification bell | Role-based, interactive |
| Auth redirect loop | Fixed |
| Legal pages | Privacy, Terms, GDPR, Cookie, API Docs — real content |
| Admin broken imports | mockAdminStats → mockKPIs |
| Recruiter routes | jobs/candidates/offers/reports/settings |
| Demo account sessions | Working correctly |


---

## Supabase Migration Issues Fixed

### What Was Wrong
The existing migrations had several critical bugs:

| Problem | Fix Applied |
|---------|-------------|
| `app_role` enum missing `company` and `job_seeker` values | Added in master_fix migration |
| `profiles` table missing columns (location, skills, resume_url, etc.) | Added with ALTER TABLE |
| `jobs` table missing columns (salary, skills, workplace_type, etc.) | Added with ALTER TABLE |
| `get_user_role()` RPC didn't handle all role names | Rewritten to handle all variants |
| `handle_new_user()` used wrong default role | Fixed to use `job_seeker` |
| RLS policies conflicting on jobs/applications | Cleaned up and rewritten |
| Demo users in edge function used wrong emails | Fixed to match frontend |
| `conversations/messages/notifications` tables never created | Created in master_fix |

### How to Apply
```bash
# This runs all migrations in order — master_fix runs last and fixes everything
npx supabase db push
```

### After Push — Create Demo Users in Supabase
Invoke the edge function once to seed demo accounts in your real Supabase project:
```bash
# Using Supabase CLI
npx supabase functions invoke create-demo-users

# Or via curl (replace YOUR_PROJECT_URL and YOUR_ANON_KEY)
curl -X POST https://YOUR_PROJECT_URL.supabase.co/functions/v1/create-demo-users \
  -H "apikey: YOUR_ANON_KEY"
```

This creates these real Supabase accounts:
- admin.demo@interq.com / Admin@123
- company.demo@interq.com / Company@123
- recruiter.demo@interq.com / Recruiter@123
- jobseeker.demo@interq.com / JobSeeker@123

### Migration Order (all files in supabase/migrations/)
1. Core schema (profiles, assessments, interviews) — 2025-11 files
2. Role system (app_role enum, user_roles) — 20251128141554
3. Job application schema (jobs, applications) — 20251214000000
4. Recruiter + messaging + notifications — 20261202000000
5. **Master fix** (fixes all bugs above) — **20260324000000_master_fix.sql** ← Run this last

