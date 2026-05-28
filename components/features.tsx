'use client'

import { motion } from 'framer-motion'
import { Sparkles, Truck, RefreshCcw } from 'lucide-react'

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
    <section className="border-t border-border bg-background py-10 md:py-32">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-3 gap-2 sm:gap-4 md:gap-8">
          {features.map((feature, index) => (
            <motion.div
              key={feature.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              className="text-center"
            >
              <div className="mb-3 inline-flex h-9 w-9 items-center justify-center rounded-full border border-border md:mb-6 md:h-14 md:w-14">
                <feature.icon className="h-4 w-4 text-foreground md:h-6 md:w-6" />
              </div>
              <h3 className="text-[11px] font-medium leading-tight tracking-tight text-foreground sm:text-sm md:text-lg md:tracking-wide">
                {feature.title}
              </h3>
              <p className="mt-1 text-[9px] leading-snug text-muted-foreground sm:text-xs md:mt-2 md:text-sm md:leading-relaxed">
                {feature.description}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}
