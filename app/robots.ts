import type { MetadataRoute } from 'next'

import { getCanonicalSiteOrigin } from '@/lib/site'

export default function robots(): MetadataRoute.Robots {
  const siteUrl = getCanonicalSiteOrigin()

  return {
    rules: [
      {
        userAgent: '*',
        allow: '/',
        disallow: ['/admin/', '/auth/', '/account', '/checkout', '/cart', '/payfast/'],
      },
    ],
    sitemap: `${siteUrl}/sitemap.xml`,
    host: siteUrl,
  }
}

