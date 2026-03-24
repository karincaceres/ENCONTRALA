export interface Participant {
  id: string
  nombre: string
  email: string
  telefono: string
  createdAt: number
}

export interface Jugada {
  id: string
  participantId: string
  participantEmail: string
  prizeId: string
  prizeName: string
  positionX: number
  positionY: number
  imageUrl?: string // Capture of the play position
  createdAt: number
  isWinner?: boolean
  notifiedAt?: number
}

export interface WinningPosition {
  id: string
  prizeId: string
  prizeName: string
  positionX: number
  positionY: number
  videoUrl?: string // Video/replay reference
  description?: string
  tolerance: number // Tolerance radius in percentage (e.g., 5 = 5% radius)
  createdAt: number
  processedAt?: number
  winnersCount?: number
}

export interface GameSession {
  id: string
  name: string
  description?: string
  startDate: number
  endDate: number
  isActive: boolean
  createdAt: number
}
