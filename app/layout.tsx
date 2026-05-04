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

const geistSans = Geist({
  subsets: ['latin'],
  variable: '--font-geist-sans',
})

const geistMono = Geist_Mono({
  subsets: ['latin'],
  variable: '--font-geist-mono',
})

export const metadata: Metadata = {
  title: 'SCENT | Premium Menswear',
  description: 'Premium mens and youth clothing. Modern streetwear with timeless quality.',
  keywords: ['streetwear', 'premium clothing', 'menswear', 'youth fashion', 'luxury'],
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
