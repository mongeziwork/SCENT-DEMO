'use client'

import Link from 'next/link'
import { Suspense, useEffect, useState } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'

import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { createSupabaseBrowserClient } from '@/lib/supabase/browser'

function SignInInner() {
  const router = useRouter()
  const params = useSearchParams()
  const next = params.get('next') || '/account'

  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState<string | null>(null)

  useEffect(() => {
    let cancelled = false
    async function run() {
      const supabase = createSupabaseBrowserClient()
      const { data } = await supabase.auth.getSession()
      if (!cancelled && data.session) router.replace(next)
    }
    void run()
    return () => {
      cancelled = true
    }
  }, [next, router])

  async function signIn() {
    setLoading(true)
    setMessage(null)
    try {
      const supabase = createSupabaseBrowserClient()
      const { error } = await supabase.auth.signInWithPassword({
        email: email.trim().toLowerCase(),
        password,
      })
      if (error) {
        setMessage(error.message)
        return
      }
      router.replace(next)
    } finally {
      setLoading(false)
    }
  }

  async function sendMagicLink() {
    setLoading(true)
    setMessage(null)
    try {
      const supabase = createSupabaseBrowserClient()
      const { error } = await supabase.auth.signInWithOtp({
        email: email.trim().toLowerCase(),
        options: {
          emailRedirectTo:
            typeof window !== 'undefined'
              ? `${window.location.origin}/auth/callback?next=${encodeURIComponent(next)}`
              : undefined,
        },
      })
      setMessage(error ? error.message : 'Check your email for a secure sign-in link.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-background pt-20">
      <div className="mx-auto max-w-md px-6 lg:px-8 pt-16 pb-16">
        <Card>
          <CardHeader>
            <CardTitle>Sign in</CardTitle>
            <CardDescription>Access your account and order updates.</CardDescription>
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
                autoComplete="current-password"
              />
            </div>

            {message ? <div className="text-sm text-muted-foreground">{message}</div> : null}

            <div className="flex flex-col gap-2 pt-2">
              <Button onClick={() => void signIn()} disabled={loading || !email.trim() || !password}>
                {loading ? 'Please wait…' : 'Sign in'}
              </Button>
              <Button variant="outline" onClick={() => void sendMagicLink()} disabled={loading || !email.trim()}>
                Email me a magic link
              </Button>
            </div>

            <div className="pt-2 text-sm text-muted-foreground">
              New here?{' '}
              <Link href={`/auth/sign-up?next=${encodeURIComponent(next)}`} className="underline underline-offset-4">
                Create an account
              </Link>
              .
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

export default function SignInPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-background pt-20">
          <div className="mx-auto max-w-md px-6 lg:px-8 pt-16 pb-16">
            <Card>
              <CardContent className="py-10 text-sm text-muted-foreground">Loading…</CardContent>
            </Card>
          </div>
        </div>
      }
    >
      <SignInInner />
    </Suspense>
  )
}

