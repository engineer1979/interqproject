# Email Verification Issue - Diagnostic Report

## Issue Summary
**Problem**: Verification emails are not being received after user signup.

---

## Root Cause Analysis

### 1. **SMTP Configuration Missing** ❌
**Current Status**: Supabase is likely using the default **in-app** email system (no actual emails sent).

**Evidence**:
- No SMTP credentials found in `.env.local`
- `config.toml` has no SMTP settings configured
- Default Supabase setup does NOT send real emails—only in-app confirmations

**Solution**: Configure Custom SMTP with Gmail

---

## Fixed Configuration Steps

### Step 1: Enable Email Authentication in Supabase Dashboard
```
1. Go to: https://supabase.com/dashboard
2. Select YOUR PROJECT (lenltzsnlbzwlizmijc)
3. Navigate: Settings → Authentication
4. Enable Email Auth (if not already enabled)
5. Set "Confirm Email" to ON
```

### Step 2: Configure Custom SMTP (Gmail)
```
1. Settings → Authentication → Email Templates
2. Scroll down to "SMTP Settings" 
3. Click "Custom SMTP"
4. Fill in:
   - Host: smtp.gmail.com
   - Port: 587
   - User: yourgmail@gmail.com (your actual Gmail)
   - Password: [Gmail App Password - See Step 3]
   - Sender Email: yourgmail@gmail.com
   - Sender Name: InterQ
```

### Step 3: Generate Gmail App Password (Critical!)
```
IMPORTANT: Use App Password, NOT your regular Gmail password
⚠️  Regular passwords won't work with SMTP

Steps:
1. Gmail Account → Manage Your Account → Security
2. Enable 2-Step Verification (if not already enabled)
3. App passwords → Select "Mail" → Select "Windows Computer"
4. Google generates a 16-character password
5. Copy this password → Paste in Supabase SMTP Password field
```

### Step 4: Update Environment Variables (Optional)
If you need to reference email config in code:
```
.env.local adds (if needed):
VITE_SMTP_HOST=smtp.gmail.com
VITE_SMTP_USER=yourgmail@gmail.com
VITE_SMTP_PORT=587
```

---

## How Email Verification Works in Your App

### Current Flow:
1. User signs up at `/auth` → Email/Password
2. `AuthContext.tsx` calls `supabase.auth.signUp()`
3. Supabase sends verification email (if SMTP configured)
4. User clicks link in email
5. `email_confirmed_at` is updated in `auth.users`
6. **Database Trigger** (`20261201060000_email_verification_triggers.sql`):
   - Automatically creates user profile
   - Assigns role (job_seeker by default)
   - Inserts into `user_roles` table
7. User redirected to dashboard

### Current Code:
```typescript
// src/contexts/AuthContext.tsx
const signUp = async (email, password, fullName, role) => {
  const { data, error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      emailRedirectTo: `${window.location.origin}/auth`,
      data: { full_name: fullName }
    }
  });
  
  // If session exists → Auto sign-in (no email confirmation needed)
  // If no session → Show "Check your email" message
};
```

---

## Testing Email Configuration

### Test 1: Send Verification Email
```
1. Start dev server: npm run dev
2. Go to: http://localhost:8080/auth
3. Sign up with test email: test@gmail.com
4. Submit
5. Check Gmail inbox/spam for "Confirm your InterQ email"
```

### Test 2: Debug Emails in Supabase
```
1. Supabase Dashboard → Auth → Email Templates
2. Scroll to bottom → "Email Sending Logs" (or check Logs)
3. Filter by "auth.email"
4. View queued/sent emails
```

### Test 3: Manual Bypass (For Dev)
```sql
-- If email not working, manually verify user:
SELECT verify_user_email('user-uuid-here');

-- User profile will auto-create via trigger
```

---

## Troubleshooting Checklist

| Issue | Cause | Fix |
|-------|-------|-----|
| ❌ Emails not received | SMTP not configured | Configure Gmail SMTP (Step 2) |
| ❌ Gmail auth error | Using regular password | Generate App Password (Step 3) |
| ❌ Emails in spam | Domain reputation | Use Gmail as sender (trusted) |
| ❌ 587 port blocked | Firewall | Use port 465 (SSL) alternative |
| ❌ Profile not created | Trigger not firing | Check migration status: npx supabase db push |
| ✅ Instant login | No email confirmation | This is NORMAL if `data.session` exists in signup response |

---

## Quick Fix Commands

### Push Supabase migrations (required):
```powershell
cd c:\Users\CZ\Downloads\interqproject-master
npx supabase db push
```

### Test signup (after SMTP config):
```powershell
npm run dev
# Then visit http://localhost:8080/auth
```

### Check email status:
```
Supabase Dashboard → Auth → Email Templates → Sending Logs
```

---

## Current Setup Status

| Component | Status | Details |
|-----------|--------|---------|
| Supabase Project | ✅ Connected | Project ID: lenltzsnlbzwlizmijc |
| Auth Context | ✅ Implemented | Uses `supabase.auth.signUp()` |
| Email Triggers | ✅ Migrations Ready | `20261201060000_email_verification_triggers.sql` |
| SMTP Config | ❌ NOT CONFIGURED | Need Gmail App Password |
| Redirect URL | ✅ Set | `process.env.VITE_SUPABASE_URL` |

---

## Next Steps

### Immediate:
1. ✅ Generate Gmail App Password
2. ✅ Configure SMTP in Supabase Dashboard
3. ✅ Test signup flow
4. ✅ Verify email received

### Follow-up:
- Monitor email sending logs
- Adjust sender name/domain if needed
- Consider alternative SMTP (SendGrid, AWS SES) for production

---

## Important Notes

**❗ Email Must Be Verified For:**
- Account activation
- Automatic profile creation
- Role assignment (job_seeker, company, recruiter)

**⚠️  Current Behavior:**
- Without SMTP: Emails queued but never sent
- With SMTP: Emails sent immediately → User clicks link → Account activated

**✅ Once Configured:**
- Users will receive "Confirm your InterQ email" 
- Clicking link confirms account
- Automatic dashboard redirection

---

## Production Considerations

For production, consider:
- **SendGrid** (industry standard, better deliverability)
- **AWS SES** (scalable, pay-per-email)
- **Resend** (modern, developer-friendly)
- Implement email templates/branding

---

**Last Updated**: April 3, 2026
**Project**: InterQ Recruitment Platform
**Environment**: Development (localhost:8080)
