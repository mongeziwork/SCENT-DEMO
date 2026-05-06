import type { MetadataRoute } from 'next'

import { createSupabaseServerClient } from '@/lib/supabase/server'

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const siteUrl = (process.env.NEXT_PUBLIC_SITE_URL?.trim() || 'https://scentclothing.site').replace(/\/+$/, '')

  const staticRoutes: MetadataRoute.Sitemap = [
    { url: `${siteUrl}/`, lastModified: new Date(), changeFrequency: 'weekly', priority: 1 },
    { url: `${siteUrl}/shop`, lastModified: new Date(), changeFrequency: 'daily', priority: 0.9 },
    { url: `${siteUrl}/contact`, lastModified: new Date(), changeFrequency: 'monthly', priority: 0.6 },
    { url: `${siteUrl}/shipping`, lastModified: new Date(), changeFrequency: 'yearly', priority: 0.3 },
    { url: `${siteUrl}/returns`, lastModified: new Date(), changeFrequency: 'yearly', priority: 0.3 },
    { url: `${siteUrl}/privacy-policy`, lastModified: new Date(), changeFrequency: 'yearly', priority: 0.2 },
  ]

  try {
    const supabase = createSupabaseServerClient()
    const { data: products } = await supabase
      .from('products')
      .select('slug,updated_at,created_at,is_active')
      .eq('is_active', true)

    const productRoutes: MetadataRoute.Sitemap =
      (products ?? [])
        .filter((p) => Boolean(p.slug))
        .map((p) => ({
          url: `${siteUrl}/shop/${p.slug}`,
          lastModified: new Date(p.updated_at ?? p.created_at ?? Date.now()),
          changeFrequency: 'weekly',
          priority: 0.8,
        })) ?? []

    return [...staticRoutes, ...productRoutes]
  } catch {
    return staticRoutes
  }
}

