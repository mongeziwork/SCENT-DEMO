'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'

import { Card, CardContent } from '@/components/ui/card'
import { createSupabaseBrowserClient } from '@/lib/supabase/browser'

export default function AuthCallbackPage() {
  const router = useRouter()
  const [message, setMessage] = useState('Completing sign in…')

  useEffect(() => {
    async function completeSignIn() {
      const supabase = createSupabaseBrowserClient()
      const url = new URL(window.location.href)
      const code = url.searchParams.get('code')
      const errorDescription =
        url.searchParams.get('error_description') ??
        url.searchParams.get('error')
      const next = url.searchParams.get('next') || '/account'

      if (errorDescription) {
        setMessage(errorDescription)
        return
      }

      if (code) {
        const { error } = await supabase.auth.exchangeCodeForSession(code)
        if (error) {
          setMessage(error.message)
          return
        }
      } else {
        const { data } = await supabase.auth.getSession()
        if (!data.session) {
          setMessage('No sign-in code was found. Please request a new magic link.')
          return
        }
      }

      router.replace(next)
    }

    void completeSignIn()
  }, [router])

  return (
    <div className="mx-auto max-w-md px-6 pt-28 pb-16">
      <Card>
        <CardContent className="py-10 text-sm text-muted-foreground">
          {message}
        </CardContent>
      </Card>
    </div>
  )
}
