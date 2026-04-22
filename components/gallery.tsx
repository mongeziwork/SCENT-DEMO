'use client'

import { motion } from 'framer-motion'
import Image from 'next/image'

const galleryImages = [
  { src: '/images/gallery-1.jpg', alt: 'Streetwear editorial', span: 'md:col-span-2 md:row-span-2' },
  { src: '/images/gallery-2.jpg', alt: 'Studio portrait', span: '' },
  { src: '/images/gallery-3.jpg', alt: 'Product detail', span: '' },
]

export function Gallery() {
  return (
    <section className="py-24 md:py-32 bg-card">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <span className="text-xs tracking-[0.3em] uppercase text-muted-foreground">
            Lookbook
          </span>
          <h2 className="mt-2 text-4xl md:text-5xl font-light tracking-tight text-foreground">
            The Vision
          </h2>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-6">
          {galleryImages.map((image, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              className={`relative overflow-hidden group ${image.span}`}
            >
              <div className={`relative ${index === 0 ? 'aspect-square' : 'aspect-[4/5]'} w-full`}>
                <Image
                  src={image.src}
                  alt={image.alt}
                  fill
                  className="object-cover transition-transform duration-700 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-background/0 group-hover:bg-background/10 transition-colors duration-500" />
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}
