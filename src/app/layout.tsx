import type { Metadata, Viewport } from 'next'
import { DM_Sans, Inter } from 'next/font/google'
import Nav from '@/components/layout/Nav'
import ShineTracker from '@/components/ui/ShineTracker'
import './globals.css'

const dmSans = DM_Sans({
  subsets: ['latin'],
  weight: ['400', '500', '600'],
  variable: '--font-dm-sans',
  display: 'swap',
})

const inter = Inter({
  subsets: ['latin'],
  weight: ['300', '400', '500'],
  variable: '--font-inter',
  display: 'swap',
})

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
}

export const metadata: Metadata = {
  title: {
    default: 'Damcraft — Design & Technology Studio',
    template: '%s | Damcraft',
  },
  description:
    "Damcraft is a design and technology studio from Noida. We don't decorate — we construct brands, products & experiences.",
  keywords: ['design studio', 'brand identity', 'web development', 'UX design', 'Noida', 'India'],
  openGraph: {
    type: 'website',
    locale: 'en_US',
    siteName: 'Damcraft',
  },
  icons: {
    icon: '/favicon.svg',
  },
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${dmSans.variable} ${inter.variable}`}>
      <body>
        <ShineTracker />
        <Nav />
        <main>{children}</main>
      </body>
    </html>
  )
}
