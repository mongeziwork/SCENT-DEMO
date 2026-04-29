import { createClient } from '@supabase/supabase-js'
import type { Database } from './database.types'

let cached: ReturnType<typeof createClient<Database>> | null = null

export function createSupabaseBrowserClient() {
  if (cached) return cached

  const url = process.env.NEXT_PUBLIC_SUPABASE_URL
  const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

  if (!url || !anonKey) {
    throw new Error(
      'Missing NEXT_PUBLIC_SUPABASE_URL or NEXT_PUBLIC_SUPABASE_ANON_KEY env vars.',
    )
  }

  cached = createClient<Database>(url, anonKey, {
    auth: {
      persistSession: true,
      autoRefreshToken: true,
      detectSessionInUrl: true,
    },
  })

  return cached
}

