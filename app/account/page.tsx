'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'

import { createSupabaseBrowserClient } from '@/lib/supabase/browser'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'

export default function AccountPage() {
  const [loading, setLoading] = useState(true)
  const [email, setEmail] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    async function run() {
      const supabase = createSupabaseBrowserClient()
      const { data, error } = await supabase.auth.getUser()
      if (error) setError(error.message)
      setEmail(data.user?.email ?? null)
      setLoading(false)
    }
    void run()
  }, [])

  async function signOut() {
    const supabase = createSupabaseBrowserClient()
    await supabase.auth.signOut()
    window.location.href = '/'
  }

  return (
    <div className="min-h-screen bg-background pt-20">
      <section className="py-16 md:py-24">
        <div className="mx-auto max-w-3xl px-6 lg:px-8">
          <Card>
            <CardHeader>
              <CardTitle>Account</CardTitle>
              <CardDescription>Manage your SCENT account.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {loading ? (
                <div className="text-sm text-muted-foreground">Loading…</div>
              ) : error ? (
                <div className="text-sm text-muted-foreground">{error}</div>
              ) : email ? (
                <div className="text-sm">
                  Signed in as <span className="font-medium">{email}</span>
                </div>
              ) : (
                <div className="text-sm text-muted-foreground">
                  You’re not signed in. <Link className="underline underline-offset-4" href="/auth/sign-in">Sign in</Link>.
                </div>
              )}

              <div className="flex flex-wrap gap-3">
                <Button asChild variant="outline">
                  <Link href="/shop">Continue shopping</Link>
                </Button>
                {email ? (
                  <Button onClick={() => void signOut()} variant="outline">
                    Sign out
                  </Button>
                ) : (
                  <Button asChild>
                    <Link href="/auth/sign-up">Create account</Link>
                  </Button>
                )}
              </div>
            </CardContent>
          </Card>
        </div>
      </section>
    </div>
  )
}

