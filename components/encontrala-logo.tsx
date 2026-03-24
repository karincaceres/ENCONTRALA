"use client"

export function EncontralaLogo({ className = "" }: { className?: string }) {
  return (
    <div className={`flex items-center justify-center ${className}`}>
      <svg viewBox="0 0 620 120" className="w-full h-auto">
        {/* E text */}
        <text 
          x="0" 
          y="88" 
          fontFamily="Impact, Arial Black, sans-serif" 
          fontSize="80" 
          fill="white"
          style={{ 
            fontWeight: 'bold',
          }}
        >
          ENC
        </text>
        
        {/* Target/Crosshair O with ball - positioned after ENC */}
        <g transform="translate(155, 10)">
          {/* Outer circle - the O */}
          <circle cx="50" cy="50" r="42" fill="none" stroke="#8BC34A" strokeWidth="6" />
          {/* Inner circle */}
          <circle cx="50" cy="50" r="22" fill="none" stroke="#8BC34A" strokeWidth="4" />
          {/* Crosshairs */}
          <line x1="50" y1="0" x2="50" y2="28" stroke="#8BC34A" strokeWidth="4" />
          <line x1="50" y1="72" x2="50" y2="100" stroke="#8BC34A" strokeWidth="4" />
          <line x1="0" y1="50" x2="28" y2="50" stroke="#8BC34A" strokeWidth="4" />
          <line x1="72" y1="50" x2="100" y2="50" stroke="#8BC34A" strokeWidth="4" />
          
          {/* Soccer ball - top right */}
          <g transform="translate(62, -5)">
            <circle cx="18" cy="18" r="18" fill="white" stroke="#1a1a1a" strokeWidth="1" />
            {/* Pentagon pattern */}
            <path d="M18 6 L23 12 L21 19 L15 19 L13 12 Z" fill="#1a1a1a" />
            <path d="M30 16 L26 12 L26 20 L30 20 Z" fill="#1a1a1a" />
            <path d="M6 16 L10 12 L10 20 L6 20 Z" fill="#1a1a1a" />
            <path d="M12 28 L15 24 L21 24 L24 28 Z" fill="#1a1a1a" />
          </g>
        </g>
        
        {/* NTRALA text - after the O target */}
        <text 
          x="255" 
          y="88" 
          fontFamily="Impact, Arial Black, sans-serif" 
          fontSize="80" 
          fill="white"
          style={{ 
            fontWeight: 'bold',
          }}
        >
          NTRALA
        </text>
      </svg>
    </div>
  )
}
