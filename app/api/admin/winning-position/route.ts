import { NextRequest, NextResponse } from 'next/server'
import { nanoid } from 'nanoid'
import { 
  createWinningPosition, 
  getJugadasByPrize,
  updateJugadaWinner,
  updateWinningPositionProcessed,
  isWithinTolerance,
  getAllWinningPositions
} from '@/lib/db'
import { sendWinnerNotificationEmail } from '@/lib/email'
import { WinningPosition } from '@/lib/types'

// Create a new winning position and find winners
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { prizeId, prizeName, positionX, positionY, tolerance = 5, videoUrl, description } = body

    if (!prizeId || positionX === undefined || positionY === undefined) {
      return NextResponse.json(
        { error: 'prizeId, positionX y positionY son requeridos' },
        { status: 400 }
      )
    }

    // Create the winning position
    const winningPosition: WinningPosition = {
      id: nanoid(),
      prizeId,
      prizeName,
      positionX,
      positionY,
      tolerance,
      videoUrl,
      description,
      createdAt: Date.now(),
    }

    await createWinningPosition(winningPosition)

    // Find all jugadas for this prize
    const jugadas = await getJugadasByPrize(prizeId)
    
    // Check which jugadas are within tolerance
    const winners = jugadas.filter(jugada => 
      isWithinTolerance(
        { x: jugada.positionX, y: jugada.positionY },
        { x: positionX, y: positionY },
        tolerance
      )
    )

    // Update winners and send notifications
    const notificationResults = []
    for (const winner of winners) {
      await updateJugadaWinner(winner.participantId, winner.id, true)
      
      // Send winner notification email
      if (winner.participantEmail) {
        try {
          await sendWinnerNotificationEmail({
            to: winner.participantEmail,
            jugada: winner,
            winningPosition,
          })
          notificationResults.push({
            jugadaId: winner.id,
            email: winner.participantEmail,
            sent: true,
          })
        } catch (emailError) {
          console.error('Error sending winner email:', emailError)
          notificationResults.push({
            jugadaId: winner.id,
            email: winner.participantEmail,
            sent: false,
            error: String(emailError),
          })
        }
      }
    }

    // Update winning position with processed info
    await updateWinningPositionProcessed(prizeId, winningPosition.id, winners.length)

    return NextResponse.json({
      winningPosition,
      totalJugadas: jugadas.length,
      winnersCount: winners.length,
      winners: winners.map(w => ({
        id: w.id,
        participantId: w.participantId,
        email: w.participantEmail,
        position: { x: w.positionX, y: w.positionY },
      })),
      notifications: notificationResults,
    })
  } catch (error) {
    console.error('Error processing winning position:', error)
    return NextResponse.json(
      { error: 'Error al procesar posición ganadora' },
      { status: 500 }
    )
  }
}

export async function GET() {
  try {
    const positions = await getAllWinningPositions()
    return NextResponse.json({ positions })
  } catch (error) {
    console.error('Error fetching winning positions:', error)
    return NextResponse.json(
      { error: 'Error al obtener posiciones ganadoras' },
      { status: 500 }
    )
  }
}
