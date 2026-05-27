import { FeaturedProductLanding } from '@/components/featured-product-landing'
import { Features } from '@/components/features'
import { Hero } from '@/components/hero'
import { createSupabaseServerClient } from '@/lib/supabase/server'

export const dynamic = 'force-dynamic'
export const revalidate = 0

export default async function HomePage() {
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

  return (
    <>
      {featuredProduct ? <FeaturedProductLanding product={featuredProduct} /> : <Hero />}
      <Features />
    </>
  )
}
