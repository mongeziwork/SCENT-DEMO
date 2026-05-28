'use client'

import { useEffect, useMemo, useState, type MouseEvent, type ReactNode } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import Lenis from 'lenis'
import Image from 'next/image'
import Link from 'next/link'
import { ArrowRight, ChevronDown, MoveUpRight, ShoppingBag } from 'lucide-react'

import { ProductPurchasePanel } from '@/components/product-purchase-panel'
import { formatZar } from '@/lib/currency'
import { getProductImageUrls, getPrimaryProductImage } from '@/lib/product-images'
import { cn } from '@/lib/utils'

type CampaignProduct = {
  id: string
  name: string
  slug: string | null
  description: string | null
  price: string | number
  image_url: string | null
  gallery_image_urls?: string[] | null
  category: string | null
  stock?: number | null
  color_options?: string[] | null
  size_options?: string[] | null
}

type ProductCampaignPageProps = {
  product: CampaignProduct
}

const detailCards = [
  {
    title: 'Ribbed cuffs',
    copy: 'Structured comfort at the wrist, built to hold shape through everyday wear.',
  },
  {
    title: 'Adjustable waist',
    copy: 'Elastic waist control lets the jacket sit cropped, loose, or locked in.',
  },
  {
    title: 'Heavyweight body',
    copy: 'Bull denim gives the piece a premium weight, shadow, and architectural drape.',
  },
  {
    title: 'Oversized silhouette',
    copy: 'A naturally baggy streetwear fit designed to layer without losing structure.',
  },
]

const sizeNotes = [
  'Above 5’8 choose XL',
  'Below 5’8 choose Large',
  'Naturally baggy fit',
]

function MagneticLink({
  href,
  children,
  className,
  variant = 'solid',
}: {
  href: string
  children: ReactNode
  className?: string
  variant?: 'solid' | 'outline'
}) {
  const [offset, setOffset] = useState({ x: 0, y: 0 })

  function handleMove(event: MouseEvent<HTMLAnchorElement>) {
    const rect = event.currentTarget.getBoundingClientRect()
    setOffset({
      x: (event.clientX - rect.left - rect.width / 2) * 0.16,
      y: (event.clientY - rect.top - rect.height / 2) * 0.16,
    })
  }

  return (
    <Link
      href={href}
      onMouseMove={handleMove}
      onMouseLeave={() => setOffset({ x: 0, y: 0 })}
      style={{ transform: `translate3d(${offset.x}px, ${offset.y}px, 0)` }}
      className={cn(
        'group inline-flex items-center justify-center gap-3 overflow-hidden px-7 py-4 text-xs font-medium uppercase tracking-[0.28em] transition-[transform,border-color,background-color,color,opacity] duration-300',
        variant === 'solid'
          ? 'bg-white text-black hover:bg-zinc-200'
          : 'border border-white/20 text-white hover:border-white/70 hover:bg-white/5',
        className,
      )}
    >
      <span className="relative z-10">{children}</span>
      <ArrowRight className="relative z-10 h-4 w-4 transition-transform group-hover:translate-x-1" />
    </Link>
  )
}

