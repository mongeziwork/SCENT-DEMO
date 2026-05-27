'use client'

import { motion } from 'framer-motion'
import Image from 'next/image'
import Link from 'next/link'
import { ArrowRight } from 'lucide-react'

import { ProductPurchasePanel } from '@/components/product-purchase-panel'
import { formatZar } from '@/lib/currency'
import { getPrimaryProductImage } from '@/lib/product-images'

type FeaturedProduct = {
  id: string
  name: string
  slug: string | null
  description: string | null
  price: string | number
  image_url: string | null
  gallery_image_urls?: string[] | null
  category: string | null
  stock?: number | null
  color_options?: string[] | null
  size_options?: string[] | null
}

type FeaturedProductLandingProps = {
  product: FeaturedProduct
}

export function FeaturedProductLanding({ product }: FeaturedProductLandingProps) {
  const productHref = product.slug ? `/shop/${product.slug}` : '/shop'
  const imageSrc = getPrimaryProductImage(product)

  return (
    <section className="relative min-h-screen overflow-hidden bg-background pt-20">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(255,255,255,0.10),transparent_35%),linear-gradient(180deg,transparent,rgba(255,255,255,0.04))]" />

      <div className="relative mx-auto grid min-h-[calc(100vh-5rem)] max-w-7xl grid-cols-1 items-center gap-12 px-6 py-16 lg:grid-cols-[0.95fr_1.05fr] lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 28 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7 }}
          className="order-2 lg:order-1"
        >
          <p className="text-[10px] uppercase tracking-[0.38em] text-muted-foreground">
            New piece / limited focus
          </p>
          <h1 className="mt-5 max-w-2xl text-5xl font-light leading-none tracking-tight text-foreground md:text-7xl">
            {product.name}
          </h1>
          <p className="mt-5 text-xl text-foreground">{formatZar(product.price)}</p>
          <p className="mt-6 max-w-xl text-sm leading-7 text-muted-foreground">
            {product.description ||
              'A focused SCENT drop built around structure, weight, and everyday streetwear utility.'}
          </p>

          <div className="mt-8 flex flex-col gap-3 sm:flex-row">
            <Link
              href={productHref}
              className="group inline-flex items-center justify-center gap-3 bg-foreground px-7 py-4 text-xs font-medium uppercase tracking-[0.28em] text-background transition-opacity hover:opacity-90"
            >
              Shop new piece
              <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
            </Link>
            <Link
              href="/story"
              className="inline-flex items-center justify-center border border-border px-7 py-4 text-xs font-medium uppercase tracking-[0.28em] text-foreground transition-colors hover:border-foreground"
            >
              The story
            </Link>
          </div>

          <div className="mt-6 border border-border bg-card/30 p-4">
            <div className="mb-2 flex items-center justify-between gap-4 text-[10px] uppercase tracking-[0.24em] text-muted-foreground">
              <span>Quick buy</span>
              <span>{(product.stock ?? 0) > 0 ? `In stock (${product.stock})` : 'Out of stock'}</span>
            </div>
            <ProductPurchasePanel product={product} className="mt-0" />
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, scale: 0.96 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8, delay: 0.15 }}
          className="order-1 lg:order-2"
        >
          <Link href={productHref} className="group block">
            <div className="relative aspect-[4/5] overflow-hidden bg-secondary">
              <Image
                src={imageSrc}
                alt={product.name}
                fill
                priority
                sizes="(min-width: 1024px) 52vw, 100vw"
                className="object-contain p-6 transition-transform duration-700 group-hover:scale-[1.03]"
              />
              <div className="absolute inset-x-0 bottom-0 flex items-center justify-between bg-background/70 p-4 backdrop-blur">
                <span className="text-[10px] uppercase tracking-[0.24em] text-muted-foreground">
                  View product
                </span>
                <ArrowRight className="h-4 w-4 text-foreground transition-transform group-hover:translate-x-1" />
              </div>
            </div>
          </Link>
        </motion.div>
      </div>
    </section>
  )
}
