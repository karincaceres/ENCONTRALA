"use client"

import { useState } from 'react'
import { Prize, useGame } from '@/components/game-provider'
import { Plus, Minus } from 'lucide-react'

interface PrizeCardProps {
  prize: Prize
  imageUrl: string
}

export function PrizeCard({ prize, imageUrl }: PrizeCardProps) {
  const [quantity, setQuantity] = useState(0)
  const { addToCart } = useGame()

  const handleAdd = () => {
    if (quantity > 0) {
      addToCart(prize, quantity)
      setQuantity(0)
    }
  }

  const incrementQuantity = () => setQuantity(prev => prev + 1)
  const decrementQuantity = () => setQuantity(prev => Math.max(0, prev - 1))

  return (
    <div className="relative flex flex-col bg-[#1a1a1a]/80 rounded-lg overflow-hidden border border-white/10 hover:border-[#E53935]/50 transition-all duration-300 group">
      {/* Image */}
      <div className="relative aspect-[4/3] overflow-hidden">
        <img 
          src={imageUrl} 
          alt={prize.name}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
        
        {/* Prize Name Overlay */}
        <div className="absolute bottom-0 left-0 right-0 p-3">
          <h3 className="text-white text-sm md:text-base font-bold uppercase leading-tight line-clamp-2" style={{ fontFamily: 'var(--font-oswald), Impact, sans-serif' }}>
            {prize.name}
          </h3>
        </div>
      </div>
      
      {/* Price & Controls */}
      <div className="p-3 flex flex-col gap-3">
        {/* Free Badge */}
        <div className="text-center">
          <span className="text-[#8BC34A] text-xl md:text-2xl font-bold" style={{ fontFamily: 'var(--font-oswald), Impact, sans-serif' }}>
            GRATIS
          </span>
        </div>
        
        {/* Quantity Controls */}
        <div className="flex items-center justify-center gap-2">
          <button
            onClick={decrementQuantity}
            className="w-8 h-8 flex items-center justify-center bg-[#333] hover:bg-[#444] rounded transition-colors"
            aria-label="Decrementar cantidad"
          >
            <Minus className="w-4 h-4 text-white" />
          </button>
          
          <div className="w-12 h-8 flex items-center justify-center bg-[#222] rounded border border-white/20">
            <span className="text-white font-bold">{quantity}</span>
          </div>
          
          <button
            onClick={incrementQuantity}
            className="w-8 h-8 flex items-center justify-center bg-[#333] hover:bg-[#444] rounded transition-colors"
            aria-label="Incrementar cantidad"
          >
            <Plus className="w-4 h-4 text-white" />
          </button>
        </div>
        
        {/* Add Button */}
        <button
          onClick={handleAdd}
          disabled={quantity === 0}
          className={`w-full py-2 rounded font-bold uppercase text-sm tracking-wider transition-all duration-300 ${
            quantity > 0
              ? 'bg-[#E53935] hover:bg-[#C62828] text-white cursor-pointer'
              : 'bg-[#333] text-gray-500 cursor-not-allowed'
          }`}
          style={{ fontFamily: 'var(--font-oswald), Impact, sans-serif' }}
        >
          AGREGAR
        </button>
      </div>
    </div>
  )
}
