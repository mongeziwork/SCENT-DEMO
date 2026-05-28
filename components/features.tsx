'use client'

import { motion } from 'framer-motion'
import { ChevronDown, Sparkles, Truck, RefreshCcw } from 'lucide-react'

const features = [
  {
    icon: Sparkles,
    title: 'Premium Quality',
    description: 'Crafted from the finest materials for lasting comfort and style.',
  },
  {
    icon: Truck,
    title: 'Nationwide Delivery',
    description: 'Standard South African courier delivery is available for R190.00.',
  },
  {
    icon: RefreshCcw,
    title: 'Easy Returns',
    description: '30-day hassle-free returns for your peace of mind.',
  },
]

export function Features() {
  return (
    <section className="border-b border-border bg-background py-8 md:py-10" aria-labelledby="service-details-title">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <div className="mb-5 flex items-end justify-between gap-4">
          <div>
            <p className="text-[10px] uppercase tracking-[0.32em] text-muted-foreground">Service</p>
            <h2 id="service-details-title" className="mt-2 text-lg font-light uppercase tracking-wide text-foreground">
              Details before checkout
            </h2>
          </div>
          <p className="hidden max-w-xs text-right text-xs leading-relaxed text-muted-foreground sm:block">
            Quick answers on quality, shipping, and returns.
          </p>
        </div>

        <div className="grid grid-cols-1 gap-2 md:grid-cols-3 md:gap-4">
          {features.map((feature, index) => (
            <motion.details
              key={feature.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              className="group border border-border bg-card/20 open:border-foreground/35"
            >
              <summary className="flex cursor-pointer list-none items-center justify-between gap-4 px-4 py-4 marker:hidden">
                <span className="flex min-w-0 items-center gap-3">
                  <span className="inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-full border border-border">
                    <feature.icon className="h-4 w-4 text-foreground" />
                  </span>
                  <span className="truncate text-xs font-medium uppercase tracking-[0.18em] text-foreground">
                    {feature.title}
                  </span>
                </span>
                <ChevronDown className="h-4 w-4 shrink-0 text-muted-foreground transition-transform group-open:rotate-180" />
              </summary>
              <p className="border-t border-border px-4 pb-4 pt-3 text-sm leading-relaxed text-muted-foreground">
                {feature.description}
              </p>
            </motion.details>
          ))}
        </div>
      </div>
    </section>
  )
}
