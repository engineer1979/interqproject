# Assessment Workflow Loading Fix
Status: [0/12]

## Phase 1: Critical Components [4/4] ✅✅
- [x] Optimize AssessmentSelection.tsx (aggregate query + React Query + error UI)
- [x] Create useAssessments hook  
- [x] Migrate AssessmentLibrary.tsx 
- [x] Fix Assessments.tsx fetchAssessments()

## Phase 2: Workflow [1/4]
- [x] Audit AssessmentWorkflow.tsx loading (session manager fixed)
- [ ] Add Suspense + streaming
- [ ] Prefetch on hover
- [ ] Virtualized lists

## Phase 3: Resilience [0/2]
- [ ] Offline mocks always available
- [ ] Smart empty states everywhere

## Phase 4: Testing [0/2]
- [ ] Unit tests (useAssessments)
- [ ] E2E (happy path + error)

**Next**: Phase 1 → Install React Query → AssessmentSelection fix

