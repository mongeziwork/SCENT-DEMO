# SCENT Demo

Next.js storefront with Supabase-backed catalog/admin and PayFast checkout wiring.

## Local dev

1. Copy env vars:

```bash
cp .env.example .env.local
```

See also `env.template` for a fuller list with comments.

2. Fill in at least:

- `NEXT_PUBLIC_SUPABASE_URL`
- `NEXT_PUBLIC_SUPABASE_KEY` (recommended: `sb_publishable_...`) or legacy `NEXT_PUBLIC_SUPABASE_ANON_KEY`
- `NEXT_PUBLIC_ADMIN_EMAILS` — comma-separated emails allowed into `/admin` (optional if you use `NEXT_PUBLIC_ADMIN_EMAIL` only)
- `NEXT_PUBLIC_ADMIN_EMAIL` — single admin email (optional; merged with the list above)
- `NEXT_PUBLIC_SITE_URL` — canonical deployed URL (used for auth redirects)

Optional:

- `SUPABASE_SERVICE_ROLE_KEY` — **server-only**; never expose to the client. Use only in Route Handlers or server code that must bypass RLS.

3. Install and run:

```bash
npm install
npm run dev
```

## Deploy (Vercel)

Add the same variables in the Vercel project:

- **Production** and **Preview** both need `NEXT_PUBLIC_SUPABASE_*` and at least one of `NEXT_PUBLIC_ADMIN_EMAILS` / `NEXT_PUBLIC_ADMIN_EMAIL` if you test `/admin` on preview deployments.
- Never add `SUPABASE_SERVICE_ROLE_KEY` to client-exposed env; keep it server-only in Vercel.

## Auth model (this repo)

- **Sign-in** for everyone (customers + admins) at **`/auth/sign-in`** (header account icon, or legacy **`/login`** → same). After sign-in, **Admin** appears in the account menu only for emails in `NEXT_PUBLIC_ADMIN_EMAIL` / `NEXT_PUBLIC_ADMIN_EMAILS`. Register and forgot-password stay at `/register` and `/forgot-password`.
- **Browser session**: `@supabase/supabase-js` with `persistSession` / `autoRefreshToken` / `detectSessionInUrl` in `lib/supabase/browser.ts`.
- **`/admin`**: guarded client-side; unauthenticated users are sent to **`/auth/sign-in`** with a `next=` return URL. **`/admin/login`** redirects to the same sign-in flow. This is weaker than `@supabase/ssr` middleware + cookies; RLS and allowlisting still matter on the database side.
- **Admin allowlist**: `NEXT_PUBLIC_ADMIN_EMAILS` via `lib/admin-config.ts` (prefer tighter claims/roles in Supabase for production).

## Checklist with Supabase project owner

1. **Authentication → URL configuration**: Site URL = this app’s production URL. **Redirect URLs** include production, `http://localhost:3000`, `/auth/callback`, `/auth/sign-in`, and any Vercel preview URLs you use.
2. **Email templates**: Password reset / magic links must match your `redirectTo` paths (e.g. `/forgot-password`).
3. **RLS**: Policies on their tables must allow the right operations for authenticated users; use the **service role** only in trusted server code.

## Out of scope here

NextAuth, Prisma auth adapters, and Apparely-specific product/order services are not part of this scaffold.
