'use client'

import { Suspense, useMemo, useState } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'

import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'

function PortalLoginInner() {
  const router = useRouter()
  const params = useSearchParams()
  const next = params.get('next') || '/portal'

  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState<string | null>(null)

  const safeNext = useMemo(() => {
    // Only allow internal next paths.
    if (!next.startsWith('/')) return '/portal'
    if (next.startsWith('/portal')) return next
    return '/portal'
  }, [next])

  async function submit() {
    setLoading(true)
    setMessage(null)
    try {
      const res = await fetch('/api/portal/login', {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify({ password, next: safeNext }),
      })
      if (!res.ok) {
        const data = (await res.json().catch(() => null)) as { error?: string } | null
        setMessage(data?.error || 'Login failed.')
        return
      }
      router.replace(safeNext)
    } catch (e) {
      setMessage(e instanceof Error ? e.message : 'Login failed.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-background pt-20">
      <div className="mx-auto max-w-md px-6 lg:px-8 pt-16 pb-16">
        <Card>
          <CardHeader>
            <CardTitle>Portal login</CardTitle>
            <CardDescription>Restricted access.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <div className="text-xs tracking-widest uppercase text-muted-foreground">Password</div>
              <Input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                autoComplete="current-password"
                onKeyDown={(e) => {
                  if (e.key === 'Enter') void submit()
                }}
              />
            </div>

            {message ? <div className="text-sm text-muted-foreground">{message}</div> : null}

            <div className="flex flex-col gap-2 pt-2">
              <Button onClick={() => void submit()} disabled={loading || !password}>
                {loading ? 'Please wait…' : 'Sign in'}
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

export default function PortalLoginPage() {
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
      <PortalLoginInner />
    </Suspense>
  )
}

