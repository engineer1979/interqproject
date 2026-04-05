# ✅ InterQ Authentication - Implementation Checklist

**Print this page and track your progress!**

---

## 🚀 PHASE 1: CRITICAL FIXES (10 minutes)

### Enable SMTP Email Configuration

- [ ] **Step 1: Generate Gmail App Password**
  - [ ] Go to: https://myaccount.google.com/
  - [ ] Click "Security" (left sidebar)
  - [ ] Check "2-Step Verification" is enabled
  - [ ] Find "App passwords"
  - [ ] Select: Mail and Windows Computer
  - [ ] Google generates 16-character password
  - [ ] **COPY THIS PASSWORD** (you need it for Step 2!)
  - Time taken: _____ min | Completed: ☐

- [ ] **Step 2: Configure SMTP in Supabase**
  - [ ] Go to: https://supabase.com/dashboard
  - [ ] Select project: lenltzlsnlbzwlizmijc
  - [ ] Navigate: Settings → Authentication → Email Templates
  - [ ] Click: "Custom SMTP"
  - [ ] Fill in form:
    - [ ] Host: smtp.gmail.com
    - [ ] Port: 587
    - [ ] User: your-gmail@gmail.com
    - [ ] Password: [16-char password from Step 1]
    - [ ] Sender Email: your-gmail@gmail.com
    - [ ] Sender Name: InterQ
  - [ ] Click: "Save"
  - [ ] Wait 30 seconds for configuration to apply
  - Time taken: _____ min | Completed: ☐

- [ ] **Step 3: Add Redirect URL**
  - [ ] Go to: Settings → Authentication → URL Configuration
  - [ ] Click: "Add Redirect URL"
  - [ ] Enter: http://localhost:5173/reset-password
  - [ ] Click: "Save"
  - [ ] (Later, add production URL when ready)
  - Time taken: _____ min | Completed: ☐

**Phase 1 Total Time**: _____ minutes | Status: ☐ Complete

---

## 🧪 PHASE 2: TESTING (5 minutes)

### Test Email Verification Flow

- [ ] **Test Setup**
  - [ ] Start development server: npm run dev
  - [ ] Open browser: http://localhost:5173/auth
  - [ ] Clear browser cache (if needed)
  - Time taken: _____ min

- [ ] **Test 1: Email Verification**
  - [ ] Click "Sign Up" tab
  - [ ] Fill form:
    - [ ] Email: test@example.com
    - [ ] Password: TestPassword123
    - [ ] Full Name: Test User
    - [ ] Role: Job Seeker
  - [ ] Click "Sign Up" button
  - [ ] Check email inbox (wait up to 2 minutes)
  - [ ] Find "Confirm your email" from InterQ
  - [ ] Click verification link in email
  - [ ] ✅ Account activated, dashboard loads
  - Status: ☐ PASS | ☐ FAIL
  - Time taken: _____ min

- [ ] **Test 2: Password Reset**
  - [ ] Go to: http://localhost:5173/auth
  - [ ] Click "Sign In" tab
  - [ ] Click "Forgot Password?" link
  - [ ] Enter email: test@example.com
  - [ ] Check email inbox (wait up to 2 minutes)
  - [ ] Find "Reset your password" from InterQ
  - [ ] Click reset link in email
  - [ ] Password reset form appears
  - [ ] Enter new password: NewPassword456
  - [ ] Confirm password: NewPassword456
  - [ ] Click "Update Password"
  - [ ] ✅ Success message appears
  - Status: ☐ PASS | ☐ FAIL
  - Time taken: _____ min

- [ ] **Test 3: Login with New Password**
  - [ ] Go to: http://localhost:5173/auth
  - [ ] Enter email: test@example.com
  - [ ] Enter password: NewPassword456
  - [ ] Click "Sign In"
  - [ ] ✅ Dashboard loads successfully
  - Status: ☐ PASS | ☐ FAIL
  - Time taken: _____ min

- [ ] **Test 4: Logout**
  - [ ] Click "Logout" or user menu
  - [ ] ✅ Redirected back to login page
  - Status: ☐ PASS | ☐ FAIL
  - Time taken: _____ min

**Phase 2 Total Time**: _____ minutes | Status: ☐ Complete

