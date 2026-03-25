# Unified Assessment Management System - TODO

Status: [0/7] 

## Phase 1: Core Components [2/2] ✅
- [x] Created `src/components/assessment/AssessmentLibrary.tsx` 
- [x] Created `src/types/assessment.ts`


## Phase 2: Hero Page Integration [1/2] ✅
- [x] Updated `src/pages/Assessments.tsx` → uses AssessmentLibrary
- [ ] Add real-time Supabase subscription


## Phase 3: Dashboard Integration [0/3]
- [ ] JobSeekerDashboard → AssessmentLibrary (available + my results tabs)
- [ ] RecruiterDashboard → AssessmentLibrary (assign button, candidate analytics)
- [ ] AdminDashboard → AssessmentLibrary (CRUD, stats)

## Phase 4: Backend/API [0/2]
- [ ] Create Supabase RPC: `get_assessments_filtered`
- [ ] Add real-time RLS policies for role-sync

## Phase 5: Testing [0/1]
- [ ] E2E test filters across roles

**Next: Phase 1 → Create AssessmentLibrary component**

