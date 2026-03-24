"use client"

import Link from 'next/link'
import { useGame } from '@/components/game-provider'
import { EncontralaLogo } from '@/components/encontrala-logo'
import { FieldGame } from '@/components/field-game'
import { Home, Plus, Trash2, Play, RotateCcw, Check } from 'lucide-react'
import { useRouter } from 'next/navigation'

export default function LaJugadaPage() {
  const { 
    cart, 
    updateQuantity, 
    removeFromCart, 
    getTotalItems,
    currentPlayingId,
    setCurrentPlayingId
  } = useGame()
  const router = useRouter()

  const allPlayed = cart.length > 0 && cart.every(item => item.played)
  const playedCount = cart.filter(item => item.played).length

  if (cart.length === 0) {
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
            <Play className="w-12 h-12 text-gray-600" />
          </div>
          <h1 className="text-2xl md:text-3xl font-bold text-white mb-4" style={{ fontFamily: 'var(--font-oswald), Impact, sans-serif' }}>
            NO TENES PREMIOS SELECCIONADOS
          </h1>
          <p className="text-gray-400 mb-8 max-w-md">
            Agregá premios a tu jugada para comenzar a jugar por ellos
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

  return (
    <main className="h-screen bg-[#0a0a0a] flex flex-col overflow-hidden">
      {/* Header */}
      <header className="shrink-0 bg-[#0a0a0a]/95 border-b border-white/10">
        <div className="container mx-auto px-4 py-3 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2 hover:opacity-80 transition-opacity">
            <Home className="w-5 h-5 text-white" />
            <EncontralaLogo className="w-24 md:w-32" />
          </Link>
        </div>
      </header>
      
      {/* Main Content - Split Layout */}
      <div className="flex-1 flex overflow-hidden">
        {/* Left Side - Field Game Area */}
        <div className="flex-1 bg-black relative">
          {currentPlayingId ? (
            <FieldGame
              prizeId={currentPlayingId}
              prizeName={cart.find(item => item.id === currentPlayingId)?.name || ''}
              onClose={() => setCurrentPlayingId(null)}
            />
          ) : playedCount > 0 ? (
            /* Show saved positions on the field */
            <div className="absolute inset-0">
              {/* Field background */}
              <img
                src="/images/cancha.jpg"
                alt="Cancha"
                className="absolute inset-0 w-full h-full object-cover"
              />
              
              {/* Title overlay */}
              <div className="absolute top-4 left-4 bg-black/70 backdrop-blur-sm px-4 py-2 rounded-lg">
                <h2 className="text-[#8BC34A] font-bold uppercase" style={{ fontFamily: 'var(--font-oswald), Impact, sans-serif' }}>
                  TUS JUGADAS GUARDADAS
                </h2>
              </div>

              {/* Saved markers */}
              {cart.filter(item => item.played && item.position).map((item, index) => (
                <div
                  key={item.id}
                  className="absolute z-10 cursor-pointer group"
                  style={{
                    left: `${item.position!.x}%`,
                    top: `${item.position!.y}%`,
                    transform: 'translate(-50%, -50%)'
                  }}
                  onClick={() => setCurrentPlayingId(item.id)}
                >
                  {/* Marker */}
                  <div className="relative">
                    <div className="w-8 h-8 rounded-full bg-[#8BC34A] border-2 border-white shadow-lg flex items-center justify-center">
                      <span className="text-black text-xs font-bold">{index + 1}</span>
                    </div>
                    {/* Tooltip on hover */}
                    <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">
                      <div className="bg-black/90 px-3 py-2 rounded whitespace-nowrap text-xs">
                        <p className="text-white font-bold">{item.name}</p>
                        <p className="text-[#8BC34A]">X:{item.position!.x.toFixed(0)}% Y:{item.position!.y.toFixed(0)}%</p>
                      </div>
                    </div>
                  </div>
                </div>
              ))}

              {/* Legend */}
              <div className="absolute bottom-4 left-4 bg-black/70 backdrop-blur-sm px-4 py-3 rounded-lg">
                <p className="text-gray-400 text-sm mb-2">Hacé click en un marcador para re-jugar</p>
                <div className="flex flex-wrap gap-2">
                  {cart.filter(item => item.played).map((item, index) => (
                    <div key={item.id} className="flex items-center gap-2 text-xs">
                      <div className="w-5 h-5 rounded-full bg-[#8BC34A] flex items-center justify-center">
                        <span className="text-black font-bold text-[10px]">{index + 1}</span>
                      </div>
                      <span className="text-white truncate max-w-[120px]">{item.name}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          ) : (
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="text-center p-8">
                <div className="w-32 h-32 mx-auto mb-6 rounded-full bg-[#1a1a1a] flex items-center justify-center">
                  <Play className="w-16 h-16 text-[#8BC34A]" />
                </div>
                <h2 className="text-2xl md:text-3xl font-bold text-white mb-3" style={{ fontFamily: 'var(--font-oswald), Impact, sans-serif' }}>
                  SELECCIONÁ UN PREMIO
                </h2>
                <p className="text-gray-400 max-w-md">
                  Elegí un premio de la lista y hacé click en &quot;Jugar&quot; para ubicar tu jugada en la cancha
                </p>
              </div>
            </div>
          )}
        </div>

        {/* Right Side - Sidebar */}
        <div className="w-80 md:w-96 bg-[#1a1a1a] flex flex-col border-l border-white/10">
          {/* Sidebar Header */}
          <div className="px-4 py-4 border-b border-white/10">
            <div className="flex items-center justify-between">
              <h1 className="text-2xl md:text-3xl font-bold text-[#8BC34A] uppercase" style={{ fontFamily: 'var(--font-oswald), Impact, sans-serif' }}>
                TU JUGADA!
              </h1>
              <span className="text-gray-400 text-sm">
                Ya jugaste {playedCount}/{cart.length}
              </span>
            </div>
          </div>

          {/* Prize List */}
          <div className="flex-1 overflow-y-auto">
            {cart.map((item) => (
              <div 
                key={item.id}
                className={`px-4 py-4 border-b border-white/5 ${
                  currentPlayingId === item.id ? 'bg-[#8BC34A]/10' : ''
                }`}
              >
                {/* Prize Name */}
                <h3 className="text-white text-sm md:text-base font-bold uppercase mb-3" style={{ fontFamily: 'var(--font-oswald), Impact, sans-serif' }}>
                  {item.name}
                </h3>
                
                {/* Actions Row */}
                <div className="flex items-center gap-3 text-sm">
                  {/* Play/Replay Button */}
                  {item.played ? (
                    <button
                      onClick={() => setCurrentPlayingId(item.id)}
                      className="text-[#8BC34A] hover:text-[#9CCC65] transition-colors flex items-center gap-1"
                    >
                      <RotateCcw className="w-3 h-3" />
                      Re-jugar
                    </button>
                  ) : (
                    <button
                      onClick={() => setCurrentPlayingId(item.id)}
                      className="text-white hover:text-[#8BC34A] transition-colors"
                    >
                      Jugar
                    </button>
                  )}
                  
                  <span className="text-gray-600">|</span>
                  
                  {/* Add More */}
                  <button
                    onClick={() => updateQuantity(item.id, item.quantity + 1)}
                    className="text-white hover:text-[#8BC34A] transition-colors flex items-center gap-1"
                  >
                    <Plus className="w-3 h-3" />
                    Agregar
                  </button>
                  
                  <span className="text-gray-600">|</span>
                  
                  {/* Delete */}
                  <button
                    onClick={() => removeFromCart(item.id)}
                    className="text-[#E53935] hover:text-[#EF5350] transition-colors"
                  >
                    Eliminar
                  </button>
                </div>

                {/* Played indicator */}
                {item.played && item.position && (
                  <div className="mt-2 flex items-center gap-2 text-xs text-[#8BC34A]">
                    <Check className="w-3 h-3" />
                    <span>Posición: X:{item.position.x.toFixed(0)}% Y:{item.position.y.toFixed(0)}%</span>
                  </div>
                )}

                {/* Quantity indicator */}
                {item.quantity > 1 && (
                  <div className="mt-2 text-xs text-gray-400">
                    {item.quantity} chances seleccionadas
                  </div>
                )}
              </div>
            ))}
          </div>

          {/* Confirm Button */}
          <div className="shrink-0">
            <Link
              href="/check-out"
              className={`block w-full py-4 text-center font-bold uppercase text-lg transition-colors ${
                allPlayed
                  ? 'bg-[#E53935] hover:bg-[#C62828] text-white'
                  : 'bg-[#E53935]/50 text-white/70'
              }`}
              style={{ fontFamily: 'var(--font-oswald), Impact, sans-serif' }}
            >
              CONFIRMAR
            </Link>
          </div>
        </div>
      </div>
    </main>
  )
}
