'use client'

import { useEffect, useRef, useState } from 'react'
import { useRouter } from 'next/navigation'
import type { Session } from '@supabase/supabase-js'

import { createSupabaseBrowserClient } from '@/lib/supabase/browser'
import { isAdminEmail } from '@/lib/admin-config'

export function AdminRouteGuard({ children }: { children: React.ReactNode }) {
  const router = useRouter()
  const [allowed, setAllowed] = useState<boolean | null>(null)
  const seqRef = useRef(0)

  useEffect(() => {
    let supabase: ReturnType<typeof createSupabaseBrowserClient>
    try {
      supabase = createSupabaseBrowserClient()
    } catch {
      setAllowed(false)
      router.replace('/admin/login')
      return
    }

    async function syncAccess(session: Session | null) {
      const seq = ++seqRef.current

      if (!session?.user) {
        if (seq !== seqRef.current) return
        setAllowed(false)
        router.replace('/admin/login')
        return
      }

      const { data, error } = await supabase.auth.getUser()
      if (seq !== seqRef.current) return

      const user = data.user
      if (error || !user) {
        setAllowed(false)
        router.replace('/admin/login')
        return
      }
      if (!isAdminEmail(user.email)) {
        setAllowed(false)
        router.replace('/')
        return
      }
      setAllowed(true)
    }

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      void syncAccess(session)
    })

    return () => {
      seqRef.current += 1
      subscription.unsubscribe()
    }
  }, [router])

  if (allowed !== true) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center px-6 bg-background text-sm text-muted-foreground">
        {allowed === null ? 'Verifying admin access…' : 'Redirecting…'}
      </div>
    )
  }

  return <>{children}</>
}