---

## 🛠️ PHASE 3: CODE IMPROVEMENTS (1 hour)

### Enhanced Error Messages

- [ ] **Update AuthContext.tsx**
  - [ ] Open: src/contexts/AuthContext.tsx
  - [ ] Add error message translations (lines 25-45 in improved version)
  - [ ] Add validatePassword function
  - [ ] Add validateEmail function
  - [ ] Update signUp with validation
  - [ ] Update signIn with validation
  - [ ] Add resetPassword method
  - [ ] Add updatePassword method
  - [ ] Test all auth flows
  - Status: ☐ PASS | ☐ FAIL
  - Time taken: _____ min

- [ ] **Update ResetPassword.tsx**
  - [ ] Open: src/pages/ResetPassword.tsx
  - [ ] Replace hardcoded credentials with environment variables
  - [ ] Add REQUEST mode for email entry
  - [ ] Add VERIFY mode for email check
  - [ ] Add UPDATE mode for new password
  - [ ] Add SUCCESS mode for confirmation
  - [ ] Remove hardcoded SMTP key
  - [ ] Use supabase client from integration
  - [ ] Test all modes
  - Status: ☐ PASS | ☐ FAIL
  - Time taken: _____ min

### New Components

- [ ] **Create VerifyEmail.tsx**
  - [ ] Create: src/pages/VerifyEmail.tsx
  - [ ] Add PENDING mode (waiting for email click)
  - [ ] Add LOADING mode (processing)
  - [ ] Add SUCCESS mode (verified)
  - [ ] Add ERROR mode (failed)
  - [ ] Add countdown timer for resend
  - [ ] Test all modes
  - Status: ☐ PASS | ☐ FAIL
  - Time taken: _____ min

- [ ] **Create auth.ts Types File**
  - [ ] Create: src/types/auth.ts
  - [ ] Add SignUpData interface
  - [ ] Add SignInData interface
  - [ ] Add PasswordResetData interface
  - [ ] Add PasswordUpdateData interface
  - [ ] Add AuthError interface
  - [ ] Add AuthResponse interface
  - Status: ☐ PASS | ☐ FAIL
  - Time taken: _____ min

### Update Routes

- [ ] **Update App.tsx Routes**
  - [ ] Add route: /auth/verify → VerifyEmail
  - [ ] Add route: /auth/reset-password → ResetPassword
  - [ ] Add route: /reset-password → ResetPassword (backward compat)
  - [ ] Test all routes work
  - Status: ☐ PASS | ☐ FAIL
  - Time taken: _____ min

**Phase 3 Total Time**: _____ minutes | Status: ☐ Complete

---

## 🔒 PHASE 4: SECURITY FIXES (15 minutes)

### Remove Hardcoded Credentials

- [ ] **Audit Code for Hardcoded Keys**
  - [ ] Search: grep -r "eyJhbGc" src/ (find hardcoded keys)
  - [ ] Found in: ResetPassword.tsx (lines 9-10)
  - [ ] Check for other instances
  - Status: ☐ PASS | ☐ FAIL
  - Time taken: _____ min

- [ ] **Update Environment Variables**
  - [ ] Open: .env.local
  - [ ] Verify VITE_SUPABASE_URL correct
  - [ ] Verify VITE_SUPABASE_ANON_KEY present
  - [ ] Don't commit .env.local to git!
  - [ ] Add to .gitignore: .env.local
  - Status: ☐ PASS | ☐ FAIL
  - Time taken: _____ min

- [ ] **Replace All Hardcoded Credentials**
  - [ ] In ResetPassword.tsx:
    - [ ] Remove: const SUPABASE_KEY = '...'
    - [ ] Remove: const SUPABASE_URL = '...'
    - [ ] Add: import { supabase } from '@/integrations/supabase/client'
    - [ ] Use supabase client for all API calls
  - [ ] Test password reset still works
  - Status: ☐ PASS | ☐ FAIL
  - Time taken: _____ min

- [ ] **Security Review**
  - [ ] No API keys in source code ✅
  - [ ] No credentials in commits ✅
  - [ ] All auth uses supabase client ✅
  - [ ] Environment variables only ✅
  - Status: ☐ PASS | ☐ FAIL
  - Time taken: _____ min

