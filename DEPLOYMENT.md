# 🚀 DEPLOYMENT GUIDE - DomisLink PWA

## ⚡ QUICK START (5 MINUTES)

### Option 1: GitHub Pages (FREE, INSTANT)
```
Your app is now live at:
https://amaechiu-del.github.io/domislink-pwa/
```

**Steps:**
1. Go to https://github.com/amaechiu-del/domislink-pwa/settings/pages
2. Select "main" branch, root folder
3. Click "Save"
4. Wait 2-3 minutes
5. Live! ✅

---

### Option 2: Netlify (RECOMMENDED)
**Best for PWA + Forms**

1. Go to https://app.netlify.com/
2. Click "Add new site" → "Import existing project"
3. Choose GitHub repo: `domislink-pwa`
4. Click "Deploy"
5. Get instant URL: `domislink-pwa.netlify.app`

**Features:**
- Auto SSL/TLS
- Free form submissions
- Better performance
- Custom domain ready

---

### Option 3: Vercel (FASTEST)
**Best for speed**

1. Go to https://vercel.com/
2. Click "Add New" → "Project"
3. Import GitHub: `domislink-pwa`
4. Click "Deploy"
5. Get URL: `domislink-pwa.vercel.app`

---

## 🎯 PRODUCTION SETUP (DOMAIN + CUSTOM)

### Step 1: Connect Custom Domain
For all platforms:
1. Buy domain: Namecheap, GoDaddy, etc.
2. Go to DNS settings
3. Add CNAME: `your-domain.com → netlify.app` (or Vercel equivalent)
4. Wait 24-48 hours for propagation
5. Enable SSL (automatic)

**Example:**
```
Domain: teachmaster.academy
CNAME: teachmaster-domislink.netlify.app
```

---

### Step 2: Setup Environment Variables

Create `.env.local`:
```env
# Paystack
REACT_APP_PAYSTACK_KEY=pk_live_YOUR_PUBLIC_KEY

# Claude API (for AI questions)
REACT_APP_CLAUDE_API=sk_live_YOUR_KEY

# Unsplash (for images)
REACT_APP_UNSPLASH_KEY=YOUR_KEY

# YouTube (for videos)
REACT_APP_YOUTUBE_KEY=YOUR_KEY
```

---

### Step 3: Environment-Specific Variables

#### Netlify
1. Go to Site settings → Build & deploy → Environment
2. Add environment variables
3. They auto-inject into build

#### Vercel
1. Go to Settings → Environment Variables
2. Add for Production/Preview/Development
3. Redeploy for changes

---

## 💰 PAYSTACK PRODUCTION SETUP

### 1. Create Paystack Account
- Go to https://dashboard.paystack.com
- Sign up (requires business verification)

### 2. Get API Keys
- Dashboard → Settings → API Keys
- Copy: **Public Key** + **Secret Key**
- Add to environment variables

### 3. Create Plans
In Paystack Dashboard:
```
Plan 1:
- Name: Monthly
- Amount: 200000 (₦2,000 in kobo)
- Interval: monthly
- Plan Code: PLN_monthly_2000

Plan 2:
- Name: Quarterly
- Amount: 500000 (₦5,000)
- Interval: custom_3_months
- Plan Code: PLN_quarterly_5000

Plan 3:
- Name: Yearly
- Amount: 1500000 (₦15,000)
- Interval: yearly
- Plan Code: PLN_yearly_15000
```

### 4. Setup Webhooks
1. Dashboard → Settings → Webhooks
2. Add webhook URL: `https://your-domain.com/api/paystack-webhook`
3. Select events:
   - charge.success
   - subscription.create
   - subscription.disable

### 5. Enable Test Mode
- Toggle "Test Mode" while developing
- Use test card: 4111 1111 1111 1111
- Test expiry: 01/25
- Test OTP: 123456

---

## 🤖 AI API SETUP

### Claude API (Recommended)
1. Go to https://console.anthropic.com/
2. Create account / Login
3. Go to API Keys
4. Create new key
5. Add to environment: `REACT_APP_CLAUDE_API=sk_xxx`

**Usage in code:**
```javascript
const contentGenerator = new DynamicContentGenerator(apiKey);
const question = await contentGenerator.generateWithAI(prompt);
```

---

## 🖼️ IMAGE API SETUP

### Unsplash API (Free)
1. Go to https://unsplash.com/developers
2. Create app
3. Get Access Key
4. Add to environment: `REACT_APP_UNSPLASH_KEY=xxx`

### Pexels API (Alternative)
1. Go to https://www.pexels.com/api/
2. Create account
3. Get API key
4. Use: `https://api.pexels.com/v1/search`

---

## 🎬 VIDEO SETUP

### YouTube Data API
1. Go to Google Cloud Console
2. Enable YouTube Data API v3
3. Create API key
4. Add to environment: `REACT_APP_YOUTUBE_KEY=xxx`

### Embed YouTube Videos
```html
<iframe width="100%" height="315" 
  src="https://www.youtube.com/embed/VIDEO_ID" 
  frameborder="0" allowfullscreen></iframe>
```

---

## 🔐 BACKEND SETUP (OPTIONAL - FOR PRODUCTION)

If you want persistent subscriptions beyond localStorage:

### Using Supabase (Recommended)

1. Go to https://supabase.com/
2. Create project
3. Go to SQL Editor, paste:

