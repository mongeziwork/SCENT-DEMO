import type { Metadata } from 'next'
import Image from 'next/image'
import Link from 'next/link'

export const metadata: Metadata = {
  title: 'About',
  description:
    'About SCENT — the story behind the Endurance Collection, built around resilience, growth, and becoming the best versions of ourselves.',
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
              Built for endurance.
            </h1>
            <div className="mt-5 space-y-4 text-sm md:text-base text-muted-foreground leading-relaxed max-w-2xl">
              <p>
                SCENT is about the pressure we carry quietly and the strength we build while nobody is watching.
              </p>
              <p>
                The Endurance Collection was created for the people still moving through the late nights,
                the setbacks, the discipline, and the silent work it takes to become better.
              </p>
              <p>
                We aim to create the best clothes while becoming the best versions of ourselves.
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
            <h2 className="text-xs tracking-[0.3em] uppercase text-muted-foreground">The Endurance story</h2>
            <div className="mt-4 space-y-4 text-sm md:text-base text-muted-foreground leading-relaxed max-w-2xl">
              <p>
                Endurance is not only about how long you can last. It is about how you carry yourself
                when life demands patience, discipline, and belief. That feeling sits at the center of
                SCENT.
              </p>
              <p>
                We design for people who are still building: students, creators, workers, dreamers, and
                anyone trying to turn pressure into purpose. The clothes are made to feel strong,
                comfortable, and intentional because the person wearing them is becoming stronger too.
              </p>
              <p>
                The Endurance Collection carries that mindset through utility details, bold graphics,
                and silhouettes that feel grounded. It is not about pretending the journey is easy. It
                is about showing up anyway.
              </p>
              <p>
                Our goal is simple: keep improving the quality of the garments, keep sharpening the
                story, and keep growing into the best versions of ourselves alongside the people who
                wear SCENT.
              </p>
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
                Endurance story
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

