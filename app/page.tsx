"use client"

import Link from 'next/link'
import { EncontralaLogo } from '@/components/encontrala-logo'

export default function HomePage() {
  return (
    <main className="relative min-h-screen w-full overflow-hidden">
      {/* Background Image - Stadium */}
      <div 
        className="absolute inset-0 bg-cover bg-center bg-no-repeat"
        style={{
          backgroundImage: `url('https://hebbkx1anhila5yf.public.blob.vercel-storage.com/ORSAI_preview-14x4F9YkHFCivH1CoffMSf07Ylq5L5.png')`,
        }}
      />
      
      {/* Dark Overlay */}
      <div className="absolute inset-0 bg-black/60" />
      
      {/* Content */}
      <div className="relative z-10 flex flex-col items-center justify-center min-h-screen px-4">
        {/* Logo */}
        <div className="mb-8 md:mb-12">
          <EncontralaLogo className="w-72 md:w-96 lg:w-[500px]" />
        </div>
        
        {/* Play Button */}
        <Link
          href="/a-jugar"
          className="group relative inline-flex items-center justify-center"
        >
          <div className="relative px-16 md:px-24 py-4 md:py-5 bg-[#E53935] hover:bg-[#C62828] transition-all duration-300 rounded-lg shadow-lg hover:shadow-xl transform hover:scale-105">
            <span className="text-white text-2xl md:text-3xl font-bold tracking-wider uppercase" style={{ fontFamily: 'var(--font-oswald), Impact, sans-serif' }}>
              A JUGAR
            </span>
          </div>
        </Link>
      </div>
    </main>
  )
}
