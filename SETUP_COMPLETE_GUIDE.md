# 🚀 InterQ - Complete Setup Guide for IDE

**Ready to Run in Your IDE!**

---

## ⚡ QUICK START (5 MINUTES)

### Step 1: Extract ZIP File
```bash
# Extract the downloaded zip file
# On Windows: Right-click → Extract All
# On Mac/Linux: unzip InterQ_Complete_Project.zip
```

### Step 2: Open in VS Code
```bash
# Navigate to extracted folder
cd interqproject-master

# Open in VS Code
code .
```

### Step 3: Install Dependencies
```bash
# In VS Code Terminal (Ctrl+`)
npm install
```

### Step 4: Start Development Server
```bash
npm run dev
```

### Step 5: Open in Browser
```
Go to: http://localhost:5173
```

✅ **Your app is running!**

---

## 📋 REQUIREMENTS

Before starting, make sure you have:

- [ ] **Node.js** (version 18 or higher)
  - Download: https://nodejs.org/
  - Check: `node --version` (should be v18+)

- [ ] **npm** (comes with Node.js)
  - Check: `npm --version`

- [ ] **VS Code** or any IDE
  - Download: https://code.visualstudio.com/

- [ ] **Git** (optional, but recommended)
  - Download: https://git-scm.com/

---

## 🔧 DETAILED SETUP INSTRUCTIONS

### STEP 1: Check Node.js is Installed

**Windows:**
```bash
# Open Command Prompt and type:
node --version
npm --version

# Should show something like:
# v18.17.0
# 9.6.7
```

**Mac/Linux:**
```bash
node --version
npm --version
```

If not installed, download from: https://nodejs.org/

---

### STEP 2: Extract the ZIP File

**Windows:**
1. Right-click on `InterQ_Complete_Project.zip`
2. Select "Extract All..."
3. Choose destination folder
4. Click "Extract"

**Mac:**
```bash
unzip InterQ_Complete_Project.zip
cd interqproject-master
```

**Linux:**
```bash
unzip InterQ_Complete_Project.zip
cd interqproject-master
```

---

### STEP 3: Open Project in VS Code

**Option A: Command Line**
```bash
# Navigate to project folder
cd /path/to/interqproject-master

# Open in VS Code
code .
```

**Option B: GUI**
1. Open VS Code
2. File → Open Folder
3. Select `interqproject-master` folder
4. Click "Open"

---

### STEP 4: Open Terminal in VS Code

```
Press: Ctrl + ` (backtick)
or: Ctrl + Shift + `
or: View → Terminal
```

You should see a terminal panel at the bottom of VS Code.

---

### STEP 5: Install Dependencies

In the VS Code terminal, type:

```bash
npm install
```

**What this does:**
- Downloads all required packages from npm
- Creates `node_modules` folder
- Installs: React, Vite, Supabase, Tailwind CSS, etc.

**⏱️ Time: 2-5 minutes** (depends on internet speed)

**Expected output:**
```
added 500+ packages in 120s
```

---

### STEP 6: Configure Environment Variables

1. In VS Code, find the file `.env.local` in the root folder
2. Check these values are present:
   ```
   VITE_SUPABASE_URL=https://lenltzlsnlbzwlizmijc.supabase.co
   VITE_SUPABASE_ANON_KEY=eyJhbGc...
   VITE_SUPABASE_SERVICE_ROLE_KEY=eyJhbGc...
   ```

3. **BEFORE USING**: 
   - [ ] Read: `STEP_BY_STEP_GMAIL_APP_PASSWORD.md`
   - [ ] Generate Gmail App Password
   - [ ] Configure SMTP in Supabase (see guide)

---

### STEP 7: Start Development Server

In the VS Code terminal:

```bash
npm run dev
```

**Expected output:**
```
  VITE v5.4.19  ready in 342 ms

  ➜  Local:   http://localhost:5173/
  ➜  Press h + enter to show help
