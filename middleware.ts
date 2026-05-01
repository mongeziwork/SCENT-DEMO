import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

const COOKIE_NAME = 'portal_auth'

function toHex(buffer: ArrayBuffer) {
  return Array.from(new Uint8Array(buffer))
    .map((b) => b.toString(16).padStart(2, '0'))
    .join('')
}

async function hmacSha256Hex(secret: string, message: string) {
  const enc = new TextEncoder()
  const key = await crypto.subtle.importKey(
    'raw',
    enc.encode(secret),
    { name: 'HMAC', hash: 'SHA-256' },
    false,
    ['sign'],
  )
  const sig = await crypto.subtle.sign('HMAC', key, enc.encode(message))
  return toHex(sig)
}

async function verifyPortalCookie(cookieValue: string | undefined, secret: string) {
  if (!cookieValue) return false
  const [payloadB64, sig] = cookieValue.split('.')
  if (!payloadB64 || !sig) return false

  let payloadJson = ''
  try {
    payloadJson = atob(payloadB64)
  } catch {
    return false
  }

  let payload: { exp?: unknown } = {}
  try {
    payload = JSON.parse(payloadJson) as { exp?: unknown }
  } catch {
    return false
  }

  const exp = typeof payload.exp === 'number' ? payload.exp : null
  if (!exp || Date.now() > exp) return false

  const expected = await hmacSha256Hex(secret, payloadB64)
  return expected === sig
}

export async function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl

  // Only protect /portal routes, excluding the login endpoint itself.
  if (!pathname.startsWith('/portal') || pathname.startsWith('/portal/login')) {
    return NextResponse.next()
  }

  const secret = process.env.PORTAL_COOKIE_SECRET ?? ''
  if (!secret.trim()) {
    // Fail closed if misconfigured.
    const url = req.nextUrl.clone()
    url.pathname = '/portal/login'
    url.searchParams.set('next', pathname)
    url.searchParams.set('error', 'missing_secret')
    return NextResponse.redirect(url)
  }

  const ok = await verifyPortalCookie(req.cookies.get(COOKIE_NAME)?.value, secret)
  if (ok) return NextResponse.next()

  const url = req.nextUrl.clone()
  url.pathname = '/portal/login'
  url.searchParams.set('next', pathname)
  return NextResponse.redirect(url)
}

export const config = {
  // Important: `/portal/:path*` does NOT match `/portal` itself.
  matcher: ['/portal', '/portal/:path*'],
}

