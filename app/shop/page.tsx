'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import Image from 'next/image'
import { ShoppingBag, Filter, X } from 'lucide-react'

const products = [
  { id: 1, name: 'Noir Hoodie', price: 189, category: 'hoodies', image: '/images/product-1.jpg' },
  { id: 2, name: 'Shadow Crewneck', price: 149, category: 'tops', image: '/images/product-2.jpg' },
  { id: 3, name: 'Stealth Cargos', price: 219, category: 'bottoms', image: '/images/product-3.jpg' },
  { id: 4, name: 'Essential Tee', price: 79, category: 'tops', image: '/images/product-4.jpg' },
  { id: 5, name: 'Onyx Bomber', price: 299, category: 'outerwear', image: '/images/product-5.jpg' },
  { id: 6, name: 'Forest Hoodie', price: 189, category: 'hoodies', image: '/images/product-6.jpg' },
]

const categories = ['all', 'hoodies', 'tops', 'bottoms', 'outerwear']

export default function ShopPage() {
  const [activeCategory, setActiveCategory] = useState('all')
  const [showFilters, setShowFilters] = useState(false)

  const filteredProducts =
    activeCategory === 'all'
      ? products
      : products.filter((p) => p.category === activeCategory)

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
              {categories.map((category) => (
                <button
                  key={category}
                  onClick={() => setActiveCategory(category)}
                  className={`text-sm tracking-widest uppercase transition-colors duration-300 ${
                    activeCategory === category
                      ? 'text-foreground'
                      : 'text-muted-foreground hover:text-foreground'
                  }`}
                >
                  {category}
                </button>
              ))}
            </motion.div>

            <button
              onClick={() => setShowFilters(!showFilters)}
              className="flex md:hidden items-center gap-2 text-sm tracking-widest uppercase text-foreground"
            >
              <Filter className="h-4 w-4" />
              Filter
            </button>

            <motion.span
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.3 }}
              className="text-sm text-muted-foreground"
            >
              {filteredProducts.length} products
            </motion.span>
          </div>

          <AnimatePresence>
            {showFilters && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                className="md:hidden mb-8 overflow-hidden"
              >
                <div className="flex flex-wrap gap-3 pb-4 border-b border-border">
                  {categories.map((category) => (
                    <button
                      key={category}
                      onClick={() => {
                        setActiveCategory(category)
                        setShowFilters(false)
                      }}
                      className={`px-4 py-2 text-xs tracking-widest uppercase border transition-colors ${
                        activeCategory === category
                          ? 'bg-foreground text-background border-foreground'
                          : 'border-border text-foreground hover:border-foreground'
                      }`}
                    >
                      {category}
                    </button>
                  ))}
                </div>
              </motion.div>
            )}
          </AnimatePresence>

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
                  <div className="relative aspect-[3/4] overflow-hidden bg-secondary">
                    <Image
                      src={product.image}
                      alt={product.name}
                      fill
                      className="object-cover transition-transform duration-700 group-hover:scale-105"
                    />
                    <div className="absolute inset-0 bg-background/0 group-hover:bg-background/20 transition-colors duration-300" />

                    <motion.div
                      initial={{ opacity: 0, y: 20 }}
                      whileHover={{ opacity: 1, y: 0 }}
                      className="absolute bottom-0 left-0 right-0 p-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                    >
                      <motion.button
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        className="w-full py-4 bg-foreground text-background text-xs tracking-widest uppercase font-medium flex items-center justify-center gap-2"
                      >
                        <ShoppingBag className="h-4 w-4" />
                        Add to Bag
                      </motion.button>
                    </motion.div>
                  </div>

                  <div className="mt-4 flex justify-between items-start">
                    <div>
                      <h3 className="text-sm font-medium text-foreground tracking-wide">
                        {product.name}
                      </h3>
                      <p className="mt-1 text-xs text-muted-foreground uppercase tracking-wider">
                        {product.category}
                      </p>
                    </div>
                    <p className="text-sm text-foreground">${product.price}</p>
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
