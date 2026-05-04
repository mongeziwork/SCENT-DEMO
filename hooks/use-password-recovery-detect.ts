'use client'

import { useCallback, useEffect, useState } from 'react'
import { useSearchParams } from 'next/navigation'

import { createSupabaseBrowserClient } from '@/lib/supabase/browser'

function parseHashParams(hash: string): Record<string, string> {
  const trimmed = hash.startsWith('#') ? hash.slice(1) : hash
  const params = new URLSearchParams(trimmed)
  const out: Record<string, string> = {}
  params.forEach((value, key) => {
    out[key] = value
  })
  return out
}

/**
 * Detects Supabase password recovery: query `type=recovery`, hash fragments
 * (`#...type=recovery`), or PASSWORD_RECOVERY from onAuthStateChange.
 */
export function usePasswordRecoveryDetect() {
  const searchParams = useSearchParams()
  const [isRecovery, setIsRecovery] = useState(false)

  const checkHash = useCallback(() => {
    if (typeof window === 'undefined') return false
    const hashParams = parseHashParams(window.location.hash)
    return hashParams.type === 'recovery'
  }, [])

  useEffect(() => {
    const fromQuery = searchParams.get('type') === 'recovery'
    if (fromQuery || checkHash()) {
      setIsRecovery(true)
    }

    const supabase = createSupabaseBrowserClient()
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((event) => {
      if (event === 'PASSWORD_RECOVERY') {
        setIsRecovery(true)
      }
    })

    const onHash = () => {
      if (checkHash()) setIsRecovery(true)
    }
    window.addEventListener('hashchange', onHash)

    return () => {
      subscription.unsubscribe()
      window.removeEventListener('hashchange', onHash)
    }
  }, [searchParams, checkHash])

  return isRecovery
}
