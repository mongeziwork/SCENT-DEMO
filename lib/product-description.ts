type ProductInfoSection = {
  title: string
  body: string
}

const SECTION_MARKERS = [
  'Product Features',
  'Fit & Sizing',
  'Care Instructions',
  'Product Details',
  'Fabric & Care',
]

function tidyText(value: string) {
  return value.replace(/\s+/g, ' ').trim()
}

export function getProductInfoSections(description: string | null | undefined) {
  const text = tidyText(description ?? '')
  if (!text) return []

  const markerPattern = new RegExp(`\\b(${SECTION_MARKERS.map((marker) => marker.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')).join('|')})\\b`, 'g')
  const matches = Array.from(text.matchAll(markerPattern))

  if (matches.length === 0) {
    return [{ title: 'Overview', body: text }]
  }

  const sections: ProductInfoSection[] = []
  const firstMarkerIndex = matches[0]?.index ?? 0
  const overview = tidyText(text.slice(0, firstMarkerIndex))
  if (overview) sections.push({ title: 'Overview', body: overview })

  for (let index = 0; index < matches.length; index += 1) {
    const match = matches[index]!
    const title = match[0]
    const start = (match.index ?? 0) + title.length
    const end = matches[index + 1]?.index ?? text.length
    const body = tidyText(text.slice(start, end))
    if (body) sections.push({ title, body })
  }

  return sections
}
