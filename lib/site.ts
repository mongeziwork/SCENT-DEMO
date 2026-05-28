const DEFAULT_SITE_URL = 'https://scentclothing.site'

export function getCanonicalSiteUrl() {
  const configured = process.env.NEXT_PUBLIC_SITE_URL?.trim()
  if (!configured) return DEFAULT_SITE_URL

  try {
    return new URL(configured).origin
  } catch {
    return DEFAULT_SITE_URL
  }
}

export function toAbsoluteUrl(pathOrUrl: string | null | undefined, siteUrl = getCanonicalSiteUrl()) {
  if (!pathOrUrl) return `${siteUrl}/brand/logo-white.png`
  if (/^https?:\/\//i.test(pathOrUrl)) return pathOrUrl
  return `${siteUrl}${pathOrUrl.startsWith('/') ? pathOrUrl : `/${pathOrUrl}`}`
}

export function getSiteOrigin() {
  // Prefer a configured canonical site URL so auth email redirects
  // don't depend on the current browser origin (preview/old deploy).
  const configured = process.env.NEXT_PUBLIC_SITE_URL?.trim()
  if (configured) return getCanonicalSiteUrl()

  if (typeof window !== 'undefined') return window.location.origin
  return DEFAULT_SITE_URL
}

