import { NextRequest, NextResponse } from 'next/server'
import { nanoid } from 'nanoid'
import { createParticipant, getParticipantByEmail } from '@/lib/db'
import { Participant } from '@/lib/types'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { nombre, email, telefono } = body

    if (!nombre || !email || !telefono) {
      return NextResponse.json(
        { error: 'Nombre, email y teléfono son requeridos' },
        { status: 400 }
      )
    }

    // Check if participant already exists
    let participant = await getParticipantByEmail(email)
    
    if (!participant) {
      // Create new participant
      participant = {
        id: nanoid(),
        nombre,
        email,
        telefono,
        createdAt: Date.now(),
      }
      await createParticipant(participant)
    }

    return NextResponse.json({ participant })
  } catch (error) {
    console.error('Error creating participant:', error)
    return NextResponse.json(
      { error: 'Error al registrar participante' },
      { status: 500 }
    )
  }
}
