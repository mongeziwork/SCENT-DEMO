'use client'

import { usePathname } from 'next/navigation'

import { AdminRouteGuard } from '@/components/admin/admin-route-guard'

/**
 * `/admin/login` is public. All other `/admin/*` routes are wrapped by the guard.
 */
export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()
  const isLogin = pathname === '/admin/login' || pathname?.startsWith('/admin/login/')

  if (isLogin) {
    return <>{children}</>
  }

  return <AdminRouteGuard>{children}</AdminRouteGuard>
}
