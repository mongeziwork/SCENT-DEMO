'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { motion, AnimatePresence } from 'framer-motion'
import { Sparkles, X } from 'lucide-react'

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

function HyperRealGiftCard() {
  return (
    <div className="relative flex min-h-[300px] items-center justify-center overflow-hidden bg-[radial-gradient(circle_at_50%_20%,rgba(255,255,255,0.22),transparent_28%),linear-gradient(135deg,rgba(255,255,255,0.08),transparent_58%)] px-6 py-10">
      <div className="absolute inset-0 bg-[linear-gradient(120deg,transparent,rgba(255,255,255,0.08),transparent)]" />
      <div className="absolute left-8 top-10 h-24 w-24 rounded-full bg-white/10 blur-3xl" />
      <div className="absolute bottom-8 right-8 h-28 w-28 rounded-full bg-white/10 blur-3xl" />

      <motion.div
        aria-hidden="true"
        className="absolute h-56 w-56 rounded-full border border-white/10"
        animate={{ rotate: 360 }}
        transition={{ duration: 24, repeat: Infinity, ease: 'linear' }}
      />

      <motion.div
        className="relative h-[176px] w-[284px] rounded-[1.6rem] [perspective:1100px] sm:h-[198px] sm:w-[320px]"
        animate={{ rotateX: [8, 2, 8], rotateY: [-18, 16, -18], y: [0, -6, 0] }}
        transition={{ duration: 7, repeat: Infinity, ease: 'easeInOut' }}
      >
        <div className="absolute inset-x-8 -bottom-10 h-12 rounded-full bg-black/70 blur-2xl" />
        <div className="relative h-full w-full overflow-hidden rounded-[1.6rem] border border-white/25 bg-[linear-gradient(135deg,#0a0a0a_0%,#1a1a1a_34%,#050505_68%,#2a2a2a_100%)] shadow-[0_34px_90px_rgba(0,0,0,0.65),inset_0_1px_0_rgba(255,255,255,0.35),inset_0_-18px_45px_rgba(0,0,0,0.65)]">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_18%_18%,rgba(255,255,255,0.28),transparent_26%),radial-gradient(circle_at_84%_22%,rgba(255,255,255,0.16),transparent_22%),linear-gradient(115deg,transparent_20%,rgba(255,255,255,0.18)_42%,transparent_58%)]" />
          <motion.div
            className="absolute -inset-y-10 -left-1/2 w-1/2 rotate-12 bg-gradient-to-r from-transparent via-white/30 to-transparent blur-sm"
            animate={{ x: ['0%', '330%'] }}
            transition={{ duration: 4.8, repeat: Infinity, repeatDelay: 1.4, ease: 'easeInOut' }}
          />
          <div className="absolute left-0 top-0 h-full w-1/2 bg-[linear-gradient(90deg,rgba(255,255,255,0.09),transparent)]" />
          <div className="absolute right-5 top-5 h-10 w-16 rounded-md border border-white/25 bg-[linear-gradient(135deg,rgba(255,255,255,0.5),rgba(255,255,255,0.08)_38%,rgba(255,255,255,0.32))] shadow-[inset_0_1px_0_rgba(255,255,255,0.45)]">
            <div className="absolute left-1/2 top-0 h-full w-px -translate-x-1/2 bg-black/25" />
            <div className="absolute left-0 top-1/2 h-px w-full -translate-y-1/2 bg-black/25" />
          </div>
          <div className="absolute bottom-0 left-0 h-12 w-full bg-[linear-gradient(90deg,rgba(255,255,255,0.08),rgba(255,255,255,0.2),rgba(255,255,255,0.06))]" />
          <div className="absolute bottom-5 left-6 right-6 h-px bg-gradient-to-r from-white/10 via-white/45 to-white/10" />

          <div className="relative flex h-full flex-col justify-between p-6 text-white">
            <div>
              <p className="text-[10px] uppercase tracking-[0.62em] text-white drop-shadow-[0_2px_10px_rgba(255,255,255,0.28)]">
                SCENT
              </p>
              <p className="mt-3 text-[8px] uppercase tracking-[0.34em] text-white/45">
                Complimentary reward card
              </p>
            </div>

            <div>
              <p className="text-[9px] uppercase tracking-[0.28em] text-white/50">First purchase</p>
              <p className="mt-2 text-2xl font-light uppercase leading-none tracking-tight text-white sm:text-3xl">
                Free Gift
              </p>
            </div>

            <div className="flex items-end justify-between text-[8px] uppercase tracking-[0.22em] text-white/42">
              <span>No. SC-0001</span>
              <span>Valid online</span>
            </div>
          </div>
        </div>
      </motion.div>

      <motion.div
        className="absolute right-8 top-10 flex items-center gap-1 rounded-full border border-white/15 bg-black/50 px-3 py-1 text-[9px] uppercase tracking-[0.22em] text-white/70"
        animate={{ y: [0, -8, 0] }}
        transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
      >
        <Sparkles className="h-3 w-3" />
        Gift card unlocked
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

            <HyperRealGiftCard />

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
