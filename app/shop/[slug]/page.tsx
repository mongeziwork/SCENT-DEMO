import type { Metadata } from 'next'
import Image from 'next/image'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { ShoppingBag } from 'lucide-react'

import { getProductBySlug, products } from '@/lib/products'

type PageProps = {
  params: Promise<{ slug: string }>
}

export function generateStaticParams() {
  return products.map((p) => ({ slug: p.slug }))
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params
  const product = getProductBySlug(slug)

  if (!product) {
    return {
      title: 'Product not found | SCENT',
    }
  }

  return {
    title: `${product.name} | SCENT`,
    description: product.description,
  }
}

export default async function ProductPage({ params }: PageProps) {
  const { slug } = await params
  const product = getProductBySlug(slug)

  if (!product) notFound()

  return (
    <div className="min-h-screen bg-background pt-20">
      <section className="py-12 md:py-20">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <div className="mb-10 flex items-center justify-between">
            <Link
              href="/shop"
              className="text-xs tracking-widest uppercase text-muted-foreground hover:text-foreground transition-colors"
            >
              Back to shop
            </Link>
            <p className="text-xs tracking-widest uppercase text-muted-foreground">{product.category}</p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-16">
            <div className="relative aspect-[3/4] overflow-hidden bg-secondary">
              <Image
                src={product.image}
                alt={product.name}
                fill
                className="object-cover"
                priority
              />
            </div>

            <div className="flex flex-col">
              <h1 className="text-4xl md:text-5xl font-light tracking-tight text-foreground">
                {product.name}
              </h1>
              <p className="mt-4 text-lg text-foreground">${product.price}</p>

              <p className="mt-8 text-muted-foreground leading-relaxed">{product.description}</p>

              <div className="mt-8">
                <h2 className="text-xs tracking-widest uppercase text-foreground">Details</h2>
                <ul className="mt-4 space-y-2 text-sm text-muted-foreground">
                  {product.details.map((d) => (
                    <li key={d} className="flex gap-3">
                      <span className="mt-2 h-1 w-1 rounded-full bg-muted-foreground" />
                      <span>{d}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="mt-10 flex flex-col sm:flex-row gap-4">
                <button className="flex-1 py-4 bg-foreground text-background text-xs tracking-widest uppercase font-medium flex items-center justify-center gap-2">
                  <ShoppingBag className="h-4 w-4" />
                  Add to Bag
                </button>
                <Link
                  href="/shop"
                  className="flex-1 py-4 border border-border text-foreground text-xs tracking-widest uppercase font-medium flex items-center justify-center hover:border-foreground transition-colors"
                >
                  Continue Shopping
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}

