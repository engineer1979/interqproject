# Supabase Gmail Verification Fix (No Email Issue)

## Step 1: Enable Email Auth
```
1. https://supabase.com/dashboard → YOUR PROJECT
2. Settings → Authentication → Email Auth → ENABLE 
3. Confirm Email → ON
```

## Step 2: Gmail SMTP Setup (Free)
```
Dashboard → Auth → SMTP Settings → Custom SMTP:
Host: smtp.gmail.com
Port: 587
User: yourgmail@gmail.com
Password: Gmail App Password (16-char)
Sender: yourgmail@gmail.com
```

**Gmail App Password:**
```
1. Gmail → Account → Security → 2-Step Verification ON
2. App passwords → Generate → "Mail" → Copy 16-char code
3. Use this as SMTP Password (NOT regular password)
```

## Step 3: Test
```
1. localhost:5173/auth → Sign Up → test@gmail.com → Submit
2. Gmail inbox/spam → "Confirm your InterQ email" → Click
3. Login successful!
```

## Debug:
```
Dashboard → Logs → Filter "auth.email" → See queued emails
No SMTP = Emails stuck in logs
```

**Works 100% with Gmail App Password!** 📧

**Demo instant login** if urgent.
