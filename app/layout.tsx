import type { Metadata, Viewport } from 'next'
import { Oswald, Inter } from 'next/font/google'
import { Analytics } from '@vercel/analytics/next'
import './globals.css'
import { GameProvider } from '@/components/game-provider'

const oswald = Oswald({ 
  subsets: ["latin"],
  variable: '--font-oswald',
  weight: ['400', '500', '600', '700']
});

const inter = Inter({ 
  subsets: ["latin"],
  variable: '--font-inter'
});

export const metadata: Metadata = {
  title: 'ENCONTRALA - River Plate',
  description: 'Juega y gana premios exclusivos de River Plate',
  generator: 'v0.app',
}

export const viewport: Viewport = {
  themeColor: '#E53935',
  width: 'device-width',
  initialScale: 1,
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="es" className="dark">
      <body className={`${oswald.variable} ${inter.variable} font-sans antialiased bg-[#0a0a0a] text-white min-h-screen`}>
        <GameProvider>
          {children}
        </GameProvider>
        <Analytics />
      </body>
    </html>
  )
}
