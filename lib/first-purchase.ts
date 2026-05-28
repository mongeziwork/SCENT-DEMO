import type { SupabaseClient } from '@supabase/supabase-js'

import type { Database } from '@/lib/supabase/database.types'

type Supabase = SupabaseClient<Database>

export function normalizeCustomerEmail(email: string | null | undefined) {
  return email?.trim().toLowerCase() ?? ''
}

export async function hasCompletedOrderForEmail(supabase: Supabase, email: string) {
  const normalizedEmail = normalizeCustomerEmail(email)
  if (!normalizedEmail) return false

  const { data, error } = await supabase
    .from('orders')
    .select('id')
    .in('status', ['paid', 'shipped'])
    .ilike('customer_email', normalizedEmail)
    .limit(1)

  if (error) throw error
  return (data ?? []).length > 0
}

export async function isFirstPurchaseEmail(supabase: Supabase, email: string) {
  const normalizedEmail = normalizeCustomerEmail(email)
  if (!normalizedEmail) return false
  return !(await hasCompletedOrderForEmail(supabase, normalizedEmail))
}
