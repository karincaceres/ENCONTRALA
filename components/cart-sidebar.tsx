"use client"

import { useGame } from '@/components/game-provider'
import { Trash2, X } from 'lucide-react'
import Link from 'next/link'

interface CartSidebarProps {
  isOpen: boolean
  onClose: () => void
}

export function CartSidebar({ isOpen, onClose }: CartSidebarProps) {
  const { cart, removeFromCart, getTotal } = useGame()

  if (!isOpen) return null

  return (
    <>
      {/* Overlay */}
      <div 
        className="fixed inset-0 bg-black/60 z-40"
        onClick={onClose}
      />
      
      {/* Sidebar */}
      <div className="fixed right-0 top-0 h-full w-full max-w-md bg-[#1a1a1a] z-50 shadow-2xl flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-white/10">
          <h2 className="text-xl font-bold text-white uppercase" style={{ fontFamily: 'var(--font-oswald), Impact, sans-serif' }}>
            TU JUGADA!
          </h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-white/10 rounded-lg transition-colors"
            aria-label="Cerrar carrito"
          >
            <X className="w-6 h-6 text-white" />
          </button>
        </div>
        
        {/* Cart Items */}
        <div className="flex-1 overflow-y-auto p-4 space-y-3">
          {cart.length === 0 ? (
            <div className="text-center text-gray-400 py-8">
              <p>No hay premios seleccionados</p>
              <p className="text-sm mt-2">Agregá premios para jugar</p>
            </div>
          ) : (
            cart.map((item) => (
              <div 
                key={item.id}
                className="bg-[#222] rounded-lg p-3 flex items-start justify-between gap-3"
              >
                <div className="flex-1">
                  <h3 className="text-white text-sm font-semibold leading-tight">
                    {item.name}
                  </h3>
                  <div className="flex items-center gap-2 mt-2">
                    <span className="text-[#8BC34A] font-bold">
                      x{item.quantity}
                    </span>
                    <span className="text-gray-400">=</span>
                    <span className="text-white font-bold">
                      ${item.price * item.quantity}
                    </span>
                  </div>
                </div>
                <button
                  onClick={() => removeFromCart(item.id)}
                  className="p-2 text-gray-400 hover:text-[#E53935] hover:bg-white/5 rounded transition-all"
                  aria-label={`Eliminar ${item.name}`}
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            ))
          )}
        </div>
        
        {/* Footer */}
        {cart.length > 0 && (
          <div className="p-4 border-t border-white/10 space-y-4">
            {/* Total */}
            <div className="flex items-center justify-between">
              <span className="text-white font-bold uppercase">Total:</span>
              <span className="text-[#8BC34A] text-2xl font-bold" style={{ fontFamily: 'var(--font-oswald), Impact, sans-serif' }}>
                ${getTotal()}
              </span>
            </div>
            
            {/* Action Button */}
            <Link
              href="/la-jugada"
              onClick={onClose}
              className="block w-full py-3 bg-[#E53935] hover:bg-[#C62828] text-white text-center font-bold uppercase rounded-lg transition-colors"
              style={{ fontFamily: 'var(--font-oswald), Impact, sans-serif' }}
            >
              A JUGAR
            </Link>
          </div>
        )}
      </div>
    </>
  )
}
