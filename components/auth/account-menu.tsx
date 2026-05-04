'use client'

import { useEffect, useMemo, useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import type { User } from '@supabase/supabase-js'

import { createSupabaseBrowserClient } from '@/lib/supabase/browser'
import { isAdminEmail } from '@/lib/admin-config'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { Button } from '@/components/ui/button'

export function AccountMenu() {
  const router = useRouter()
  const supabase = useMemo(() => createSupabaseBrowserClient(), [])
  const [user, setUser] = useState<User | null>(null)

  useEffect(() => {
    async function load() {
      const { data } = await supabase.auth.getUser()
      setUser(data.user ?? null)
    }
    void load()

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null)
    })

    return () => subscription.unsubscribe()
  }, [supabase])

  async function signOut() {
    await supabase.auth.signOut()
    setUser(null)
    router.refresh()
  }

  if (!user) {
    return (
      <Button variant="ghost" size="sm" className="tracking-widest uppercase text-xs" asChild>
        <Link href="/admin/login">Sign in</Link>
      </Button>
    )
  }

  const email = user.email ?? 'Account'
  const short = email.length > 28 ? `${email.slice(0, 26)}…` : email

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="sm" className="max-w-[200px] truncate tracking-wide text-xs">
          {short}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent
        align="end"
        className="w-56"
        onCloseAutoFocus={(e) => e.preventDefault()}
      >
        <div className="px-2 py-1.5 text-xs text-muted-foreground truncate">{email}</div>
        <DropdownMenuSeparator />
        {isAdminEmail(user.email) && (
          <DropdownMenuItem asChild>
            <Link href="/admin">Admin</Link>
          </DropdownMenuItem>
        )}
        <DropdownMenuItem onClick={() => void signOut()}>Sign out</DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
