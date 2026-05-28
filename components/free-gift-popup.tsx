'use client'

import { useEffect, useState } from 'react'
import Image from 'next/image'
import { usePathname } from 'next/navigation'
import { motion, AnimatePresence } from 'framer-motion'
import { Gift, Sparkles, X } from 'lucide-react'

const DISMISS_KEY = 'scent:free-gift-popup-dismissed:v2'
const SESSION_HIDE_KEY = 'scent:free-gift-popup-session-hidden:v2'

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
    <div className="relative flex min-h-[300px] items-center justify-center overflow-hidden bg-[radial-gradient(circle_at_50%_18%,rgba(255,255,255,0.26),transparent_30%),linear-gradient(135deg,rgba(255,255,255,0.08),transparent_58%)] px-6 py-10">
      <div className="absolute inset-0 bg-[linear-gradient(120deg,transparent,rgba(255,255,255,0.08),transparent)]" />
      <div className="absolute left-8 top-10 h-24 w-24 rounded-full bg-white/10 blur-3xl" />
      <div className="absolute bottom-8 right-8 h-28 w-28 rounded-full bg-white/10 blur-3xl" />

      <motion.div
        aria-hidden="true"
        className="absolute h-64 w-64 rounded-full border border-white/10"
        animate={{ rotate: 360 }}
        transition={{ duration: 24, repeat: Infinity, ease: 'linear' }}
      />

      <motion.div
        className="relative h-[230px] w-[230px] [perspective:1200px] sm:h-[275px] sm:w-[275px]"
        animate={{ rotateX: [7, 1, 7], rotateY: [-18, 18, -18], rotateZ: [-1.5, 1.5, -1.5], y: [0, -8, 0] }}
        whileHover={{ rotateX: 0, rotateY: 0, rotateZ: 0, y: -12, scale: 1.04 }}
        transition={{ duration: 7, repeat: Infinity, ease: 'easeInOut' }}
      >
        <div className="absolute inset-x-8 bottom-4 h-16 rounded-full bg-black/70 blur-2xl" />
        <div className="absolute inset-3 rounded-[2rem] bg-white/10 blur-xl" />
        <div className="relative h-full w-full overflow-hidden rounded-[2rem]">
          <Image
            src="/images/scent-metallic-gift-card.webp"
            alt="SCENT metallic gift card"
            fill
            sizes="(min-width: 640px) 275px, 230px"
            className="object-contain drop-shadow-[0_34px_55px_rgba(0,0,0,0.65)]"
            priority
          />
          <motion.div
            className="absolute -inset-y-10 -left-1/2 w-1/2 rotate-12 bg-gradient-to-r from-transparent via-white/55 to-transparent blur-sm"
            animate={{ x: ['0%', '330%'] }}
            transition={{ duration: 5, repeat: Infinity, repeatDelay: 1.6, ease: 'easeInOut' }}
          />
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
  const [canReopen, setCanReopen] = useState(false)

  useEffect(() => {
    if (shouldHideOnRoute(pathname)) {
      setOpen(false)
      return
    }

    if (window.localStorage.getItem(DISMISS_KEY) === 'true') {
      setCanReopen(true)
      return
    }

    if (window.sessionStorage.getItem(SESSION_HIDE_KEY) === 'true') {
      setCanReopen(true)
      return
    }

    const timer = window.setTimeout(() => setOpen(true), 900)
    return () => window.clearTimeout(timer)
  }, [pathname])

  function dismiss() {
    window.localStorage.setItem(DISMISS_KEY, 'true')
    setCanReopen(true)
    setOpen(false)
  }

  function continueToSite() {
    window.sessionStorage.setItem(SESSION_HIDE_KEY, 'true')
    setCanReopen(true)
    setOpen(false)
  }

  function reopen() {
    window.localStorage.removeItem(DISMISS_KEY)
    window.sessionStorage.removeItem(SESSION_HIDE_KEY)
    setCanReopen(false)
    setOpen(true)
  }

  const showLauncher = !shouldHideOnRoute(pathname) && !open && canReopen

  return (
    <>
      <AnimatePresence>
        {showLauncher && (
          <motion.button
            type="button"
            onClick={reopen}
            className="fixed bottom-4 right-4 z-[70] inline-flex items-center gap-1.5 rounded-full border border-white/15 bg-background/90 px-3 py-2.5 text-[10px] font-medium uppercase tracking-[0.14em] text-foreground shadow-[0_18px_50px_rgba(0,0,0,0.45)] backdrop-blur-xl transition-colors hover:border-white/40 sm:gap-2 sm:px-4 sm:py-3 sm:text-xs sm:tracking-[0.18em] md:bottom-8"
            initial={{ opacity: 0, y: 12, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 10, scale: 0.96 }}
            aria-label="Reopen free gift offer"
          >
            <Gift className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
            Gift
          </motion.button>
        )}
      </AnimatePresence>

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
                <button
                  type="button"
                  onClick={continueToSite}
                  className="inline-flex items-center justify-center border border-foreground bg-foreground px-6 py-3 text-xs font-medium uppercase tracking-[0.24em] text-background transition-opacity hover:opacity-90"
                >
                  Continue to site
                </button>
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
    </>
  )
}
