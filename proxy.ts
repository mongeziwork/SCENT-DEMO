import { NextRequest, NextResponse } from 'next/server'

const ADMIN_PATH_PREFIX = '/admin'

function timingSafeEqual(a: string, b: string): boolean {
  if (a.length !== b.length) return false
  let out = 0
  for (let i = 0; i < a.length; i++) out |= a.charCodeAt(i) ^ b.charCodeAt(i)
  return out === 0
}

function unauthorizedResponse() {
  return new NextResponse('Authentication required', {
    status: 401,
    headers: {
      'WWW-Authenticate': 'Basic realm="Admin", charset="UTF-8"',
      'Cache-Control': 'no-store',
    },
  })
}

export function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl

  if (!pathname.startsWith(ADMIN_PATH_PREFIX)) {
    return NextResponse.next()
  }

  const user = process.env.ADMIN_BASIC_AUTH_USER
  const pass = process.env.ADMIN_BASIC_AUTH_PASSWORD

  // If not configured, do not accidentally lock you out in local dev.
  if (process.env.NODE_ENV !== 'production') {
    if (!user || !pass) return NextResponse.next()
  } else {
    if (!user || !pass) {
      return new NextResponse('Admin access is not configured (missing ADMIN_BASIC_AUTH_* env vars).', {
        status: 503,
        headers: { 'Cache-Control': 'no-store' },
      })
    }
  }

  const header = request.headers.get('authorization')
  if (!header?.startsWith('Basic ')) {
    return unauthorizedResponse()
  }

  let decoded = ''
  try {
    decoded = atob(header.slice('Basic '.length).trim())
  } catch {
    return unauthorizedResponse()
  }

  const sep = decoded.indexOf(':')
  if (sep === -1) return unauthorizedResponse()

  const providedUser = decoded.slice(0, sep)
  const providedPass = decoded.slice(sep + 1)

  if (!timingSafeEqual(providedUser, user) || !timingSafeEqual(providedPass, pass)) {
    return unauthorizedResponse()
  }

  return NextResponse.next()
}

export const config = {
  // Include `/admin` itself and nested routes.
  matcher: ['/admin', '/admin/:path*'],
}
