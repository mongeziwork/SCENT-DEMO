'use client'

import { useEffect, useMemo, useState } from 'react'
import { usePathname, useRouter } from 'next/navigation'

import { createSupabaseBrowserClient } from '@/lib/supabase/browser'
import { getSupabasePublicEnv } from '@/lib/supabase/env'

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter()
  const pathname = usePathname()

  const supabase = useMemo(() => {
    const { url, key } = getSupabasePublicEnv()
    if (!url || !key) return null
    return createSupabaseBrowserClient()
  }, [])

  const [ready, setReady] = useState(false)

  useEffect(() => {
    let cancelled = false

    async function guard() {
      if (!supabase) {
        const next = pathname || '/admin'
        router.replace(`/admin/sign-in?next=${encodeURIComponent(next)}`)
        return
      }

      const { data, error } = await supabase.auth.getUser()
      if (cancelled) return

      const configuredAdminEmail = (process.env.NEXT_PUBLIC_ADMIN_EMAIL ?? '').trim().toLowerCase()
      const currentEmail = data.user?.email?.trim().toLowerCase() ?? ''

      // Fail closed: if misconfigured, don't leave /admin public.
      const allowed = Boolean(configuredAdminEmail) && !error && currentEmail === configuredAdminEmail

      if (!allowed) {
        const next = pathname || '/admin'
        router.replace(`/admin/sign-in?next=${encodeURIComponent(next)}`)
        return
      }

      setReady(true)
    }

    void guard()

    return () => {
      cancelled = true
    }
  }, [pathname, router, supabase])

  if (!ready) return null

  return children
}

