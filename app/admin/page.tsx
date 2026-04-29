'use client'

import Link from 'next/link'

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'

export default function AdminPage() {
  return (
    <div className="mx-auto max-w-7xl px-6 lg:px-8 pt-28 pb-16">
        <div className="flex items-start justify-between gap-4">
          <div>
            <h1 className="text-3xl font-light tracking-widest uppercase">Admin</h1>
            <p className="mt-2 text-sm text-muted-foreground">
              Connected to Supabase. This route is public in the app; database access still follows RLS.
            </p>
          </div>
          <Button variant="outline" onClick={() => window.location.reload()}>
            Refresh
          </Button>
        </div>

        <div className="mt-8 grid grid-cols-1 lg:grid-cols-3 gap-6">
          <Card className="lg:col-span-2">
            <CardHeader>
              <CardTitle>Connection</CardTitle>
              <CardDescription>Basic wiring check (client initialized)</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between rounded-lg border bg-background/40 px-4 py-3">
                <div className="text-sm">Supabase client</div>
                <div className="text-sm font-mono text-muted-foreground">ready</div>
              </div>
              <div className="mt-4 flex flex-wrap gap-3">
                <Button asChild>
                  <Link href="/admin/products">Manage products</Link>
                </Button>
                <Button asChild variant="outline">
                  <Link href="/admin/orders">Manage orders</Link>
                </Button>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Notes</CardTitle>
              <CardDescription>Supabase + RLS</CardDescription>
            </CardHeader>
            <CardContent className="text-sm text-muted-foreground space-y-2">
              <div>- Admin UI loads without an app login gate</div>
              <div>- Writes may still require an authenticated admin session per your RLS policies</div>
            </CardContent>
          </Card>
        </div>
    </div>
  )
}

