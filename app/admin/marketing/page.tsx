'use client'

import Link from 'next/link'
import { Database } from 'lucide-react'

import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'

export default function AdminMarketingPage() {
  return (
    <div className="p-6 lg:p-10 max-w-3xl space-y-8">
      <div>
        <h1 className="text-2xl font-light tracking-[0.2em] uppercase">Marketing</h1>
        <p className="mt-2 text-sm text-muted-foreground leading-relaxed">
          Subscriber lists, automations, and campaign data live in your Supabase project. This page
          does not delete or truncate those tables—it is a control center so you know where your
          data remains.
        </p>
      </div>

      <Card className="border-border bg-card/30">
        <CardHeader>
          <CardTitle className="text-base font-normal flex items-center gap-2">
            <Database className="h-4 w-4 text-muted-foreground" />
            Where your data lives
          </CardTitle>
          <CardDescription>Typical tables (names may differ in your project)</CardDescription>
        </CardHeader>
        <CardContent className="text-sm text-muted-foreground space-y-4">
          <ul className="list-disc pl-5 space-y-2 leading-relaxed">
            <li>
              <span className="font-mono text-foreground/80">products</span> — edited from{' '}
              <Link href="/admin/products" className="text-foreground underline-offset-4 hover:underline">
                Products
              </Link>
            </li>
            <li>
              <span className="font-mono text-foreground/80">orders</span> /{' '}
              <span className="font-mono text-foreground/80">order_items</span> — created at checkout
            </li>
            <li>Newsletter or marketing tables — managed in Supabase (or connect an ESP later)</li>
          </ul>
          <p className="text-xs border-t border-border pt-4">
            To export subscribers or run campaigns, open the Supabase SQL editor or Table Editor for
            your project. No destructive actions run from this screen.
          </p>
        </CardContent>
      </Card>

      <div className="flex flex-wrap gap-3">
        <Button variant="outline" size="sm" asChild>
          <Link href="/admin">← Overview</Link>
        </Button>
        <Button variant="outline" size="sm" asChild>
          <a
            href="https://supabase.com/dashboard"
            target="_blank"
            rel="noopener noreferrer"
          >
            Supabase dashboard (external)
          </a>
        </Button>
      </div>
    </div>
  )
}
