import { NextResponse } from 'next/server'

import { isFirstPurchaseEmail, normalizeCustomerEmail } from '@/lib/first-purchase'
import { createSupabaseServerClient } from '@/lib/supabase/server'

type Body = {
  email?: string
}

export async function POST(req: Request) {
  const body = (await req.json()) as Body
  const email = normalizeCustomerEmail(body.email)

  if (!email) {
    return NextResponse.json({ isFirstPurchase: false })
  }

  try {
    const supabase = createSupabaseServerClient()
    const isFirstPurchase = await isFirstPurchaseEmail(supabase, email)
    return NextResponse.json({ isFirstPurchase })
  } catch (e) {
    const message = e instanceof Error ? e.message : 'Unable to check first purchase status'
    return NextResponse.json({ error: message }, { status: 500 })
  }
}
