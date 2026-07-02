# 🚀 Deploy TeachMaster to Cloudflare Pages

## ✅ Quick Deploy (5 Minutes)

### Step 1: Create Cloudflare Account
1. Go to https://dash.cloudflare.com/sign-up
2. Sign up (free account)
3. Verify email

### Step 2: Connect GitHub
1. Go to **Pages** in left sidebar
2. Click "Create a project"
3. Select **"Connect to Git"**
4. Authorize GitHub (select your account)
5. Find & select `amaechiu-del/domislink-pwa` repo
6. Click **Connect**

### Step 3: Configure Build
- **Project name:** `teachmaster` (or your preferred name)
- **Production branch:** `main`
- **Build command:** (leave empty - static site)
- **Build output directory:** `/` (root folder)
- **Environment variables:** (leave empty for now)

### Step 4: Deploy!
1. Click **"Save and Deploy"**
2. Wait 30-60 seconds
3. Get your URL: `teachmaster.pages.dev`

---

## 🎯 After Deployment

### Option A: Use Cloudflare Subdomain (FREE)
Your site: `https://teachmaster.pages.dev`

### Option B: Use Custom Domain (if you own domislink.com)
1. Go to **Pages** → **Settings**
2. Click **"Custom domains"**
3. Add domain: `academy.domislink.com`
4. Follow DNS setup (Cloudflare will guide you)
5. Wait 10 minutes for DNS to update

---

## 🔧 Files Included

| File | Purpose |
|------|---------|
| `wrangler.toml` | Cloudflare Pages config |
| `_redirects` | SPA routing (all routes → index.html) |
| `_headers` | Cache & security headers |
| `CLOUDFLARE_DEPLOY.md` | This file |

---

## 🚀 Auto-Deploy on Push

After connecting GitHub:
- **Every time you push to `main`** → Cloudflare auto-deploys
- No manual action needed
- Takes 30-60 seconds

Test it:
1. Make a change to `app.js`
2. Commit & push to GitHub
3. Cloudflare auto-deploys
4. Check your URL

---

## 📊 Monitor Your Site

In Cloudflare Pages Dashboard:
- ✅ **Deployments** - See all deploys
- 📈 **Analytics** - Users, bandwidth, errors
- ⚡ **Performance** - Speed insights
- 🔒 **Security** - DDoS protection included

---

## 🆘 Troubleshooting

### "Blank page" or "404"
- Check `_redirects` file exists
- Verify build output directory is `/`
- Clear browser cache (Ctrl+Shift+Delete)

### "Service worker not loading"
- Check `sw.js` file exists in root
- Verify `_headers` has `Service-Worker-Allowed: /`

### "PWA not installing"
- Check `manifest.json` is valid (copy from repo)
- Verify `start_url` is `/` in manifest

### Redeploy manually
- Go to **Pages** → **Deployments**
- Click the latest deploy
- Click **Retry Deploy**

---

## 💡 Pro Tips

1. **Faster deployments** - Cloudflare is usually 2-3x faster than Netlify
2. **Global CDN** - Your site loads fast worldwide (free with Cloudflare)
3. **Free SSL/TLS** - HTTPS automatic (included)
4. **Redirects** - The `_redirects` file ensures SPA routing works
5. **No build step needed** - Your app is already static HTML/CSS/JS

---

## 🎁 Bonus: Preview Deploys

Every pull request gets a preview URL:
- PR #1 → `pr-1.teachmaster.pages.dev`
- Perfect for testing before merging!

---

**Ready? Go to https://dash.cloudflare.com/sign-up and start deploying!**
