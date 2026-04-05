# 📧 Supabase SMTP Setup - Step-by-Step Guide

**Time Required**: 5 minutes  
**Difficulty**: Easy  
**Prerequisites**: Gmail App Password (from previous guide)

---

## ✅ Prerequisites Checklist

Before starting, make sure you have:

- [ ] Gmail App Password (16 characters from previous step)
- [ ] Supabase account access
- [ ] Your Gmail address
- [ ] Project ID: `lenltzlsnlbzwlizmijc`

---

## STEP 1: Log into Supabase Dashboard

```
1. Open browser
2. Go to: https://supabase.com/dashboard
3. Sign in with your Supabase account
4. You should see your projects list
```

**Expected Result**:
- Supabase dashboard loads
- You can see your projects
- "lenltzlsnlbzwlizmijc" project is visible

---

## STEP 2: Select Your Project

```
1. Look for project: "lenltzlsnlbzwlizmijc"
2. Click on it to open the project
```

**Visual Layout**:
```
┌────────────────────────────────────┐
│ Your Projects                      │
├────────────────────────────────────┤
│                                    │
│ [Project Name] lenltzlsnlbzwlizmijc │
│ Status: ✅ Active                   │
│ Region: US East                    │
│ [Click to open]                    │
│                                    │
└────────────────────────────────────┘
```

**Expected Result**:
- Project dashboard opens
- You see options like Overview, SQL, Auth, Database, etc.

---

## STEP 3: Navigate to Authentication Settings

```
1. In the left sidebar, find: "Authentication" or "Auth"
2. Click it
3. A submenu appears with options:
   - Users
   - Providers
   - Email Templates
   - URL Configuration
   - etc.
4. Click: "Email Templates"
```

**Visual Sidebar**:
```
┌──────────────────────┐
│ Sidebar Menu         │
├──────────────────────┤
│ • Home               │
│ • SQL Editor         │
│ • Authentication ▼   │
│   ├─ Users           │
│   ├─ Providers       │
│   ├─ Email Templates │✅
│   ├─ URL Config      │
│   └─ Policies        │
│ • Database           │
│ • Storage            │
│ • Functions          │
│ • Logs               │
└──────────────────────┘
```

**Expected Result**:
- Email Templates page loads
- You see options for email configuration

---

## STEP 4: Find SMTP Settings

```
1. On the Email Templates page
2. Scroll DOWN to the bottom
3. Look for section: "SMTP Settings" 
   (or "Custom SMTP" or "Email Provider")
4. You might see text like:
   "No SMTP provider configured"
5. Click: "Custom SMTP" button
```

**What You're Looking For**:
```
┌─────────────────────────────────────┐
│ Email Templates Page                │
├─────────────────────────────────────┤
│                                     │
│ Confirmation email template         │
│ Recovery email template             │
│ ...more templates...                │
│                                     │
│ ─── SMTP Settings ───────────────── │
│                                     │
│ Current: No SMTP configured         │
│                                     │
│ [Custom SMTP] ✅ Click this         │
│                                     │
└─────────────────────────────────────┘
```

**Expected Result**:
- SMTP configuration form appears
- Empty fields ready for input

---

## STEP 5: Fill in SMTP Form - Host

```
1. First field: "SMTP Host"
2. Enter: smtp.gmail.com
3. Don't make typos! Exact spelling required
```

**Correct Format**:
```
✅ smtp.gmail.com
❌ SMTP.gmail.com (wrong capitalization)
❌ smtp.Gmail.com (wrong capitalization)
❌ smtp.gmail (missing .com)
❌ gmailsmtp.com (wrong provider)
```

**Visual Form**:
```
┌─────────────────────────────────────┐
│ SMTP Configuration                  │
├─────────────────────────────────────┤
│                                     │
│ SMTP Host:                          │
│ [smtp.gmail.com____________]        │
│                                     │
│ SMTP Port:                          │
│ [         ]                         │
│                                     │
│ SMTP User:                          │
│ [                                 ] │
│                                     │
│ SMTP Password:                      │
│ [••••••••••••••••]                  │
│                                     │
│ Sender Email:                       │
│ [                                 ] │
│                                     │
│ Sender Name:                        │
│ [InterQ________________]            │
│                                     │
│            [Save] [Cancel]          │
└─────────────────────────────────────┘
```

---

## STEP 6: Fill in SMTP Form - Port

```
1. Second field: "SMTP Port"
2. Enter: 587
3. (Note: you can also use 465, but 587 is recommended)
```

**Port Options**:
```
✅ 587  ← Recommended (TLS)
✅ 465  ← Alternative (SSL)
❌ 25   ← Not recommended
❌ 26   ← Not for Gmail
```

**Why 587?**
- Standard SMTP port
- Uses STARTTLS encryption
- Works with Gmail

---

## STEP 7: Fill in SMTP Form - Username

```
1. Third field: "SMTP User" or "SMTP Username"
2. Enter: your-email@gmail.com
3. Use the EXACT Gmail address you generated the App Password for
4. Make sure it's lowercase
```

