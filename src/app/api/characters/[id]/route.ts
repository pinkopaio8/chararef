import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'

export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const body = await request.json()
    const { status, name, anime, description, colors, images } = body

    // If only status is provided, do simple simple status update
    if (status && !name && !anime && !description && !colors && !images) {
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
    }

    // Handle full character update (for editing)
    if (name && anime) {
      // Update character basic info
      const updateData: any = {
        name,
        anime,
        description: description || null,
        status: status || 'PENDING'
      }

      const character = await db.animeCharacter.update({
        where: { id: params.id },
        data: updateData,
        include: {
          colors: true,
          images: true
        }
      })

      // Update colors if provided
      if (colors && Array.isArray(colors)) {
        // Delete existing colors
        await db.characterColor.deleteMany({
          where: { characterId: params.id }
        })

        // Create new colors
        for (const color of colors) {
          await db.characterColor.create({
            data: {
              characterId: params.id,
              name: color.name || null,
              hex: color.hex,
              rgb: color.rgb
            }
          })
        }
      }

      // Update images if if provided (images are already uploaded, just update DB reference)
      if (images && Array.isArray(images)) {
        // Delete existing image references
        await db.characterImage.deleteMany({
          where: { characterId: params.id }
        })

        // Create new image references
        for (const image of images) {
          await db.characterImage.create({
            data: {
              characterId: params.id,
              filename: image.filename,
              originalName: image.originalName,
              filePath: image.filePath,
              fileSize: image.fileSize,
              mimeType: image.mimeType
            }
          })
        }
      }

      // Return updated character with all relations
      const updatedCharacter = await db.animeCharacter.findUnique({
        where: { id: params.id },
        include: {
          colors: true,
          images: true
        }
      })

      return NextResponse.json(updatedCharacter)
    }

    return NextResponse.json(
      { error: 'Invalid request data' },
      { status: 400 }
    )
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