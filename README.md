# 📚 TeachMaster - WAEC, NECO, JAMB Prep Platform

## 🎯 WHAT THIS APP DOES

✅ User registration/login
✅ 16 exam-preparation subjects
✅ Quizzes, scoring, XP, streaks and badges
✅ Flashcards
✅ Subscription plans
✅ Admin panel
✅ PWA/offline support

## 🔐 AUTHENTICATION & SECURITY

**Administrator email:** `domislinkint@gmail.com`

Authentication is being migrated from the original browser-only prototype to a production architecture based on Supabase Auth, JWT sessions, server-side authorization and database Row Level Security (RLS).

**Never commit:** passwords, Supabase service-role keys, Paystack secret keys, private API keys, or other server secrets.

### Production request flow

```text
Browser / PWA
      ↓ HTTPS
Supabase Auth
      ↓ access token / refresh session
Protected API or Supabase database
      ↓ JWT verification + RLS / role checks
Application data
```

`localStorage` is permitted only for non-sensitive offline application data. A cached `currentUser`, role, subscription, or admin flag must never be treated as proof of identity or authorization.

See `AUTHENTICATION.md`, `SECURITY.md`, and `supabase/schema.sql` for the security design and database policy.

## 💰 SUBSCRIPTION MODEL

| Plan | Price | Duration |
|------|-------|----------|
| Free | ₦0 | Forever |
| Monthly | ₦2,000 | 30 days |
| Termly | ₦5,000 | 90 days |
| Yearly | ₦15,000 | 365 days |
| School Bulk | Contact | Custom |

## 📁 MAIN FILES

```text
app.js                    ← application engine
curriculum.json           ← curriculum
questions_by_class.json   ← question bank
flashcards_by_class.json  ← flashcards
manifest.json             ← PWA configuration
_headers                  ← security headers
_redirects                ← routing
AUTHENTICATION.md         ← authentication design
SECURITY.md               ← security rules/checklist
supabase/schema.sql       ← database/RLS foundation
functions/api/paystack/   ← server-side payment webhook
```

## 🚀 DEPLOYMENT

The project can be deployed to Cloudflare Pages. Configure public Supabase values through deployment configuration; never expose server secrets in frontend JavaScript.

For Paystack, the browser may use only the public key. Payment verification and webhook processing must use the secret key on the server.

## 🔒 SECURITY RULES

1. Passwords are handled by Supabase Auth, not browser storage.
2. Never store plaintext passwords.
3. Never trust a client-side admin flag.
4. Protected database operations must be controlled by Supabase RLS and/or a verified backend.
5. Subscription status must be server/database authoritative.
6. Paystack transactions must be verified server-side.
7. Offline caches must not bypass subscription or admin controls.
8. Rotate any secret that was previously committed to a public repository.

**Built for Nigerian Students**  
**DomisLink International Business Services Ltd**
