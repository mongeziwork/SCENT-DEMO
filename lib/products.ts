export type ProductCategory = 'hoodies' | 'tops' | 'bottoms' | 'outerwear'

export type Product = {
  id: number
  slug: string
  name: string
  price: number
  category: ProductCategory
  image: string
  description: string
  details: string[]
}

export const categories: Array<'all' | ProductCategory> = [
  'all',
  'hoodies',
  'tops',
  'bottoms',
  'outerwear',
]

export const products: Product[] = [
  {
    id: 1,
    slug: 'noir-hoodie',
    name: 'Noir Hoodie',
    price: 189,
    category: 'hoodies',
    image: '/images/product-1.jpg',
    description: 'Heavyweight fleece hoodie with a clean, minimal silhouette.',
    details: ['480 GSM brushed fleece', 'Double-layer hood', 'Ribbed cuffs and hem'],
  },
  {
    id: 2,
    slug: 'shadow-crewneck',
    name: 'Shadow Crewneck',
    price: 149,
    category: 'tops',
    image: '/images/product-2.jpg',
    description: 'Relaxed crewneck built for everyday layering and long wear.',
    details: ['Midweight cotton blend', 'Dropped shoulders', 'Garment-washed finish'],
  },
  {
    id: 3,
    slug: 'stealth-cargos',
    name: 'Stealth Cargos',
    price: 219,
    category: 'bottoms',
    image: '/images/product-3.jpg',
    description: 'Utility cargos with a tapered leg and subtle pocketing.',
    details: ['Cotton ripstop', 'Articulated knees', 'Adjustable cuffs'],
  },
  {
    id: 4,
    slug: 'essential-tee',
    name: 'Essential Tee',
    price: 79,
    category: 'tops',
    image: '/images/product-4.jpg',
    description: 'Premium tee with a structured drape and soft hand-feel.',
    details: ['220 GSM cotton', 'Reinforced collar', 'Boxy fit'],
  },
  {
    id: 5,
    slug: 'onyx-bomber',
    name: 'Onyx Bomber',
    price: 299,
    category: 'outerwear',
    image: '/images/product-5.jpg',
    description: 'Modern bomber jacket with a matte finish and clean hardware.',
    details: ['Water-resistant shell', 'Quilted lining', 'Two-way zip'],
  },
  {
    id: 6,
    slug: 'forest-hoodie',
    name: 'Forest Hoodie',
    price: 189,
    category: 'hoodies',
    image: '/images/product-6.jpg',
    description: 'A deep-toned hoodie with a soft interior and refined fit.',
    details: ['Brushed interior', 'Hidden side pockets', 'Pre-shrunk fabric'],
  },
]

export function getProductBySlug(slug: string): Product | undefined {
  return products.find((p) => p.slug === slug)
}

