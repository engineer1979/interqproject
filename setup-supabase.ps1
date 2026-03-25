# InterQ — Supabase Setup Script (Windows PowerShell)
# Run this once in your project directory

$PROJECT_REF = "lenltzlsnlbzwlizmijc"

Write-Host "================================================" -ForegroundColor Cyan
Write-Host "  InterQ Supabase Setup" -ForegroundColor Cyan
Write-Host "================================================"
Write-Host ""

Write-Host "Step 1: Login to Supabase..."
npx supabase login

Write-Host ""
Write-Host "Step 2: Link to your project..."
npx supabase link --project-ref $PROJECT_REF

Write-Host ""
Write-Host "Step 3: Push all migrations..."
npx supabase db push

Write-Host ""
Write-Host "Step 4: Deploy edge functions..."
npx supabase functions deploy create-demo-users
npx supabase functions deploy create-user
npx supabase functions deploy evaluate-code

Write-Host ""
Write-Host "Step 5: Create demo users..."
npx supabase functions invoke create-demo-users

Write-Host ""
Write-Host "================================================" -ForegroundColor Green
Write-Host "  Setup Complete!" -ForegroundColor Green
Write-Host ""
Write-Host "  Demo Login Credentials:"
Write-Host "  Admin:      admin.demo@interq.com    / Admin@123"
Write-Host "  Company:    company.demo@interq.com  / Company@123"  
Write-Host "  Recruiter:  recruiter.demo@interq.com / Recruiter@123"
Write-Host "  Job Seeker: jobseeker.demo@interq.com / JobSeeker@123"
Write-Host "================================================" -ForegroundColor Green
