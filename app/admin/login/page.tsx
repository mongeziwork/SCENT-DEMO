'use client'

import { useEffect, useMemo, useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'

import { createSupabaseBrowserClient } from '@/lib/supabase/browser'
import { isAdminEmail } from '@/lib/admin-config'
import { useToast } from '@/components/ui/use-toast'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'

function redirectForUser(email: string | undefined) {
  return isAdminEmail(email) ? '/admin' : '/'
}

export default function AdminLoginPage() {
  const router = useRouter()
  const { toast } = useToast()
  const supabase = useMemo(() => createSupabaseBrowserClient(), [])

  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    async function checkSession() {
      const { data } = await supabase.auth.getUser()
      if (data.user) {
        router.replace(redirectForUser(data.user.email))
      }
    }
    void check()

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((event, session) => {
      if (event === 'SIGNED_IN' && session?.user) {
        router.replace(redirectForUser(session.user.email))
        router.refresh()
      }
    })

    return () => subscription.unsubscribe()
  }, [router, supabase])

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)

    const { error } = await supabase.auth.signInWithPassword({
      email: email.trim(),
      password,
    })

    setLoading(false)

    if (error) {
      toast({
        title: 'Sign in failed',
        description: error.message,
        variant: 'destructive',
      })
      return
    }

    const { data } = await supabase.auth.getUser()
    router.replace(redirectForUser(data.user?.email))
    router.refresh()
  }

  return (
    <Card className="w-full max-w-md border-border bg-card/40 shadow-none">
      <CardHeader className="space-y-1">
        <CardTitle className="text-lg font-light tracking-[0.25em] uppercase">Admin access</CardTitle>
        <CardDescription className="text-sm leading-relaxed">
          Allowlisted admins go to the console. Other accounts return to the storefront.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={onSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="email"
              autoComplete="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="password">Password</Label>
            <Input
              id="password"
              type="password"
              autoComplete="current-password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>
          <Button type="submit" className="w-full tracking-wide" disabled={loading}>
            {loading ? 'Signing in…' : 'Sign in'}
          </Button>
        </form>
        <div className="mt-6 flex flex-col gap-2 text-center text-sm text-muted-foreground">
          <Link href="/forgot-password" className="hover:text-foreground underline-offset-4 hover:underline">
            Forgot password?
          </Link>
          <span>
            No account?{' '}
            <Link href="/register" className="text-foreground underline-offset-4 hover:underline">
              Create one
            </Link>
          </span>
        </div>
      </CardContent>
    </Card>
  )
}