```

✅ **Server is running!**

---

### STEP 8: Open in Browser

Click the link or type in address bar:
```
http://localhost:5173
```

You should see the InterQ login page!

---

## 📚 IMPORTANT GUIDES INCLUDED

After opening the project, you'll see these guides in the root folder:

1. **STEP_BY_STEP_GMAIL_APP_PASSWORD.md** ⭐ READ FIRST
   - How to generate Gmail App Password
   - Time: 5 minutes

2. **STEP_BY_STEP_SUPABASE_SMTP.md** ⭐ READ SECOND
   - How to configure email sending
   - Time: 5 minutes

3. **COMPLETE_BUG_FIX_GUIDE.md**
   - Detailed explanation of all issues
   - Time: 30 minutes (for reference)

4. **CODE_IMPROVEMENTS_AND_FIXES.md**
   - Code updates you can apply
   - Time: 60 minutes (optional)

5. **QUICK_START_GUIDE.md**
   - Quick reference guide
   - Time: 5 minutes

6. **IMPLEMENTATION_CHECKLIST.md**
   - Printable checklist
   - Time: Ongoing

---

## 🔑 FIX THE EMAIL ISSUES (10 MINUTES)

To make email verification and password reset work:

### Quick Fix (In Order):

1. **Read**: STEP_BY_STEP_GMAIL_APP_PASSWORD.md (5 min)
   - Follow all 8 steps
   - Copy the 16-character password

2. **Read**: STEP_BY_STEP_SUPABASE_SMTP.md (5 min)
   - Follow all 15 steps
   - Paste the password from step 1

3. **Test**: In your browser
   - Go to: http://localhost:5173/auth
   - Sign up with test email
   - Check inbox for verification email ✅

---

## 📁 PROJECT STRUCTURE

After extraction, you'll see:

```
interqproject-master/
│
├── 📖 SETUP_COMPLETE_GUIDE.md         (This file)
├── 📖 STEP_BY_STEP_GMAIL_APP_PASSWORD.md
├── 📖 STEP_BY_STEP_SUPABASE_SMTP.md
├── 📖 COMPLETE_BUG_FIX_GUIDE.md
├── 📖 CODE_IMPROVEMENTS_AND_FIXES.md
├── 📖 QUICK_START_GUIDE.md
├── 📖 IMPLEMENTATION_CHECKLIST.md
│
├── src/                              (Source code)
│   ├── pages/
│   │   ├── Auth.tsx                 (Login/Signup)
│   │   ├── ResetPassword.tsx        (Password reset)
│   │   └── ...
│   ├── components/                  (UI components)
│   ├── contexts/                    (Auth context)
│   ├── services/                    (API calls)
│   └── App.tsx                      (Main app)
│
├── supabase/                        (Database)
│   ├── migrations/                  (Database schemas)
│   └── functions/                   (Supabase functions)
│
├── public/                          (Images, assets)
│
├── package.json                     (Dependencies list)
├── vite.config.ts                   (Build configuration)
├── tsconfig.json                    (TypeScript config)
├── tailwind.config.ts               (Tailwind CSS config)
└── .env.local                       (Environment variables)
```

---

## 🎯 COMMON COMMANDS

### Development Commands

```bash
# Start development server
npm run dev

# Build for production
npm run build

# Preview production build
npm preview

# Run linter
npm run lint
```

---

## 🐛 TROUBLESHOOTING

### Problem: "npm: command not found"

**Solution**: Node.js is not installed
```bash
# Download and install from: https://nodejs.org/
# Then restart terminal
```

### Problem: Port 5173 already in use

**Solution**: Use different port
```bash
npm run dev -- --port 3000
# Then visit: http://localhost:3000
```

### Problem: "Cannot find module"

**Solution**: Install dependencies
```bash
npm install
```

### Problem: "node_modules not found"

**Solution**: Install dependencies
```bash
npm install
```

### Problem: Vite compilation errors

**Solution**: Clear cache and restart
```bash
# Delete node_modules
rm -rf node_modules

