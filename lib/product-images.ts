type ProductImageSource = {
  image_url?: string | null
  gallery_image_urls?: string[] | null
}

const FALLBACK_PRODUCT_IMAGE = '/images/product-1.jpg'

export function normalizeImageUrls(urls: Array<string | null | undefined>) {
  const seen = new Set<string>()
  const normalized: string[] = []

  for (const value of urls) {
    const url = value?.trim()
    if (!url || seen.has(url)) continue
    seen.add(url)
    normalized.push(url)
  }

  return normalized
}

export function getProductImageUrls(product: ProductImageSource) {
  return normalizeImageUrls([...(product.gallery_image_urls ?? []), product.image_url])
}

export function getPrimaryProductImage(product: ProductImageSource) {
  return getProductImageUrls(product)[0] ?? FALLBACK_PRODUCT_IMAGE
}

export function toAbsoluteImageUrl(url: string, siteUrl: string) {
  if (url.startsWith('http')) return url
  if (url.startsWith('/')) return `${siteUrl}${url}`
  return `${siteUrl}/${url}`
}
