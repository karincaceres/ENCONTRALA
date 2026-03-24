"use client"

import { CartSidebar } from '@/components/cart-sidebar'
import { EncontralaLogo } from '@/components/encontrala-logo'
import { prizes, useGame } from '@/components/game-provider'
import { PrizeCard } from '@/components/prize-card'
import { Home, ShoppingCart } from 'lucide-react'
import Link from 'next/link'
import { useState } from 'react'

// Prize images based on the contact sheet
const prizeImages = [
  'https://hebbkx1anhila5yf.public.blob.vercel-storage.com/orsai_extracted_assets_contact_sheet-UDeZWEIaZnsFB9sfus4YvFxRNQYFOj.png',
]

// Individual prize image mappings
const prizeImageMap: Record<string, string> = {
  'meet-greet': 'https://images.unsplash.com/photo-1574629810360-7efbbe195018?w=400&h=300&fit=crop',
  'viaje-equipo': 'https://images.unsplash.com/photo-1540747913346-19e32dc3e97e?w=400&h=300&fit=crop',
  'cuota-social': 'https://images.unsplash.com/photo-1459865264687-595d652de67e?w=400&h=300&fit=crop',
  'camiseta-firmada': 'https://images.unsplash.com/photo-1580087256394-dc596e1c8f4f?w=400&h=300&fit=crop',
  'experiencia-river': 'https://images.unsplash.com/photo-1489944440615-453fc2b6a9a9?w=400&h=300&fit=crop',
  'kit-hincha': 'https://images.unsplash.com/photo-1606925797300-0b35e9d1794e?w=400&h=300&fit=crop',
}

export default function AJugarPage() {
  const [isCartOpen, setIsCartOpen] = useState(false)
  const { getTotalItems, getTotal } = useGame()

  return (
    <main className="min-h-screen bg-[#0a0a0a]">
      {/* Header */}
      <header className="sticky top-0 z-30 bg-[#0a0a0a]/95 backdrop-blur-sm border-b border-white/10">
        <div className="container mx-auto px-4 py-3 flex items-center justify-between">
          {/* Logo / Home */}
          <Link href="/" className="flex items-center gap-2 hover:opacity-80 transition-opacity">
            <Home className="w-5 h-5 text-white" />
            <EncontralaLogo className="w-24 md:w-32" />
          </Link>

          {/* Cart Button */}
          <button
            onClick={() => setIsCartOpen(true)}
            className="relative flex items-center gap-2 px-4 py-2 bg-[#E53935] hover:bg-[#C62828] rounded-lg transition-colors"
          >
            <ShoppingCart className="w-5 h-5 text-white" />
            <span className="text-white font-bold hidden md:inline">TU JUGADA</span>
            {getTotalItems() > 0 && (
              <span className="absolute -top-2 -right-2 w-6 h-6 bg-[#8BC34A] rounded-full flex items-center justify-center text-xs font-bold text-black">
                {getTotalItems()}
              </span>
            )}
          </button>
        </div>
      </header>

      {/* Page Title */}
      <div className="bg-linear-to-b from-[#1a1a1a] to-[#0a0a0a] py-6 md:py-8">
        <div className="container mx-auto px-4">
          <div className="flex items-center gap-4">
            <div className="w-1 h-12 bg-[#E53935] rounded-full" />
            <div>
              <h1 className="text-2xl md:text-4xl font-bold text-white uppercase tracking-wide" style={{ fontFamily: 'var(--font-oswald), Impact, sans-serif' }}>
                A JUGAR
              </h1>
              <p className="text-gray-400 text-sm md:text-base mt-1">
                SELECCIONA EL PREMIO POR EL QUE VAS A JUGAR
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Prizes Grid */}
      <section className="container mx-auto px-4 py-6 md:py-8">
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4 md:gap-6">
          {prizes.map((prize) => (
            <PrizeCard
              key={prize.id}
              prize={prize}
              imageUrl={prizeImageMap[prize.id] || prizeImages[0]}
            />
          ))}
        </div>
      </section>

      {/* Floating Cart Summary - Mobile */}
      {getTotalItems() > 0 && (
        <div className="fixed bottom-0 left-0 right-0 p-4 bg-linear-to-t from-[#0a0a0a] via-[#0a0a0a] to-transparent md:hidden z-20">
          <button
            onClick={() => setIsCartOpen(true)}
            className="w-full py-4 bg-[#E53935] hover:bg-[#C62828] rounded-lg flex items-center justify-center gap-3 transition-colors shadow-lg"
          >
            <ShoppingCart className="w-5 h-5 text-white" />
            <span className="text-white font-bold uppercase" style={{ fontFamily: 'var(--font-oswald), Impact, sans-serif' }}>
              Ver Jugada ({getTotalItems()}) - ${getTotal()}
            </span>
          </button>
        </div>
      )}

      {/* Cart Sidebar */}
      <CartSidebar isOpen={isCartOpen} onClose={() => setIsCartOpen(false)} />
    </main>
  )
}