**Phase 4 Total Time**: _____ minutes | Status: ☐ Complete

---

## 📊 PHASE 5: COMPREHENSIVE TESTING (30 minutes)

### Signup Flow

- [ ] **New User Signup**
  - [ ] Test Case: Brand new user
  - [ ] Go to: http://localhost:5173/auth
  - [ ] Sign up with: newtester@example.com
  - [ ] Password: SecurePass123
  - [ ] Name: New Tester
  - [ ] Receive verification email ✅
  - [ ] Click verification link ✅
  - [ ] Account confirmed ✅
  - [ ] Redirected to dashboard ✅
  - Status: ☐ PASS | ☐ FAIL
  - Time taken: _____ min

- [ ] **Signup Validation**
  - [ ] Test Case: Invalid email
    - [ ] Try: invalidemail (no @)
    - [ ] Error message shown ✅
    - Status: ☐ PASS
  - [ ] Test Case: Weak password
    - [ ] Try: 123 (too short)
    - [ ] Error message shown ✅
    - Status: ☐ PASS
  - [ ] Test Case: Missing name
    - [ ] Try: empty name
    - [ ] Error message shown ✅
    - Status: ☐ PASS
  - Overall Status: ☐ PASS | ☐ FAIL
  - Time taken: _____ min

### Login Flow

- [ ] **Existing User Login**
  - [ ] Test Case: Valid credentials
  - [ ] Enter: test@example.com / NewPassword456
  - [ ] Login successful ✅
  - [ ] Redirected to dashboard ✅
  - Status: ☐ PASS | ☐ FAIL
  - Time taken: _____ min

- [ ] **Login Error Cases**
  - [ ] Test Case: Wrong password
    - [ ] Try: correct email, wrong password
    - [ ] Error message shown ✅
    - Status: ☐ PASS
  - [ ] Test Case: Non-existent email
    - [ ] Try: nonexistent@example.com
    - [ ] Error message shown ✅
    - Status: ☐ PASS
  - [ ] Test Case: Empty fields
    - [ ] Try: submit without filling
    - [ ] Validation error shown ✅
    - Status: ☐ PASS
  - Overall Status: ☐ PASS | ☐ FAIL
  - Time taken: _____ min

### Password Reset Flow

- [ ] **Complete Password Reset**
  - [ ] Test Case: Request → Receive → Update
  - [ ] Click "Forgot Password?" ✅
  - [ ] Enter: test@example.com ✅
  - [ ] Receive reset email ✅
  - [ ] Click reset link ✅
  - [ ] Enter new password: UltraSecure789 ✅
  - [ ] Confirm password: UltraSecure789 ✅
  - [ ] Success message shown ✅
  - [ ] Can login with new password ✅
  - Status: ☐ PASS | ☐ FAIL
  - Time taken: _____ min

### Role-Based Navigation

- [ ] **Admin User**
  - [ ] Login as admin
  - [ ] Redirected to: /admin ✅
  - Status: ☐ PASS | ☐ FAIL

- [ ] **Company User**
  - [ ] Login as company
  - [ ] Redirected to: /company ✅
  - Status: ☐ PASS | ☐ FAIL

- [ ] **Recruiter User**
  - [ ] Login as recruiter
  - [ ] Redirected to: /recruiter ✅
  - Status: ☐ PASS | ☐ FAIL

- [ ] **Job Seeker User**
  - [ ] Login as job seeker
  - [ ] Redirected to: /jobseeker ✅
  - Status: ☐ PASS | ☐ FAIL

### Logout Flow

- [ ] **Logout Functionality**
  - [ ] Click logout button
  - [ ] Session cleared ✅
  - [ ] Redirected to login ✅
  - [ ] Cannot access protected routes ✅
  - Status: ☐ PASS | ☐ FAIL
  - Time taken: _____ min

**Phase 5 Total Time**: _____ minutes | Status: ☐ Complete

---

## 🚀 PHASE 6: PRODUCTION READINESS (Ongoing)

### Before Deploying to Production

- [ ] **Environment Setup**
  - [ ] Create .env.production with:
    - [ ] Production Supabase URL
    - [ ] Production Supabase Keys
    - [ ] Production domain redirect URLs
  - [ ] .env.local NOT in git ✅
  - [ ] .gitignore includes .env* ✅
  - [ ] Status: ☐ COMPLETE

