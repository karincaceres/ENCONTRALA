"use client"

import { useState } from 'react'
import Link from 'next/link'
import { useGame } from '@/components/game-provider'
import { EncontralaLogo } from '@/components/encontrala-logo'
import { Home, ArrowLeft, Trash2, User, CheckCircle2, Gift } from 'lucide-react'

export default function CheckOutPage() {
  const { cart, removeFromCart, getTotalItems, clearCart } = useGame()
  const [isProcessing, setIsProcessing] = useState(false)
  const [isComplete, setIsComplete] = useState(false)

  // Form state
  const [contactData, setContactData] = useState({
    nombre: '',
    email: '',
    telefono: '',
  })

 const handleSubmit = async (e: React.FormEvent) => {
  e.preventDefault()
  setIsProcessing(true)

  try {
    // Simulación temporal: no guarda nada en backend
    console.log('CHECKOUT TEMPORAL - sin guardado', {
      contactData,
      cart,
    })

    // pequeña espera para que se vea el loader
    await new Promise((resolve) => setTimeout(resolve, 1200))

    setIsComplete(true)

    // limpia el carrito después de mostrar éxito
    setTimeout(() => {
      clearCart()
    }, 3000)
  } catch (error) {
    console.error('Error:', error)
    alert('Hubo un error al procesar tu jugada. Intenta de nuevo.')
  } finally {
    setIsProcessing(false)
  }
}
  if (cart.length === 0 && !isComplete) {
    return (
      <main className="min-h-screen bg-[#0a0a0a] flex flex-col">
        {/* Header */}
        <header className="bg-[#0a0a0a]/95 border-b border-white/10">
          <div className="container mx-auto px-4 py-3 flex items-center justify-between">
            <Link href="/" className="flex items-center gap-2 hover:opacity-80 transition-opacity">
              <Home className="w-5 h-5 text-white" />
              <EncontralaLogo className="w-24 md:w-32" />
            </Link>
          </div>
        </header>

        {/* Empty State */}
        <div className="flex-1 flex flex-col items-center justify-center p-8 text-center">
          <div className="w-24 h-24 mb-6 rounded-full bg-[#1a1a1a] flex items-center justify-center">
            <Gift className="w-12 h-12 text-gray-600" />
          </div>
          <h1 className="text-2xl md:text-3xl font-bold text-white mb-4" style={{ fontFamily: 'var(--font-oswald), Impact, sans-serif' }}>
            NO HAY PREMIOS SELECCIONADOS
          </h1>
          <p className="text-gray-400 mb-8 max-w-md">
            Primero selecciona los premios por los que quieras jugar
          </p>
          <Link
            href="/a-jugar"
            className="px-8 py-4 bg-[#E53935] hover:bg-[#C62828] text-white font-bold uppercase rounded-lg transition-colors"
            style={{ fontFamily: 'var(--font-oswald), Impact, sans-serif' }}
          >
            SELECCIONAR PREMIOS
          </Link>
        </div>
      </main>
    )
  }

  if (isComplete) {
    return (
      <main className="min-h-screen bg-[#0a0a0a] flex flex-col">
        {/* Header */}
        <header className="bg-[#0a0a0a]/95 border-b border-white/10">
          <div className="container mx-auto px-4 py-3 flex items-center justify-between">
            <Link href="/" className="flex items-center gap-2 hover:opacity-80 transition-opacity">
              <Home className="w-5 h-5 text-white" />
              <EncontralaLogo className="w-24 md:w-32" />
            </Link>
          </div>
        </header>

        {/* Success State */}
        <div className="flex-1 flex flex-col items-center justify-center p-8 text-center">
          <div className="w-24 h-24 mb-6 rounded-full bg-[#8BC34A]/20 flex items-center justify-center animate-pulse">
            <CheckCircle2 className="w-16 h-16 text-[#8BC34A]" />
          </div>
          <h1 className="text-2xl md:text-4xl font-bold text-white mb-4" style={{ fontFamily: 'var(--font-oswald), Impact, sans-serif' }}>
            REGISTRO EXITOSO!
          </h1>
          <p className="text-gray-400 mb-2 max-w-md text-lg">
            Tu jugada fue registrada. Mucha suerte!
          </p>
          <p className="text-[#8BC34A] mb-8 max-w-md">
            Te enviamos un email de confirmación con los detalles de tu jugada.
          </p>
          <Link
            href="/"
            className="px-8 py-4 bg-[#E53935] hover:bg-[#C62828] text-white font-bold uppercase rounded-lg transition-colors"
            style={{ fontFamily: 'var(--font-oswald), Impact, sans-serif' }}
          >
            VOLVER AL INICIO
          </Link>
        </div>
      </main>
    )
  }

  return (
    <main className="min-h-screen bg-[#0a0a0a]">
      {/* Header */}
      <header className="sticky top-0 z-30 bg-[#0a0a0a]/95 backdrop-blur-sm border-b border-white/10">
        <div className="container mx-auto px-4 py-3 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2 hover:opacity-80 transition-opacity">
            <Home className="w-5 h-5 text-white" />
            <EncontralaLogo className="w-24 md:w-32" />
          </Link>

          <Link
            href="/la-jugada"
            className="flex items-center gap-2 px-4 py-2 bg-[#333] hover:bg-[#444] rounded-lg transition-colors text-white"
          >
            <ArrowLeft className="w-4 h-4" />
            <span className="hidden md:inline">Volver</span>
          </Link>
        </div>
      </header>

      {/* Page Title */}
      <div className="bg-gradient-to-b from-[#1a1a1a] to-[#0a0a0a] py-6 md:py-8">
        <div className="container mx-auto px-4">
          <div className="flex items-center gap-4">
            <div className="w-1 h-12 bg-[#E53935] rounded-full" />
            <div>
              <h1 className="text-2xl md:text-4xl font-bold text-white uppercase tracking-wide" style={{ fontFamily: 'var(--font-oswald), Impact, sans-serif' }}>
                CONFIRMAR JUGADA
              </h1>
              <p className="text-gray-400 text-sm md:text-base mt-1">
                Completa tus datos para participar GRATIS
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-6 md:py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 md:gap-8">
          {/* Order Summary */}
          <div className="lg:col-span-1 order-2 lg:order-1">
            <div className="bg-[#1a1a1a] rounded-lg p-4 md:p-6 border border-white/10 sticky top-24">
              <h2 className="text-xl font-bold text-white uppercase mb-4" style={{ fontFamily: 'var(--font-oswald), Impact, sans-serif' }}>
                Tu Jugada
              </h2>

              <div className="space-y-3 mb-6">
                {cart.map((item) => (
                  <div
                    key={item.id}
                    className="flex items-start justify-between gap-3 py-3 border-b border-white/10 last:border-0"
                  >
                    <div className="flex-1">
                      <h3 className="text-white text-sm font-semibold leading-tight">
                        {item.name}
                      </h3>
                      <div className="flex items-center gap-2 mt-1">
                        <span className="text-[#8BC34A] text-sm font-bold">
                          x{item.quantity} chances
                        </span>
                      </div>
                    </div>
                    <button
                      onClick={() => removeFromCart(item.id)}
                      className="p-1 text-gray-500 hover:text-[#E53935] transition-colors"
                      aria-label={`Eliminar ${item.name}`}
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                ))}
              </div>

              {/* Total */}
              <div className="pt-4 border-t border-white/10">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-white font-bold uppercase">Total de chances:</span>
                  <span className="text-white text-xl font-bold">
                    {getTotalItems()}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-white font-bold uppercase">Costo:</span>
                  <span className="text-[#8BC34A] text-3xl font-bold" style={{ fontFamily: 'var(--font-oswald), Impact, sans-serif' }}>
                    GRATIS
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Registration Form */}
          <div className="lg:col-span-2 order-1 lg:order-2">
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Contact Information */}
              <div className="bg-[#1a1a1a] rounded-lg p-4 md:p-6 border border-white/10">
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-10 h-10 rounded-full bg-[#E53935]/20 flex items-center justify-center">
                    <User className="w-5 h-5 text-[#E53935]" />
                  </div>
                  <h2 className="text-xl font-bold text-white uppercase" style={{ fontFamily: 'var(--font-oswald), Impact, sans-serif' }}>
                    Datos de Contacto
                  </h2>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="md:col-span-2">
                    <label className="block text-gray-400 text-sm mb-2" htmlFor="nombre">
                      Nombre completo
                    </label>
                    <input
                      type="text"
                      id="nombre"
                      required
                      value={contactData.nombre}
                      onChange={(e) => setContactData({ ...contactData, nombre: e.target.value })}
                      className="w-full px-4 py-3 bg-[#222] border border-white/10 rounded-lg text-white placeholder-gray-500 focus:border-[#E53935] focus:outline-none transition-colors"
                      placeholder="Juan Pérez"
                    />
                  </div>

                  <div>
                    <label className="block text-gray-400 text-sm mb-2" htmlFor="email">
                      Email
                    </label>
                    <input
                      type="email"
                      id="email"
                      required
                      value={contactData.email}
                      onChange={(e) => setContactData({ ...contactData, email: e.target.value })}
                      className="w-full px-4 py-3 bg-[#222] border border-white/10 rounded-lg text-white placeholder-gray-500 focus:border-[#E53935] focus:outline-none transition-colors"
                      placeholder="juan@email.com"
                    />
                  </div>

                  <div>
                    <label className="block text-gray-400 text-sm mb-2" htmlFor="telefono">
                      Teléfono
                    </label>
                    <input
                      type="tel"
                      id="telefono"
                      required
                      value={contactData.telefono}
                      onChange={(e) => setContactData({ ...contactData, telefono: e.target.value })}
                      className="w-full px-4 py-3 bg-[#222] border border-white/10 rounded-lg text-white placeholder-gray-500 focus:border-[#E53935] focus:outline-none transition-colors"
                      placeholder="+54 11 1234-5678"
                    />
                  </div>
                </div>
              </div>

              {/* Free notice */}
              <div className="bg-[#8BC34A]/10 border border-[#8BC34A]/30 rounded-lg p-4 flex items-center gap-4">
                <Gift className="w-8 h-8 text-[#8BC34A] shrink-0" />
                <div>
                  <p className="text-[#8BC34A] font-bold uppercase" style={{ fontFamily: 'var(--font-oswald), Impact, sans-serif' }}>
                    Participación 100% Gratuita
                  </p>
                  <p className="text-gray-400 text-sm">
                    No necesitas tarjeta de crédito ni pagar nada
                  </p>
                </div>
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={isProcessing}
                className={`w-full py-4 rounded-lg font-bold uppercase text-lg transition-all duration-300 ${
                  isProcessing
                    ? 'bg-[#333] text-gray-500 cursor-not-allowed'
                    : 'bg-[#E53935] hover:bg-[#C62828] text-white'
                }`}
                style={{ fontFamily: 'var(--font-oswald), Impact, sans-serif' }}
              >
                {isProcessing ? (
                  <span className="flex items-center justify-center gap-3">
                    <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Registrando...
                  </span>
                ) : (
                  'CONFIRMAR JUGADA GRATIS'
                )}
              </button>
            </form>
          </div>
        </div>
      </div>
    </main>
  )
}
