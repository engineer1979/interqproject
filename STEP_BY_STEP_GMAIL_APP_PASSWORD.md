# 📱 Gmail App Password - Step-by-Step Visual Guide

**Time Required**: 5 minutes  
**Difficulty**: Easy  
**Requirements**: 2-Step Verification enabled

---

## ⚠️ IMPORTANT PREREQUISITES

Before you start, you MUST have:
- [ ] 2-Step Verification enabled on your Gmail account
- [ ] Access to your phone (for verification)
- [ ] Your Gmail password handy

---

## STEP 1: Go to Google Security Page

```
1. Open your browser
2. Go to: https://myaccount.google.com/
3. You should see the page from your screenshot
4. Click: "Security and sign-in" (on the left sidebar)
```

**Expected Result**: 
- Security and sign-in page opens
- You see options like "Your devices", "Sign-in & recovery", etc.

---

## STEP 2: Enable 2-Step Verification (If Not Already Done)

**CHECK FIRST**: Look for "2-Step Verification" in the page
- If it says "✅ On" → Skip to STEP 3
- If it says "❌ Off" → Follow this step

```
1. Find "2-Step Verification" section
2. Click it
3. Click "Get started" or "Enable"
4. Follow the prompts:
   - Enter your password
   - Choose verification method (phone recommended)
   - Enter phone number
   - Accept verification code sent to your phone
   - Verify the code
5. Click "Turn on"
```

**Expected Result**: 
- 2-Step Verification shows "✅ On"
- You can now generate App Passwords

---

## STEP 3: Go to "Google password" Section

```
1. Stay on Security and sign-in page
2. Look for "How you sign in to Google" section
3. Click: "Google password" (shown in your screenshot as one of the blue options)
4. You might be asked to enter your password again
5. Enter your Gmail password and click "Next"
```

**Expected Result**:
- "Change your password" page appears
- Shows your current password strength

---

## STEP 4: Navigate to App Passwords

⚠️ **IMPORTANT**: App Passwords option only appears if 2-Step Verification is ON

```
1. From the "Google password" page, look for "App passwords" option
   (Usually near the bottom or in a sidebar)
2. If you don't see it:
   - Go back to: https://myaccount.google.com/apppasswords
   - This is the direct link to App Passwords
3. You may need to verify your identity again
4. Enter your password if prompted
```

**Expected Result**:
- "App passwords" page opens
- Shows "Select the app and device you're using"

---

## STEP 5: Select App and Device

```
1. Click the first dropdown: "Select app"
2. Scroll down and select: "Mail" 
   (If you don't see "Mail", select "Other (custom name)")
   
3. Click the second dropdown: "Select device"
4. Choose: "Windows Computer" 
   (Or your device type: Mac, Linux, iPhone, Android, etc.)

5. Click: "Generate"
```

**Visual Guide**:
```
┌─────────────────────────────────────┐
│ Select the app and device you're    │
│ using                               │
├─────────────────────────────────────┤
│                                     │
│ App:    [Mail         ▼]            │
│         ┌─────────────────┐         │
│         │ Chrome          │         │
│         │ Gmail           │         │
│         │ Mail      ✅    │         │
│         │ Other           │         │
│         └─────────────────┘         │
│                                     │
│ Device: [Windows Computer ▼]        │
│         ┌──────────────────┐        │
│         │ Windows Computer │✅      │
│         │ Mac              │        │
│         │ Linux            │        │
│         │ iPhone           │        │
│         └──────────────────┘        │
│                                     │
│              [Generate]             │
└─────────────────────────────────────┘
```

**Expected Result**:
- A popup appears with your 16-character App Password
- Looks like: `abcd efgh ijkl mnop` (with spaces)

---

## STEP 6: Copy the App Password

```
1. A popup window appears with your password
2. The password looks like this:
   
   ┌────────────────────────────────┐
   │ Your app password is:          │
   │                                │
   │  a b c d  e f g h  i j k l  m no p  │
   │                                │
   │  [Copy]                        │
   └────────────────────────────────┘

3. Click the "Copy" button (or select all and Ctrl+C)
4. The password is now copied to your clipboard
```

**⚠️ CRITICAL**: 
- This password will NOT be shown again
- If you lose it, you must generate a new one
- Keep it somewhere safe while you paste it in Supabase

**What it looks like**:
- 16 characters in 4 groups of 4
- Example: `abcdefghijklmnop`
- With spaces: `abcd efgh ijkl mnop`

---

## STEP 7: SAVE THE PASSWORD TEMPORARILY

**DO THIS RIGHT NOW** (before moving to Supabase):

