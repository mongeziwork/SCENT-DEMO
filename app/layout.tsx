import type { Metadata } from 'next'
import { Geist, Geist_Mono } from 'next/font/google'
import { Analytics } from '@vercel/analytics/next'
import './globals.css'
import {
  ConditionalFooter,
  ConditionalMusicPlayer,
  ConditionalNavigation,
} from '@/components/layout/conditional-store-chrome'
import { Toaster } from '@/components/ui/toaster'
import { getCanonicalSiteUrl } from '@/lib/site'

const geistSans = Geist({
  subsets: ['latin'],
  variable: '--font-geist-sans',
})

const geistMono = Geist_Mono({
  subsets: ['latin'],
  variable: '--font-geist-mono',
})

const siteUrl = getCanonicalSiteUrl()

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: 'SCENT | Premium Menswear',
    template: '%s | SCENT',
  },
  description: 'Premium menswear crafted for the modern youth. Where quality meets contemporary style.',
  applicationName: 'SCENT',
  keywords: ['SCENT', 'menswear', 'streetwear', 'premium clothing', 'South Africa', 'youth fashion'],
  alternates: {
    canonical: '/',
  },
  openGraph: {
    type: 'website',
    url: siteUrl,
    siteName: 'SCENT',
    title: 'SCENT | Premium Menswear',
    description: 'Premium menswear crafted for the modern youth. Where quality meets contemporary style.',
    images: [
      {
        url: '/brand/logo-white.png',
        width: 1200,
        height: 630,
        alt: 'SCENT',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'SCENT | Premium Menswear',
    description: 'Premium menswear crafted for the modern youth. Where quality meets contemporary style.',
    images: ['/brand/logo-white.png'],
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
                name: 'SCENT',
                url: siteUrl,
                logo: `${siteUrl}/brand/logo-white.png`,
                sameAs: ['https://instagram.com/scent_jhb'],
              },
              {
                '@context': 'https://schema.org',
                '@type': 'WebSite',
                name: 'SCENT',
                url: siteUrl,
                potentialAction: {
                  '@type': 'SearchAction',
                  target: `${siteUrl}/shop?query={search_term_string}`,
                  'query-input': 'required name=search_term_string',
                },
              },
            ]),
          }}
        />
        <ConditionalNavigation />
        <main className="flex-1 w-full min-h-0">{children}</main>
        <ConditionalFooter />
        <ConditionalMusicPlayer />
        <Toaster />
        {process.env.NODE_ENV === 'production' && <Analytics />}
      </body>
    </html>
  )
}
