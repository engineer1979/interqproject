# Recruitment Platform Implementation TODO

Status: [0/N] Complete - Following Approved Plan

## Phase 1: DB/Backend (Supabase) [2/4] 
- [x] Create migration: add_recruiter_role_messaging_notifications.sql (recruiter enum/FKs, messages/conversations/notifications tables, triggers)
- [ ] Run `npx supabase db push` (needs `supabase link` first)
- [ ] Test get_user_role RPC with new 'recruiter'
- [ ] Update policies/RLS for new tables/roles

**Note:** DB push pending Supabase project link. Proceeding to frontend.

## Phase 2: Auth/Login/Signup [2/2] ✅
- [x] Edit src/pages/Auth.tsx: Add role selector UI (buttons for Admin/Company/Recruiter/Job Seeker)
- [x] Update AuthContext.tsx: Pass role to signup RPC; recruiter redirect to /recruiter

## Phase 3: Landing Page [0/3]
- [ ] Enhance src/pages/Index.tsx/LandingPage.tsx: Add job search bar, featured jobs/companies, stats
- [ ] Create src/components/Landing/JobSearch.tsx, FeaturedJobs.tsx
- [ ] Add SEO meta tags/scripts

## Phase 4: Recruiter Dashboard (New) [4/4] ✅
- [x] Create src/pages/recruiter/RecruiterDashboard.tsx (jobs, pipeline, ATS, chat)
- [x] Create src/components/recruiter/RecruiterLayout.tsx
- [ ] Create src/pages/recruiter/JobPosting.tsx (reuse CreateJobDialog)
- [x] Add routing in App.tsx for /recruiter/*

## Phase 5: Dashboard Polish [0/4]
- [ ] Edit AdminDashboard.tsx: User/company/job mgmt, analytics
- [ ] Edit CompanyDashboard.tsx: Recruiter mgmt, jobs
- [ ] Edit JobSeekerDashboard.tsx: Profile/resume/job search/applications
- [ ] Add charts/analytics to all

## Phase 6: Core Features [0/4]
- [ ] Create ATS ResumeUpload in jobseeker apply flow
- [ ] Create Messaging/ChatWindow with Supabase realtime
- [ ] Create NotificationCenter/Bell integration
- [ ] Job posting/search integration

## Phase 7: Testing/Deploy [0/3]
- [ ] E2E workflow tests
- [ ] Seed demo data
- [ ] Build/deploy Vercel

**Next Step: Phase 1 migration**

