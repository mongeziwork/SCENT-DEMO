import type { Metadata } from 'next'
import Image from 'next/image'
import Link from 'next/link'

import { ProductCampaignPage } from '@/components/product-campaign/product-campaign-page'
import { createSupabaseServerClient } from '@/lib/supabase/server'

export const metadata: Metadata = {
  title: 'The Story',
  description:
    'Behind the scenes at SCENT — the inspiration, craft, and process behind our latest drops.',
  alternates: {
    canonical: '/story',
  },
}

export const dynamic = 'force-dynamic'
export const revalidate = 0

export default async function StoryPage() {
  const supabase = createSupabaseServerClient()
  const { data: products } = await supabase
    .from('products')
    .select(
      'id,name,slug,description,price,image_url,gallery_image_urls,category,is_active,stock,color_options,size_options',
    )
    .eq('is_active', true)
    .order('updated_at', { ascending: false })
    .limit(1)

  const featuredProduct = products?.[0] ?? null

  if (featuredProduct) {
    return <ProductCampaignPage product={featuredProduct} />
  }

  return (
    <div className="min-h-screen bg-background pt-20">
      <section className="relative overflow-hidden">
        <div className="absolute inset-0">
          <Image
            src="/images/endurance-hero.jpg"
            alt="Behind the scenes at SCENT"
            fill
            priority
            className="object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-background/70 via-background/45 to-background" />
        </div>

        <div className="relative mx-auto max-w-7xl px-6 lg:px-8 py-16 md:py-24">
          <div className="max-w-3xl">
            <p className="text-[10px] tracking-[0.34em] uppercase text-muted-foreground">
              Behind the scenes
            </p>
            <h1 className="mt-4 text-2xl md:text-4xl font-light tracking-tight text-foreground leading-[1.05]">
              The story behind our latest arrivals
            </h1>
            <p className="mt-5 text-sm md:text-base text-muted-foreground leading-relaxed max-w-2xl">
              Use this page to share the inspiration, the process, and the people behind the drop.
              Keep it short, honest, and visual—like a premium lookbook.
            </p>

            <div className="mt-8 flex flex-col sm:flex-row gap-4">
              <Link
                href="/shop"
                className="inline-flex items-center justify-center px-7 py-3 border border-foreground/30 text-foreground text-xs tracking-[0.28em] uppercase font-medium hover:border-foreground transition-colors"
              >
                New Arrivals
              </Link>
              <a
                href="#read"
                className="inline-flex items-center justify-center px-7 py-3 border border-foreground/30 text-foreground text-xs tracking-[0.28em] uppercase font-medium hover:border-foreground transition-colors"
              >
                Read the story
              </a>
            </div>
          </div>
        </div>
      </section>

      <section id="read" className="mx-auto max-w-7xl px-6 lg:px-8 py-14 md:py-20">
        <div className="grid gap-10 lg:grid-cols-12">
          <div className="lg:col-span-7">
            <h2 className="text-xs tracking-[0.3em] uppercase text-muted-foreground">
              The concept
            </h2>
            <p className="mt-4 text-base md:text-lg text-foreground leading-relaxed">
              <span className="text-muted-foreground">
                Replace this copy with your real story.
              </span>{' '}
              What does this collection represent? What details matter? What feeling should it leave
              the customer with?
            </p>

            <div className="mt-8 space-y-4 text-sm md:text-base text-muted-foreground leading-relaxed">
              <p>
                <strong className="text-foreground font-medium">Inspiration:</strong> Where the
                idea came from (music, city, sport, film, a moment).
              </p>
              <p>
                <strong className="text-foreground font-medium">Materials:</strong> What you
                chose and why (weight, wash, comfort, durability).
              </p>
              <p>
                <strong className="text-foreground font-medium">Fit & finish:</strong> The
                details that make it premium (stitching, trims, graphics, labels).
              </p>
            </div>

            <blockquote className="mt-10 border-l border-border pl-6 text-sm md:text-base text-foreground/90">
              “Add a short quote here—something that sets the tone for the drop.”
              <span className="block mt-3 text-xs tracking-widest uppercase text-muted-foreground">
                — SCENT Studio
              </span>
            </blockquote>
          </div>

          <div className="lg:col-span-5">
            <div className="space-y-6">
              <div className="border border-border bg-card/20 p-6">
                <h3 className="text-xs tracking-[0.3em] uppercase text-muted-foreground">
                  Quick details
                </h3>
                <ul className="mt-4 space-y-2 text-sm text-muted-foreground">
                  <li>
                    <span className="text-foreground/90">Drop:</span> New Arrivals
                  </li>
                  <li>
                    <span className="text-foreground/90">Delivery:</span> South Africa
                  </li>
                  <li>
                    <span className="text-foreground/90">Returns:</span> 30 days
                  </li>
                </ul>
              </div>

              <div className="relative aspect-[4/5] overflow-hidden border border-border bg-secondary">
                <Image
                  src="/images/endurance-hero.jpg"
                  alt="SCENT lookbook frame"
                  fill
                  className="object-cover"
                />
              </div>
            </div>
          </div>
        </div>

        <div className="mt-16 flex flex-col sm:flex-row gap-4">
          <Link
            href="/shop"
            className="inline-flex items-center justify-center px-7 py-3 bg-foreground text-background text-xs tracking-[0.28em] uppercase font-medium hover:opacity-90 transition-opacity"
          >
            Shop now
          </Link>
          <Link
            href="/contact"
            className="inline-flex items-center justify-center px-7 py-3 border border-foreground/30 text-foreground text-xs tracking-[0.28em] uppercase font-medium hover:border-foreground transition-colors"
          >
            Contact
          </Link>
        </div>
      </section>
    </div>
  )
}

