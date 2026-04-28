import type { Metadata } from 'next'
import Image from 'next/image'
import Link from 'next/link'
import { notFound } from 'next/navigation'

import { createSupabaseServerClient } from '@/lib/supabase/server'
import { ProductPurchasePanel } from '@/components/product-purchase-panel'

export const dynamic = 'force-dynamic'
export const revalidate = 0

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
    .select(
      'id,name,slug,description,price,image_url,category,is_active,stock,color_options,size_options',
    )
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

              <div className="mt-6 flex items-center justify-between gap-4 border-y border-border py-4">
                <div className="text-xs tracking-widest uppercase text-muted-foreground">
                  Availability
                </div>
                <div className="text-sm text-foreground">
                  {(product.stock ?? 0) > 0 ? (
                    <>
                      In stock <span className="text-muted-foreground">({product.stock})</span>
                    </>
                  ) : (
                    <span className="text-muted-foreground">Out of stock</span>
                  )}
                </div>
              </div>

              {product.description && (
                <p className="mt-8 text-muted-foreground leading-relaxed">{product.description}</p>
              )}

              <ProductPurchasePanel product={product} />

              <div className="mt-4">
                <Link
                  href="/shop"
                  className="block w-full py-4 border border-border text-foreground text-xs tracking-widest uppercase font-medium text-center hover:border-foreground transition-colors"
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

