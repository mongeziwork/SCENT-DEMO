'use client'

import { useEffect, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import Image from 'next/image'
import Link from 'next/link'
import { ShoppingBag } from 'lucide-react'

import { createSupabaseBrowserClient } from '@/lib/supabase/browser'
import { formatZar } from '@/lib/currency'
import { getPrimaryProductImage } from '@/lib/product-images'

type ProductRow = {
  id: string
  name: string
  slug: string | null
  description: string | null
  price: string | number
  image_url: string | null
  gallery_image_urls: string[] | null
  category: string | null
  is_active: boolean | null
}

const shopCategories = [
  { label: 'Latest Drops', value: 'latest-drops' },
  { label: 'Accessories', value: 'accessories' },
  { label: 'Men', value: 'men' },
  { label: 'Women', value: 'women' },
  { label: 'Homeware', value: 'homeware' },
]

export default function ShopPage() {
  const [supabase, setSupabase] = useState<ReturnType<typeof createSupabaseBrowserClient> | null>(null)
  const [activeCategory, setActiveCategory] = useState('latest-drops')
  const [products, setProducts] = useState<ProductRow[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    setSupabase(createSupabaseBrowserClient())
  }, [])

  useEffect(() => {
    if (!supabase) return
    const client = supabase
    let cancelled = false
    async function run() {
      setLoading(true)
      const { data, error } = await client
        .from('products')
        .select('id,name,slug,description,price,image_url,gallery_image_urls,category,is_active')
        .eq('is_active', true)
        .order('updated_at', { ascending: false })

      if (cancelled) return
      if (error) {
        setProducts([])
      } else {
        setProducts((data ?? []) as ProductRow[])
      }
      setLoading(false)
    }
    void run()
    return () => {
      cancelled = true
    }
  }, [supabase])

  const filteredProducts =
    activeCategory === 'latest-drops'
      ? products
      : activeCategory === 'men'
        ? products.filter((p) => !['accessories', 'women', 'homeware'].includes((p.category ?? '').toLowerCase()))
        : products.filter((p) => (p.category ?? '').toLowerCase() === activeCategory)

  return (
    <div className="min-h-screen bg-background pt-20">
      <section className="py-16 md:py-24">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center mb-16"
          >
            <h1 className="text-4xl md:text-6xl font-light tracking-tight text-foreground">
              Shop
            </h1>
            <p className="mt-4 text-muted-foreground max-w-md mx-auto">
              Explore our curated collection of premium menswear
            </p>
          </motion.div>

          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 mb-12">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.2 }}
              className="hidden md:flex gap-8"
            >
              {shopCategories.map((category) => (
                <button
                  key={category.value}
                  onClick={() => setActiveCategory(category.value)}
                  className={`text-sm tracking-widest uppercase transition-colors duration-300 ${
                    activeCategory === category.value
                      ? 'text-foreground'
                      : 'text-muted-foreground hover:text-foreground'
                  }`}
                >
                  {category.label}
                </button>
              ))}
            </motion.div>

            <div className="-mx-6 grid w-[calc(100%+3rem)] grid-cols-3 gap-2 px-6 pb-2 md:hidden">
              {shopCategories.map((category) => (
                <button
                  key={category.value}
                  onClick={() => setActiveCategory(category.value)}
                  className={`border px-2 py-1.5 text-[10px] uppercase tracking-[0.14em] transition-colors ${
                    activeCategory === category.value
                      ? 'border-foreground bg-foreground text-background'
                      : 'border-border text-foreground'
                  }`}
                >
                  {category.label}
                </button>
              ))}
            </div>

            <motion.span
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.3 }}
              className="text-sm text-muted-foreground"
            >
              {loading ? 'Loading…' : `${filteredProducts.length} products`}
            </motion.span>
          </div>

          <motion.div
            layout
            className="-mx-6 flex snap-x snap-mandatory gap-5 overflow-x-auto px-6 pb-8 sm:mx-0 sm:grid sm:grid-cols-2 sm:gap-6 sm:overflow-visible sm:px-0 sm:pb-0 lg:grid-cols-3 md:gap-8"
          >
            <AnimatePresence mode="popLayout">
              {filteredProducts.map((product, index) => {
                const imageSrc = getPrimaryProductImage(product)

                return (
                  <motion.div
                    key={product.id}
                    layout
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.9 }}
                    transition={{ duration: 0.4, delay: index * 0.05 }}
                    className="group min-w-[78vw] snap-start sm:min-w-0"
                  >
                    <Link href={product.slug ? `/shop/${product.slug}` : '/shop'} className="block">
                      <div className="relative aspect-[3/4] overflow-hidden bg-secondary">
                        <Image
                          src={imageSrc}
                          alt={product.name}
                          fill
                          sizes="(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"
                          className="object-contain p-3 transition-transform duration-700 group-hover:scale-105"
                        />
                        <div className="absolute inset-0 bg-background/0 group-hover:bg-background/20 transition-colors duration-300" />

                        <motion.div
                          initial={{ opacity: 0, y: 20 }}
                          whileHover={{ opacity: 1, y: 0 }}
                          className="absolute bottom-0 left-0 right-0 p-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                        >
                          <motion.button
                            type="button"
                            onClick={(e) => e.preventDefault()}
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                            className="w-full py-4 bg-foreground text-background text-xs tracking-widest uppercase font-medium flex items-center justify-center gap-2"
                          >
                            <ShoppingBag className="h-4 w-4" />
                            Add to Bag
                          </motion.button>
                        </motion.div>
                      </div>
                    </Link>

                    <div className="mt-4 flex justify-between items-start">
                      <div>
                        <Link
                          href={product.slug ? `/shop/${product.slug}` : '/shop'}
                          className="inline-block"
                        >
                          <h3 className="text-sm font-medium text-foreground tracking-wide">
                            {product.name}
                          </h3>
                        </Link>
                        <p className="mt-1 text-xs text-muted-foreground uppercase tracking-wider">
                          {product.category ?? '—'}
                        </p>
                      </div>
                      <p className="text-sm text-foreground">{formatZar(product.price)}</p>
                    </div>
                  </motion.div>
                )
              })}
            </AnimatePresence>
          </motion.div>
        </div>
      </section>
    </div>
  )
}
