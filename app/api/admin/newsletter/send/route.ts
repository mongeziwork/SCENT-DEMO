import { NextResponse } from 'next/server'
import { z } from 'zod'
import { createClient } from '@supabase/supabase-js'

import type { Database } from '@/lib/supabase/database.types'

const bodySchema = z.object({
  campaignId: z.string().uuid(),
})

function getSupabaseUrl(): string {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL
  if (!url) throw new Error('Missing NEXT_PUBLIC_SUPABASE_URL')
  return url
}

function getAnonKey(): string {
  const key =
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || process.env.NEXT_PUBLIC_SUPABASE_KEY
  if (!key) throw new Error('Missing NEXT_PUBLIC_SUPABASE_ANON_KEY')
  return key
}

/**
 * Sends a draft campaign to all subscribed marketing_subscribers via Resend.
 * Caller must be an authenticated admin (JWT); RLS is evaluated with that JWT.
 */
export async function POST(req: Request) {
  const authHeader = req.headers.get('authorization') ?? req.headers.get('Authorization')
  const token = authHeader?.startsWith('Bearer ') ? authHeader.slice(7).trim() : null
  if (!token) {
    return NextResponse.json({ error: 'Missing Authorization Bearer token.' }, { status: 401 })
  }

  let json: unknown
  try {
    json = await req.json()
  } catch {
    return NextResponse.json({ error: 'Invalid JSON' }, { status: 400 })
  }

  const parsed = bodySchema.safeParse(json)
  if (!parsed.success) {
    return NextResponse.json({ error: 'Invalid campaign id.' }, { status: 400 })
  }

  const { campaignId } = parsed.data

  const supabase = createClient<Database>(getSupabaseUrl(), getAnonKey(), {
    global: { headers: { Authorization: `Bearer ${token}` } },
  })

  const { data: isAdmin, error: adminErr } = await supabase.rpc('is_admin')
  if (adminErr || !isAdmin) {
    return NextResponse.json({ error: 'Admin access required.' }, { status: 403 })
  }

  const { data: campaign, error: campErr } = await supabase
    .from('newsletter_campaigns')
    .select('id,name,subject,body,status')
    .eq('id', campaignId)
    .single()

  if (campErr || !campaign) {
    return NextResponse.json({ error: 'Campaign not found.' }, { status: 404 })
  }

  if (campaign.status !== 'draft') {
    return NextResponse.json({ error: 'Only draft campaigns can be sent.' }, { status: 400 })
  }

  const { data: subscribers, error: subErr } = await supabase
    .from('marketing_subscribers')
    .select('email')
    .eq('status', 'subscribed')

  if (subErr) {
    return NextResponse.json({ error: subErr.message }, { status: 500 })
  }

  const emails = [...new Set((subscribers ?? []).map((r) => r.email.trim().toLowerCase()).filter(Boolean))]
  if (emails.length === 0) {
    return NextResponse.json({ error: 'No subscribed recipients.' }, { status: 400 })
  }

  const apiKey = process.env.RESEND_API_KEY
  const from =
    process.env.NEWSLETTER_FROM_EMAIL?.trim() || process.env.CONTACT_FROM_EMAIL?.trim()
  if (!apiKey || !from) {
    return NextResponse.json(
      {
        error:
          'Email not configured. Set RESEND_API_KEY and CONTACT_FROM_EMAIL (or NEWSLETTER_FROM_EMAIL).',
      },
      { status: 503 },
    )
  }

  let sent = 0
  const errors: string[] = []

  for (const to of emails) {
    const res = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        from,
        to: [to],
        subject: campaign.subject,
        text: campaign.body,
      }),
    })

    if (!res.ok) {
      const detail = await res.text().catch(() => '')
      errors.push(`${to}: ${detail.slice(0, 120)}`)
      continue
    }
    sent += 1
  }

  const { error: updErr } = await supabase
    .from('newsletter_campaigns')
    .update({
      status: 'sent',
      sent_count: sent,
      sent_at: new Date().toISOString(),
    })
    .eq('id', campaignId)

  if (updErr) {
    return NextResponse.json(
      {
        error: `Sent ${sent} messages but failed to update campaign: ${updErr.message}`,
        sent,
        failures: errors,
      },
      { status: 500 },
    )
  }

  return NextResponse.json({
    ok: true,
    sent,
    skipped: emails.length - sent,
    failures: errors.length ? errors.slice(0, 20) : undefined,
  })
}
