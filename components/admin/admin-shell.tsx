'use client'

import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import {
  ExternalLink,
  LayoutDashboard,
  LogOut,
  Mail,
  Megaphone,
  Package,
  ShoppingCart,
  Users,
} from 'lucide-react'

import { createSupabaseBrowserClient } from '@/lib/supabase/browser'
import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/button'

const sidebarNav = [
  { href: '/admin', label: 'Overview', icon: LayoutDashboard, match: 'exact' as const },
  { href: '/admin/products', label: 'Products', icon: Package, match: 'prefix' as const },
  { href: '/admin/orders', label: 'Orders', icon: ShoppingCart, match: 'prefix' as const },
  { href: '/admin/subscribers', label: 'Subscribers', icon: Users, match: 'prefix' as const },
  { href: '/admin/newsletters', label: 'Newsletters', icon: Mail, match: 'prefix' as const },
  { href: '/admin/marketing', label: 'Marketing', icon: Megaphone, match: 'prefix' as const },
]

function navActive(pathname: string, href: string, match: 'exact' | 'prefix') {
  if (match === 'exact') return pathname === href
  return pathname === href || pathname.startsWith(`${href}/`)
}

export function AdminShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname() ?? ''
  const router = useRouter()

  async function signOut() {
    const supabase = createSupabaseBrowserClient()
    await supabase.auth.signOut()
    router.replace('/auth/sign-in?next=%2Fadmin')
    router.refresh()
  }

  return (
    <div className="min-h-screen flex bg-background text-foreground">
      <aside className="hidden md:flex w-56 shrink-0 flex-col border-r border-border bg-card/40">
        <div className="p-5 border-b border-border">
          <Link
            href="/admin"
            className="block text-[11px] font-light tracking-[0.28em] text-foreground uppercase"
          >
            SCENT
          </Link>
          <p className="mt-1.5 text-[10px] text-muted-foreground tracking-wide leading-snug">
            Admin console
          </p>
        </div>
        <nav className="flex-1 p-2 space-y-0.5">
          {sidebarNav.map(({ href, label, icon: Icon, match }) => {
            const active = navActive(pathname, href, match)
            return (
              <Link
                key={href}
                href={href}
                className={cn(
                  'flex items-center gap-2.5 rounded-md px-3 py-2 text-sm transition-colors',
                  active
                    ? 'bg-secondary text-foreground'
                    : 'text-muted-foreground hover:bg-secondary/60 hover:text-foreground',
                )}
              >
                <Icon className="h-4 w-4 shrink-0 opacity-80" aria-hidden />
                {label}
              </Link>
            )
          })}
        </nav>
        <div className="p-2 border-t border-border space-y-1">
          <Button variant="outline" size="sm" className="w-full justify-start gap-2 h-9 text-xs" asChild>
            <Link href="/">
              <ExternalLink className="h-3.5 w-3.5" />
              Storefront
            </Link>
          </Button>
          <Button
            variant="ghost"
            size="sm"
            className="w-full justify-start gap-2 h-9 text-xs text-muted-foreground"
            onClick={() => void signOut()}
          >
            <LogOut className="h-3.5 w-3.5" />
            Sign out
          </Button>
        </div>
      </aside>

      <div className="flex-1 flex flex-col min-w-0 min-h-screen">
        <header className="md:hidden sticky top-0 z-10 flex flex-col gap-0 border-b border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/80">
          <div className="flex h-12 items-center justify-between px-4">
            <Link href="/admin" className="text-[10px] tracking-[0.2em] uppercase text-foreground">
              Admin
            </Link>
            <Button variant="ghost" size="sm" className="h-8 text-xs" onClick={() => void signOut()}>
              Out
            </Button>
          </div>
          <nav className="flex gap-1 px-2 pb-2 overflow-x-auto">
            {sidebarNav.map(({ href, label, match }) => {
              const active = navActive(pathname, href, match)
              return (
                <Link
                  key={href}
                  href={href}
                  className={cn(
                    'shrink-0 rounded-full px-3 py-1 text-[11px] tracking-wide',
                    active ? 'bg-secondary text-foreground' : 'text-muted-foreground',
                  )}
                >
                  {label}
                </Link>
              )
            })}
          </nav>
        </header>

        <div className="flex-1 overflow-auto">{children}</div>
      </div>
    </div>
  )
}
