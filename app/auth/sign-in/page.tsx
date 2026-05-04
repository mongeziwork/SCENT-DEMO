'use client'

import Link from 'next/link'
import { Suspense, useEffect, useState } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { useToast } from '@/hooks/use-toast'
import { getSiteOrigin } from '@/lib/site'
import { createSupabaseBrowserClient } from '@/lib/supabase/browser'

function SignInInner() {
  const router = useRouter()
  const params = useSearchParams()
  const next = params.get('next') || '/account'
  const justRegistered = params.get('registered') === '1'
  const { toast } = useToast()

  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState<string | null>(null)
  const [registeredDialogOpen, setRegisteredDialogOpen] = useState(false)

  useEffect(() => {
    if (!justRegistered) return
    setRegisteredDialogOpen(true)
    toast({
      title: "You're registered",
      description: 'Confirm your email if we sent you a link, then sign in below.',
    })
  }, [justRegistered, toast])

  function dismissRegisteredDialog() {
    setRegisteredDialogOpen(false)
    const q = new URLSearchParams(params.toString())
    q.delete('registered')
    const qs = q.toString()
    router.replace(qs ? `/auth/sign-in?${qs}` : '/auth/sign-in')
  }

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
      toast({
        title: 'Signed in',
        description: 'Welcome back.',
      })
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
      const origin = getSiteOrigin()
      const { error } = await supabase.auth.signInWithOtp({
        email: email.trim().toLowerCase(),
        options: {
          emailRedirectTo: `${origin}/auth/callback?next=${encodeURIComponent(next)}`,
        },
      })
      setMessage(error ? error.message : 'Check your email for a secure sign-in link.')
    } finally {
      setLoading(false)
    }
  }

  async function signInWithGoogle() {
    setLoading(true)
    setMessage(null)
    try {
      const supabase = createSupabaseBrowserClient()
      const origin = getSiteOrigin()
      if (!origin) {
        setMessage('Site URL is not configured. Set NEXT_PUBLIC_SITE_URL for production.')
        return
      }
      const { error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: `${origin}/auth/callback?next=${encodeURIComponent(next)}`,
        },
      })
      if (error) setMessage(error.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-background pt-20">
      <AlertDialog open={registeredDialogOpen} onOpenChange={(open) => !open && dismissRegisteredDialog()}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Registration successful</AlertDialogTitle>
            <AlertDialogDescription className="text-left space-y-2">
              <span className="block">
                If your store sends a confirmation email, open the link in that message first.
              </span>
              <span className="block">
                Then sign in here with the same email and password, or use <strong>Continue with Google</strong> if
                you signed up with Google.
              </span>
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogAction onClick={() => dismissRegisteredDialog()}>OK, sign me in</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      <div className="mx-auto max-w-md px-6 lg:px-8 pt-16 pb-16">
        <Card>
          <CardHeader>
            <CardTitle>Sign in</CardTitle>
            <CardDescription>Access your account and order updates.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <Button
              type="button"
              variant="outline"
              className="w-full"
              onClick={() => void signInWithGoogle()}
              disabled={loading}
            >
              Continue with Google
            </Button>
            <div className="relative py-2">
              <div className="absolute inset-0 flex items-center">
                <span className="w-full border-t border-border" />
              </div>
              <div className="relative flex justify-center text-xs uppercase tracking-widest text-muted-foreground">
                <span className="bg-card px-2">Or email</span>
              </div>
            </div>
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

