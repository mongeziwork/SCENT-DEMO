import type { Metadata } from 'next'
import Image from 'next/image'
import Link from 'next/link'

export const metadata: Metadata = {
  title: 'About',
  description:
    'About SCENT — atmosphere, memory, identity, and presence stitched into fabric.',
  alternates: {
    canonical: '/about',
  },
}

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-background pt-20">
      <section className="relative overflow-hidden">
        <div className="absolute inset-0">
          <Image
            src="/images/endurance-hero.jpg"
            alt="About SCENT"
            fill
            priority
            className="object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-background/75 via-background/45 to-background" />
        </div>

        <div className="relative mx-auto max-w-7xl px-6 lg:px-8 py-16 md:py-24">
          <div className="max-w-3xl">
            <p className="text-[10px] tracking-[0.34em] uppercase text-muted-foreground">
              About
            </p>
            <h1 className="mt-4 text-2xl md:text-4xl font-light tracking-tight text-foreground leading-[1.05]">
              Scent is more than clothing.
            </h1>
            <div className="mt-5 space-y-4 text-sm md:text-base text-muted-foreground leading-relaxed max-w-2xl">
              <p>
                It’s atmosphere, memory, identity, and presence stitched into fabric.
              </p>
              <p>
                Built from the idea that people remember how you made them feel, Scent exists to
                create pieces that carry emotion, confidence, and energy into everyday life. Every
                garment is designed with intention — clean silhouettes, elevated essentials, and
                visuals that feel timeless instead of temporary.
              </p>
              <p>
                We believe fashion should move like a feeling: subtle but unforgettable.
              </p>
            </div>

            <div className="mt-8 flex flex-col sm:flex-row gap-4">
              <Link
                href="/shop"
                className="inline-flex items-center justify-center px-7 py-3 bg-foreground text-background text-xs tracking-[0.28em] uppercase font-medium hover:opacity-90 transition-opacity"
              >
                Shop
              </Link>
              <Link
                href="/contact"
                className="inline-flex items-center justify-center px-7 py-3 border border-foreground/30 text-foreground text-xs tracking-[0.28em] uppercase font-medium hover:border-foreground transition-colors"
              >
                Contact
              </Link>
            </div>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-6 lg:px-8 py-14 md:py-20">
        <div className="grid gap-10 lg:grid-cols-12">
          <div className="lg:col-span-7">
            <h2 className="text-xs tracking-[0.3em] uppercase text-muted-foreground">Our belief</h2>
            <div className="mt-4 space-y-4 text-sm md:text-base text-muted-foreground leading-relaxed max-w-2xl">
              <p>
                Scent was created for people building their own world. The late nights. The quiet
                ambition. The creatives, outsiders, dreamers, and individuals who understand that
                style is more than appearance — it’s language without words.
              </p>
              <p>
                Our approach blends minimalism with meaning: quality fabrics, refined design, and
                storytelling rooted in culture, mood, and self-expression.
              </p>
              <p>This is not fast fashion. This is identity in motion.</p>
              <p>
                Every collection is designed to feel like a moment — something you wear long after
                the trend disappears.
              </p>
              <p>Scent isn’t about being loud. It’s about leaving an impression.</p>
            </div>

            <div className="mt-10 flex flex-col sm:flex-row gap-3">
              <Link
                href="/shop"
                className="inline-flex items-center justify-center px-7 py-3 border border-foreground/30 text-foreground text-xs tracking-[0.28em] uppercase font-medium hover:border-foreground transition-colors"
              >
                New arrivals
              </Link>
              <Link
                href="/story"
                className="inline-flex items-center justify-center px-7 py-3 border border-foreground/30 text-foreground text-xs tracking-[0.28em] uppercase font-medium hover:border-foreground transition-colors"
              >
                Behind the scenes
              </Link>
            </div>
          </div>

          <div className="lg:col-span-5">
            <div className="space-y-6">
              <div className="border border-border bg-card/20 p-6">
                <h3 className="text-xs tracking-[0.3em] uppercase text-muted-foreground">
                  Helpful links
                </h3>
                <div className="mt-4 flex flex-col gap-3">
                  <Link
                    href="/shipping"
                    className="text-sm text-muted-foreground hover:text-foreground transition-colors"
                  >
                    Shipping information →
                  </Link>
                  <Link
                    href="/returns"
                    className="text-sm text-muted-foreground hover:text-foreground transition-colors"
                  >
                    Returns policy →
                  </Link>
                  <Link
                    href="/privacy-policy"
                    className="text-sm text-muted-foreground hover:text-foreground transition-colors"
                  >
                    Privacy policy →
                  </Link>
                  <Link
                    href="/contact"
                    className="text-sm text-muted-foreground hover:text-foreground transition-colors"
                  >
                    Contact →
                  </Link>
                </div>
              </div>

              <div className="relative aspect-[4/5] overflow-hidden border border-border bg-secondary">
                <Image
                  src="/images/endurance-hero.jpg"
                  alt="SCENT studio frame"
                  fill
                  className="object-cover"
                />
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}

