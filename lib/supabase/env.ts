function getProjectRefFromUrl(url: string): string | null {
  try {
    const parsed = new URL(url)
    const host = parsed.hostname
    // Typical Supabase project URLs:
    // - https://<ref>.supabase.co
    // - https://<ref>.supabase.in
    // - https://<ref>.supabase.net
    const ref = host.split('.')[0]
    return ref || null
  } catch {
    return null
  }
}

function base64UrlToJson(input: string): unknown {
  const padded = input.replace(/-/g, '+').replace(/_/g, '/').padEnd(Math.ceil(input.length / 4) * 4, '=')
  const decoded = (() => {
    // Browser-safe base64 decoding (Next.js may run this in client components).
    if (typeof globalThis.atob === 'function') {
      // atob returns a binary string; convert to UTF-8.
      const binary = globalThis.atob(padded)
      const bytes = Uint8Array.from(binary, (c) => c.charCodeAt(0))
      return new TextDecoder().decode(bytes)
    }

    // Node.js fallback
    return Buffer.from(padded, 'base64').toString('utf8')
  })()
  return JSON.parse(decoded) as unknown
}

function getRefFromLegacyAnonJwt(key: string): string | null {
  const parts = key.split('.')
  if (parts.length !== 3) return null
  try {
    const payload = base64UrlToJson(parts[1]) as { ref?: unknown }
    return typeof payload.ref === 'string' ? payload.ref : null
  } catch {
    return null
  }
}

function isValidHttpUrl(value: string): boolean {
  try {
    const parsed = new URL(value)
    return parsed.protocol === 'http:' || parsed.protocol === 'https:'
  } catch {
    return false
  }
}

export function getSupabasePublicEnv() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL
  const key = process.env.NEXT_PUBLIC_SUPABASE_KEY ?? process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

  // During `next build` (or other non-runtime contexts) we may not have env vars
  // available. Returning a *syntactically valid* placeholder prevents build-time
  // SSR from crashing when a client component imports Supabase, while still
  // surfacing a clear error in actual runtime if env vars are missing.
  const isBuildOrSSR = Boolean(process.env.NEXT_PHASE) || typeof window === 'undefined'
  const urlValid = typeof url === 'string' && isValidHttpUrl(url)

  if (!urlValid || !key) {
    // Next sets NEXT_PHASE during build. Also guard any server-side render where
    // env vars may be unavailable (Vercel build, CI), but never hide missing env
    // vars in the actual browser runtime.
    if (isBuildOrSSR) {
      return {
        url: 'https://placeholder.supabase.co',
        key: 'sb_publishable_placeholder',
      }
    }
    throw new Error(
      'Missing Supabase env vars. Set NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_KEY (or legacy NEXT_PUBLIC_SUPABASE_ANON_KEY).',
    )
  }

  // Fail fast for the most common "admin login broken" case:
  // Supabase URL is from one project but key/token is from another.
  const urlRef = getProjectRefFromUrl(url)
  const keyRef = key.startsWith('sb_publishable_') ? null : getRefFromLegacyAnonJwt(key)

  if (urlRef && keyRef && urlRef !== keyRef) {
    throw new Error(
      `Supabase project mismatch: NEXT_PUBLIC_SUPABASE_URL points to "${urlRef}" but the provided key is for "${keyRef}". Double-check your env vars (Vercel/local).`,
    )
  }

  return { url, key }
}

