# Supabase Email (SMTP) Setup Guide

## Project Details
- **URL:** https://lenltzlsnlbzwlizmijc.supabase.co
- **Anon Key:** eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...

## Gmail SMTP Setup (Recommended)

### 1. Gmail App Password (REQUIRED)
```
1. Gmail → Account → Security → 2-Step Verification ON
2. App Passwords → Mail → Windows Computer → Generate
3. Copy 16-char password (e.g., abcd efgh ijkl mnop)
```

### 2. Supabase Dashboard Settings
```
Settings → Authentication → SMTP Settings → Custom SMTP

Host: smtp.gmail.com
Port: 587
User: your.email@gmail.com
Password: [16-char App Password]
Sender Email: your.email@gmail.com
Sender Name: InterQ
```

### 3. URL Configuration
```
Authentication → URL Configuration
Site URL: http://localhost:8085
Redirect URLs: 
  - http://localhost:8085/auth/callback
  - http://localhost:8085/reset-password
  - http://localhost:8085/verify-email
```

### 4. Providers
```
Authentication → Providers → Email → Enable
```

## Test Flow
```
1. localhost:8085/auth → Signup
2. Check inbox for verification
3. localhost:8085/forget-password → Send reset
4. Click link → ResetPassword → Success
```

## Troubleshooting
**No Email:**
- Wrong App Password (regular Gmail pass fails)
- Port 587 blocked → Try 465 (SSL)
- Gmail "Less secure apps" OFF (2FA required)

**"Unable to reach auth":**
- .env.local VITE_SUPABASE_URL matches dashboard
- npx supabase db push (migrations)

**Prod Setup:**
Replace localhost with domain in URL Config.

**Alternative SMTP:**
- SendGrid (free 100/day)
- Resend (developer friendly)

Last Updated: 2026

