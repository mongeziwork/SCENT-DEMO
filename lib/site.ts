const DEFAULT_SITE_ORIGIN = 'https://scentclothing.site'

const LEGACY_DEPLOYMENT_HOSTS = new Set([
  'v0-premium-clothing-store.vercel.app',
])

export function getCanonicalSiteOrigin() {
  const configured = process.env.NEXT_PUBLIC_SITE_URL?.trim()
  if (configured) {
    try {
      const origin = new URL(configured).origin
      const host = new URL(origin).hostname.toLowerCase()
      if (!LEGACY_DEPLOYMENT_HOSTS.has(host)) return origin
    } catch {
      // Fall back to the production domain below.
    }
  }

  return DEFAULT_SITE_ORIGIN
}

export function isLegacyDeploymentHost(host: string | null | undefined) {
  if (!host) return false
  return LEGACY_DEPLOYMENT_HOSTS.has(host.split(':')[0]?.toLowerCase() ?? '')
}

export function getSiteOrigin() {
  // Prefer a configured canonical site URL so auth email redirects
  // don't depend on the current browser origin (preview/old deploy).
  const configured = getCanonicalSiteOrigin()
  if (configured) return configured

  if (typeof window !== 'undefined') return window.location.origin
  return ''
}

