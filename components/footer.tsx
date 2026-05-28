'use client'

import Link from 'next/link'
import Image from 'next/image'
import { motion } from 'framer-motion'
import { Instagram } from 'lucide-react'

import { Features } from '@/components/features'

export function Footer() {
  return (
    <footer className="border-t border-border bg-background">
      <Features />
      <div className="mx-auto max-w-7xl px-6 py-10 lg:px-8 md:py-16">
        <div className="grid grid-cols-1 gap-10 md:grid-cols-[1.4fr_1fr] md:gap-12">
          <div className="max-w-xs">
            <h4 className="mb-4 text-xs font-medium uppercase tracking-widest text-foreground md:mb-6">
              Navigation
            </h4>
            <ul className="space-y-3">
              {['Home', 'Shop', 'Contact'].map((item) => (
                <li key={item}>
                  <Link
                    href={item === 'Home' ? '/' : `/${item.toLowerCase()}`}
                    className="text-sm text-muted-foreground hover:text-foreground transition-colors duration-300"
                  >
                    {item}
                  </Link>
                </li>
              ))}
            </ul>

            <div className="mt-8 border-t border-border pt-6">
              <Link href="/" className="inline-block">
                <Image
                  src="/brand/logo-white.png"
                  alt="SCENT"
                  width={220}
                  height={55}
                  priority
                  className="h-auto w-24 max-w-full sm:w-28 md:w-32"
                />
              </Link>
              <p className="mt-3 max-w-[12rem] text-[11px] leading-relaxed text-muted-foreground sm:max-w-[14rem] md:text-xs">
                Premium menswear crafted for the modern youth. Where quality meets contemporary style.
              </p>
            </div>
          </div>

          <div>
            <h4 className="mb-4 text-xs font-medium uppercase tracking-widest text-foreground md:mb-6">
              Connect
            </h4>
            <div className="flex gap-4">
              <motion.a
                href="https://instagram.com/scent_jhb"
                target="_blank"
                rel="noreferrer"
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                className="p-2 border border-border rounded-full hover:border-foreground transition-colors duration-300"
                aria-label="Instagram"
              >
                <Instagram className="h-4 w-4 text-foreground" />
              </motion.a>
            </div>
          </div>
        </div>

        <div className="mt-10 flex flex-col items-center justify-between gap-4 border-t border-border pt-6 md:mt-16 md:flex-row md:pt-8">
          <p className="text-xs text-muted-foreground">
            &copy; {new Date().getFullYear()} SCENT. All rights reserved.
          </p>
          <div className="flex flex-wrap justify-center gap-x-6 gap-y-2">
            <Link
              href="/about"
              className="text-xs text-muted-foreground hover:text-foreground transition-colors"
            >
              About
            </Link>
            <Link
              href="/shipping"
              className="text-xs text-muted-foreground hover:text-foreground transition-colors"
            >
              Shipping
            </Link>
            <Link
              href="/returns"
              className="text-xs text-muted-foreground hover:text-foreground transition-colors"
            >
              Returns
            </Link>
            <Link
              href="/privacy-policy"
              className="text-xs text-muted-foreground hover:text-foreground transition-colors"
            >
              Privacy Policy
            </Link>
          </div>
        </div>
      </div>
    </footer>
  )
}