- [ ] **Email Configuration**
  - [ ] Configure SMTP for production domain
  - [ ] Add production redirect URLs to Supabase:
    - [ ] https://yourdomain.com/auth/verify
    - [ ] https://yourdomain.com/auth/reset-password
  - [ ] Test email with production domain
  - [ ] Status: ☐ COMPLETE

- [ ] **Security Checklist**
  - [ ] No API keys in code ✅
  - [ ] HTTPS enabled ✅
  - [ ] Secure cookies configured ✅
  - [ ] Rate limiting enabled ✅
  - [ ] CORS properly configured ✅
  - [ ] Status: ☐ COMPLETE

- [ ] **Monitoring Setup**
  - [ ] Set up email log monitoring
  - [ ] Add error tracking (Sentry/etc)
  - [ ] Monitor auth failure rates
  - [ ] Set up alerts for issues
  - [ ] Status: ☐ COMPLETE

- [ ] **Documentation**
  - [ ] Document auth setup steps
  - [ ] Create runbook for troubleshooting
  - [ ] Document roles and permissions
  - [ ] Create user guide for password reset
  - [ ] Status: ☐ COMPLETE

**Phase 6 Status**: ☐ Ready for Production

---

## 📈 OVERALL PROGRESS

### Summary

| Phase | Task | Time | Status |
|-------|------|------|--------|
| 1 | Critical SMTP Setup | 10 min | ☐ |
| 2 | Testing | 5 min | ☐ |
| 3 | Code Improvements | 60 min | ☐ |
| 4 | Security Fixes | 15 min | ☐ |
| 5 | Comprehensive Testing | 30 min | ☐ |
| 6 | Production Readiness | 30 min | ☐ |

**Total Time**: ~150 minutes (2.5 hours) for full implementation

**Minimum Time** (Critical fixes only): 10 minutes

---

## 📝 NOTES & OBSERVATIONS

### Issues Resolved
- [ ] Email verification not working → SMTP configured
- [ ] Password reset emails missing → SMTP configured
- [ ] Signup not confirming → SMTP configured
- [ ] Generic error messages → Code improvements applied
- [ ] Hardcoded credentials → Replaced with env vars

### Known Issues Remaining
- [ ] (List any issues discovered during testing)
- [ ] (Add observations here)

### Recommendations for Future
- [ ] Switch to SendGrid for production (better deliverability)
- [ ] Implement two-factor authentication
- [ ] Add passwordless login (magic links)
- [ ] Implement email templates/branding
- [ ] Add user profile completion flow

### Lessons Learned
- [ ] SMTP configuration is critical for email flows
- [ ] Environment variables must be used for credentials
- [ ] Error messages should be user-friendly
- [ ] Testing all auth flows is essential
- [ ] (Add other lessons here)

---

## 🎉 COMPLETION STATUS

**Overall Completion**: _____% (Manual calculation)

- Phase 1: ☐ Complete (10 min)
- Phase 2: ☐ Complete (5 min)
- Phase 3: ☐ Complete (60 min)
- Phase 4: ☐ Complete (15 min)
- Phase 5: ☐ Complete (30 min)
- Phase 6: ☐ Complete (30 min)

**Final Status**: ☐ ALL PHASES COMPLETE ✅

**Date Started**: _______________  
**Date Completed**: _______________  
**Total Time Spent**: _______________ hours

---

## 👥 Team Sign-Off

| Role | Name | Date | Signature |
|------|------|------|-----------|
| Developer | | | |
| QA | | | |
| DevOps | | | |
| Manager | | | |

---

## 📞 Support & Resources

**Need Help?**
- See: COMPLETE_BUG_FIX_GUIDE.md
- See: CODE_IMPROVEMENTS_AND_FIXES.md
- See: QUICK_START_GUIDE.md

**Useful Links**
- Supabase Docs: https://supabase.com/docs
- Email Config: https://supabase.com/docs/guides/auth/auth-smtp
- Auth Guide: https://supabase.com/docs/guides/auth

---

**Created**: April 5, 2026  
**Version**: 1.0  
**Status**: Ready for Use ✅
