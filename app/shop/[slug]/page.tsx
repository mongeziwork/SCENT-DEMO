import type { Metadata } from 'next'
import Image from 'next/image'
import Link from 'next/link'
import { notFound } from 'next/navigation'

import { createSupabaseServerClient } from '@/lib/supabase/server'
import { ProductPurchasePanel } from '@/components/product-purchase-panel'
import { formatZar } from '@/lib/currency'
import { getProductImageUrls, toAbsoluteImageUrl } from '@/lib/product-images'
import { getCanonicalSiteOrigin } from '@/lib/site'

export const dynamic = 'force-dynamic'
export const revalidate = 0

type PageProps = {
  params: Promise<{ slug: string }>
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params
  const siteUrl = getCanonicalSiteOrigin()

  const supabase = createSupabaseServerClient()
  const { data: product } = await supabase
    .from('products')
    .select('name,description,image_url,gallery_image_urls,slug,category,updated_at,created_at')
    .eq('slug', slug)
    .maybeSingle()

  if (!product) {
    return { title: 'Product' }
  }

  const title = product.name
  const description =
    product.description?.slice(0, 180) ||
    `Shop ${product.name} from SCENT. Premium menswear crafted for the modern youth.`
  const url = `${siteUrl}/shop/${product.slug ?? slug}`
  const imageUrls = getProductImageUrls(product).map((imageUrl) => toAbsoluteImageUrl(imageUrl, siteUrl))
  const imageUrl = imageUrls[0] ?? `${siteUrl}/brand/logo-white.png`

  return {
    title,
    description,
    alternates: { canonical: url },
    openGraph: {
      type: 'product',
      url,
      title,
      description,
      images: [{ url: imageUrl, alt: product.name }],
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      images: [imageUrl],
    },
  }
}

export default async function ProductPage({ params }: PageProps) {
  const { slug } = await params
  const supabase = createSupabaseServerClient()
  const { data: product } = await supabase
    .from('products')
    .select(
      'id,name,slug,description,price,image_url,gallery_image_urls,category,is_active,stock,color_options,size_options',
    )
    .eq('slug', slug)
    .eq('is_active', true)
    .maybeSingle()

  if (!product) notFound()

  const siteUrl = getCanonicalSiteOrigin()
  const productUrl = `${siteUrl}/shop/${product.slug ?? slug}`
  const productImages = getProductImageUrls(product)
  const galleryImages = productImages.length > 0 ? productImages : ['/images/product-1.jpg']
  const productImageUrls = galleryImages.map((imageUrl) => toAbsoluteImageUrl(imageUrl, siteUrl))

  return (
    <div className="min-h-screen bg-background pt-20">
      <script
        type="application/ld+json"
        // eslint-disable-next-line react/no-danger
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            '@context': 'https://schema.org',
            '@type': 'Product',
            name: product.name,
            description: product.description ?? undefined,
            image: productImageUrls,
            sku: product.id,
            url: productUrl,
            brand: { '@type': 'Brand', name: 'SCENT' },
            offers: {
              '@type': 'Offer',
              priceCurrency: 'ZAR',
              price: Number(product.price),
              availability:
                (product.stock ?? 0) > 0 ? 'https://schema.org/InStock' : 'https://schema.org/OutOfStock',
              url: productUrl,
            },
          }),
        }}
      />
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
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              {galleryImages.map((imageUrl, index) => (
                <div key={`${imageUrl}-${index}`} className="relative aspect-[3/4] overflow-hidden bg-secondary">
                  <Image
                    src={imageUrl}
                    alt={`${product.name} image ${index + 1}`}
                    fill
                    sizes="(min-width: 1024px) 25vw, (min-width: 640px) 50vw, 100vw"
                    className="object-contain p-4"
                    priority={index === 0}
                  />
                </div>
              ))}
            </div>

            <div className="flex flex-col lg:sticky lg:top-28 lg:self-start">
              <h1 className="text-4xl md:text-5xl font-light tracking-tight text-foreground">
                {product.name}
              </h1>
              <p className="mt-4 text-lg text-foreground">{formatZar(product.price)}</p>

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

