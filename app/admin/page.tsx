"use client";

import { createSupabaseBrowserClient } from "../../lib/supabase/browser";

export default function AdminPage() {
  // Intentionally unauthenticated for early UI iteration.
  // Data access should remain safe via RLS; later we’ll add an auth gate + role checks.
  const supabase = createSupabaseBrowserClient();

  return (
    <main style={{ padding: 24, maxWidth: 1100, margin: "0 auto" }}>
      <h1 style={{ margin: 0 }}>Admin</h1>
      <p style={{ marginTop: 12, color: "#444" }}>
        This page is currently open (no auth). Supabase client is configured via
        env vars.
      </p>

      <section
        style={{
          marginTop: 16,
          padding: 16,
          border: "1px solid #eee",
          borderRadius: 12,
          background: "#fafafa",
        }}
      >
        <div style={{ fontWeight: 600 }}>Supabase status</div>
        <div style={{ marginTop: 8, fontFamily: "ui-monospace, SFMono-Regular" }}>
          Connected: {String(Boolean(supabase))}
        </div>
      </section>
    </main>
  );
}

