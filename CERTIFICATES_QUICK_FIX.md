# Quick Fix: Certificates Not Showing

## Issue
Certificates not appearing after completion

## Solution Applied

1. **Added Demo Certificate Button**
   - Click "Generate Demo Certificate" in empty state
   - Creates a sample certificate instantly

2. **Added Real-time Refresh**
   - Certificates page now auto-refreshes every 2 seconds
   - `refetchInterval: 2000` added to query

3. **Demo Certificate SQL Migration**
   - Run this in Supabase SQL Editor:
   ```sql
   -- Insert Demo Certificate
   INSERT INTO certificates (user_id, name, title, assessment_score, interview_score, status, certificate_number)
   VALUES (
     (SELECT id FROM auth.users LIMIT 1),
     'Demo Candidate',
     'IT Technical Interview Certification',
     85,
     88,
     'issued',
     'CERT-DEMO-2026-001'
   )
   ON CONFLICT (certificate_number) DO NOTHING;
   ```

## How to Test

1. Go to Certificates page
2. Click "Generate Demo Certificate" button
3. Certificate should appear immediately
4. Click "Download PDF" to test PDF generation

## If Still Not Showing

1. Check browser console for errors
2. Verify migrations are applied in Supabase
3. Check user is logged in
4. Verify `certificates` table exists in Supabase

## Required Migrations (if not applied)

Run these in Supabase SQL Editor:
1. `supabase/migrations/20261210000000_create_certificates_table.sql`
2. `supabase/migrations/20261210000001_create_assessment_results_table.sql`
3. `supabase/migrations/20261210000002_insert_demo_certificate.sql`