'use client'

import { usePathname } from 'next/navigation'

import { Navigation } from '@/components/navigation'
import { Footer } from '@/components/footer'
import { MusicPlayer } from '@/components/music-player'

function useIsAdminRoute() {
  const pathname = usePathname() ?? ''
  return pathname === '/admin' || pathname.startsWith('/admin/')
}

export function ConditionalNavigation() {
  if (useIsAdminRoute()) return null
  return <Navigation />
}

export function ConditionalFooter() {
  if (useIsAdminRoute()) return null
  return <Footer />
}

export function ConditionalMusicPlayer() {
  if (useIsAdminRoute()) return null
  return <MusicPlayer />
}
