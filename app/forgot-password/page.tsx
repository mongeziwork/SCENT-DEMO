'use client'

import { Suspense, useMemo, useState } from 'react'
import Link from 'next/link'

import { createSupabaseBrowserClient } from '@/lib/supabase/browser'
import { usePasswordRecoveryDetect } from '@/hooks/use-password-recovery-detect'
import { useToast } from '@/components/ui/use-toast'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'

function ForgotPasswordForm() {
  const { toast } = useToast()
  const supabase = useMemo(() => createSupabaseBrowserClient(), [])
  const isRecovery = usePasswordRecoveryDetect()

  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirm, setConfirm] = useState('')
  const [loading, setLoading] = useState(false)

  async function requestReset(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)

    const origin = typeof window !== 'undefined' ? window.location.origin : ''
    const { error } = await supabase.auth.resetPasswordForEmail(email.trim(), {
      redirectTo: `${origin}/forgot-password`,
    })

    setLoading(false)

    if (error) {
      toast({
        title: 'Request failed',
        description: error.message,
        variant: 'destructive',
      })
      return
    }

    toast({
      title: 'Email sent',
      description: 'If an account exists for that address, you will receive a reset link.',
    })
  }

  async function setNewPassword(e: React.FormEvent) {
    e.preventDefault()
    if (password !== confirm) {
      toast({
        title: 'Passwords do not match',
        variant: 'destructive',
      })
      return
    }

    setLoading(true)
    const { error } = await supabase.auth.updateUser({ password })
    setLoading(false)

    if (error) {
      toast({
        title: 'Update failed',
        description: error.message,
        variant: 'destructive',
      })
      return
    }

    toast({ title: 'Password updated', description: 'You can sign in with your new password.' })
  }

  if (isRecovery) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="text-xl font-light tracking-widest uppercase">Set new password</CardTitle>
          <CardDescription>Choose a new password for your account.</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={setNewPassword} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="new-password">New password</Label>
              <Input
                id="new-password"
                type="password"
                autoComplete="new-password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                minLength={6}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="confirm-password">Confirm password</Label>
              <Input
                id="confirm-password"
                type="password"
                autoComplete="new-password"
                value={confirm}
                onChange={(e) => setConfirm(e.target.value)}
                required
                minLength={6}
              />
            </div>
            <Button type="submit" className="w-full" disabled={loading}>
              {loading ? 'Saving…' : 'Update password'}
            </Button>
          </form>
          <p className="mt-6 text-center text-sm text-muted-foreground">
            <Link href="/admin/login" className="text-foreground underline-offset-4 hover:underline">
              Back to sign in
            </Link>
          </p>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-xl font-light tracking-widest uppercase">Reset password</CardTitle>
        <CardDescription>We will email you a link to choose a new password.</CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={requestReset} className="space-y-4">
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
          <Button type="submit" className="w-full" disabled={loading}>
            {loading ? 'Sending…' : 'Send reset link'}
          </Button>
        </form>
        <p className="mt-6 text-center text-sm text-muted-foreground">
          <Link href="/admin/login" className="text-foreground underline-offset-4 hover:underline">
            Back to sign in
          </Link>
        </p>
      </CardContent>
    </Card>
  )
}

export default function ForgotPasswordPage() {
  return (
    <div className="mx-auto max-w-md px-6 pt-28 pb-16">
      <Suspense
        fallback={
          <Card>
            <CardContent className="pt-8 pb-8 text-center text-sm text-muted-foreground">Loading…</CardContent>
          </Card>
        }
      >
        <ForgotPasswordForm />
      </Suspense>
    </div>
  )
}
