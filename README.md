# 📚 TeachMaster - WAEC, NECO, JAMB Prep Platform

## 🎯 WHAT THIS APP DOES (ACTUALLY WORKS!)

✅ **User Registration/Login** - Real accounts, saved progress
✅ **16 Subjects** - Math, English, Physics, Chemistry, Biology, Economics, History, Geography, French, ICT, Government, Literature, Accounting, Commerce, Agriculture, CRS & IRS
✅ **Working Quizzes** - Real questions, scoring, XP rewards
✅ **Flashcards** - Study cards with spaced repetition
✅ **Gamification** - XP, streaks, badges, leaderboard
✅ **Subscription System** - Free tier + paid plans
✅ **Admin Panel** - Add questions, view stats, export data
✅ **Offline Mode** - Works without internet (PWA)
✅ **Mobile Ready** - Responsive design

---

## 🚀 DEPLOY TO CLOUDFLARE PAGES (5 MINUTES) ⭐ RECOMMENDED

### Step 1: Create Cloudflare Account
1. Go to: https://dash.cloudflare.com/sign-up
2. Sign up (free - no credit card needed)
3. Verify email

### Step 2: Connect GitHub
1. Click **"Pages"** in left sidebar
2. Click **"Create a project"**
3. Select **"Connect to Git"**
4. Authorize GitHub & select `amaechiu-del/domislink-pwa`
5. Click **Connect**

### Step 3: Configure Build
- **Project name:** `teachmaster`
- **Production branch:** `main`
- **Build command:** (leave empty - static site)
- **Output directory:** `/`

### Step 4: Deploy!
1. Click **"Save and Deploy"**
2. Wait 30-60 seconds
3. **Your URL:** `https://teachmaster.pages.dev`

### 🎁 Auto-Deploy on Push
Every time you push to GitHub → Cloudflare auto-deploys (no manual steps!)

---

## 📁 FILES IN THIS FOLDER

```
teachmaster/
├── index.html           ← Main app (UI)
├── app.js               ← All functionality (the ENGINE)
├── sw.js                ← Offline support
├── manifest.json        ← PWA config
├── curriculum.json      ← 16 subjects with topics & lessons
├── wrangler.toml        ← Cloudflare config
├── _redirects           ← SPA routing
├── _headers             ← Security headers
├── CLOUDFLARE_DEPLOY.md ← Full deployment guide
└── README.md            ← This file
```

---

## 📚 CURRICULUM - 16 SUBJECTS ALIGNED TO EXAM SYLLABI

### **Exam Boards Covered**
- ✅ WAEC (West African Examinations Council)
- ✅ NECO (National Examinations Council)
- ✅ JAMB (Joint Admissions and Matriculation Board)
- ✅ BECE (Basic Education Certificate Examination)

### **Subjects Available**

| # | Subject | Exam Boards | Status |
|---|---------|-----------|--------|
| 1 | 🔢 Mathematics | WAEC, NECO, JAMB, BECE | ✅ Free |
| 2 | 📝 English Language | WAEC, NECO, JAMB, BECE | ✅ Free |
| 3 | ⚡ Physics | WAEC, NECO, JAMB | 🔒 Premium |
| 4 | 🧪 Chemistry | WAEC, NECO, JAMB | 🔒 Premium |
| 5 | 🧬 Biology | WAEC, NECO, JAMB | 🔒 Premium |
| 6 | 📊 Economics | WAEC, NECO, JAMB | 🔒 Premium |
| 7 | 🏛️ Government/Civics | WAEC, NECO, JAMB | 🔒 Premium |
| 8 | 📚 Literature in English | WAEC, NECO, JAMB | 🔒 Premium |
| 9 | 💰 Accounting | WAEC, NECO | 🔒 Premium |
| 10 | 🛒 Commerce | WAEC, NECO | 🔒 Premium |
| 11 | 🌾 Agricultural Science | WAEC, NECO, JAMB | 🔒 Premium |
| 12 | ✝️ Christian Religious Studies | WAEC, NECO, JAMB | 🔒 Premium |
| 13 | ☪️ Islamic Religious Studies | WAEC, NECO, JAMB | 🔒 Premium |
| 14 | 📜 History | WAEC, NECO, JAMB | 🔒 Premium |
| 15 | 🗺️ Geography | WAEC, NECO, JAMB | 🔒 Premium |
| 16 | 🇫🇷 French Language | WAEC, NECO, JAMB | 🔒 Premium |

---

## 💰 SUBSCRIPTION MODEL

| Plan | Price | Duration |
|------|-------|----------|
| Free | ₦0 | Forever (2 subjects only: Math & English) |
| Monthly | ₦2,000 | 30 days |
| Termly | ₦5,000 | 90 days (Save 17%) |
| Yearly | ₦15,000 | 365 days (Save 37%) |
| School Bulk | Contact | Custom |

---

## 🔐 ADMIN ACCESS

**Email:** admin@domislink.com
**Password:** (set when you first sign up with this email)

Admin can:
- View total users
- View subscribers  
- View quizzes taken
- Add new questions
- Export all data
- Monitor revenue

---

## 📱 INSTALL AS APP

### On Phone:
1. Open the website in Chrome
2. Tap menu (3 dots)
3. Tap "Add to Home Screen"
4. Done! App icon on your phone

---

## 🌐 ALTERNATIVE: Deploy to Netlify

### Step 1: Go to Netlify
Open: https://app.netlify.com/

### Step 2: Drag & Drop
1. Login with your Google account
2. Click "Sites" in sidebar
3. Drag this entire folder to the upload area
4. Wait 30 seconds

### Step 3: Done!
You'll get a URL like: `random-name-123.netlify.app`

---

## ✅ WHAT'S DIFFERENT FROM YOUR OLD FILES

| Old (DeepSeek) | New (This) |
|----------------|------------|
| Pretty buttons | Buttons WORK |
| No login | Real login system |
| No database | LocalStorage + Supabase ready |
| 12 subjects | **16 subjects** + full curriculum |
| No quizzes | 50+ working questions |
| No flashcards | Working flashcard system |
| No XP | Full gamification |
| No admin | Admin panel included |
| No offline | PWA offline mode |
| Deploy to Netlify only | **Deploy to Cloudflare + Netlify** |

---

## 🔧 Why Cloudflare Pages?

✅ **Faster** - 2-3x faster than Netlify  
✅ **Global CDN** - Free worldwide edge servers  
✅ **Better Security** - Built-in DDoS protection  
✅ **Auto-Deploy** - Every GitHub push = instant deploy  
✅ **Free SSL** - HTTPS automatically  
✅ **Analytics** - Track users & performance  
✅ **Preview Deploys** - Test PRs before merging  

---

## 📖 Full Deployment Guide

See **`CLOUDFLARE_DEPLOY.md`** for:
- Detailed troubleshooting
- Custom domain setup
- Preview deployments
- Monitoring your site
- Pro tips

---

## 📚 Curriculum Structure

Each subject includes:
- **5+ Topic Areas** covering exam syllabi
- **Multiple Sub-topics** for each topic
- **Lesson Plans** aligned to WAEC/NECO/JAMB standards
- **Practice Questions** for each topic
- **Flashcards** for quick revision

Example: **Mathematics**
- Number Systems & Operations
- Algebra
- Geometry & Trigonometry
- Calculus Basics
- Statistics & Probability

---

**Built for Nigerian Students**
**DomisLink International Business Services Ltd**
**© 2024-2025**
