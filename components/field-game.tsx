"use client"

import { useState, useRef, useCallback, useEffect } from 'react'
import { useGame } from './game-provider'
import { Target, Check, X } from 'lucide-react'

interface FieldGameProps {
  prizeId: string
  prizeName: string
  onClose: () => void
}

export function FieldGame({ prizeId, prizeName, onClose }: FieldGameProps) {
  const { markAsPlayed } = useGame()
  const containerRef = useRef<HTMLDivElement>(null)
  const [position, setPosition] = useState<{ x: number; y: number } | null>(null)
  const [isDragging, setIsDragging] = useState(false)
  const [showCoordinates, setShowCoordinates] = useState(true)

  const handleInteraction = useCallback((clientX: number, clientY: number) => {
    if (!containerRef.current) return
    
    const rect = containerRef.current.getBoundingClientRect()
    const x = ((clientX - rect.left) / rect.width) * 100
    const y = ((clientY - rect.top) / rect.height) * 100
    
    // Clamp values between 0 and 100
    const clampedX = Math.max(0, Math.min(100, x))
    const clampedY = Math.max(0, Math.min(100, y))
    
    setPosition({ x: clampedX, y: clampedY })
  }, [])

  const handleMouseDown = (e: React.MouseEvent) => {
    setIsDragging(true)
    handleInteraction(e.clientX, e.clientY)
  }

  const handleMouseMove = (e: React.MouseEvent) => {
    if (isDragging) {
      handleInteraction(e.clientX, e.clientY)
    }
  }

  const handleMouseUp = () => {
    setIsDragging(false)
  }

  const handleTouchStart = (e: React.TouchEvent) => {
    setIsDragging(true)
    const touch = e.touches[0]
    handleInteraction(touch.clientX, touch.clientY)
  }

  const handleTouchMove = (e: React.TouchEvent) => {
    if (isDragging) {
      const touch = e.touches[0]
      handleInteraction(touch.clientX, touch.clientY)
    }
  }

  const handleTouchEnd = () => {
    setIsDragging(false)
  }

  const handleClick = (e: React.MouseEvent) => {
    handleInteraction(e.clientX, e.clientY)
  }

  const handleSave = () => {
    if (position) {
      markAsPlayed(prizeId, position)
    }
  }

  useEffect(() => {
    const handleGlobalMouseUp = () => setIsDragging(false)
    window.addEventListener('mouseup', handleGlobalMouseUp)
    window.addEventListener('touchend', handleGlobalMouseUp)
    return () => {
      window.removeEventListener('mouseup', handleGlobalMouseUp)
      window.removeEventListener('touchend', handleGlobalMouseUp)
    }
  }, [])

  return (
    <div className="relative w-full h-full flex flex-col">
      {/* Header with prize name */}
      <div className="bg-[#1a1a1a] px-4 py-3 border-b border-white/10 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Target className="w-5 h-5 text-[#8BC34A]" />
          <span className="text-white font-bold uppercase text-sm md:text-base" style={{ fontFamily: 'var(--font-oswald), Impact, sans-serif' }}>
            {prizeName}
          </span>
        </div>
        <button
          onClick={onClose}
          className="p-2 text-gray-400 hover:text-white hover:bg-white/10 rounded transition-all"
          aria-label="Cerrar"
        >
          <X className="w-5 h-5" />
        </button>
      </div>

      {/* Field Container */}
      <div 
        ref={containerRef}
        className="flex-1 relative cursor-crosshair select-none overflow-hidden bg-black"
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseUp}
        onClick={handleClick}
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
      >
        {/* Soccer Field Image */}
        <img
          src="/images/cancha.jpg"
          alt="Cancha"
          className="absolute inset-0 w-full h-full object-cover"
          draggable={false}
        />

        {/* Grid Overlay for coordinates */}
        {showCoordinates && (
          <div className="absolute inset-0 pointer-events-none">
            {/* Vertical lines */}
            {[10, 20, 30, 40, 50, 60, 70, 80, 90].map(x => (
              <div
                key={`v-${x}`}
                className="absolute top-0 bottom-0 w-px bg-white/10"
                style={{ left: `${x}%` }}
              />
            ))}
            {/* Horizontal lines */}
            {[10, 20, 30, 40, 50, 60, 70, 80, 90].map(y => (
              <div
                key={`h-${y}`}
                className="absolute left-0 right-0 h-px bg-white/10"
                style={{ top: `${y}%` }}
              />
            ))}
            {/* Center crosshair */}
            <div className="absolute left-1/2 top-1/2 w-8 h-8 -translate-x-1/2 -translate-y-1/2">
              <div className="absolute left-1/2 top-0 bottom-0 w-px bg-[#8BC34A]/30 -translate-x-1/2" />
              <div className="absolute top-1/2 left-0 right-0 h-px bg-[#8BC34A]/30 -translate-y-1/2" />
            </div>
          </div>
        )}

        {/* Position Marker */}
        {position && (
          <div
            className="absolute pointer-events-none z-10"
            style={{
              left: `${position.x}%`,
              top: `${position.y}%`,
              transform: 'translate(-50%, -50%)'
            }}
          >
            {/* Crosshair lines extending to edges */}
            <div 
              className="absolute w-px bg-[#8BC34A]/60"
              style={{
                left: '50%',
                top: '-50vh',
                height: '100vh',
                transform: 'translateX(-50%)'
              }}
            />
            <div 
              className="absolute h-px bg-[#8BC34A]/60"
              style={{
                top: '50%',
                left: '-50vw',
                width: '100vw',
                transform: 'translateY(-50%)'
              }}
            />
            
            {/* Target circle */}
            <div className="relative">
              {/* Outer ring pulse */}
              <div className="absolute -inset-4 rounded-full border-2 border-[#8BC34A] animate-ping opacity-30" />
              {/* Outer ring */}
              <div className="absolute -inset-4 rounded-full border-2 border-[#8BC34A]/80" />
              {/* Middle ring */}
              <div className="absolute -inset-2 rounded-full border border-[#8BC34A]" />
              {/* Center dot */}
              <div className="w-4 h-4 rounded-full bg-[#8BC34A] shadow-lg shadow-[#8BC34A]/50" />
            </div>

            {/* Coordinates display */}
            <div className="absolute top-8 left-1/2 -translate-x-1/2 bg-black/80 px-3 py-1 rounded text-xs whitespace-nowrap">
              <span className="text-[#8BC34A] font-mono">
                X: {position.x.toFixed(1)}% | Y: {position.y.toFixed(1)}%
              </span>
            </div>
          </div>
        )}

        {/* Instructions overlay when no position */}
        {!position && (
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
            <div className="bg-black/70 backdrop-blur-sm px-6 py-4 rounded-lg text-center">
              <Target className="w-12 h-12 text-[#8BC34A] mx-auto mb-3 animate-pulse" />
              <p className="text-white font-bold uppercase" style={{ fontFamily: 'var(--font-oswald), Impact, sans-serif' }}>
                UBICÁ TU JUGADA
              </p>
              <p className="text-gray-400 text-sm mt-1">
                Hacé click o arrastrá para posicionar
              </p>
            </div>
          </div>
        )}
      </div>

      {/* Bottom Controls */}
      <div className="bg-[#1a1a1a] px-4 py-4 border-t border-white/10">
        <div className="flex items-center justify-between gap-4">
          {/* Toggle coordinates */}
          <button
            onClick={() => setShowCoordinates(!showCoordinates)}
            className={`px-4 py-2 rounded text-sm font-medium transition-colors ${
              showCoordinates 
                ? 'bg-[#8BC34A]/20 text-[#8BC34A] border border-[#8BC34A]/50' 
                : 'bg-[#333] text-gray-400 border border-white/10'
            }`}
          >
            {showCoordinates ? 'Ocultar grilla' : 'Mostrar grilla'}
          </button>

          {/* Position info */}
          {position && (
            <div className="text-center flex-1">
              <span className="text-gray-400 text-sm">Posición seleccionada</span>
            </div>
          )}

          {/* Save button */}
          <button
            onClick={handleSave}
            disabled={!position}
            className={`px-6 py-3 rounded-lg font-bold uppercase flex items-center gap-2 transition-all ${
              position
                ? 'bg-[#8BC34A] hover:bg-[#7CB342] text-black'
                : 'bg-[#333] text-gray-600 cursor-not-allowed'
            }`}
            style={{ fontFamily: 'var(--font-oswald), Impact, sans-serif' }}
          >
            <Check className="w-5 h-5" />
            GUARDAR JUGADA
          </button>
        </div>
      </div>
    </div>
  )
}
