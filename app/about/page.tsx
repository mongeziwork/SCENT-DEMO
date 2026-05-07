import type { Metadata } from 'next'
import Image from 'next/image'
import Link from 'next/link'

export const metadata: Metadata = {
  title: 'About',
  description:
    'About SCENT — premium menswear crafted for the modern youth. Our story, our process, and what we stand for.',
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
              SCENT is built for the modern youth
            </h1>
            <p className="mt-5 text-sm md:text-base text-muted-foreground leading-relaxed max-w-2xl">
              This page is your brand foundation—what SCENT stands for, what makes your product
              premium, and the feeling customers should expect every time they wear it.
            </p>

            <div className="mt-8 flex flex-col sm:flex-row gap-4">
              <Link
                href="/shop"
                className="inline-flex items-center justify-center px-7 py-3 bg-foreground text-background text-xs tracking-[0.28em] uppercase font-medium hover:opacity-90 transition-opacity"
              >
                Shop
              </Link>
              <Link
                href="/story"
                className="inline-flex items-center justify-center px-7 py-3 border border-foreground/30 text-foreground text-xs tracking-[0.28em] uppercase font-medium hover:border-foreground transition-colors"
              >
                The story
              </Link>
            </div>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-6 lg:px-8 py-14 md:py-20">
        <div className="grid gap-10 lg:grid-cols-12">
          <div className="lg:col-span-7">
            <h2 className="text-xs tracking-[0.3em] uppercase text-muted-foreground">
              What we stand for
            </h2>
            <p className="mt-4 text-base md:text-lg text-foreground leading-relaxed">
              Premium quality, honest design, and a clean silhouette—built to last and feel lived in
              from day one.
            </p>

            <div className="mt-8 space-y-4 text-sm md:text-base text-muted-foreground leading-relaxed">
              <p>
                <strong className="text-foreground font-medium">Design:</strong> Keep it minimal,
                make the details speak.
              </p>
              <p>
                <strong className="text-foreground font-medium">Quality:</strong> Better fabric,
                better fit, better finish.
              </p>
              <p>
                <strong className="text-foreground font-medium">Culture:</strong> Streetwear is
                community—SCENT is built for people who move with purpose.
              </p>
            </div>

            <blockquote className="mt-10 border-l border-border pl-6 text-sm md:text-base text-foreground/90">
              “Add your brand statement here—one line that captures SCENT.”
              <span className="block mt-3 text-xs tracking-widest uppercase text-muted-foreground">
                — SCENT
              </span>
            </blockquote>
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

