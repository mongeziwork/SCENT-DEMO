import { NextResponse } from 'next/server'

import { z } from 'zod'

const bodySchema = z.object({
  name: z.string().trim().min(1).max(200),
  email: z.string().trim().email().max(320),
  subject: z.string().trim().min(1).max(200),
  message: z.string().trim().min(1).max(10000),
})

const DEFAULT_INBOX = 'scentclobrand@gmail.com'

export async function POST(req: Request) {
  let json: unknown
  try {
    json = await req.json()
  } catch {
    return NextResponse.json({ error: 'Invalid JSON' }, { status: 400 })
  }

  const parsed = bodySchema.safeParse(json)
  if (!parsed.success) {
    return NextResponse.json({ error: 'Please check your entries and try again.' }, { status: 400 })
  }

  const { name, email, subject, message } = parsed.data

  const apiKey = process.env.RESEND_API_KEY
  const from = process.env.CONTACT_FROM_EMAIL?.trim()
  const to = process.env.CONTACT_TO_EMAIL?.trim() || DEFAULT_INBOX

  if (!apiKey || !from) {
    console.error('[contact] Missing RESEND_API_KEY or CONTACT_FROM_EMAIL')
    return NextResponse.json(
      {
        error:
          'Contact form email is not configured. Please email us directly at scentclobrand@gmail.com.',
      },
      { status: 503 },
    )
  }

  const text = [
    'New message from the website contact form.',
    '',
    `Name: ${name}`,
    `Reply-to: ${email}`,
    '',
    `Subject: ${subject}`,
    '',
    message,
  ].join('\n')

  const res = await fetch('https://api.resend.com/emails', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${apiKey}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      from,
      to: [to],
      reply_to: [email],
      subject: `[Contact] ${subject}`,
      text,
    }),
  })

  if (!res.ok) {
    const detail = await res.text().catch(() => '')
    console.error('[contact] Resend error:', res.status, detail)
    return NextResponse.json(
      { error: 'Could not send your message. Please try again or email us directly.' },
      { status: 502 },
    )
  }

  return NextResponse.json({ ok: true })
}
