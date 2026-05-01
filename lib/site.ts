export function getSiteOrigin() {
  // Prefer a configured canonical site URL so auth email redirects
  // don't depend on the current browser origin (preview/old deploy).
  const configured = process.env.NEXT_PUBLIC_SITE_URL?.trim()
  if (configured) {
    try {
      return new URL(configured).origin
    } catch {
      // Fall through to runtime origin.
    }
  }

  if (typeof window !== 'undefined') return window.location.origin
  return ''
}