**Example**:
```
✅ CORRECT:
   john.doe@gmail.com
   support@gmail.com
   
❌ INCORRECT:
   John.Doe@gmail.com        (has uppercase)
   john.doe@Gmail.com        (has uppercase)
   john.doe                  (missing @gmail.com)
```

**⚠️ IMPORTANT**: 
This must be the SAME email address you used for the Gmail App Password!

---

## STEP 8: Fill in SMTP Form - Password

```
1. Fourth field: "SMTP Password" or "SMTP Auth Password"
2. Click in the field
3. Paste the 16-character Gmail App Password
   (The one you copied in the previous guide)
4. It should look like: abcdefghijklmnop
5. (With or without spaces - Supabase should handle both)
```

**Getting the Password Ready**:
```
If you still have your Notepad/TextEdit open:
1. Select all: Ctrl+A
2. Copy: Ctrl+C
3. Click in Supabase password field
4. Paste: Ctrl+V

If you wrote it down:
1. Carefully type the 16 characters
2. Check for typos
3. Move to next field
```

**Format Examples**:
```
✅ ACCEPTED:
   abcd efgh ijkl mnop     (with spaces)
   abcdefghijklmnop        (without spaces)
   
❌ REJECTED:
   abcd-efgh-ijkl-mnop     (with dashes)
   [Copy]                  (the button text)
   your@gmail.com          (your email address)
```

**⚠️ CRITICAL**:
- Paste carefully
- No extra spaces at beginning/end
- Check for typos
- If wrong, emails won't send

---

## STEP 9: Fill in SMTP Form - Sender Email

```
1. Fifth field: "Sender Email" or "From Email"
2. Enter: your-email@gmail.com
3. This is the email address that will show as "from"
   when users receive emails
4. Usually same as SMTP User (Step 7)
```

**What Users See**:
```
When a user receives email:

From: InterQ <your-email@gmail.com>  ← This is what you set here
Subject: Verify your email
Body: Click here to verify...
```

---

## STEP 10: Fill in SMTP Form - Sender Name

```
1. Sixth field: "Sender Name" or "From Name"
2. Enter: InterQ
3. This appears in the "From" line of emails
4. Keep it professional and recognizable
```

**What Users See**:
```
From: InterQ <your-email@gmail.com>
      ↑
   This is the Sender Name
```

**Other Options**:
```
✅ InterQ
✅ InterQ Team
✅ InterQ Recruitment
✅ Recruitment Platform
```

---

## STEP 11: Review All Fields

**Before clicking Save, verify**:

```
SMTP Host:        smtp.gmail.com              ✅
SMTP Port:        587                         ✅
SMTP User:        your-email@gmail.com        ✅
SMTP Password:    [16-char password]          ✅
Sender Email:     your-email@gmail.com        ✅
Sender Name:      InterQ                      ✅
```

**Checklist**:
- [ ] Host is exactly: smtp.gmail.com
- [ ] Port is exactly: 587
- [ ] User is your Gmail address
- [ ] Password is 16 characters (no spaces)
- [ ] Sender Email is your Gmail address
- [ ] Sender Name is: InterQ

**If anything looks wrong**, go back and fix it before clicking Save!

---

## STEP 12: Save SMTP Configuration

```
1. Click the "Save" button
2. You might see a loading spinner
3. Wait for confirmation message
4. You should see: "✅ Configuration saved"
   or similar success message
```

**Visual**:
```
Before Save:
┌─────────────────────────────────────┐
│ [Custom SMTP Configuration Form]    │
│                                     │
│ SMTP Host: smtp.gmail.com           │
│ ... (other fields)                  │
│                                     │
│            [Save]  [Cancel]         │
└─────────────────────────────────────┘

After Save:
┌─────────────────────────────────────┐
│ ✅ SMTP configuration saved!        │
│                                     │
│ Your emails will now send via       │
│ smtp.gmail.com                      │
│                                     │
│ [Close] [Edit]                      │
└─────────────────────────────────────┘
```

---

## STEP 13: Wait for Configuration to Apply

```
1. After clicking Save
2. Wait 30 seconds
3. Supabase applies the configuration
4. During this time:
   - Don't refresh the page
   - Don't close the page
   - Just wait
5. After 30 seconds, configuration is active
```

**What's Happening**:
```
Your Request:
  ↓
Supabase receives SMTP settings
  ↓
Supabase validates settings
  ↓
Supabase updates configuration
  ↓ (30 seconds)
Configuration is LIVE
  ↓
Emails can now be sent!
```

---

## ✅ CONFIRMATION: SMTP is Working

After 30 seconds, your SMTP is configured! You should see:

```
Email Templates page shows:
"SMTP Provider: Custom SMTP (Gmail)"

or

"Current SMTP: Active
Host: smtp.gmail.com
Port: 587
Status: ✅ Connected"
```

---

## 🧪 STEP 14: Test Email Configuration (Optional)

