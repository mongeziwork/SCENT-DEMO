'use client'

import type { ReactNode } from 'react'
import { useCallback, useEffect, useMemo, useState } from 'react'
import type { User } from '@supabase/supabase-js'

import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { createSupabaseBrowserClient } from '@/lib/supabase/browser'

type AuthStatus = 'checking' | 'signed-out' | 'unauthorized' | 'authorized'

type AdminAuthGateProps = {
  children: ReactNode
}

export function AdminAuthGate({ children }: AdminAuthGateProps) {
  const supabase = useMemo(() => createSupabaseBrowserClient(), [])
  const [status, setStatus] = useState<AuthStatus>('checking')
  const [user, setUser] = useState<User | null>(null)
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [message, setMessage] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)

  const checkAdmin = useCallback(
    async (nextUser: User | null) => {
      setUser(nextUser)
      if (!nextUser?.email) {
        setStatus('signed-out')
        return
      }

      const { data, error } = await supabase
        .from('admin_users')
        .select('email')
        .eq('email', nextUser.email.toLowerCase())
        .maybeSingle()

      if (error || !data) {
        setStatus('unauthorized')
        setMessage('This account is signed in, but it is not on the admin allowlist.')
        return
      }

      setStatus('authorized')
      setMessage(null)
    },
    [supabase],
  )

  useEffect(() => {
    let cancelled = false

    async function run() {
      const { data } = await supabase.auth.getUser()
      if (!cancelled) await checkAdmin(data.user)
    }

    void run()

    const { data: listener } = supabase.auth.onAuthStateChange((_event, session) => {
      void checkAdmin(session?.user ?? null)
    })

    return () => {
      cancelled = true
      listener.subscription.unsubscribe()
    }
  }, [checkAdmin, supabase])

  async function signIn() {
    setLoading(true)
    setMessage(null)

    const { error } = await supabase.auth.signInWithPassword({
      email: email.trim().toLowerCase(),
      password,
    })

    if (error) {
      setMessage(error.message)
      setLoading(false)
      return
    }

    setPassword('')
    setLoading(false)
  }

  async function sendMagicLink() {
    setLoading(true)
    setMessage(null)

    const { error } = await supabase.auth.signInWithOtp({
      email: email.trim().toLowerCase(),
      options: {
        emailRedirectTo: typeof window !== 'undefined' ? `${window.location.origin}/admin` : undefined,
      },
    })

    setMessage(error ? error.message : 'Check your email for a secure sign-in link.')
    setLoading(false)
  }

  async function signOut() {
    await supabase.auth.signOut()
    setStatus('signed-out')
    setUser(null)
  }

  if (status === 'checking') {
    return (
      <div className="mx-auto max-w-7xl px-6 lg:px-8 pt-28 pb-16">
        <Card>
          <CardContent className="py-10 text-sm text-muted-foreground">Checking admin access…</CardContent>
        </Card>
      </div>
    )
  }

  if (status !== 'authorized') {
    return (
      <div className="mx-auto max-w-md px-6 pt-28 pb-16">
        <Card>
          <CardHeader>
            <CardTitle>Admin sign in</CardTitle>
            <CardDescription>Use the Supabase Auth account that is allowlisted for admin access.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {user?.email ? (
              <div className="rounded-md border border-border p-3 text-sm">
                Signed in as <span className="font-medium">{user.email}</span>, but this email is not an admin.
              </div>
            ) : null}
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
            <div className="flex flex-col gap-2">
              <Button onClick={() => void signIn()} disabled={loading || !email.trim() || !password}>
                {loading ? 'Please wait…' : 'Sign in'}
              </Button>
              <Button variant="outline" onClick={() => void sendMagicLink()} disabled={loading || !email.trim()}>
                Email me a magic link
              </Button>
              {user ? (
                <Button variant="outline" onClick={() => void signOut()} disabled={loading}>
                  Sign out
                </Button>
              ) : null}
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <>
      <div className="fixed right-4 top-24 z-40">
        <Button variant="outline" size="sm" onClick={() => void signOut()}>
          Sign out
        </Button>
      </div>
      {children}
    </>
  )
}
