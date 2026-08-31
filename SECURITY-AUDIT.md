# Security Remediation Audit — 31 August 2026

## Scope

Repository: `amaechiu-del/domislink-pwa`

The original application was a browser-only prototype. The audit focused on authentication, authorization, credentials, tokens, payments, offline behavior, deployment headers, repository hygiene and test readiness.

## Findings and remediation status

| Area | Original problem | Remediation |
|---|---|---|
| Administrator email | Old `admin@domislink.com` identifier | Standardized to `domislinkint@gmail.com` in the security architecture and hardening plan |
| Password storage | Prototype stored plaintext passwords in localStorage | Supabase Auth is now the required identity provider; no password is stored by the new auth layer |
| Browser identity | `currentUser` came from localStorage | New `auth.js` derives identity from Supabase Auth session |
| Admin authorization | Prototype compared an email in browser JavaScript | Database `profiles.role` + RLS is the target authority |
| Roles | No server-enforced roles | Added `app_role` and protected profile role policy |
| Subscription | Prototype simulated payment locally | Added server-side Paystack initialization and webhook verification |
| Paystack secret | Secret must not reach frontend | Server functions read `PAYSTACK_SECRET_KEY` only from server environment |
| Offline mode | Local state could be confused with authority | Documentation explicitly separates offline cache from online-authoritative identity/entitlements |
| Headers | Basic headers only | Added CSP, HSTS, permissions policy, no-sniff, frame control and cache rules |
| Secrets | No environment contract | Added `.env.example` and security rules |
| Dependencies | `node_modules` was present in repository history | Added `.gitignore`; removal of already-tracked generated files still needs repository cleanup |

## Production authentication flow

```text
User
 ↓
Supabase Auth
 ↓
Authenticated session / JWT
 ↓
Frontend
 ↓
Supabase RLS or trusted backend
 ↓
Authorized data
```

## Production payment flow

```text
Authenticated user
 ↓
POST /api/paystack/initialize
 ↓
Server validates Supabase JWT
 ↓
Server initializes Paystack with secret key
 ↓
User completes checkout
 ↓
Paystack webhook
 ↓
HMAC SHA-512 signature validation
 ↓
Paystack transaction verification
 ↓
Supabase subscription entitlement
```

## What remains environment-dependent

The repository now contains the implementation foundation, but these values must be configured before production use:

- Supabase project URL
- Supabase anon/publishable key
- Supabase database schema/RLS deployment
- creation and verification of `domislinkint@gmail.com` in Supabase Auth
- Paystack secret key in Cloudflare/server environment
- Supabase service-role key in server environment
- Paystack webhook URL
- production redirect URLs

## Required acceptance tests

### Authentication

- Register a new student.
- Confirm the email.
- Sign out.
- Sign in again.
- Refresh the page and confirm the provider session restores.
- Confirm no plaintext password appears in localStorage.
- Confirm an ordinary user cannot access admin operations.

### Administrator

- Sign up/sign in with `domislinkint@gmail.com`.
- Confirm the profile role is `admin`.
- Confirm admin operations work through RLS/backend authorization.
- Confirm a normal user cannot change their own role to `admin`.

### Payments

- Initialize a test payment while authenticated.
- Confirm the Paystack secret never reaches browser JavaScript.
- Complete a test payment.
- Confirm webhook signature validation.
- Confirm transaction verification.
- Confirm subscription entitlement is written only after successful verification.
- Confirm a modified client-side price cannot create a higher entitlement.

### Offline/PWA

- Load the learning content online.
- Disconnect the network.
- Confirm lessons/questions/flashcards continue to work where intended.
- Confirm offline data cannot manufacture admin access or premium entitlement.
- Reconnect and confirm synchronization does not overwrite server-authoritative subscription state.

## Current release status

**Security foundation: implemented.**

**Production release: not yet complete until the external Supabase/Paystack configuration and acceptance tests above are executed.**
