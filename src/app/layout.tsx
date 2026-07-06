import type { Metadata, Viewport } from 'next'
import { DM_Sans, Inter } from 'next/font/google'
import Nav from '@/components/layout/Nav'
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
    'Damcraft is a design and technology studio based in Italy. We deliver holistic brand identity & digital experiences.',
  keywords: ['design studio', 'brand identity', 'web development', 'UX design', 'Italy'],
  openGraph: {
    type: 'website',
    locale: 'en_US',
    siteName: 'Damcraft',
  },
  icons: {
    icon: '/logo.svg',
  },
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${dmSans.variable} ${inter.variable}`}>
      <body>
        <Nav />
        <main>{children}</main>
      </body>
    </html>
  )
}
