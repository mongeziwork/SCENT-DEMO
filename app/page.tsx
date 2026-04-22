import { Hero } from '@/components/hero'
import { ProductCarousel } from '@/components/product-carousel'
import { Gallery } from '@/components/gallery'
import { Features } from '@/components/features'

export default function HomePage() {
  return (
    <>
      <Hero />
      <ProductCarousel />
      <Gallery />
      <Features />
    </>
  )
}
