'use client'

import { useEffect, useMemo, useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import type { User } from '@supabase/supabase-js'
import { User as UserIcon } from 'lucide-react'

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

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          type="button"
          variant="ghost"
          size="icon"
          className="relative h-10 w-10 shrink-0"
          aria-label={user ? 'Account menu' : 'Sign in'}
        >
          <UserIcon className="h-5 w-5 text-foreground" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent
        align="end"
        className="w-56"
        onCloseAutoFocus={(e) => e.preventDefault()}
      >
        {!user ? (
          <>
            <DropdownMenuItem asChild>
              <Link href="/auth/sign-in">Sign in</Link>
            </DropdownMenuItem>
            <DropdownMenuItem asChild>
              <Link href="/auth/sign-up">Create account</Link>
            </DropdownMenuItem>
          </>
        ) : (
          <>
            <div className="px-2 py-1.5 text-xs text-muted-foreground truncate">
              {user.email ?? 'Account'}
            </div>
            <DropdownMenuSeparator />
            <DropdownMenuItem asChild>
              <Link href="/account">My account</Link>
            </DropdownMenuItem>
            {isAdminEmail(user.email) && (
              <DropdownMenuItem asChild>
                <Link href="/admin">Admin</Link>
              </DropdownMenuItem>
            )}
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={() => void signOut()}>Sign out</DropdownMenuItem>
          </>
        )}
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
