import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'

interface CharacterColor {
  name?: string
  hex: string
  rgb: string
}

interface CharacterImage {
  filename: string
  originalName: string
  filePath: string
  fileSize: number
  mimeType: string
}

interface CreateCharacterRequest {
  name: string
  anime: string
  description?: string
  colors: CharacterColor[]
  images: CharacterImage[]
}

export async function GET(request: NextRequest) {
  try {
    const characters = await db.animeCharacter.findMany({
      include: {
        colors: true,
        images: true
      },
      orderBy: {
        createdAt: 'desc'
      }
    })

    return NextResponse.json(characters)
  } catch (error) {
    console.error('Error fetching characters:', error)
    return NextResponse.json(
      { error: 'Failed to fetch characters' },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { name, anime, description, colors, images }: CreateCharacterRequest = body

    // Validate required fields
    if (!name || !anime || !colors || colors.length === 0) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      )
    }

    // Create character with colors and images
    const character = await db.animeCharacter.create({
      data: {
        name,
        anime,
        description: description || null,
        status: 'PENDING',
        colors: {
          create: colors.map((color) => ({
            name: color.name || null,
            hex: color.hex,
            rgb: color.rgb
          }))
        },
        images: images && images.length > 0 ? {
          create: images.map((image) => ({
            filename: image.filename,
            originalName: image.originalName,
            filePath: image.filePath,
            fileSize: image.fileSize,
            mimeType: image.mimeType
          }))
        } : undefined
      },
      include: {
        colors: true,
        images: true
      }
    })

    return NextResponse.json(character, { status: 201 })
  } catch (error) {
    console.error('Error creating character:', error)
    return NextResponse.json(
      { error: 'Failed to create character' },
      { status: 500 }
    )
  }
}