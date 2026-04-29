import { createClient } from '@supabase/supabase-js'
import type { Database } from './database.types'
import { getSupabasePublicEnv } from './env'

let cached: ReturnType<typeof createClient<Database>> | null = null

export function createSupabaseServerClient() {
  if (cached) return cached

  const { url, key } = getSupabasePublicEnv()

  cached = createClient<Database>(url, key, {
    auth: {
      persistSession: false,
      autoRefreshToken: false,
      detectSessionInUrl: false,
    },
  })

  return cached
}