function CampaignEffects() {
  const [loading, setLoading] = useState(true)
  const [progress, setProgress] = useState(0)
  const [cursor, setCursor] = useState({ x: -120, y: -120 })

  useEffect(() => {
    const timeout = window.setTimeout(() => setLoading(false), 1150)
    return () => window.clearTimeout(timeout)
  }, [])

  useEffect(() => {
    const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    if (reduceMotion) return

    gsap.registerPlugin(ScrollTrigger)
    const lenis = new Lenis({
      duration: 1.15,
      smoothWheel: true,
      wheelMultiplier: 0.9,
    })

    lenis.on('scroll', ScrollTrigger.update)

    let frame = 0
    const raf = (time: number) => {
      lenis.raf(time)
      frame = window.requestAnimationFrame(raf)
    }
    frame = window.requestAnimationFrame(raf)

    const triggers: ScrollTrigger[] = []
    const revealItems = gsap.utils.toArray<HTMLElement>('[data-campaign-reveal]')
    revealItems.forEach((item) => {
      const tween = gsap.fromTo(
        item,
        { autoAlpha: 0, y: 80 },
        {
          autoAlpha: 1,
          y: 0,
          duration: 1.1,
          ease: 'power3.out',
          scrollTrigger: {
            trigger: item,
            start: 'top 82%',
          },
        },
      )
      if (tween.scrollTrigger) triggers.push(tween.scrollTrigger)
    })

    const floatItems = gsap.utils.toArray<HTMLElement>('[data-float-depth]')
    floatItems.forEach((item) => {
      const depth = Number(item.dataset.floatDepth ?? 40)
      const tween = gsap.to(item, {
        y: depth * -1,
        ease: 'none',
        scrollTrigger: {
          trigger: item,
          start: 'top bottom',
          end: 'bottom top',
          scrub: 1,
        },
      })
      if (tween.scrollTrigger) triggers.push(tween.scrollTrigger)
    })

    return () => {
      window.cancelAnimationFrame(frame)
      triggers.forEach((trigger) => trigger.kill())
      lenis.destroy()
    }
  }, [])

  useEffect(() => {
    function updateProgress() {
      const scrollable = document.documentElement.scrollHeight - window.innerHeight
      setProgress(scrollable > 0 ? window.scrollY / scrollable : 0)
    }

    function updateCursor(event: PointerEvent) {
      setCursor({ x: event.clientX, y: event.clientY })
    }

    updateProgress()
    window.addEventListener('scroll', updateProgress, { passive: true })
    window.addEventListener('pointermove', updateCursor, { passive: true })

    return () => {
      window.removeEventListener('scroll', updateProgress)
      window.removeEventListener('pointermove', updateCursor)
    }
  }, [])

  return (
    <>
      <div className="fixed left-0 top-0 z-[70] h-0.5 w-full bg-white/10">
        <div
          className="h-full bg-white shadow-[0_0_18px_rgba(255,255,255,0.65)]"
          style={{ width: `${Math.min(100, Math.max(0, progress * 100))}%` }}
        />
      </div>

      <div
        className="pointer-events-none fixed z-[60] hidden h-36 w-36 -translate-x-1/2 -translate-y-1/2 rounded-full bg-white/10 blur-3xl md:block"
        style={{ left: cursor.x, top: cursor.y }}
      />

      <AnimatePresence>
        {loading && (
          <motion.div
            key="campaign-loader"
            initial={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.6, ease: 'easeInOut' }}
            className="fixed inset-0 z-[100] flex items-center justify-center bg-black"
          >
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7 }}
              className="text-center"
            >
              <div className="mx-auto mb-6 h-px w-44 overflow-hidden bg-white/15">
                <motion.div
                  initial={{ x: '-100%' }}
                  animate={{ x: '100%' }}
                  transition={{ duration: 1.1, ease: 'easeInOut', repeat: Infinity }}
                  className="h-full w-24 bg-white"
                />
              </div>
              <p className="text-[10px] uppercase tracking-[0.5em] text-white/70">
                Loading structure
              </p>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}

function AmbientParticles() {
  return (
    <div className="pointer-events-none absolute inset-0 overflow-hidden">
      {Array.from({ length: 18 }).map((_, index) => (
        <motion.span
          key={index}
          initial={{ opacity: 0.08, y: 0 }}
          animate={{ opacity: [0.05, 0.18, 0.05], y: [-12, 16, -12] }}
          transition={{
            duration: 6 + (index % 5),
            repeat: Infinity,
            delay: index * 0.28,
            ease: 'easeInOut',
          }}
          className="absolute h-1 w-1 rounded-full bg-white/60 blur-[1px]"
          style={{
            left: `${(index * 17) % 100}%`,
            top: `${10 + ((index * 23) % 80)}%`,
          }}
        />
      ))}
    </div>
  )
}

function SectionLabel({ children }: { children: ReactNode }) {
  return (
    <p className="text-[10px] uppercase tracking-[0.42em] text-white/45">
      {children}
    </p>
  )
}

