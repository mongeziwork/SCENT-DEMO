## Supabase + MCP setup

This repo already includes:

- `lib/supabase/browser.ts` and `lib/supabase/server.ts` (Supabase client helpers)
- `supabase/migrations/*` (database migrations)

### App env vars (required)

Copy the example and fill in your Supabase project values:

```bash
cp .env.example .env.local
```

Set:

- `NEXT_PUBLIC_SUPABASE_URL`
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`

### Supabase CLI link (optional, for migrations/local dev)

If you use the Supabase CLI, link this repo to your Supabase project:

```bash
supabase --version
supabase login
supabase link --project-ref <your_project_ref>
```

After linking, you can run Supabase CLI commands (migrations, local stack, etc.) in this repo.

### Supabase MCP link (Cursor/agents)

This repo includes a root `.mcp.json` pointing to the hosted Supabase MCP server.

To enable the tools:

- Authenticate the **Supabase** MCP server in Cursor when prompted (OAuth flow), then reload.
- If your environment shows the server as “needsAuth”, that’s expected until you complete auth.

Reference: `https://supabase.com/docs/guides/getting-started/mcp`