```sql
-- Users table
CREATE TABLE users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email VARCHAR UNIQUE NOT NULL,
  password_hash VARCHAR NOT NULL,
  full_name VARCHAR,
  phone VARCHAR,
  created_at TIMESTAMP DEFAULT NOW()
);

-- Subscriptions table
CREATE TABLE subscriptions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES users(id),
  plan_id VARCHAR NOT NULL,
  paystack_ref VARCHAR UNIQUE,
  status VARCHAR DEFAULT 'active',
  expires_at TIMESTAMP,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Quiz history
CREATE TABLE quiz_history (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES users(id),
  subject VARCHAR NOT NULL,
  score INTEGER,
  total INTEGER,
  completed_at TIMESTAMP DEFAULT NOW()
);

-- Lessons viewed
CREATE TABLE lessons_viewed (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES users(id),
  subject VARCHAR NOT NULL,
  topic VARCHAR NOT NULL,
  viewed_at TIMESTAMP DEFAULT NOW()
);
```

4. Get API URL + Key from Settings
5. Use Supabase JS client:

```javascript
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  "https://your-project.supabase.co",
  "your-anon-key"
);

// Check subscription
const { data } = await supabase
  .from("subscriptions")
  .select("*")
  .eq("user_id", userId)
  .single();
```

---

## 📊 MONITORING & ANALYTICS

### Google Analytics (Free)
1. Go to https://analytics.google.com/
2. Create property
3. Get Tracking ID: `G-XXXXXXXXXX`
4. Add to index.html:

```html
<script async src="https://www.googletagmanager.com/gtag/js?id=G-XXXXXXXXXX"></script>
<script>
  window.dataLayer = window.dataLayer || [];
  function gtag(){dataLayer.push(arguments);}
  gtag('js', new Date());
  gtag('config', 'G-XXXXXXXXXX');
</script>
```

### Sentry (Error Tracking - Free)
1. Go to https://sentry.io/
2. Create project
3. Get DSN
4. Add to app.js:

```javascript
Sentry.init({ dsn: "YOUR_SENTRY_DSN" });
```

---

## 🔄 CI/CD PIPELINE

### GitHub Actions (Auto-Deploy)

Create `.github/workflows/deploy.yml`:

```yaml
name: Deploy to Netlify

on:
  push:
    branches: [main]

jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v2
      
      - name: Deploy to Netlify
        uses: nwtgck/actions-netlify@v2.0
        with:
          publish-dir: './'
          production-branch: main
          github-token: ${{ secrets.GITHUB_TOKEN }}
          deploy-message: "Deploy from GitHub Actions"
          enable-pull-request-comment: true
          enable-commit-comment: true
        env:
          NETLIFY_AUTH_TOKEN: ${{ secrets.NETLIFY_AUTH_TOKEN }}
          NETLIFY_SITE_ID: ${{ secrets.NETLIFY_SITE_ID }}
        timeout-minutes: 1
```

---

## 📱 MOBILE APP STORE

### Google Play Store

1. **Build APK with Capacitor:**
```bash
npm install @capacitor/core @capacitor/cli
npx cap init domislink com.domislink.teachmaster
npx cap copy
npx cap open android
# Build from Android Studio
```

2. **Upload to Google Play Console:**
- Create developer account ($25)
- Go to https://play.google.com/console
- Create new app
- Upload APK/AAB
- Fill app details, screenshots, privacy policy
- Submit for review (takes 24-48 hours)

### Apple App Store

1. **Same with iOS:**
```bash
npx cap open ios
# Build from Xcode
```

2. **Upload:**
- Join Apple Developer ($99/year)
- Use Xcode → Product → Archive
- Upload through Xcode

---

## ✅ PRE-LAUNCH CHECKLIST

- [ ] Test on mobile (iOS + Android)
- [ ] Test offline mode (PWA)
- [ ] Test subscription payment (test mode)
- [ ] Setup error tracking (Sentry)
- [ ] Setup analytics (Google Analytics)
- [ ] Add privacy policy page
- [ ] Add terms of service page
- [ ] Test on slow network (3G)
- [ ] Performance audit (PageSpeed Insights)
- [ ] Security audit (OWASP)
- [ ] SEO optimization (meta tags, structured data)
- [ ] Test AI question generation
- [ ] Test image/video loading
- [ ] Test all 12 subjects fully

---

## 🆘 TROUBLESHOOTING

### App not showing in Google Play
- Check content rating (questionnaire)
- Ensure no restricted content
- App must have privacy policy link
- Screenshots must show real app UI

### Service Worker not caching
- Clear browser cache
- Check DevTools → Application → Service Workers
- Ensure `sw.js` has correct cache names

### Paystack payment failing
- Check public key is correct
- Test mode enabled during development
- Check plan codes match dashboard
- Enable test transaction logs in dashboard

### AI questions not generating
- Check Claude API key is valid
- Check rate limits (free tier = 5 requests/day)
- Fallback to mock questions working?
- Check browser console for errors

### Images not loading
- Check Unsplash API key
- Check rate limits (free = 50/hour)
- Check search terms valid
- Ensure CORS enabled

### Slow performance
- Use Lighthouse in DevTools
- Compress images (<100KB)
- Minimize JavaScript
- Enable gzip compression on server
- Use CDN for static assets

---

## 📞 SUPPORT & RESOURCES

- **Netlify Docs:** https://docs.netlify.com/
- **Vercel Docs:** https://vercel.com/docs
- **Paystack Docs:** https://paystack.com/developers
- **GitHub Pages:** https://pages.github.com/
- **PWA Guide:** https://web.dev/progressive-web-apps/
- **Claude API:** https://console.anthropic.com/
- **Supabase Docs:** https://supabase.com/docs
- **Capacitor:** https://capacitorjs.com/

---

**Ready to go live? Choose your platform above and deploy! 🚀**

### Quick Links to Deploy Now:
- [Deploy to Netlify](https://app.netlify.com/)
- [Deploy to Vercel](https://vercel.com/)
- [GitHub Pages Settings](https://github.com/amaechiu-del/domislink-pwa/settings/pages)
- [Paystack Dashboard](https://dashboard.paystack.com/)
