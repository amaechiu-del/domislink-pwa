# TeachMaster Authentication Architecture

## 1. Identity

Supabase Auth is the source of truth for user identity. The browser must never authenticate a user merely because an object exists in `localStorage`.

Administrator account:

- Email: `domislinkint@gmail.com`
- Password: created and managed through Supabase Auth

Never place the administrator password in source code.

## 2. Request flow

```text
Sign up / Sign in
      ↓
Supabase Auth
      ↓
Authenticated session
      ↓
Access JWT + refresh mechanism
      ↓
Supabase database/API request
      ↓
JWT verification + RLS / role policy
      ↓
Authorized response
```

## 3. Client responsibilities

The client may:

- start login/signup
- listen for auth-state changes
- display the authenticated user's profile
- attach the provider-managed session to authorized requests
- cache non-sensitive learning data for offline use

The client must not:

- store plaintext passwords
- manufacture authentication tokens
- decide that a user is an administrator solely from a local value
- grant premium access solely from local storage
- verify Paystack transactions using a secret key

## 4. Roles

The database supports these application roles:

- `user`
- `student`
- `business`
- `agent`
- `publisher`
- `moderator`
- `admin`
- `super_admin`

Authorization must be enforced by database policies and/or a trusted backend.

## 5. Admin access

The administrator email is a bootstrap identifier, not a substitute for authentication. The account must first authenticate through Supabase. Database policies then determine which administrative operations are allowed.

For stronger production security, administrative privileges should be represented by a database role/profile record rather than a frontend email comparison.

## 6. Offline behavior

Offline mode is for learning continuity, not security bypass.

Safe candidates for offline caching:

- curriculum
- questions
- flashcards
- non-sensitive UI preferences
- local learning progress awaiting synchronization

Online-authoritative data:

- identity
- roles
- administrator privileges
- subscription entitlement
- payment status
- sensitive account information

## 7. Session lifecycle

On application startup the client should restore the provider-managed session. On sign-in/sign-out/token refresh, the application should update its UI from the provider's auth-state event.

When the user signs out, the provider session must be terminated and sensitive local application state cleared.

## 8. Supabase setup

Create a Supabase project and configure the frontend with only:

- project URL
- anon/publishable key

The service-role key must exist only in trusted server-side environments.

Create the database objects in `supabase/schema.sql` and enable the required RLS policies before exposing protected production data.
