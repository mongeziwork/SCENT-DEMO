'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'

import { AdminRouteGuard } from '@/components/admin/admin-route-guard'
import { AdminShell } from '@/components/admin/admin-shell'

/**
 * Store chrome (nav, footer, music) is hidden for all `/admin/*` via root layout.
 * `/admin/login` uses a minimal header; other routes use AdminShell + guard.
 */
export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()
  const isLogin = pathname === '/admin/login' || pathname?.startsWith('/admin/login/')

  if (isLogin) {
    return (
      <div className="min-h-screen flex flex-col bg-background">
        <header className="flex h-14 shrink-0 items-center justify-between border-b border-border px-4 sm:px-6">
          <Link
            href="/"
            className="text-[11px] tracking-[0.2em] uppercase text-muted-foreground transition-colors hover:text-foreground"
          >
            ← Storefront
          </Link>
          <span className="text-[10px] tracking-[0.28em] uppercase text-foreground">Sign in</span>
        </header>
        <div className="flex flex-1 flex-col items-center justify-center p-6">{children}</div>
      </div>
    )
  }

  return (
    <AdminRouteGuard>
      <AdminShell>{children}</AdminShell>
    </AdminRouteGuard>
  )
}