# Clear npm cache
npm cache clean --force

# Reinstall
npm install

# Start again
npm run dev
```

---

## 📱 TESTING THE APP

### Test User Accounts (Demo)

These demo accounts work without email verification:

```
Admin:
- Email: admin@interq.com
- Password: Admin@123

Company:
- Email: company@interq.com
- Password: Company@123

Recruiter:
- Email: recruiter@interq.com
- Password: Recruiter@123

Job Seeker:
- Email: jobseeker@interq.com
- Password: JobSeeker@123
```

### Test Email Features

**To test real email signup:**

1. Read STEP_BY_STEP_GMAIL_APP_PASSWORD.md
2. Read STEP_BY_STEP_SUPABASE_SMTP.md
3. Configure SMTP (10 minutes)
4. Sign up with new email
5. Check inbox for verification ✅

---

## 🔒 SECURITY NOTES

### Important:

- ✅ `.env.local` is included but **NEVER commit it to git**
- ✅ Supabase credentials in `.env.local` are for development only
- ✅ For production, update credentials and add to `.gitignore`
- ✅ Never share your API keys

### Before Deploying:

```bash
# Add to .gitignore (if not already there)
.env.local
.env.*.local
node_modules/
dist/
```

---

## 🚀 NEXT STEPS

### Immediate (Today)

- [ ] Extract ZIP
- [ ] Open in VS Code
- [ ] Run `npm install`
- [ ] Run `npm run dev`
- [ ] Open http://localhost:5173
- [ ] Login with demo account

### Within 1 Hour

- [ ] Read STEP_BY_STEP_GMAIL_APP_PASSWORD.md
- [ ] Generate Gmail App Password
- [ ] Read STEP_BY_STEP_SUPABASE_SMTP.md
- [ ] Configure SMTP
- [ ] Test signup with email

### This Week

- [ ] Review COMPLETE_BUG_FIX_GUIDE.md
- [ ] Apply code improvements (optional)
- [ ] Test all authentication flows
- [ ] Deploy to production

---

## 📞 SUPPORT

**If you get stuck:**

1. Check the included guides:
   - STEP_BY_STEP_GMAIL_APP_PASSWORD.md
   - STEP_BY_STEP_SUPABASE_SMTP.md
   - COMPLETE_BUG_FIX_GUIDE.md

2. Check error messages in:
   - VS Code terminal
   - Browser console (F12)
   - Supabase dashboard logs

3. Common fixes:
   - Restart terminal
   - Delete node_modules and run `npm install`
   - Clear browser cache
   - Check .env.local file

---

## ✅ VERIFICATION CHECKLIST

Before considering setup complete:

- [ ] Node.js v18+ installed
- [ ] Project extracted
- [ ] Opened in VS Code
- [ ] `npm install` completed successfully
- [ ] `npm run dev` running
- [ ] Browser shows http://localhost:5173
- [ ] Can see login/signup page
- [ ] Can login with demo account
- [ ] No errors in console

---

## 📊 PROJECT INFO

**Technology Stack:**
- Frontend: React 18 + TypeScript
- Build Tool: Vite
- UI Framework: shadcn/ui
- CSS: Tailwind CSS
- Database: Supabase (PostgreSQL)
- Authentication: Supabase Auth
- API: Supabase JS Client

**Requirements:**
- Node.js 18+
- npm 9+
- Modern browser (Chrome, Firefox, Safari, Edge)

**File Size:** ~7.3 MB (ZIP) → ~50 MB (extracted)

---

## 🎉 YOU'RE READY!

Everything is set up and ready to go!

**Next:** Read the guides and fix the email issues (10 minutes)

---

**Created**: April 5, 2026
**Version**: 1.0
**Status**: Ready to Run ✅
