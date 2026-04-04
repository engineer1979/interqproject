# 📧 Step-by-Step Email Setup Guide
## Configure Email Verification & Password Reset

---

## ✅ STEP 1: Generate Gmail App Password (3 minutes)

### Why App Password?
Your regular Gmail password won't work with SMTP. You need a special 16-character app password.

### Instructions:

1. **Go to your Google Account security page**:
   - Open: https://myaccount.google.com/security
   - Make sure you're logged in to your Gmail account

2. **Enable 2-Step Verification** (if not already enabled):
   - Look for "2-Step Verification" section
   - Click "Get Started"
   - Follow the prompts to enable it
   - (If already enabled, skip this)

3. **Generate App Password**:
   - In Security page, scroll down to "App passwords"
   - Click on "App passwords"
   - If asked, sign in again
   - Select: **Mail**
   - Select: **Windows Computer**
   - Google will generate a 16-character password
   - **COPY THIS PASSWORD** (you'll need it in Step 2)

4. **Save the password somewhere safe**:
   ```
   Gmail: your-email@gmail.com
   App Password: [16 characters - copy from Google]
   ```

### ✋ STOP HERE - Go complete this step before continuing!

---

## ✅ STEP 2: Configure SMTP in Supabase (5 minutes)

### After you have your App Password, do this:

1. **Open Supabase Dashboard**:
   - Go to: https://supabase.com/dashboard
   - Make sure you're logged in

2. **Select the InterQ Project**:
   - Click on project: `lenltzlsnlbzwlizmijc`
   - (Should say "InterQ" or similar)

3. **Navigate to Email Settings**:
   - Left menu → **Settings**
   - Click **Authentication**
   - Scroll down to **Email Templates**

4. **Enable Custom SMTP**:
   - Scroll to "SMTP Settings" section
   - Click the button: **"Set custom SMTP"** or **"Custom SMTP"**

5. **Fill in SMTP Details**:
   ```
   Host: smtp.gmail.com
   Port: 587
   User: your-email@gmail.com (your actual Gmail)
   Password: [16-character App Password from Step 1]
   Sender Email: your-email@gmail.com
   Sender Name: InterQ
   ```

6. **Save Settings**:
   - Click **Save** button
   - You should see: "SMTP settings saved successfully"

### ✋ STOP HERE - Verify SMTP is saved before continuing!

---

## ✅ STEP 3: Add Redirect URLs (2 minutes)

### These URLs tell Supabase where to send users after email verification:

1. **In the same Supabase Dashboard**:
   - Still in **Settings → Authentication**

2. **Find "URL Configuration"** section:
   - Look for "Redirect URLs" or "Site URLs"

3. **Add Development URL**:
   - Click **+ Add URL**
   - Enter: `http://localhost:5173/reset-password`
   - Click **Add**

4. **Add Production URL** (optional for later):
   - Click **+ Add URL**
   - Enter: `https://yourdomain.com/reset-password`
   - Click **Add**
   - (Replace yourdomain.com with your actual domain)

5. **Save**:
   - Scroll to bottom
   - Click **Save**

### ✅ All Setup Complete!

---

## 🧪 STEP 4: Test It Works (5 minutes)

### Now let's verify everything is working:

1. **Start your dev server** (if not already running):
   ```bash
   npm run dev
   ```
   - Should start at: http://localhost:5173

2. **Open browser to**:
   - http://localhost:5173

3. **TEST #1 - Email Verification**:
   - Click **"Sign Up"** tab
   - Fill in:
     - Email: `test@gmail.com` (your actual Gmail)
     - Password: `Test123!`
     - Full Name: `Test User`
   - Click **Sign Up**
   - **Check your email** for verification link
   - If you see email → ✅ SUCCESS!
   - If no email after 2 min → Check spam folder
   - Click link in email to verify account

4. **TEST #2 - Password Reset**:
   - Go to Sign In page
   - Click **"Forgot Password?"** link
   - Enter same email
   - Click **Send Reset Link**
   - **Check your email** for reset link
   - If you see email → ✅ SUCCESS!
   - If no email → Check spam folder
   - Click link to reset password

5. **TEST #3 - Local Fallback** (if SMTP not working):
   - If emails don't arrive after 5 minutes:
   - Try signing up with different email
   - Check browser console for errors (F12 → Console)
   - Verify Gmail App Password is correct (check step 1)
   - Verify SMTP settings in Supabase (double-check step 2)

---

## 🆘 Troubleshooting

### Emails Not Arriving?

**Check 1: Wrong App Password?**
- Go back to Gmail security page
- Generate a NEW app password
- Copy the EXACT 16 characters (no spaces)
- Update in Supabase (Step 2)

**Check 2: App Password Copied Wrong?**
- Make sure you copied all 16 characters
- No spaces before/after
- Try deleting and regenerating new password

**Check 3: SMTP Settings Have Typos?**
- Host: `smtp.gmail.com` (not gmail.com)
- Port: `587` (not 465 or 25)
- User: Full Gmail address like `name@gmail.com`
- Password: Exactly as generated

**Check 4: 2-Step Verification Not Enabled?**
- If app password generation fails
- Go back to https://myaccount.google.com/security
- Enable 2-Step Verification first

**Check 5: Redirect URLs Missing?**
- If link expires or doesn't work
- Make sure you added `http://localhost:5173/reset-password` in Step 3
- Supabase won't send reset links without valid redirect URLs

### Still Not Working?

1. Check browser console (F12 → Console):
   - Look for error messages
   - Screenshot the error

2. Check Supabase Dashboard:
   - Settings → Authentication → Logs
   - Look for email sending attempts
   - See any error messages there

3. Refresh page and try again:
   - Sometimes caching issues
   - Clear browser storage: F12 → Application → Clear Storage

---

## ✅ Checklist Before You Start

- [ ] I'm at: https://myaccount.google.com/security
- [ ] I have 2-Step Verification enabled
- [ ] I've generated an App Password (16 characters)
- [ ] I have my Gmail address
- [ ] I'm logged into Supabase dashboard
- [ ] Project `lenltzlsnlbzwlizmijc` is selected
- [ ] I'm ready to configure SMTP

---

## 📋 Summary of What We're Doing

| Step | What | Time | Status |
|------|------|------|--------|
| 1 | Generate App Password | 3 min | ⏳ Pending |
| 2 | Configure SMTP | 5 min | ⏳ Pending |
| 3 | Add Redirect URLs | 2 min | ⏳ Pending |
| 4 | Test Email | 5 min | ⏳ Pending |
| **Total** | **All Steps** | **15 min** | **⏳ Ready** |

---

## 🚀 Ready to Start?

**First**, scroll down and complete **STEP 1** (Gmail App Password)

Let me know when you have the 16-character app password, and we'll continue to Step 2!

---

*Need help? Reply with any error messages you see, and I'll help troubleshoot.*