export function ProductCampaignPage({ product }: ProductCampaignPageProps) {
  const productHref = product.slug ? `/shop/${product.slug}` : '/shop'
  const images = useMemo(() => {
    const productImages = getProductImageUrls(product)
    return productImages.length > 0 ? productImages : ['/images/product-1.jpg']
  }, [product])
  const primaryImage = getPrimaryProductImage(product)
  const secondaryImage = images[1] ?? primaryImage
  const detailImage = images[2] ?? secondaryImage
  const galleryImages = images.slice(0, 7)

  return (
    <div className="relative min-h-screen overflow-hidden bg-black text-white">
      <CampaignEffects />
      <div className="pointer-events-none fixed inset-0 z-[1] opacity-[0.075] [background-image:url('data:image/svg+xml,%3Csvg_viewBox=%220_0_256_256%22_xmlns=%22http://www.w3.org/2000/svg%22%3E%3Cfilter_id=%22noiseFilter%22%3E%3CfeTurbulence_type=%22fractalNoise%22_baseFrequency=%220.8%22_numOctaves=%223%22_stitchTiles=%22stitch%22/%3E%3C/filter%3E%3Crect_width=%22100%25%22_height=%22100%25%22_filter=%22url(%23noiseFilter)%22/%3E%3C/svg%3E')]" />

      <section className="relative min-h-screen overflow-hidden pt-20">
        <AmbientParticles />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_70%_15%,rgba(255,255,255,0.16),transparent_30%),radial-gradient(circle_at_20%_80%,rgba(255,255,255,0.08),transparent_26%)]" />
        <div className="absolute inset-x-0 bottom-0 h-1/2 bg-gradient-to-t from-black via-black/70 to-transparent" />

        <div className="relative z-10 mx-auto grid min-h-[calc(100vh-5rem)] max-w-7xl grid-cols-1 items-center gap-10 px-6 py-16 lg:grid-cols-[0.9fr_1.1fr] lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1] }}
            className="order-2 lg:order-1"
          >
            <SectionLabel>SCENT / limited outerwear</SectionLabel>
            <h1 className="mt-5 text-4xl font-light uppercase leading-[0.95] tracking-tight text-white md:text-6xl lg:text-7xl">
              Heavyweight
              <span className="block text-white/45">Bull Denim</span>
            </h1>
            <p className="mt-6 max-w-xl text-xl uppercase tracking-[0.16em] text-white/75 md:text-2xl">
              Naturally baggy fit
            </p>
            <p className="mt-6 max-w-xl text-sm leading-7 text-white/50">
              A cinematic one-piece streetwear release built with structure, weight, and a naturally oversized silhouette.
            </p>
            <div className="mt-9 flex flex-col gap-3 sm:flex-row">
              <MagneticLink href={productHref}>Shop now</MagneticLink>
              <MagneticLink href="#fabric" variant="outline">
                Explore fabric
              </MagneticLink>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 30 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            transition={{ duration: 1, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
            className="order-1 lg:order-2"
            data-float-depth="55"
          >
            <Link href={productHref} className="group relative block">
              <div className="absolute -inset-8 rounded-full bg-white/10 blur-3xl transition-opacity group-hover:opacity-80" />
              <div className="relative aspect-[4/5] overflow-hidden border border-white/10 bg-zinc-950/70 shadow-[0_40px_140px_rgba(0,0,0,0.75)]">
                <Image
                  src={primaryImage}
                  alt={product.name}
                  fill
                  priority
                  sizes="(min-width: 1024px) 54vw, 100vw"
                  className="object-contain p-5 transition-transform duration-700 group-hover:scale-[1.03] md:p-8"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/55 via-transparent to-white/5" />
                <div className="absolute bottom-5 left-5 right-5 flex items-center justify-between border-t border-white/15 pt-4">
                  <div>
                    <p className="text-[10px] uppercase tracking-[0.32em] text-white/45">
                      New piece
                    </p>
                    <p className="mt-1 text-sm text-white">{formatZar(product.price)}</p>
                  </div>
                  <MoveUpRight className="h-5 w-5 text-white/70 transition-transform group-hover:translate-x-1 group-hover:-translate-y-1" />
                </div>
              </div>
            </Link>
          </motion.div>
        </div>

        <div className="absolute bottom-8 left-1/2 z-10 -translate-x-1/2 text-white/40">
          <ChevronDown className="h-5 w-5 animate-bounce" />
        </div>
      </section>

      <section className="relative border-y border-white/10 bg-zinc-950 py-10">
        <div className="mx-auto grid max-w-7xl grid-cols-2 gap-px px-6 text-center md:grid-cols-4 lg:px-8">
          {[
            ['01', 'Heavyweight structure'],
            ['02', 'Bull denim shell'],
            ['03', 'Oversized silhouette'],
            ['04', 'Utility waist control'],
          ].map(([number, label]) => (
            <div key={label} className="bg-black/50 px-4 py-7">
              <p className="text-xs text-white/35">{number}</p>
              <p className="mt-2 text-[10px] uppercase tracking-[0.24em] text-white/65">
                {label}
              </p>
            </div>
          ))}
        </div>
      </section>

      <section id="fabric" className="relative overflow-hidden py-28 md:py-36">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_20%,rgba(255,255,255,0.08),transparent_34%)]" />
        <div className="relative mx-auto grid max-w-7xl grid-cols-1 items-center gap-12 px-6 lg:grid-cols-2 lg:px-8">
          <div data-campaign-reveal>
            <SectionLabel>Craft / fabric</SectionLabel>
            <h2 className="mt-4 text-4xl font-light uppercase leading-none tracking-tight md:text-6xl">
              Built with
              <span className="block text-white/35">weight.</span>
            </h2>
            <p className="mt-8 max-w-xl text-sm leading-8 text-white/55">
              Heavyweight bull denim creates a structured outer shell with a premium hand-feel. The body holds shape, catches light, and gives the jacket its oversized architectural profile.
            </p>
          </div>

          <div className="relative" data-campaign-reveal data-float-depth="35">
            <div className="absolute -inset-6 bg-white/5 blur-3xl" />
            <div className="relative aspect-square overflow-hidden border border-white/10 bg-zinc-950">
              <Image
                src={detailImage}
                alt={`${product.name} denim texture`}
                fill
                sizes="(min-width: 1024px) 50vw, 100vw"
                className="object-cover transition-transform duration-700 hover:scale-105"
              />
              <div className="absolute inset-0 bg-gradient-to-tr from-black/60 via-transparent to-white/10" />
              <div className="absolute left-8 top-8 h-24 w-px bg-white/70 shadow-[0_0_28px_rgba(255,255,255,0.8)]" />
              <div className="absolute bottom-8 right-8 h-px w-28 bg-white/70 shadow-[0_0_28px_rgba(255,255,255,0.8)]" />
              <p className="absolute bottom-8 left-8 max-w-56 text-[10px] uppercase leading-5 tracking-[0.24em] text-white/70">
                Animated stitch highlights / bull denim texture study
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className="relative overflow-hidden border-y border-white/10 bg-zinc-950 py-28 md:py-36">
        <div className="absolute right-0 top-0 h-full w-1/2 bg-gradient-to-l from-white/5 to-transparent" />
        <div className="relative mx-auto grid max-w-7xl grid-cols-1 items-center gap-12 px-6 lg:grid-cols-[1.1fr_0.9fr] lg:px-8">
          <div className="relative order-2 lg:order-1" data-campaign-reveal>
            <div className="grid grid-cols-2 gap-4">
              {[primaryImage, secondaryImage].map((image, index) => (
                <div
                  key={`${image}-${index}`}
                  className={cn(
                    'relative overflow-hidden border border-white/10 bg-black',
                    index === 0 ? 'aspect-[3/4]' : 'mt-12 aspect-[3/4]',
                  )}
                >
                  <Image
                    src={image}
                    alt={`${product.name} fit visual ${index + 1}`}
                    fill
                    sizes="(min-width: 1024px) 25vw, 50vw"
                    className="object-contain p-3"
                  />
                </div>
              ))}
            </div>
          </div>

          <div className="order-1 lg:order-2" data-campaign-reveal>
            <SectionLabel>Fit guide</SectionLabel>
            <h2 className="mt-4 text-4xl font-light uppercase leading-none tracking-tight md:text-6xl">
              Naturally
              <span className="block text-white/35">baggy fit.</span>
            </h2>
            <div className="mt-8 space-y-3">
              {sizeNotes.map((note) => (
                <div
                  key={note}
                  className="flex items-center justify-between border border-white/10 bg-black/40 px-5 py-4 text-xs uppercase tracking-[0.2em] text-white/70"
                >
                  <span>{note}</span>
                  <span className="h-1.5 w-1.5 rounded-full bg-white/70" />
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="relative py-28 md:py-36">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <div className="mb-14 max-w-3xl" data-campaign-reveal>
            <SectionLabel>Product details</SectionLabel>
            <h2 className="mt-4 text-4xl font-light uppercase leading-none tracking-tight md:text-6xl">
              Designed for
              <span className="block text-white/35">structure.</span>
            </h2>
          </div>

          <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4">
            {detailCards.map((detail, index) => (
              <motion.div
                key={detail.title}
                data-campaign-reveal
                whileHover={{ y: -8 }}
                transition={{ type: 'spring', stiffness: 260, damping: 22 }}
                className="group min-h-64 border border-white/10 bg-zinc-950/80 p-6 transition-colors hover:border-white/45 hover:bg-white/[0.06]"
              >
                <p className="text-xs text-white/30">0{index + 1}</p>
                <h3 className="mt-16 text-xl font-light uppercase tracking-tight text-white">
                  {detail.title}
                </h3>
                <p className="mt-4 text-sm leading-7 text-white/45 transition-colors group-hover:text-white/65">
                  {detail.copy}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      <section className="relative overflow-hidden border-y border-white/10 bg-zinc-950 py-28 md:py-36">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <div className="mb-14 flex flex-col justify-between gap-6 md:flex-row md:items-end" data-campaign-reveal>
            <div>
              <SectionLabel>Editorial gallery</SectionLabel>
              <h2 className="mt-4 text-4xl font-light uppercase leading-none tracking-tight md:text-6xl">
                Campaign
                <span className="block text-white/35">frames.</span>
              </h2>
            </div>
            <p className="max-w-sm text-sm leading-7 text-white/45">
              A staggered visual system with soft zoom, atmospheric darkness, and monochrome product focus.
            </p>
          </div>

          <div className="grid grid-cols-1 gap-4 md:grid-cols-4">
            {galleryImages.map((image, index) => (
              <motion.div
                key={`${image}-${index}`}
                data-campaign-reveal
                className={cn(
                  'group relative overflow-hidden border border-white/10 bg-black',
                  index === 0 && 'md:col-span-2 md:row-span-2',
                  index === 3 && 'md:col-span-2',
                )}
              >
                <div className={cn('relative', index === 0 ? 'aspect-square' : 'aspect-[4/5]')}>
                  <Image
                    src={image}
                    alt={`${product.name} editorial image ${index + 1}`}
                    fill
                    sizes="(min-width: 1024px) 25vw, 100vw"
                    className="object-cover transition-transform duration-700 group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/45 via-transparent to-transparent opacity-70" />
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      <section className="relative min-h-screen overflow-hidden py-28 md:py-36">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_30%,rgba(255,255,255,0.12),transparent_36%)]" />
        <div className="relative mx-auto grid max-w-7xl grid-cols-1 items-center gap-12 px-6 lg:grid-cols-[0.9fr_1.1fr] lg:px-8">
          <div data-campaign-reveal>
            <SectionLabel>Limited release</SectionLabel>
            <h2 className="mt-4 text-5xl font-light uppercase leading-[0.95] tracking-tight md:text-7xl">
              Built for
              <span className="block text-white/35">structure</span>
            </h2>
            <p className="mt-6 text-xl text-white/70">{product.name}</p>
            <p className="mt-2 text-white/45">{formatZar(product.price)}</p>
            <div className="mt-8">
              <MagneticLink href={productHref}>
                Checkout
              </MagneticLink>
            </div>
          </div>

          <div className="border border-white/10 bg-zinc-950/70 p-5 shadow-[0_40px_140px_rgba(0,0,0,0.8)]" data-campaign-reveal>
            <div className="mb-5 flex items-center justify-between text-[10px] uppercase tracking-[0.26em] text-white/45">
              <span>Direct add</span>
              <span>{(product.stock ?? 0) > 0 ? `In stock (${product.stock})` : 'Out of stock'}</span>
            </div>
            <ProductPurchasePanel product={product} className="mt-0" />
            <Link
              href={productHref}
              className="mt-4 flex items-center justify-center gap-2 border border-white/10 py-4 text-xs uppercase tracking-[0.24em] text-white/65 transition-colors hover:border-white/50 hover:text-white"
            >
              Full product page
              <ShoppingBag className="h-4 w-4" />
            </Link>
          </div>
        </div>
      </section>
    </div>
  )
}
