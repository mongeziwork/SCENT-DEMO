'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { motion, AnimatePresence } from 'framer-motion'
import { Gift, Sparkles, X } from 'lucide-react'

const DISMISS_KEY = 'scent:free-gift-popup-dismissed'

function shouldHideOnRoute(pathname: string) {
  return (
    pathname === '/admin' ||
    pathname.startsWith('/admin/') ||
    pathname.startsWith('/auth/') ||
    pathname === '/cart' ||
    pathname === '/checkout' ||
    pathname.startsWith('/payfast/')
  )
}

function SpinningPhone() {
  return (
    <div className="relative flex min-h-[260px] items-center justify-center overflow-hidden bg-[radial-gradient(circle_at_center,rgba(255,255,255,0.18),transparent_32%),linear-gradient(135deg,rgba(255,255,255,0.08),transparent_55%)]">
      <div className="absolute inset-x-6 top-8 h-px bg-gradient-to-r from-transparent via-white/40 to-transparent" />
      <div className="absolute inset-x-6 bottom-8 h-px bg-gradient-to-r from-transparent via-white/30 to-transparent" />
      <motion.div
        aria-hidden="true"
        className="absolute h-40 w-40 rounded-full border border-white/10"
        animate={{ rotate: 360 }}
        transition={{ duration: 18, repeat: Infinity, ease: 'linear' }}
      />
      <motion.div
        className="relative h-[220px] w-[118px] rounded-[2rem] border border-white/25 bg-black p-2 shadow-[0_30px_90px_rgba(255,255,255,0.14)] [perspective:900px]"
        animate={{ rotateY: [0, 18, 0, -18, 0] }}
        transition={{ duration: 5.5, repeat: Infinity, ease: 'easeInOut' }}
      >
        <div className="absolute left-1/2 top-2 h-1.5 w-10 -translate-x-1/2 rounded-full bg-white/20" />
        <div className="flex h-full flex-col justify-between rounded-[1.45rem] border border-white/10 bg-[linear-gradient(160deg,#111,#050505_45%,#1d1d1d)] px-4 py-5">
          <div>
            <p className="text-[9px] uppercase tracking-[0.36em] text-white/45">SCENT</p>
            <div className="mt-8 flex h-12 w-12 items-center justify-center rounded-full border border-white/20 bg-white text-black">
              <Gift className="h-5 w-5" />
            </div>
          </div>
          <div>
            <p className="text-[9px] uppercase tracking-[0.24em] text-white/45">First purchase</p>
            <p className="mt-2 text-xl font-light uppercase leading-none tracking-tight text-white">
              Free
              <br />
              Gift
            </p>
          </div>
        </div>
      </motion.div>
      <motion.div
        className="absolute right-8 top-10 flex items-center gap-1 rounded-full border border-white/15 bg-black/50 px-3 py-1 text-[9px] uppercase tracking-[0.22em] text-white/70"
        animate={{ y: [0, -8, 0] }}
        transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
      >
        <Sparkles className="h-3 w-3" />
        Gift unlocked
      </motion.div>
    </div>
  )
}

export function FreeGiftPopup() {
  const pathname = usePathname() ?? ''
  const [open, setOpen] = useState(false)

  useEffect(() => {
    if (shouldHideOnRoute(pathname)) {
      setOpen(false)
      return
    }

    if (window.localStorage.getItem(DISMISS_KEY) === 'true') return

    const timer = window.setTimeout(() => setOpen(true), 900)
    return () => window.clearTimeout(timer)
  }, [pathname])

  function dismiss() {
    window.localStorage.setItem(DISMISS_KEY, 'true')
    setOpen(false)
  }

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          className="fixed inset-0 z-[80] flex items-end justify-center bg-black/70 px-4 pb-5 backdrop-blur-sm sm:items-center sm:pb-0"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          role="dialog"
          aria-modal="true"
          aria-label="Free gift on first purchase"
        >
          <motion.div
            className="relative grid w-full max-w-3xl overflow-hidden border border-white/15 bg-background text-foreground shadow-[0_30px_120px_rgba(0,0,0,0.55)] md:grid-cols-[0.9fr_1.1fr]"
            initial={{ opacity: 0, y: 40, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.98 }}
            transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
          >
            <button
              type="button"
              onClick={dismiss}
              className="absolute right-4 top-4 z-10 rounded-full border border-white/15 bg-black/40 p-2 text-white/80 transition-colors hover:border-white/50 hover:text-white"
              aria-label="Close free gift popup"
            >
              <X className="h-4 w-4" />
            </button>

            <SpinningPhone />

            <div className="flex flex-col justify-center px-6 py-7 sm:px-8 md:py-10">
              <p className="text-[10px] uppercase tracking-[0.38em] text-muted-foreground">
                First order reward
              </p>
              <h2 className="mt-4 text-3xl font-light uppercase leading-none tracking-tight text-foreground sm:text-5xl">
                Special free gift
                <span className="block text-foreground/45">on your first purchase.</span>
              </h2>
              <p className="mt-5 max-w-md text-sm leading-relaxed text-muted-foreground">
                Place your first SCENT order and unlock a complimentary surprise gift with your
                package. Limited to first-time customers while stock lasts.
              </p>
              <div className="mt-7 flex flex-col gap-3 sm:flex-row">
                <Link
                  href="/shop"
                  onClick={() => setOpen(false)}
                  className="inline-flex items-center justify-center border border-foreground bg-foreground px-6 py-3 text-xs font-medium uppercase tracking-[0.24em] text-background transition-opacity hover:opacity-90"
                >
                  Shop now
                </Link>
                <button
                  type="button"
                  onClick={dismiss}
                  className="inline-flex items-center justify-center border border-border px-6 py-3 text-xs font-medium uppercase tracking-[0.24em] text-foreground transition-colors hover:border-foreground"
                >
                  Maybe later
                </button>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
