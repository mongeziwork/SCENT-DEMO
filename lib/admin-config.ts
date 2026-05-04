/**
 * Admin access is gated by email allowlist.
 * - `NEXT_PUBLIC_ADMIN_EMAILS` — comma-separated (preferred for multiple admins)
 * - `NEXT_PUBLIC_ADMIN_EMAIL` — single email (backward compatible with older deploys)
 *
 * Production note: for stricter control, use Supabase custom claims or a server-only
 * role table instead of exposing admin emails in a public env var.
 */
function parseAdminEmailSet(): Set<string> {
  const rawList = process.env.NEXT_PUBLIC_ADMIN_EMAILS ?? ''
  const single = (process.env.NEXT_PUBLIC_ADMIN_EMAIL ?? '').trim().toLowerCase()
  const fromList = rawList
    .split(',')
    .map((s) => s.trim().toLowerCase())
    .filter(Boolean)
  const set = new Set(fromList)
  if (single) set.add(single)
  return set
}

export function getAdminEmails(): Set<string> {
  return parseAdminEmailSet()
}

export function isAdminEmail(email: string | null | undefined): boolean {
  if (!email) return false
  return getAdminEmails().has(email.trim().toLowerCase())
}
