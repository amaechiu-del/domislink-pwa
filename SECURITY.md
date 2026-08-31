# Security Baseline

## Secrets

Never commit passwords, service-role keys, Paystack secret keys, private API keys, or production credentials.

Frontend configuration may contain public identifiers such as a Supabase project URL and anon/publishable key. Treat every other credential as server-only unless the provider explicitly documents it as public.

## Authentication

Supabase Auth is authoritative. `localStorage` must never be used as proof of identity.

## Authorization

Every administrative and privileged operation must be enforced outside the browser through database RLS and/or a trusted backend.

## Payments

Paystack public key: frontend-safe.
Paystack secret key: server-only.

The server must verify the transaction amount, currency, reference, status and expected customer before granting subscription entitlement.

## Offline

Offline data must not be able to create or extend an entitlement. Synchronization must be validated by the server.

## Content safety

User-generated content should be rendered as text or sanitized HTML. Avoid injecting untrusted strings into `innerHTML` without sanitization.

## Deployment

Use HTTPS. Set security headers. Do not cache sensitive authenticated responses as public assets. Review service-worker caching whenever authentication or payment functionality changes.

## Repository hygiene

Do not commit generated dependency directories such as `node_modules`. Keep dependency manifests and lockfiles in source control instead.

## Pre-production checklist

- [ ] Supabase project configured
- [ ] Email authentication configured
- [ ] Admin account created with `domislinkint@gmail.com`
- [ ] RLS enabled on all protected tables
- [ ] Admin role assigned in database
- [ ] No plaintext passwords in repository or browser storage
- [ ] No server secrets in frontend
- [ ] Paystack webhook secret configured server-side
- [ ] Paystack transaction verification tested
- [ ] Offline cache reviewed
- [ ] Security headers reviewed
- [ ] Production build tested
