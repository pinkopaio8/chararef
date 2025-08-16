import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'

export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const body = await request.json()
    const { status } = body

    // Validate status
    if (!['APPROVED', 'REJECTED'].includes(status)) {
      return NextResponse.json(
        { error: 'Invalid status' },
        { status: 400 }
      )
    }

    const character = await db.animeCharacter.update({
      where: { id: params.id },
      data: { status },
      include: {
        colors: true,
        images: true
      }
    })

    return NextResponse.json(character)
  } catch (error) {
    console.error('Error updating character:', error)
    return NextResponse.json(
      { error: 'Failed to update character' },
      { status: 500 }
    )
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    // First, get the character to delete associated images
    const character = await db.animeCharacter.findUnique({
      where: { id: params.id },
      include: { images: true }
    })

    if (!character) {
      return NextResponse.json(
        { error: 'Character not found' },
        { status: 404 }
      )
    }

    // Delete character (cascade will delete colors and images from DB)
    await db.animeCharacter.delete({
      where: { id: params.id }
    })

    // Note: In a production environment, you should also delete the physical files
    // from the filesystem. This is omitted for simplicity but should be implemented.

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Error deleting character:', error)
    return NextResponse.json(
      { error: 'Failed to delete character' },
      { status: 500 }
    )
  }
}