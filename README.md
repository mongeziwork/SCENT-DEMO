# SCENT Demo

Minimal Next.js app scaffold with an open `/admin` route (no auth yet) and a Supabase client helper.

## Local dev

1. Copy env vars:

```bash
cp .env.example .env.local
```

2. Fill in:

- `NEXT_PUBLIC_SUPABASE_URL`
- `NEXT_PUBLIC_SUPABASE_KEY` (recommended: `sb_publishable_...`)
  - Fallback (legacy): `NEXT_PUBLIC_SUPABASE_ANON_KEY`
- `NEXT_PUBLIC_SITE_URL` (recommended): your canonical deployed URL (used for magic-link redirects)

3. Install and run:

```bash
npm install
npm run dev
```

## Deploy (Vercel)

Add the same env vars in your Vercel project settings.

