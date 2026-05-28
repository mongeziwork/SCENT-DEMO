import type { Metadata } from 'next'
import { Geist, Geist_Mono } from 'next/font/google'
import { Analytics } from '@vercel/analytics/next'
import './globals.css'
import {
  ConditionalFooter,
  ConditionalMusicPlayer,
  ConditionalNavigation,
  ConditionalSiteEntryLoader,
} from '@/components/layout/conditional-store-chrome'
import { Toaster } from '@/components/ui/toaster'
import { FreeGiftPopup } from '@/components/free-gift-popup'
import { LiveChatWidget } from '@/components/live-chat-widget'
import { getCanonicalSiteOrigin } from '@/lib/site'

const geistSans = Geist({
  subsets: ['latin'],
  variable: '--font-geist-sans',
})

const geistMono = Geist_Mono({
  subsets: ['latin'],
  variable: '--font-geist-mono',
})

const siteUrl = getCanonicalSiteOrigin()
const siteName = 'SCENT'
const siteDescription =
  'SCENT is a South African premium streetwear and menswear brand creating limited pieces with utility, structure, and contemporary youth culture.'
const socialImage = '/images/endurance-hero.jpg'

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: 'SCENT | Premium South African Streetwear',
    template: '%s | SCENT',
  },
  description: siteDescription,
  applicationName: siteName,
  keywords: [
    'SCENT',
    'SCENT clothing',
    'SCENT streetwear',
    'South African streetwear',
    'premium menswear',
    'utility streetwear',
    'limited clothing',
    'youth fashion',
    'Johannesburg clothing brand',
  ],
  authors: [{ name: 'SCENT' }],
  creator: 'SCENT',
  publisher: 'SCENT',
  category: 'fashion',
  classification: 'streetwear, menswear, fashion, clothing',
  referrer: 'origin-when-cross-origin',
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  alternates: {
    canonical: '/',
  },
  icons: {
    icon: [
      { url: '/favicon.ico', sizes: '32x32' },
      { url: '/icon.svg', type: 'image/svg+xml' },
      {
        url: '/icon-light-32x32.png',
        sizes: '32x32',
        type: 'image/png',
        media: '(prefers-color-scheme: light)',
      },
      {
        url: '/icon-dark-32x32.png',
        sizes: '32x32',
        type: 'image/png',
        media: '(prefers-color-scheme: dark)',
      },
      { url: '/icon-192.png', sizes: '192x192', type: 'image/png' },
      { url: '/icon-512.png', sizes: '512x512', type: 'image/png' },
    ],
    apple: [{ url: '/apple-icon.png', sizes: '180x180', type: 'image/png' }],
    shortcut: ['/favicon.ico'],
  },
  manifest: '/manifest.webmanifest',
  openGraph: {
    type: 'website',
    url: siteUrl,
    siteName,
    locale: 'en_ZA',
    title: 'SCENT | Premium South African Streetwear',
    description: siteDescription,
    images: [
      {
        url: socialImage,
        width: 842,
        height: 1500,
        alt: 'SCENT Endurance Collection editorial campaign image',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'SCENT | Premium South African Streetwear',
    description: siteDescription,
    images: [socialImage],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-image-preview': 'large',
      'max-snippet': -1,
      'max-video-preview': -1,
    },
  },
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" className="bg-background">
      <body
        className={`${geistSans.variable} ${geistMono.variable} font-sans antialiased min-h-screen flex flex-col`}
      >
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify([
              {
                '@context': 'https://schema.org',
                '@type': 'Organization',
                name: siteName,
                url: siteUrl,
                logo: `${siteUrl}/brand/logo-white.png`,
                image: `${siteUrl}${socialImage}`,
                email: 'scentclobrand@gmail.com',
                telephone: '+27659980114',
                sameAs: ['https://instagram.com/scent_jhb'],
                contactPoint: [
                  {
                    '@type': 'ContactPoint',
                    contactType: 'customer support',
                    email: 'scentclobrand@gmail.com',
                    telephone: '+27659980114',
                    areaServed: 'ZA',
                    availableLanguage: ['en'],
                  },
                ],
              },
              {
                '@context': 'https://schema.org',
                '@type': 'WebSite',
                name: siteName,
                url: siteUrl,
                description: siteDescription,
              },
              {
                '@context': 'https://schema.org',
                '@type': 'ClothingStore',
                name: siteName,
                url: siteUrl,
                image: `${siteUrl}${socialImage}`,
                logo: `${siteUrl}/brand/logo-white.png`,
                email: 'scentclobrand@gmail.com',
                telephone: '+27659980114',
                address: {
                  '@type': 'PostalAddress',
                  addressCountry: 'ZA',
                },
                priceRange: 'R',
              },
            ]),
          }}
        />
        <ConditionalSiteEntryLoader />
        <ConditionalNavigation />
        <main className="flex-1 w-full min-h-0">{children}</main>
        <ConditionalFooter />
        <ConditionalMusicPlayer />
        <FreeGiftPopup />
        <LiveChatWidget />
        <Toaster />
        {process.env.NODE_ENV === 'production' && <Analytics />}
      </body>
    </html>
  )
}
