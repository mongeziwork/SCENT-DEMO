import { NextResponse } from 'next/server'

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

function base64Encode(input: string) {
  return Buffer.from(input, 'utf8').toString('base64')
}

export async function POST(req: Request) {
  const { password } = (await req.json()) as { password?: unknown }
  const expected = process.env.PORTAL_PASSWORD ?? ''
  const secret = process.env.PORTAL_COOKIE_SECRET ?? ''

  if (!expected || !secret) {
    return NextResponse.json({ error: 'Portal is not configured.' }, { status: 500 })
  }

  if (typeof password !== 'string' || password !== expected) {
    return NextResponse.json({ error: 'Invalid password.' }, { status: 401 })
  }

  const exp = Date.now() + 1000 * 60 * 60 * 24 * 30 // 30 days
  const payload = JSON.stringify({ exp })
  const payloadB64 = base64Encode(payload)
  const sig = await hmacSha256Hex(secret, payloadB64)
  const cookieValue = `${payloadB64}.${sig}`

  const res = NextResponse.json({ ok: true })
  res.cookies.set({
    name: 'portal_auth',
    value: cookieValue,
    httpOnly: true,
    sameSite: 'lax',
    secure: true,
    path: '/',
    maxAge: 60 * 60 * 24 * 30, // 30 days
  })
  return res
}

