import type { Metadata, Viewport } from 'next'
import { Inter } from 'next/font/google'
import { Analytics } from '@vercel/analytics/next'
import './globals.css'

const inter = Inter({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800", "900"],
  variable: '--font-inter',
})

export const metadata: Metadata = {
  title: 'Will You Survive The Bear Market? | Legion',
  description: 'Find out if you have what it takes to survive the bear market. Enter your X username and discover your fate.',
  openGraph: {
    title: 'Will You Survive The Bear Market? | Legion',
    description: 'Find out if you have what it takes to survive the bear market.',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Will You Survive The Bear Market? | Legion',
    description: 'Find out if you have what it takes to survive the bear market.',
  },
}

export const viewport: Viewport = {
  themeColor: '#0a0a0a',
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" className="dark">
      <body className={`${inter.variable} font-sans antialiased bg-[#0a0a0a] text-white`}>
        {children}
        <Analytics />
      </body>
    </html>
  )
}
