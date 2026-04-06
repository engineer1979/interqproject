# Production Dashboard Implementation TODO

Status: In Progress

**Step 1: Types & Data** ✅
- [x] Create TODO.md
- [x] Expand src/data/candidateEvaluationsMock.ts (25 candidates, approved/hold/rejected/pending)
- [ ] Enhance src/types/candidateEvaluation.ts 

**Step 2: Services & Components** 
- [x] Create src/services/reportService.ts (CSV, PDF, Excel mock, stats)
- [x] Create src/components/dashboard/StatusCard.tsx (reusable cards)
- [ ] Create src/components/dashboard/ReportModal.tsx

**Step 3: Hooks** ✅
- [x] Update src/hooks/useEvaluationReports.ts (stats query, polling)

**Step 4: Dashboards**
- [ ] Edit src/pages/admin/CandidateEvaluationDashboard.tsx (cards, export, modal)
- [ ] Edit src/pages/recruiter/RecruiterDashboard.tsx (add section)

**Step 5: Test & Polish**
- [ ] Test exports/charts
- [ ] Add toasts/errors/retry
- [ ] Responsive/perf

**Bonus**
- [ ] Charts (recharts)
- [ ] Download history

