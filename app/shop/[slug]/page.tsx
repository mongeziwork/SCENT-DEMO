import type { Metadata } from 'next'
import Image from 'next/image'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { ShoppingBag } from 'lucide-react'

import { createSupabaseServerClient } from '@/lib/supabase/server'

type PageProps = {
  params: Promise<{ slug: string }>
}

export async function generateStaticParams() {
  const supabase = createSupabaseServerClient()
  const { data } = await supabase.from('products').select('slug').eq('is_active', true)
  return (data ?? [])
    .map((r) => ({ slug: r.slug as string | null }))
    .filter((r): r is { slug: string } => Boolean(r.slug))
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params
  const supabase = createSupabaseServerClient()
  const { data: product } = await supabase
    .from('products')
    .select('name,description')
    .eq('slug', slug)
    .eq('is_active', true)
    .maybeSingle()

  if (!product) {
    return {
      title: 'Product not found | SCENT',
    }
  }

  return {
    title: `${product.name} | SCENT`,
    description: product.description ?? undefined,
  }
}

export default async function ProductPage({ params }: PageProps) {
  const { slug } = await params
  const supabase = createSupabaseServerClient()
  const { data: product } = await supabase
    .from('products')
    .select('name,slug,description,price,image_url,category,is_active')
    .eq('slug', slug)
    .eq('is_active', true)
    .maybeSingle()

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
            <p className="text-xs tracking-widest uppercase text-muted-foreground">
              {product.category ?? '—'}
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-16">
            <div className="relative aspect-[3/4] overflow-hidden bg-secondary">
              <Image
                src={product.image_url ?? '/images/product-1.jpg'}
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

              {product.description && (
                <p className="mt-8 text-muted-foreground leading-relaxed">{product.description}</p>
              )}

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

