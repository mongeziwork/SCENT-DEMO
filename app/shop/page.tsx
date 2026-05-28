'use client'

import { useEffect, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import Image from 'next/image'
import Link from 'next/link'
import { ShoppingBag } from 'lucide-react'

import { createSupabaseBrowserClient } from '@/lib/supabase/browser'
import { formatZar } from '@/lib/currency'

type ProductRow = {
  id: string
  name: string
  slug: string | null
  description: string | null
  price: string | number
  image_url: string | null
  category: string | null
  is_active: boolean | null
}

export default function ShopPage() {
  const [supabase, setSupabase] = useState<ReturnType<typeof createSupabaseBrowserClient> | null>(null)
  const [activeCategory, setActiveCategory] = useState('all')
  const [products, setProducts] = useState<ProductRow[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    setSupabase(createSupabaseBrowserClient())
  }, [])

  useEffect(() => {
    if (!supabase) return
    let cancelled = false
    async function run() {
      setLoading(true)
      const { data, error } = await supabase
        .from('products')
        .select('id,name,slug,description,price,image_url,category,is_active')
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

  const categories = (() => {
    const set = new Set<string>()
    for (const p of products) {
      if (p.category) set.add(p.category)
    }
    return ['all', ...Array.from(set).sort()]
  })()

  const filteredProducts =
    activeCategory === 'all'
      ? products
      : products.filter((p) => (p.category ?? '') === activeCategory)

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

          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 md:gap-6 mb-12">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.2 }}
              className="-mx-6 w-[calc(100%+3rem)] overflow-x-auto px-6 pb-2 md:mx-0 md:w-auto md:px-0 md:pb-0"
            >
              <div className="flex min-w-max items-center gap-2 md:gap-8">
                {categories.map((category) => (
                  <button
                    key={category}
                    onClick={() => setActiveCategory(category)}
                    className={`whitespace-nowrap rounded-full border px-3 py-2 text-[10px] uppercase tracking-[0.22em] transition-colors duration-300 md:border-0 md:px-0 md:py-0 md:text-sm md:tracking-widest ${
                      activeCategory === category
                        ? 'border-foreground bg-foreground text-background md:bg-transparent md:text-foreground'
                        : 'border-border text-muted-foreground hover:border-foreground hover:text-foreground'
                    }`}
                  >
                    {category}
                  </button>
                ))}
              </div>
            </motion.div>

            <motion.span
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.3 }}
              className="text-sm text-muted-foreground md:text-right"
            >
              {loading ? 'Loading…' : `${filteredProducts.length} products`}
            </motion.span>
          </div>

          <motion.div
            layout
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8"
          >
            <AnimatePresence mode="popLayout">
              {filteredProducts.map((product, index) => (
                <motion.div
                  key={product.id}
                  layout
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  transition={{ duration: 0.4, delay: index * 0.05 }}
                  className="group"
                >
                  <Link href={product.slug ? `/shop/${product.slug}` : '/shop'} className="block">
                    <div className="relative aspect-[3/4] overflow-hidden bg-white">
                      <Image
                        src={product.image_url ?? '/images/product-1.jpg'}
                        alt={product.name}
                        fill
                        className="object-contain transition-transform duration-700 group-hover:scale-105"
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
              ))}
            </AnimatePresence>
          </motion.div>
        </div>
      </section>
    </div>
  )
}
