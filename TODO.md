# Hiring Workflow Integration Plan

## Current Status
✅ All dashboards crash-free with fallbacks

## Full Workflow
1. Company posts job → JobSeeker applies → Company moves candidate status → Recruiter tracks → Admin monitors

## Implementation Steps
- [ ] 1. Make JobForm functional (Supabase insert job)
- [ ] 2. CompanyJobs: List/delete jobs
- [ ] 3. CompanyCandidates: List apps, status update dropdown
- [ ] 4. JobSeeker jobs/applications pages
- [ ] 5. Nav links in layouts
- [ ] 6. Test end-to-end

**DB Tables Needed:** jobs, applications (company_id, job_id, status, user_id)

Approve plan?
