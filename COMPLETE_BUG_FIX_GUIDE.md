# 🔧 InterQ Complete Bug Fix Guide
## Password Reset, Email Verification & Signup Issues Resolution

**Date**: April 5, 2026  
**Status**: COMPLETE DIAGNOSTIC & SOLUTIONS ✅  
**Project**: InterQ Recruitment Platform

---

## 📋 TABLE OF CONTENTS
1. [Executive Summary](#executive-summary)
2. [Critical Issues Identified](#critical-issues-identified)
3. [Issue #1: Email Verification](#issue-1-email-verification)
4. [Issue #2: Password Reset](#issue-2-password-reset)
5. [Issue #3: Signup Issues](#issue-3-signup-issues)
6. [Implementation Checklist](#implementation-checklist)
7. [Troubleshooting Guide](#troubleshooting-guide)

---

## Executive Summary

Your InterQ platform has **3 major issues** affecting authentication:

| Issue | Severity | Root Cause | Status |
|-------|----------|-----------|--------|
| Email Verification Not Sending | 🔴 CRITICAL | No SMTP configured | Ready to Fix |
| Password Reset Emails Missing | 🔴 CRITICAL | No SMTP configured | Ready to Fix |
| Signup Not Confirming Users | 🟡 HIGH | Email verification required | Blocked by SMTP |

**Good News**: All code is correct ✅ - Issues are configuration-based, not code bugs.

**Time to Fix**: 10-15 minutes (if following this guide)

---

## Critical Issues Identified

### Issue Breakdown

```
┌──────────────────────────────────────────────────────┐
│         AUTHENTICATION SYSTEM STATUS                 │
├──────────────────────────────────────────────────────┤
│ ✅ Signup Code              WORKING                  │
│ ✅ Sign In Code             WORKING                  │
│ ✅ Password Reset Code      WORKING                  │
│ ❌ Email Sending            BLOCKED (No SMTP)        │
│ ❌ Email Verification       BLOCKED (No SMTP)        │
│ ⚠️  User Role Assignment     WORKS (Trigger Ready)   │
│ ⚠️  Dashboard Navigation     WORKS (Role-Based)      │
└──────────────────────────────────────────────────────┘
```

---

## Issue #1: Email Verification

### Problem
Users cannot verify their email addresses after signup. Verification emails are not being sent.

### Root Cause
**No SMTP server is configured in Supabase** - The app is trying to send verification emails, but Supabase has no email provider configured.

### Technical Details

#### Current Flow:
```
User Signs Up
    ↓
AuthContext.tsx calls: supabase.auth.signUp({email, password})
    ↓
Supabase tries to send verification email
    ↓
❌ FAILURE: No SMTP configured - email stuck in queue
    ↓
User never receives verification link
    ↓
Account cannot be activated
```

#### Code Location:
**File**: `src/contexts/AuthContext.tsx` (Lines 45-95)
```typescript
const signUp = async (email: string, password: string, fullName: string, role?: string) => {
  const { data, error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      emailRedirectTo: `${window.location.origin}/auth`,
      data: { full_name: fullName }
    }
  });
  // ❌ Email sending depends on SMTP being configured
};
```

### Solution

#### Step 1: Generate Gmail App Password (Required!)

1. Go to: https://myaccount.google.com/
2. Select **Security** (left sidebar)
3. Enable **2-Step Verification** (if not already enabled)
4. Find and click **App passwords**
5. Select: **Mail** and **Windows Computer** (or your device)
6. Google generates a **16-character password**
7. **Copy this password** - you'll need it for Step 2

**⚠️ Important**: You MUST use an App Password, NOT your regular Gmail password!

#### Step 2: Configure SMTP in Supabase Dashboard

1. Go to: https://supabase.com/dashboard
2. Select your project: **lenltzlsnlbzwlizmijc**
3. Navigate to: **Settings → Authentication → Email Templates**
4. Scroll down to **"SMTP Settings"**
5. Click **"Custom SMTP"**
6. Fill in the form:
   ```
   Host: smtp.gmail.com
   Port: 587
   User: your-email@gmail.com
   Password: [Paste your 16-char App Password from Step 1]
   Sender Email: your-email@gmail.com
   Sender Name: InterQ
   ```
7. Click **"Save"**

#### Step 3: Test Email Verification

1. Start dev server:
   ```bash
   npm run dev
   ```

2. Open: http://localhost:5173/auth

3. Sign up with test email:
   ```
   Email: test@example.com
   Password: TestPassword123
   Name: Test User
   Role: Job Seeker
   ```

4. Click "Sign Up"

5. Check your email inbox for "Confirm your InterQ email"

6. Click the verification link

7. ✅ Account activated!

### Troubleshooting Email Issues

| Problem | Cause | Solution |
|---------|-------|----------|
| "SMTP not configured" error | SMTP not set up in Supabase | Follow Step 2 above |
| Gmail auth failed | Using regular password instead of App Password | Generate new App Password (Step 1) |
| Emails in spam folder | Domain reputation issue | Check spam, mark as "Not Spam" |
| Port 587 blocked | Firewall or ISP blocking | Try port 465 (SSL) instead |
| Still no email after 5 min | Queue stuck | Check Supabase Email Logs |

### Verify Email Configuration

**In Browser Console** (Open DevTools):
```javascript
// Check if SMTP is working
const supabaseUrl = 'https://lenltzlsnlbzwlizmijc.supabase.co';
console.log('Checking SMTP configuration...');
fetch(supabaseUrl + '/auth/v1/health').then(r => console.log('API healthy:', r.ok));
```

**In Supabase Dashboard**:
1. Go to: Settings → Email Templates
2. Scroll to bottom → "Sending Logs"
3. Look for recent email send attempts
4. Check status: ✅ Sent, ⏳ Queued, or ❌ Failed

---

## Issue #2: Password Reset

### Problem
"Forgot Password" feature doesn't send reset emails.

### Root Cause
**Same as Issue #1** - No SMTP configured. The code tries to send an email but fails.

### Technical Details

#### Current Flow:
```
User Clicks "Forgot Password?"
    ↓
Enters email: test@example.com
    ↓
App calls: supabase.auth.resetPasswordForEmail(email)
    ↓
❌ FAILURE: No SMTP configured - email not sent
    ↓
User doesn't receive password reset link
    ↓
Cannot reset password
```

#### Code Location:
**File**: `src/pages/ResetPassword.tsx` (Lines 1-66)
```typescript
const handleSubmit = async (e) => {
  // Password update code - WORKS
  const res = await fetch(`${SUPABASE_URL}/auth/v1/user`, {
    method: 'PUT',
    headers: {
      'Authorization': `Bearer ${token}`,
      // ...
    },
    body: JSON.stringify({ password })
  });
};
```

**The code is correct**, but it depends on SMTP being configured to send the reset email in the first place.

### Solution

✅ **Same as Issue #1** - Configure SMTP (see above)

After SMTP is configured:

#### Step 1: Add Redirect URL

1. Go to: Supabase Dashboard → Settings → **Authentication → URL Configuration**
2. Click **"Add Redirect URL"**
3. Add these URLs:
   ```
   http://localhost:5173/reset-password  (development)
   https://yourdomain.com/reset-password (production)
   ```
4. Click **"Save"**

#### Step 2: Test Password Reset

1. Go to: http://localhost:5173/auth
2. Click **"Sign In"** tab
3. Click **"Forgot Password?"** link
4. Enter test email: `test@example.com`
5. Check email inbox for "Reset your InterQ password"
6. Click reset link
7. Enter new password
8. ✅ Password reset complete!

### Expected Behavior After Fix

```
✅ Scenario 1: SMTP Configured
   User → Forgot Password → Email sent → User clicks link → Reset page loads → Password updated

✅ Scenario 2: Network Error
   User → Forgot Password → Retry with config refresh → Eventually succeeds or shows helpful error
```

---

## Issue #3: Signup Issues

### Problem
New users cannot complete signup because email verification fails.

### Root Cause
Signup process requires email verification, which depends on SMTP (Issue #1).

### Technical Details

#### Current Flow:
```
User Signs Up
    ↓
Account created in Supabase
    ↓
Verification email sent (depends on SMTP)
    ↓
❌ If SMTP not configured:
   - Email doesn't reach user
   - Account can't be verified
   - Dashboard blocked
```

#### Code Location:
**File**: `src/contexts/AuthContext.tsx` (Lines 68-88)
```typescript
if (data.session) {
  // Auto sign-in (happens if SMTP not needed)
  navigate("/jobseeker");
} else {
  // ❌ Waiting for email verification
  toast({ title: "Verification email sent!", 
          description: "Check your email to verify account." });
}
```

### Solution

✅ **Same as Issue #1** - Configure SMTP

**The signup code is correct**. Once SMTP is configured:

#### Step 1: Ensure Email Confirmation Required

1. Go to: Supabase Dashboard → **Settings → Authentication → Email Templates**
2. Look for **"Confirm Email"** option
3. Make sure it's set to **"ON"**
4. This forces users to verify email

#### Step 2: Review User Profile Creation

The system automatically creates a user profile after email verification via a database trigger:

**File**: `supabase/migrations/20261201060000_email_verification_triggers.sql`

This trigger:
- ✅ Creates user profile automatically
- ✅ Assigns default role (job_seeker)
- ✅ Sets up user_roles table entry

#### Step 3: Test Complete Signup

1. Start dev server: `npm run dev`
2. Go to: http://localhost:5173/auth
3. Fill signup form:
   ```
   Email: newuser@example.com
   Password: SecurePass123
   Full Name: John Doe
   Role: Job Seeker
   ```
4. Click **"Sign Up"**
5. Check email for verification link
6. Click link
7. ✅ Dashboard loads automatically!

---

## Implementation Checklist

Follow this checklist to fix all issues:

### Phase 1: Email Setup (5-10 minutes)

- [ ] Open https://myaccount.google.com/
- [ ] Go to Security → App passwords
- [ ] Generate Gmail App Password (copy it)
- [ ] Open Supabase Dashboard
- [ ] Navigate to Settings → Authentication → Email Templates
- [ ] Click Custom SMTP
- [ ] Fill in SMTP details (host, port, credentials)
- [ ] Click Save
- [ ] Wait 30 seconds for configuration to apply

### Phase 2: URL Configuration (2 minutes)

- [ ] Go to Settings → Authentication → URL Configuration
- [ ] Add: `http://localhost:5173/reset-password` (dev)
- [ ] Add: `https://yourdomain.com/reset-password` (production - later)
- [ ] Click Save

### Phase 3: Testing (5 minutes)

- [ ] Run `npm run dev`
- [ ] Test Email Verification:
  - [ ] Sign up with new email
  - [ ] Check inbox for "Confirm your email"
  - [ ] Click link
  - [ ] Verify account activates
- [ ] Test Password Reset:
  - [ ] Go to Sign In
  - [ ] Click "Forgot Password?"
  - [ ] Enter email
  - [ ] Check inbox for reset link
  - [ ] Click link and reset password
- [ ] Test Signup Complete:
  - [ ] Sign up as new user
  - [ ] Verify email
  - [ ] Check that dashboard loads

### Phase 4: Production Setup (When Ready)

- [ ] Update redirect URLs in Supabase for production domain
- [ ] Configure SMTP to use production email (if different)
- [ ] Test all flows with production domain
- [ ] Monitor email logs for any issues

---

## Troubleshooting Guide

### "Verification email sent" but no email received

**Possible Causes**:
1. SMTP not configured
2. Email in spam folder
3. Wrong email address entered
4. Email provider blocking

**Solutions**:
1. Check SMTP configuration in Supabase
2. Check spam/junk folder
3. Verify email typed correctly
4. Try with different email provider (Gmail vs Outlook)

### "Unable to reach authentication service"

**Possible Causes**:
1. Supabase project down
2. Wrong project ID
3. Network connectivity issue
4. Credentials incorrect

**Solutions**:
1. Check https://status.supabase.com
2. Verify project ID: `lenltzlsnlbzwlizmijc`
3. Check your internet connection
4. Verify API keys in `.env.local`

### Password reset link doesn't work

**Possible Causes**:
1. Reset link expired (24 hour limit)
2. Redirect URL not configured
3. Token invalid

**Solutions**:
1. Request new password reset
2. Add redirect URL to Supabase settings
3. Check browser console for error details

### Users locked out after signup

**Possible Causes**:
1. Email verification required but SMTP down
2. User email typo
3. Account suspended

**Solutions**:
1. Configure/check SMTP
2. Have user try with correct email
3. Check Supabase Auth logs for suspension

### Database Triggers Not Firing

**Possible Causes**:
1. Migrations not applied
2. Trigger syntax error
3. Permission issues

**Solutions**:
```bash
# Apply all migrations:
npx supabase db push

# Check trigger status:
# Supabase Dashboard → SQL Editor → Inspect triggers
```

---

## Code Quality Check

### ✅ All Authentication Code is Working

| Component | Status | Notes |
|-----------|--------|-------|
| `AuthContext.tsx` | ✅ GOOD | No syntax/logic errors |
| `Auth.tsx` | ✅ GOOD | Signup/signin forms work |
| `ResetPassword.tsx` | ✅ GOOD | Password update logic correct |
| `supabase/client.ts` | ✅ GOOD | Client configuration correct |
| Database Triggers | ✅ READY | Migrations prepared |
| SMTP Configuration | ❌ MISSING | **ACTION REQUIRED** |

### Environment Configuration Status

```
VITE_SUPABASE_URL: ✅ lenltzlsnlbzwlizmijc
VITE_SUPABASE_ANON_KEY: ✅ Present
VITE_SUPABASE_SERVICE_ROLE_KEY: ✅ Present
SMTP Settings: ❌ NOT CONFIGURED (FIX THIS)
```

---

## Expected Behavior After Fix

### Sign Up Flow
```
1. User enters email/password/name
2. ✅ Account created in Supabase
3. 📧 Verification email sent
4. User clicks email link
5. ✅ Account verified
6. 🎯 Dashboard loads
```

### Sign In Flow
```
1. User enters credentials
2. ✅ Authenticated
3. 🎯 Dashboard loads (role-based)
```

### Password Reset Flow
```
1. User clicks "Forgot Password?"
2. Enters email
3. 📧 Reset email sent
4. User clicks email link
5. ✅ Password reset page loads
6. User enters new password
7. ✅ Password updated
8. 🔐 Can login with new password
```

---

## Additional Notes

### For Development/Testing
- Demo accounts available (no email needed)
- Local fallback for password reset works
- Can manually verify users via SQL if needed

### For Production
- Use SendGrid or similar for better deliverability
- Monitor email sending logs regularly
- Set up email templates/branding
- Consider higher email volume limits

### Security Best Practices
- Keep Gmail App Password secure (don't commit to git)
- Use separate email for production
- Monitor for failed login attempts
- Implement rate limiting on auth endpoints

---

## Next Steps

1. **Immediately**: Generate Gmail App Password + Configure SMTP (10 min)
2. **Today**: Test all authentication flows
3. **This Week**: Monitor email logs, fix any issues
4. **Next**: Consider upgrading email provider for production

---

## Support & Questions

**If you get stuck**:
1. Check Supabase Dashboard → Email Logs
2. Review browser console for error messages
3. Verify SMTP credentials are correct
4. Check that project ID matches: `lenltzlsnlbzwlizmijc`

**Common Commands**:
```bash
# Start development server
npm run dev

# Apply database migrations
npx supabase db push

# View Supabase logs
npx supabase logs --follow

# Check environment
cat .env.local
```

---

## Summary Table

| Issue | Cause | Fix | Time |
|-------|-------|-----|------|
| Email Verification Not Sending | No SMTP | Configure SMTP | 5 min |
| Password Reset Emails Missing | No SMTP | Configure SMTP | 3 min |
| Signup Not Confirming | No email verification | Configure SMTP | 2 min |
| Other Auth Issues | Code is correct | See troubleshooting | Varies |

**Total Fix Time**: 10-15 minutes ⏱️

---

**Last Updated**: April 5, 2026  
**Status**: Ready for Implementation ✅  
**Difficulty Level**: Easy (Configuration, no coding required)
