import { NextResponse, type NextRequest } from 'next/server'

import { getCanonicalSiteOrigin, isLegacyDeploymentHost } from '@/lib/site'

export function proxy(request: NextRequest) {
  const host = request.headers.get('host')
  if (!isLegacyDeploymentHost(host)) return NextResponse.next()

  const url = request.nextUrl.clone()
  const canonical = new URL(getCanonicalSiteOrigin())
  url.protocol = canonical.protocol
  url.hostname = canonical.hostname
  url.port = canonical.port

  return NextResponse.redirect(url, 308)
}

export const config = {
  matcher: ['/((?!api|_next/static|_next/image|favicon.ico|.*\\..*).*)'],
}
