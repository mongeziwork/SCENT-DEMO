'use client'

import { useEffect, useMemo, useState } from 'react'
import Link from 'next/link'
import { ArrowRight, Package, ShoppingBag } from 'lucide-react'

import { createSupabaseBrowserClient } from '@/lib/supabase/browser'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'

export default function AdminDashboardPage() {
  const supabase = useMemo(() => createSupabaseBrowserClient(), [])
  const [productCount, setProductCount] = useState<number | null>(null)
  const [orderCount, setOrderCount] = useState<number | null>(null)

  useEffect(() => {
    let cancelled = false
    void (async () => {
      const [p, o] = await Promise.all([
        supabase.from('products').select('*', { count: 'exact', head: true }),
        supabase.from('orders').select('*', { count: 'exact', head: true }),
      ])
      if (cancelled) return
      setProductCount(p.error ? null : (p.count ?? 0))
      setOrderCount(o.error ? null : (o.count ?? 0))
    })()
    return () => {
      cancelled = true
    }
  }, [supabase])

  return (
    <div className="p-6 lg:p-10 max-w-4xl">
      <div className="space-y-1">
        <h1 className="text-2xl font-light tracking-[0.2em] uppercase">Overview</h1>
        <p className="text-sm text-muted-foreground max-w-xl leading-relaxed">
          Manage catalog, orders, and subscribers. Your Supabase data is only changed when you
          explicitly save—nothing here bulk-deletes marketing or product tables.
        </p>
      </div>

      <div className="mt-10 grid gap-4 sm:grid-cols-2">
        <Card className="border-border bg-card/30">
          <CardHeader className="pb-2">
            <CardTitle className="text-base font-normal flex items-center gap-2">
              <Package className="h-4 w-4 text-muted-foreground" />
              Products
            </CardTitle>
            <CardDescription>Catalog in Supabase</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-light tabular-nums">
              {productCount === null ? '—' : productCount}
            </p>
            <Button variant="outline" size="sm" className="mt-4 gap-1" asChild>
              <Link href="/admin/products">
                Manage products
                <ArrowRight className="h-3.5 w-3.5" />
              </Link>
            </Button>
          </CardContent>
        </Card>

        <Card className="border-border bg-card/30">
          <CardHeader className="pb-2">
            <CardTitle className="text-base font-normal flex items-center gap-2">
              <ShoppingBag className="h-4 w-4 text-muted-foreground" />
              Orders
            </CardTitle>
            <CardDescription>Read-only count (RLS may hide this)</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-light tabular-nums">
              {orderCount === null ? '—' : orderCount}
            </p>
            <div className="mt-4 flex flex-wrap gap-2">
              <Button variant="outline" size="sm" asChild>
                <Link href="/admin/orders">Manage orders</Link>
              </Button>
            </div>
            <p className="mt-3 text-xs text-muted-foreground leading-relaxed">
              If the count shows “—”, your session may not have select access on{' '}
              <span className="font-mono">orders</span>.
            </p>
          </CardContent>
        </Card>
      </div>

      <Card className="mt-6 border-border bg-card/20">
        <CardHeader>
          <CardTitle className="text-base font-normal tracking-wide">Marketing and lists</CardTitle>
          <CardDescription>Subscribers and campaigns</CardDescription>
        </CardHeader>
        <CardContent className="text-sm text-muted-foreground space-y-3">
          <p>
            Draft campaigns, send to subscribed addresses, and review the list—all from the admin
            console. Subscriber rows stay in Supabase.
          </p>
          <div className="flex flex-wrap gap-2">
            <Button variant="secondary" size="sm" asChild>
              <Link href="/admin/newsletters">Newsletters</Link>
            </Button>
            <Button variant="outline" size="sm" asChild>
              <Link href="/admin/subscribers">Subscribers</Link>
            </Button>
            <Button variant="outline" size="sm" asChild>
              <Link href="/admin/marketing">Marketing notes</Link>
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