Some Supabase projects have a "Send Test Email" option:

```
1. Look for "Test Email" or "Send Test Email" button
2. If available, click it
3. Enter a test email address (your email)
4. Click "Send"
5. Check your inbox
6. If you get the test email, SMTP is working! ✅
```

---

## STEP 15: Add Redirect URLs (Important!)

For password reset to work, you need to add redirect URLs:

```
1. Still in Authentication section
2. Find: "URL Configuration" (in the left menu)
3. Scroll to: "Redirect URLs" section
4. Click: "Add Redirect URL"
5. Enter: http://localhost:5173/reset-password
6. Click: "Add URL"
7. For production later: https://yourdomain.com/reset-password
8. Click: "Save"
```

**Why This Matters**:
```
When user clicks password reset link in email:
  ↓
Supabase sends them to: /reset-password
  ↓
Must be in your Redirect URL list
  ↓
Otherwise: "Invalid redirect URL" error
```

---

## ✅ COMPLETE CHECKLIST

- [ ] Step 1: Logged into Supabase
- [ ] Step 2: Selected project (lenltzlsnlbzwlizmijc)
- [ ] Step 3: Went to Authentication → Email Templates
- [ ] Step 4: Found SMTP Settings section
- [ ] Step 5: Entered smtp.gmail.com
- [ ] Step 6: Entered 587
- [ ] Step 7: Entered your Gmail address
- [ ] Step 8: Pasted 16-character App Password
- [ ] Step 9: Entered sender email (same as Step 7)
- [ ] Step 10: Entered "InterQ" as sender name
- [ ] Step 11: Reviewed all fields
- [ ] Step 12: Clicked Save
- [ ] Step 13: Waited 30 seconds
- [ ] Step 14: (Optional) Tested email
- [ ] Step 15: Added redirect URLs

**Status**: ✅ SMTP Configuration Complete!

---

## 🎉 What Happens Next

Now that SMTP is configured:

1. **Email Verification Will Work**
   ```
   User signs up → Gets verification email → Clicks link → Account verified ✅
   ```

2. **Password Reset Will Work**
   ```
   User clicks "Forgot Password" → Gets reset email → Clicks link → Resets password ✅
   ```

3. **All Auth Flows Will Work**
   ```
   Signup → Verification → Login → Dashboard ✅
   Password Reset → New Password → Login ✅
   ```

---

## 🆘 Troubleshooting

### "Saved but emails still not working"

**Check**:
1. Did you wait 30 seconds after saving?
2. Is your Gmail address correct?
3. Is the App Password correct (16 chars)?
4. Is port 587 (not 25 or 26)?

**Solution**:
1. Go back to SMTP settings
2. Click Edit
3. Verify each field
4. Re-save
5. Wait 30 seconds
6. Test again

---

### "Invalid SMTP credentials error"

**Causes**:
- Wrong Gmail address
- Wrong App Password
- Typo in password
- 2-Step Verification not enabled on Gmail

**Solution**:
1. Generate NEW App Password from Gmail
2. Copy it very carefully
3. Paste it into Supabase
4. Save again

---

### "Port 587 connection refused"

**Cause**: Firewall or ISP blocking

**Solution**:
1. Try port 465 instead:
   - Host: smtp.gmail.com
   - Port: 465 (SSL)
2. Save and test again

---

### "Emails sent but going to spam"

**Not a configuration problem** - This is normal for new SMTP:

**Solutions**:
1. Users mark it as "Not spam"
2. Add domain to SPF/DKIM records (advanced)
3. Use business email for production
4. Consider SendGrid for production

---

## 🔒 Security Notes

**Safe Practices**:
- ✅ App Password allows email sending only
- ✅ Your main Gmail password is safe
- ✅ Supabase handles password securely
- ✅ You can revoke anytime

**To revoke** (if needed):
1. Go to Gmail: https://myaccount.google.com/apppasswords
2. Delete the "Mail - Windows Computer" entry
3. SMTP will stop working (you'll need to create new password)

---

## 📝 Next Steps

1. **Test Signup** (immediately)
   ```bash
   npm run dev
   Go to: http://localhost:5173/auth
   Sign up with test email
   Check inbox for verification email
   ```

2. **Test Password Reset** (same session)
   ```
   Go to: http://localhost:5173/auth
   Click "Forgot Password?"
   Enter email
   Check inbox for reset link
   ```

3. **Full Testing** (next hour)
   - Test complete signup flow
   - Test complete password reset flow
   - Test login with new account
   - Test role-based routing

---

## 📞 Still Having Issues?

Check the main guides:
- `COMPLETE_BUG_FIX_GUIDE.md` - Detailed troubleshooting
- `QUICK_START_GUIDE.md` - Quick reference
- `IMPLEMENTATION_CHECKLIST.md` - Track your progress

---

**Created**: April 5, 2026  
**Time Required**: 5 minutes  
**Difficulty**: ⭐ Easy  
**Next Step**: Test your configuration by signing up!
