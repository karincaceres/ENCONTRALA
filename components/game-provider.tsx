"use client"

import { createContext, useContext, useState, ReactNode } from 'react'

export interface Prize {
  id: string
  name: string
  description: string
  price: number
  image: string
}

export interface CartItem extends Prize {
  quantity: number
  played?: boolean
  position?: { x: number; y: number }
}

interface GameContextType {
  cart: CartItem[]
  addToCart: (prize: Prize, quantity?: number) => void
  removeFromCart: (prizeId: string) => void
  updateQuantity: (prizeId: string, quantity: number) => void
  clearCart: () => void
  getTotal: () => number
  getTotalItems: () => number
  markAsPlayed: (prizeId: string, position: { x: number; y: number }) => void
  currentPlayingId: string | null
  setCurrentPlayingId: (id: string | null) => void
}

const GameContext = createContext<GameContextType | undefined>(undefined)

export const prizes: Prize[] = [
  {
    id: 'meet-greet',
    name: 'Meet & greet con MARCELO GALLARDO',
    description: 'Conocé personalmente al Muñeco Gallardo',
    price: 0,
    image: 'https://hebbkx1anhila5yf.public.blob.vercel-storage.com/orsai_extracted_assets_contact_sheet-UDeZWEIaZnsFB9sfus4YvFxRNQYFOj.png'
  },
  {
    id: 'viaje-equipo',
    name: 'UN VIAJE CON EL EQUIPO DE VISITANTE',
    description: 'Viajá con el plantel a un partido de visitante',
    price: 0,
    image: 'https://hebbkx1anhila5yf.public.blob.vercel-storage.com/orsai_extracted_assets_contact_sheet-UDeZWEIaZnsFB9sfus4YvFxRNQYFOj.png'
  },
  {
    id: 'cuota-social',
    name: 'UN AÑO DE CUOTA SOCIAL SIN CARGO',
    description: 'Un año completo de membresía gratis',
    price: 0,
    image: 'https://hebbkx1anhila5yf.public.blob.vercel-storage.com/orsai_extracted_assets_contact_sheet-UDeZWEIaZnsFB9sfus4YvFxRNQYFOj.png'
  },
  {
    id: 'camiseta-firmada',
    name: 'CAMISETA FIRMADA POR EL PLANTEL',
    description: 'Camiseta oficial con firmas del plantel',
    price: 0,
    image: 'https://hebbkx1anhila5yf.public.blob.vercel-storage.com/orsai_extracted_assets_contact_sheet-UDeZWEIaZnsFB9sfus4YvFxRNQYFOj.png'
  },
  {
    id: 'experiencia-river',
    name: 'UNA EXPERIENCIA RIVER',
    description: 'Experiencia exclusiva en el Monumental',
    price: 0,
    image: 'https://hebbkx1anhila5yf.public.blob.vercel-storage.com/orsai_extracted_assets_contact_sheet-UDeZWEIaZnsFB9sfus4YvFxRNQYFOj.png'
  },
  {
    id: 'kit-hincha',
    name: 'KIT DEL HINCHA',
    description: 'Kit completo de merchandising oficial',
    price: 0,
    image: 'https://hebbkx1anhila5yf.public.blob.vercel-storage.com/orsai_extracted_assets_contact_sheet-UDeZWEIaZnsFB9sfus4YvFxRNQYFOj.png'
  }
]

export function GameProvider({ children }: { children: ReactNode }) {
  const [cart, setCart] = useState<CartItem[]>([])
  const [currentPlayingId, setCurrentPlayingId] = useState<string | null>(null)

  const addToCart = (prize: Prize, quantity: number = 1) => {
    setCart(prev => {
      const existing = prev.find(item => item.id === prize.id)
      if (existing) {
        return prev.map(item =>
          item.id === prize.id
            ? { ...item, quantity: item.quantity + quantity }
            : item
        )
      }
      return [...prev, { ...prize, quantity }]
    })
  }

  const removeFromCart = (prizeId: string) => {
    setCart(prev => prev.filter(item => item.id !== prizeId))
  }

  const updateQuantity = (prizeId: string, quantity: number) => {
    if (quantity <= 0) {
      removeFromCart(prizeId)
      return
    }
    setCart(prev =>
      prev.map(item =>
        item.id === prizeId ? { ...item, quantity } : item
      )
    )
  }

  const clearCart = () => setCart([])

  const getTotal = () => cart.reduce((sum, item) => sum + item.price * item.quantity, 0)

  const getTotalItems = () => cart.reduce((sum, item) => sum + item.quantity, 0)

  const markAsPlayed = (prizeId: string, position: { x: number; y: number }) => {
    setCart(prev =>
      prev.map(item =>
        item.id === prizeId ? { ...item, played: true, position } : item
      )
    )
    setCurrentPlayingId(null)
  }

  return (
    <GameContext.Provider value={{
      cart,
      addToCart,
      removeFromCart,
      updateQuantity,
      clearCart,
      getTotal,
      getTotalItems,
      markAsPlayed,
      currentPlayingId,
      setCurrentPlayingId
    }}>
      {children}
    </GameContext.Provider>
  )
}

export function useGame() {
  const context = useContext(GameContext)
  if (!context) {
    throw new Error('useGame must be used within a GameProvider')
  }
  return context
}
