'use client'

import Link from 'next/link'
import Image from 'next/image'
import { motion } from 'framer-motion'
import { Instagram } from 'lucide-react'

export function Footer() {
  return (
    <footer className="border-t border-border bg-background">
      <div className="mx-auto max-w-7xl px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12">
          <div className="md:col-span-2">
            <Link href="/">
              <Image
                src="/brand/logo-white.png"
                alt="SCENT"
                width={220}
                height={55}
                priority
                className="h-auto w-[220px] max-w-full"
              />
            </Link>
            <p className="mt-4 text-sm text-muted-foreground leading-relaxed max-w-md">
              Premium menswear crafted for the modern youth. Where quality meets contemporary style.
            </p>
          </div>

          <div>
            <h4 className="text-xs font-medium tracking-widest uppercase text-foreground mb-6">
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
          </div>

          <div>
            <h4 className="text-xs font-medium tracking-widest uppercase text-foreground mb-6">
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

        <div className="mt-16 pt-8 border-t border-border flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-xs text-muted-foreground">
            &copy; {new Date().getFullYear()} SCENT. All rights reserved.
          </p>
          <div className="flex items-center justify-center">
            <Image
              src="/brand/logo-white.png"
              alt="SCENT logo"
              width={180}
              height={45}
              className="h-auto w-[180px] opacity-90"
            />
          </div>
          <div className="flex flex-wrap justify-center gap-x-6 gap-y-2">
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
            <Link
              href="/terms"
              className="text-xs text-muted-foreground hover:text-foreground transition-colors"
            >
              Terms of Service
            </Link>
          </div>
        </div>
      </div>
    </footer>
  )
}
