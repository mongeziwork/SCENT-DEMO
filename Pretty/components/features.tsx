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
    title: 'Free Shipping',
    description: 'Complimentary worldwide delivery on all orders over $200.',
  },
  {
    icon: RefreshCcw,
    title: 'Easy Returns',
    description: '30-day hassle-free returns for your peace of mind.',
  },
]

export function Features() {
  return (
    <section className="py-24 md:py-32 bg-background border-t border-border">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12 md:gap-8">
          {features.map((feature, index) => (
            <motion.div
              key={feature.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              className="text-center"
            >
              <div className="inline-flex items-center justify-center w-14 h-14 rounded-full border border-border mb-6">
                <feature.icon className="h-6 w-6 text-foreground" />
              </div>
              <h3 className="text-lg font-medium text-foreground tracking-wide">
                {feature.title}
              </h3>
              <p className="mt-2 text-sm text-muted-foreground leading-relaxed">
                {feature.description}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}
