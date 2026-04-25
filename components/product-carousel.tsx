'use client'

import { useCallback, useEffect, useState } from 'react'
import useEmblaCarousel from 'embla-carousel-react'
import Autoplay from 'embla-carousel-autoplay'
import { motion } from 'framer-motion'
import Image from 'next/image'
import Link from 'next/link'
import { ArrowLeft, ArrowRight, ShoppingBag } from 'lucide-react'

import { products } from '@/lib/products'

export function ProductCarousel() {
  const [emblaRef, emblaApi] = useEmblaCarousel(
    { loop: true, align: 'start', slidesToScroll: 1 },
    [Autoplay({ delay: 4000, stopOnInteraction: false })]
  )
  const [selectedIndex, setSelectedIndex] = useState(0)

  const scrollPrev = useCallback(() => emblaApi?.scrollPrev(), [emblaApi])
  const scrollNext = useCallback(() => emblaApi?.scrollNext(), [emblaApi])

  useEffect(() => {
    if (!emblaApi) return
    const onSelect = () => setSelectedIndex(emblaApi.selectedScrollSnap())
    emblaApi.on('select', onSelect)
    return () => {
      emblaApi.off('select', onSelect)
    }
  }, [emblaApi])

  return (
    <section className="py-24 md:py-32 bg-background">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12"
        >
          <div>
            <span className="text-xs tracking-[0.3em] uppercase text-muted-foreground">
              Featured
            </span>
            <h2 className="mt-2 text-4xl md:text-5xl font-light tracking-tight text-foreground">
              Latest Drops
            </h2>
          </div>
          <div className="flex gap-3">
            <motion.button
              onClick={scrollPrev}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="p-4 border border-border hover:border-foreground transition-colors"
              aria-label="Previous slide"
            >
              <ArrowLeft className="h-5 w-5 text-foreground" />
            </motion.button>
            <motion.button
              onClick={scrollNext}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="p-4 border border-border hover:border-foreground transition-colors"
              aria-label="Next slide"
            >
              <ArrowRight className="h-5 w-5 text-foreground" />
            </motion.button>
          </div>
        </motion.div>

        <div ref={emblaRef} className="overflow-hidden">
          <div className="flex gap-6">
            {products.map((product, index) => (
              <motion.div
                key={product.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                className="flex-none w-[280px] md:w-[350px]"
              >
                <Link href={`/shop/${product.slug}`} className="group block">
                  <div className="relative aspect-[3/4] overflow-hidden bg-secondary">
                    <Image
                      src={product.image}
                      alt={product.name}
                      fill
                      className="object-cover transition-transform duration-700 group-hover:scale-105"
                    />
                    <div className="absolute inset-0 bg-background/0 group-hover:bg-background/20 transition-colors duration-300" />
                    <motion.button
                      initial={{ opacity: 0, y: 10 }}
                      whileHover={{ scale: 1.05 }}
                      onClick={(e) => e.preventDefault()}
                      className="absolute bottom-4 left-4 right-4 py-3 bg-foreground text-background text-xs tracking-widest uppercase font-medium opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center gap-2"
                    >
                      <ShoppingBag className="h-4 w-4" />
                      Quick Add
                    </motion.button>
                  </div>
                  <div className="mt-4 flex justify-between items-start">
                    <div>
                      <h3 className="text-sm font-medium text-foreground tracking-wide">
                        {product.name}
                      </h3>
                      <p className="mt-1 text-sm text-muted-foreground">
                        ${product.price}
                      </p>
                    </div>
                  </div>
                </Link>
              </motion.div>
            ))}
          </div>
        </div>

        <div className="flex justify-center gap-2 mt-8">
          {products.map((_, index) => (
            <button
              key={index}
              onClick={() => emblaApi?.scrollTo(index)}
              className={`w-2 h-2 rounded-full transition-all duration-300 ${
                index === selectedIndex
                  ? 'bg-foreground w-6'
                  : 'bg-border hover:bg-muted-foreground'
              }`}
              aria-label={`Go to slide ${index + 1}`}
            />
          ))}
        </div>
      </div>
    </section>
  )
}
