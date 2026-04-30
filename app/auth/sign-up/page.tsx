'use client'

import Link from 'next/link'
import { Suspense, useEffect, useMemo, useState } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'

import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { createSupabaseBrowserClient } from '@/lib/supabase/browser'

function SignUpInner() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const supabase = useMemo(() => createSupabaseBrowserClient(), [])

  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState<string | null>(null)

  useEffect(() => {
    void (async () => {
      const { data } = await supabase.auth.getSession()
      if (data.session) router.replace('/account')
    })()
  }, [router, supabase])

  async function signUp() {
    setLoading(true)
    setMessage(null)
    try {
      const next = searchParams.get('next') || '/account'
      const redirectTo = `${window.location.origin}/auth/callback?next=${encodeURIComponent(next)}`

      const { data, error } = await supabase.auth.signUp({
        email: email.trim().toLowerCase(),
        password,
        options: { emailRedirectTo: redirectTo },
      })

      if (error) {
        setMessage(error.message)
        return
      }

      // If email confirmations are disabled, we may already have a session.
      if (data.session) {
        router.replace(next)
        return
      }

      setMessage('Check your email to confirm your account.')
      setPassword('')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-background pt-20">
      <section className="py-16 md:py-24">
        <div className="mx-auto max-w-md px-6 lg:px-8">
          <Card>
            <CardHeader>
              <CardTitle>Create account</CardTitle>
              <CardDescription>Sign up to track orders and save your details.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <div className="text-xs tracking-widest uppercase text-muted-foreground">Email</div>
                <Input value={email} onChange={(e) => setEmail(e.target.value)} autoComplete="email" />
              </div>
              <div className="space-y-2">
                <div className="text-xs tracking-widest uppercase text-muted-foreground">Password</div>
                <Input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  autoComplete="new-password"
                />
                <div className="text-xs text-muted-foreground">
                  Use at least 8 characters. Avoid reusing a password from another site.
                </div>
              </div>
              {message ? <div className="text-sm text-muted-foreground">{message}</div> : null}
              <Button onClick={() => void signUp()} disabled={loading || !email.trim() || password.length < 8}>
                {loading ? 'Please wait…' : 'Create account'}
              </Button>
              <div className="text-sm text-muted-foreground">
                Already have an account?{' '}
                <Link href="/auth/sign-in" className="text-foreground underline underline-offset-4">
                  Sign in
                </Link>
              </div>
            </CardContent>
          </Card>
        </div>
      </section>
    </div>
  )
}

export default function SignUpPage() {
  return (
    <Suspense>
      <SignUpInner />
    </Suspense>
  )
}

