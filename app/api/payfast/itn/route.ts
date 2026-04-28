import { NextResponse } from 'next/server'

import { createSupabaseServerClient } from '@/lib/supabase/server'
import { getPayFastConfig, payFastValidateUrl, verifySignature } from '@/lib/payfast'

function parseFormUrlEncoded(body: string) {
  const out: Record<string, string> = {}
  const params = new URLSearchParams(body)
  for (const [k, v] of params.entries()) out[k] = v
  return out
}

export async function POST(req: Request) {
  const raw = await req.text()
  const data = parseFormUrlEncoded(raw)

  const cfg = getPayFastConfig()

  const signature = data.signature ?? ''
  if (!signature || !verifySignature(data, signature, cfg.passphrase)) {
    return new NextResponse('Invalid signature', { status: 400 })
  }

  // Verify with PayFast validate endpoint
  const validateRes = await fetch(payFastValidateUrl(cfg.mode), {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: raw,
    cache: 'no-store',
  })
  const validateText = (await validateRes.text()).trim()
  if (validateText !== 'VALID') {
    return new NextResponse('ITN validation failed', { status: 400 })
  }

  const orderId = data.m_payment_id
  if (!orderId) return new NextResponse('Missing m_payment_id', { status: 400 })

  const paymentStatus = (data.payment_status ?? '').toUpperCase()
  const nextStatus =
    paymentStatus === 'COMPLETE'
      ? 'paid'
      : paymentStatus === 'FAILED'
        ? 'failed'
        : paymentStatus === 'CANCELLED'
          ? 'cancelled'
          : 'pending'

  const supabase = createSupabaseServerClient()
  const { error } = await supabase
    .from('orders')
    .update({
      status: nextStatus,
      payfast_m_payment_id: data.m_payment_id ?? null,
      payfast_pf_payment_id: data.pf_payment_id ?? null,
      payfast_payment_id: data.payment_id ?? null,
      updated_at: new Date().toISOString(),
    })
    .eq('id', orderId)

  if (error) return new NextResponse(error.message, { status: 500 })

  return new NextResponse('OK', { status: 200 })
}

