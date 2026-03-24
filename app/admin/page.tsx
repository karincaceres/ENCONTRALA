"use client"

import { useState, useRef, useEffect } from 'react'
import Link from 'next/link'
import { EncontralaLogo } from '@/components/encontrala-logo'
import { prizes } from '@/components/game-provider'
import { Home, Target, Users, Trophy, AlertCircle, Check, Play, Video } from 'lucide-react'

interface Position {
  x: number
  y: number
}

export default function AdminPage() {
  const [selectedPrize, setSelectedPrize] = useState<string | null>(null)
  const [winningPosition, setWinningPosition] = useState<Position | null>(null)
  const [tolerance, setTolerance] = useState(5)
  const [videoUrl, setVideoUrl] = useState('')
  const [description, setDescription] = useState('')
  const [isProcessing, setIsProcessing] = useState(false)
  const [result, setResult] = useState<{
    success: boolean
    winnersCount: number
    totalJugadas: number
    message: string
  } | null>(null)
  
  const fieldRef = useRef<HTMLDivElement>(null)
  const [isHovering, setIsHovering] = useState(false)
  const [hoverPosition, setHoverPosition] = useState<Position>({ x: 0, y: 0 })

  const handleFieldClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!fieldRef.current) return
    const rect = fieldRef.current.getBoundingClientRect()
    const x = ((e.clientX - rect.left) / rect.width) * 100
    const y = ((e.clientY - rect.top) / rect.height) * 100
    setWinningPosition({ x, y })
  }

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!fieldRef.current) return
    const rect = fieldRef.current.getBoundingClientRect()
    const x = ((e.clientX - rect.left) / rect.width) * 100
    const y = ((e.clientY - rect.top) / rect.height) * 100
    setHoverPosition({ x, y })
  }

  const handleSubmit = async () => {
    if (!selectedPrize || !winningPosition) return

    setIsProcessing(true)
    setResult(null)

    try {
      const prize = prizes.find(p => p.id === selectedPrize)
      
      const response = await fetch('/api/admin/winning-position', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          prizeId: selectedPrize,
          prizeName: prize?.name || '',
          positionX: winningPosition.x,
          positionY: winningPosition.y,
          tolerance,
          videoUrl: videoUrl || undefined,
          description: description || undefined,
        }),
      })

      const data = await response.json()

      if (response.ok) {
        setResult({
          success: true,
          winnersCount: data.winnersCount,
          totalJugadas: data.totalJugadas,
          message: `Se procesaron ${data.totalJugadas} jugadas. ${data.winnersCount} ganadores notificados.`,
        })
      } else {
        setResult({
          success: false,
          winnersCount: 0,
          totalJugadas: 0,
          message: data.error || 'Error al procesar',
        })
      }
    } catch (error) {
      setResult({
        success: false,
        winnersCount: 0,
        totalJugadas: 0,
        message: 'Error de conexión',
      })
    } finally {
      setIsProcessing(false)
    }
  }

  return (
    <main className="min-h-screen bg-[#0a0a0a]">
      {/* Header */}
      <header className="bg-[#0a0a0a]/95 border-b border-white/10">
        <div className="container mx-auto px-4 py-3 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2 hover:opacity-80 transition-opacity">
            <Home className="w-5 h-5 text-white" />
            <EncontralaLogo className="w-24 md:w-32" />
          </Link>
          <div className="flex items-center gap-2 px-3 py-1 bg-[#E53935]/20 rounded-full">
            <Target className="w-4 h-4 text-[#E53935]" />
            <span className="text-[#E53935] text-sm font-bold uppercase">Admin</span>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left: Prize Selection & Settings */}
          <div className="space-y-6">
            {/* Prize Selection */}
            <div className="bg-[#1a1a1a] rounded-lg p-6 border border-white/10">
              <h2 className="text-xl font-bold text-white uppercase mb-4 flex items-center gap-2" style={{ fontFamily: 'var(--font-oswald), Impact, sans-serif' }}>
                <Trophy className="w-5 h-5 text-[#8BC34A]" />
                Seleccionar Premio
              </h2>
              
              <div className="space-y-2">
                {prizes.map(prize => (
                  <button
                    key={prize.id}
                    onClick={() => {
                      setSelectedPrize(prize.id)
                      setWinningPosition(null)
                      setResult(null)
                    }}
                    className={`w-full p-3 rounded-lg text-left transition-colors ${
                      selectedPrize === prize.id
                        ? 'bg-[#8BC34A]/20 border border-[#8BC34A]'
                        : 'bg-[#222] border border-transparent hover:border-white/20'
                    }`}
                  >
                    <span className={`text-sm font-semibold ${
                      selectedPrize === prize.id ? 'text-[#8BC34A]' : 'text-white'
                    }`}>
                      {prize.name}
                    </span>
                  </button>
                ))}
              </div>
            </div>

            {/* Settings */}
            <div className="bg-[#1a1a1a] rounded-lg p-6 border border-white/10">
              <h2 className="text-xl font-bold text-white uppercase mb-4" style={{ fontFamily: 'var(--font-oswald), Impact, sans-serif' }}>
                Configuración
              </h2>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-gray-400 text-sm mb-2">
                    Tolerancia (radio en %)
                  </label>
                  <input
                    type="number"
                    value={tolerance}
                    onChange={(e) => setTolerance(Number(e.target.value))}
                    min={1}
                    max={50}
                    className="w-full px-4 py-3 bg-[#222] border border-white/10 rounded-lg text-white focus:border-[#8BC34A] focus:outline-none"
                  />
                  <p className="text-gray-500 text-xs mt-1">
                    Los jugadores dentro de este radio ganan
                  </p>
                </div>

                <div>
                  <label className="block text-gray-400 text-sm mb-2">
                    URL del Video/Replay
                  </label>
                  <input
                    type="url"
                    value={videoUrl}
                    onChange={(e) => setVideoUrl(e.target.value)}
                    placeholder="https://..."
                    className="w-full px-4 py-3 bg-[#222] border border-white/10 rounded-lg text-white placeholder-gray-500 focus:border-[#8BC34A] focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-gray-400 text-sm mb-2">
                    Descripción (opcional)
                  </label>
                  <textarea
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    placeholder="Ej: Gol de Borja min 34"
                    rows={2}
                    className="w-full px-4 py-3 bg-[#222] border border-white/10 rounded-lg text-white placeholder-gray-500 focus:border-[#8BC34A] focus:outline-none resize-none"
                  />
                </div>
              </div>
            </div>

            {/* Selected Position Info */}
            {winningPosition && (
              <div className="bg-[#8BC34A]/10 border border-[#8BC34A]/30 rounded-lg p-4">
                <div className="flex items-center gap-2 mb-2">
                  <Target className="w-5 h-5 text-[#8BC34A]" />
                  <span className="text-[#8BC34A] font-bold">Posición seleccionada</span>
                </div>
                <p className="text-white text-2xl font-bold" style={{ fontFamily: 'var(--font-oswald), Impact, sans-serif' }}>
                  X: {winningPosition.x.toFixed(1)}% Y: {winningPosition.y.toFixed(1)}%
                </p>
              </div>
            )}

            {/* Submit Button */}
            <button
              onClick={handleSubmit}
              disabled={!selectedPrize || !winningPosition || isProcessing}
              className={`w-full py-4 rounded-lg font-bold uppercase text-lg transition-colors flex items-center justify-center gap-2 ${
                !selectedPrize || !winningPosition || isProcessing
                  ? 'bg-[#333] text-gray-500 cursor-not-allowed'
                  : 'bg-[#E53935] hover:bg-[#C62828] text-white'
              }`}
              style={{ fontFamily: 'var(--font-oswald), Impact, sans-serif' }}
            >
              {isProcessing ? (
                <>
                  <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                  </svg>
                  Procesando...
                </>
              ) : (
                <>
                  <Play className="w-5 h-5" />
                  Procesar y Notificar Ganadores
                </>
              )}
            </button>

            {/* Result */}
            {result && (
              <div className={`rounded-lg p-4 ${
                result.success ? 'bg-[#8BC34A]/10 border border-[#8BC34A]/30' : 'bg-[#E53935]/10 border border-[#E53935]/30'
              }`}>
                <div className="flex items-center gap-2 mb-2">
                  {result.success ? (
                    <Check className="w-5 h-5 text-[#8BC34A]" />
                  ) : (
                    <AlertCircle className="w-5 h-5 text-[#E53935]" />
                  )}
                  <span className={`font-bold ${result.success ? 'text-[#8BC34A]' : 'text-[#E53935]'}`}>
                    {result.success ? 'Procesado con éxito' : 'Error'}
                  </span>
                </div>
                <p className="text-white">{result.message}</p>
                {result.success && result.winnersCount > 0 && (
                  <p className="text-[#8BC34A] text-xl font-bold mt-2" style={{ fontFamily: 'var(--font-oswald), Impact, sans-serif' }}>
                    {result.winnersCount} GANADORES!
                  </p>
                )}
              </div>
            )}
          </div>

          {/* Right: Field for selecting winning position */}
          <div className="lg:col-span-2">
            <div className="bg-[#1a1a1a] rounded-lg p-6 border border-white/10">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-bold text-white uppercase flex items-center gap-2" style={{ fontFamily: 'var(--font-oswald), Impact, sans-serif' }}>
                  <Video className="w-5 h-5 text-[#E53935]" />
                  Marcar Posición Ganadora
                </h2>
                {isHovering && (
                  <span className="text-gray-400 text-sm">
                    X: {hoverPosition.x.toFixed(1)}% Y: {hoverPosition.y.toFixed(1)}%
                  </span>
                )}
              </div>

              {selectedPrize ? (
                <div
                  ref={fieldRef}
                  onClick={handleFieldClick}
                  onMouseMove={handleMouseMove}
                  onMouseEnter={() => setIsHovering(true)}
                  onMouseLeave={() => setIsHovering(false)}
                  className="relative w-full aspect-video bg-black rounded-lg overflow-hidden cursor-crosshair"
                >
                  {/* Field Image */}
                  <img
                    src="/images/cancha.jpg"
                    alt="Cancha"
                    className="absolute inset-0 w-full h-full object-cover"
                    draggable={false}
                  />

                  {/* Grid overlay */}
                  <div className="absolute inset-0 pointer-events-none">
                    {[...Array(10)].map((_, i) => (
                      <div
                        key={`v-${i}`}
                        className="absolute top-0 bottom-0 w-px bg-white/10"
                        style={{ left: `${(i + 1) * 10}%` }}
                      />
                    ))}
                    {[...Array(10)].map((_, i) => (
                      <div
                        key={`h-${i}`}
                        className="absolute left-0 right-0 h-px bg-white/10"
                        style={{ top: `${(i + 1) * 10}%` }}
                      />
                    ))}
                  </div>

                  {/* Hover crosshair */}
                  {isHovering && (
                    <>
                      <div
                        className="absolute top-0 bottom-0 w-px bg-[#E53935]/50 pointer-events-none"
                        style={{ left: `${hoverPosition.x}%` }}
                      />
                      <div
                        className="absolute left-0 right-0 h-px bg-[#E53935]/50 pointer-events-none"
                        style={{ top: `${hoverPosition.y}%` }}
                      />
                    </>
                  )}

                  {/* Selected winning position */}
                  {winningPosition && (
                    <div
                      className="absolute z-20 pointer-events-none"
                      style={{
                        left: `${winningPosition.x}%`,
                        top: `${winningPosition.y}%`,
                        transform: 'translate(-50%, -50%)',
                      }}
                    >
                      {/* Tolerance radius */}
                      <div
                        className="absolute rounded-full border-2 border-[#8BC34A]/50 bg-[#8BC34A]/10"
                        style={{
                          width: `${tolerance * 2}%`,
                          height: `${tolerance * 2}%`,
                          left: '50%',
                          top: '50%',
                          transform: 'translate(-50%, -50%)',
                          minWidth: '40px',
                          minHeight: '40px',
                        }}
                      />
                      {/* Center point */}
                      <div className="relative">
                        <div className="w-6 h-6 rounded-full bg-[#E53935] border-2 border-white shadow-lg flex items-center justify-center animate-pulse">
                          <Target className="w-3 h-3 text-white" />
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Instructions overlay */}
                  {!winningPosition && (
                    <div className="absolute inset-0 flex items-center justify-center bg-black/40 pointer-events-none">
                      <div className="text-center">
                        <Target className="w-12 h-12 text-[#E53935] mx-auto mb-3" />
                        <p className="text-white font-bold">Click para marcar la posición ganadora</p>
                        <p className="text-gray-400 text-sm">del video/replay oficial</p>
                      </div>
                    </div>
                  )}
                </div>
              ) : (
                <div className="w-full aspect-video bg-[#222] rounded-lg flex items-center justify-center">
                  <div className="text-center">
                    <Trophy className="w-12 h-12 text-gray-600 mx-auto mb-3" />
                    <p className="text-gray-400">Seleccioná un premio primero</p>
                  </div>
                </div>
              )}

              <p className="text-gray-500 text-sm mt-4 text-center">
                Marcá el punto exacto donde cayó la pelota en la jugada del video/replay oficial. 
                Los participantes dentro del radio de tolerancia ({tolerance}%) serán notificados como ganadores.
              </p>
            </div>
          </div>
        </div>
      </div>
    </main>
  )
}