```
Option 1: Copy to Notepad
─────────────────────────
1. Open Notepad (Windows) or TextEdit (Mac)
2. Paste the password: Ctrl+V
3. Keep the window open
4. You'll paste this into Supabase next

Option 2: Write it Down
──────────────────────
1. Get a piece of paper
2. Write down the 16-character password
3. Keep it visible while you set up Supabase

Option 3: Use Password Manager
──────────────────────────────
1. If you use LastPass, 1Password, Bitwarden, etc.
2. Create a new entry with:
   - Service: Gmail/Supabase
   - Username: your-email@gmail.com
   - Password: [paste the 16 chars]
```

**DO NOT close the Google page yet if copying!**

---

## STEP 8: Verify You Have the Password

**Checklist**:
- [ ] I can see the 16-character password
- [ ] I've copied/noted it somewhere safe
- [ ] It's not saved in my browser history
- [ ] I can paste it when needed

**Example of correct format**:
```
✅ CORRECT:
   abcd efgh ijkl mnop    (with spaces)
   abcdefghijklmnop       (without spaces)
   
❌ INCORRECT:
   [Copy]                 (the button, not the password)
   your-email@gmail.com   (your email, not the password)
   ••••••••••••••••       (hidden dots, you need the actual characters)
```

---

## NEXT STEP: Use in Supabase

**Now that you have your Gmail App Password**:

1. Open new browser tab or window
2. Go to: https://supabase.com/dashboard
3. Select project: `lenltzlsnlbzwlizmijc`
4. Navigate: Settings → Authentication → Email Templates
5. Click: "Custom SMTP"
6. Fill in form:

```
Host: smtp.gmail.com
Port: 587
User: your-email@gmail.com  (use the Gmail you just got password from)
Password: [PASTE THE 16-CHAR PASSWORD HERE]
Sender Email: your-email@gmail.com
Sender Name: InterQ
```

7. Click: "Save"
8. Wait 30 seconds
9. ✅ Done!

---

## ✅ Troubleshooting

### "I don't see App passwords option"

**Cause**: 2-Step Verification not enabled

**Solution**:
1. Go to: https://myaccount.google.com/
2. Click: "Security and sign-in"
3. Find: "2-Step Verification"
4. Enable it (follow STEP 2 above)
5. Then try to access App passwords again

---

### "App passwords says I can't create one"

**Cause**: Account type doesn't support App passwords

**Possible reasons**:
- Using Google Workspace (business account)
- Account settings restrict App passwords
- Using passkey/security key only

**Solution**:
- Contact your Google Workspace admin
- Or use a personal Gmail account instead

---

### "I lost/forgot the password"

**Solution**: You can generate a new one anytime
1. Go to App passwords page
2. Select app and device again
3. Click "Generate"
4. Get new 16-character password
5. Use the new password in Supabase

---

### "The password doesn't work in Supabase"

**Check**:
- [ ] Did you copy the ENTIRE 16-character password?
- [ ] Did you remove any spaces? (Supabase might not accept spaces)
- [ ] Is it the newest App Password (not an old one)?
- [ ] Did you enable 2-Step Verification?

**Solution**:
1. Generate a fresh App Password
2. Copy again (very carefully)
3. Paste in Supabase Password field
4. Check for extra spaces at beginning/end
5. If still failing, try without spaces:
   - Remove spaces: `abcd efgh ijkl mnop` → `abcdefghijklmnop`

---

## 🎯 Quick Checklist

- [ ] Step 1: Accessed https://myaccount.google.com/
- [ ] Step 2: 2-Step Verification is enabled ✅
- [ ] Step 3: Clicked "Google password"
- [ ] Step 4: Found App passwords option
- [ ] Step 5: Selected Mail + Windows Computer
- [ ] Step 6: Clicked Generate
- [ ] Step 7: Copied the 16-character password
- [ ] Step 8: Saved the password temporarily
- [ ] READY: Password ready to paste in Supabase

---

## 📋 Summary

**What You Just Did**:
✅ Enabled Gmail to work with third-party apps (Supabase)
✅ Generated a secure 16-character App Password
✅ This password allows Supabase to send emails on your behalf
✅ It's MORE SECURE than your actual Gmail password

**Next**:
→ Go to Supabase and paste this password in SMTP settings
→ Then emails will start working!

---

## 🔒 Security Notes

**Safe Practices**:
- ✅ App Password is secure for third-party apps
- ✅ It only allows sending emails, nothing else
- ✅ You can revoke it anytime
- ✅ Your main Gmail password stays protected

**Don't**:
- ❌ Don't share this password
- ❌ Don't post it in public
- ❌ Don't commit it to git
- ❌ Don't put it in source code

**To revoke** (if needed later):
1. Go to: https://myaccount.google.com/apppasswords
2. Find the "Mail - Windows Computer" entry
3. Click the trash icon
4. Click "Delete"
5. Password is now revoked

---

**Created**: April 5, 2026  
**Time Required**: 5 minutes  
**Difficulty**: ⭐ Easy  
**Next Step**: Use this password in Supabase SMTP configuration
