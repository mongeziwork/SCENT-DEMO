'use client'

import { useEffect, useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'

const SEEN_KEY = 'scent:site-entry-loader-seen:v1'

export function SiteEntryLoader() {
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    if (window.sessionStorage.getItem(SEEN_KEY) === 'true') return

    setLoading(true)
    const timer = window.setTimeout(() => {
      window.sessionStorage.setItem(SEEN_KEY, 'true')
      setLoading(false)
    }, 2300)

    return () => window.clearTimeout(timer)
  }, [])

  return (
    <AnimatePresence>
      {loading && (
        <motion.div
          key="site-entry-loader"
          initial={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.65, ease: 'easeInOut' }}
          className="fixed inset-0 z-[120] flex items-center justify-center bg-black px-6"
          role="status"
          aria-live="polite"
        >
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7 }}
            className="max-w-2xl text-center"
          >
            <div className="mx-auto mb-7 h-px w-44 overflow-hidden bg-white/15">
              <motion.div
                initial={{ x: '-100%' }}
                animate={{ x: '100%' }}
                transition={{ duration: 1.1, ease: 'easeInOut', repeat: Infinity }}
                className="h-full w-24 bg-white shadow-[0_0_18px_rgba(255,255,255,0.65)]"
              />
            </div>
            <p className="text-[10px] uppercase leading-6 tracking-[0.42em] text-white/70 sm:text-xs">
              Welcome!
            </p>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
