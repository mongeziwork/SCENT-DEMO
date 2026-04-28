import { NextResponse } from 'next/server'

import { createSupabaseServerClient } from '@/lib/supabase/server'
import { getPayFastConfig, payFastActionUrl, sign } from '@/lib/payfast'

type Item = {
  productId: string
  slug: string | null
  name: string
  price: number
  imageUrl: string | null
  color: string | null
  size: string | null
  quantity: number
}

type Body = {
  customer: {
    name: string
    email: string
    phone: string
    address: string
  }
  delivery?: {
    method: string
  }
  items: Item[]
}

const DELIVERY_OPTIONS = {
  courier: {
    label: 'Standard nationwide courier',
    fee: 190,
  },
  collection: {
    label: 'Free collection in Johannesburg, Sandton, Rivonia',
    fee: 0,
  },
} as const

export async function POST(req: Request) {
  const body = (await req.json()) as Body

  const items = Array.isArray(body.items) ? body.items : []
  if (items.length === 0) {
    return NextResponse.json({ error: 'Cart is empty' }, { status: 400 })
  }

  const subtotal = items.reduce((sum, i) => sum + Number(i.price) * Number(i.quantity ?? 0), 0)
  const deliveryMethod = body.delivery?.method === 'collection' ? 'collection' : 'courier'
  const delivery = DELIVERY_OPTIONS[deliveryMethod]
  const total = subtotal + delivery.fee

  const supabase = createSupabaseServerClient()
  const { data: order, error: orderError } = await supabase
    .from('orders')
    .insert({
      status: 'created',
      currency: 'ZAR',
      subtotal,
      total,
      customer_name: body.customer?.name?.trim() || null,
      customer_email: body.customer?.email?.trim() || null,
      customer_phone: body.customer?.phone?.trim() || null,
      shipping_address: [
        body.customer?.address?.trim(),
        `${delivery.label} (${deliveryMethod})`,
      ]
        .filter(Boolean)
        .join('\n'),
      updated_at: new Date().toISOString(),
    })
    .select('id')
    .single()

  if (orderError || !order) {
    return NextResponse.json({ error: orderError?.message ?? 'Failed to create order' }, { status: 500 })
  }

  const orderItems = items.map((i) => ({
    order_id: order.id,
    product_id: i.productId,
    name: i.name,
    slug: i.slug,
    price: i.price,
    quantity: i.quantity,
    color: i.color,
    size: i.size,
    image_url: i.imageUrl,
  }))

  const { error: itemsError } = await supabase.from('order_items').insert(orderItems)
  if (itemsError) {
    return NextResponse.json({ error: itemsError.message }, { status: 500 })
  }

  const cfg = getPayFastConfig()

  const origin = req.headers.get('origin') ?? process.env.NEXT_PUBLIC_SITE_URL ?? ''
  const returnUrl = `${origin}/payfast/return?order_id=${order.id}`
  const cancelUrl = `${origin}/payfast/cancel?order_id=${order.id}`
  const notifyUrl = `${origin}/api/payfast/itn`

  const data: Record<string, string> = {
    merchant_id: cfg.merchantId,
    merchant_key: cfg.merchantKey,
    return_url: returnUrl,
    cancel_url: cancelUrl,
    notify_url: notifyUrl,
    m_payment_id: order.id,
    amount: total.toFixed(2),
    item_name: `SCENT Order ${order.id} - ${delivery.label}`,
    currency: 'ZAR',
    name_first: body.customer?.name?.trim() || '',
    email_address: body.customer?.email?.trim() || '',
  }

  data.signature = sign(data, cfg.passphrase)

  return NextResponse.json({
    actionUrl: payFastActionUrl(cfg.mode),
    fields: data,
    orderId: order.id,
  })
}

