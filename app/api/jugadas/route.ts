import { NextRequest, NextResponse } from 'next/server'
import { nanoid } from 'nanoid'
import { createJugada, getJugadasByParticipant, getAllJugadas } from '@/lib/db'
import { sendJugadaConfirmationEmail } from '@/lib/email'
import { Jugada } from '@/lib/types'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { participantId, participantEmail, prizeId, prizeName, positionX, positionY, imageUrl } = body

    if (!participantId || !prizeId || positionX === undefined || positionY === undefined) {
      return NextResponse.json(
        { error: 'participantId, prizeId, positionX y positionY son requeridos' },
        { status: 400 }
      )
    }

    const jugada: Jugada = {
      id: nanoid(),
      participantId,
      participantEmail,
      prizeId,
      prizeName,
      positionX,
      positionY,
      imageUrl,
      createdAt: Date.now(),
    }

    await createJugada(jugada)

    // Send confirmation email with the play position
    if (participantEmail) {
      try {
        await sendJugadaConfirmationEmail({
          to: participantEmail,
          jugada,
        })
      } catch (emailError) {
        console.error('Error sending confirmation email:', emailError)
        // Don't fail the request if email fails
      }
    }

    return NextResponse.json({ jugada })
  } catch (error) {
    console.error('Error creating jugada:', error)
    return NextResponse.json(
      { error: 'Error al registrar jugada' },
      { status: 500 }
    )
  }
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const participantId = searchParams.get('participantId')

    let jugadas: Jugada[]
    
    if (participantId) {
      jugadas = await getJugadasByParticipant(participantId)
    } else {
      jugadas = await getAllJugadas()
    }

    return NextResponse.json({ jugadas })
  } catch (error) {
    console.error('Error fetching jugadas:', error)
    return NextResponse.json(
      { error: 'Error al obtener jugadas' },
      { status: 500 }
    )
  }
}
