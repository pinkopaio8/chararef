'use client'

import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { Check, X, Eye, Shield, Home, LogOut } from 'lucide-react'
import { useToast } from '@/hooks/use-toast'
import Link from 'next/link'
import { useModeratorAuth } from '@/hooks/use-moderator-auth'

interface CharacterColor {
  id: string
  name?: string
  hex: string
  rgb: string
}

interface CharacterImage {
  id: string
  filename: string
  originalName: string
  filePath: string
  fileSize: number
  mimeType: string
}

interface AnimeCharacter {
  id: string
  name: string
  anime: string
  description?: string
  status: 'PENDING' | 'APPROVED' | 'REJECTED'
  createdAt: string
  colors: CharacterColor[]
  images: CharacterImage[]
}

export default function ModerationPage() {
  const { isAuthenticated, isLoading, logout } = useModeratorAuth()
  const [pendingCharacters, setPendingCharacters] = useState<AnimeCharacter[]>([])
  const [selectedCharacter, setSelectedCharacter] = useState<AnimeCharacter | null>(null)
  const [charactersLoading, setCharactersLoading] = useState(true)
  const { toast } = useToast()

  useEffect(() => {
    if (isAuthenticated) {
      fetchPendingCharacters()
    }
  }, [isAuthenticated])

  const fetchPendingCharacters = async () => {
    try {
      const response = await fetch('/api/characters')
      if (response.ok) {
        const data = await response.json()
        setPendingCharacters(data.filter((char: AnimeCharacter) => char.status === 'PENDING'))
      }
    } catch (error) {
      console.error('Error fetching pending characters:', error)
    } finally {
      setCharactersLoading(false)
    }
  }

  const handleApprove = async (characterId: string) => {
    try {
      const response = await fetch(`/api/characters/${characterId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ status: 'APPROVED' }),
      })

      if (response.ok) {
        await fetchPendingCharacters()
        setSelectedCharacter(null)
        toast({
          title: "Personaggio approvato!",
          description: "Il personaggio è ora visibile sul sito.",
          duration: 3000,
        })
      } else {
        toast({
          title: "Errore",
          description: "Impossibile approvare il personaggio.",
          variant: "destructive",
          duration: 3000,
        })
      }
    } catch (error) {
      console.error('Error approving character:', error)
      toast({
        title: "Errore",
        description: "Impossibile approvare il personaggio.",
        variant: "destructive",
        duration: 3000,
      })
    }
  }

  const handleReject = async (characterId: string) => {
    try {
      const response = await fetch(`/api/characters/${characterId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ status: 'REJECTED' }),
      })

      if (response.ok) {
        await fetchPendingCharacters()
        setSelectedCharacter(null)
        toast({
          title: "Personaggio rifiutato",
          description: "Il personaggio è stato rifiutato.",
          duration: 3000,
        })
      } else {
        toast({
          title: "Errore",
          description: "Impossibile rifiutare il personaggio.",
          variant: "destructive",
          duration: 3000,
        })
      }
    } catch (error) {
      console.error('Error rejecting character:', error)
      toast({
        title: "Errore",
        description: "Impossibile rifiutare il personaggio.",
        variant: "destructive",
        duration: 3000,
      })
    }
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('it-IT', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  if (isLoading || !isAuthenticated) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-gray-900"></div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <Shield className="h-8 w-8 text-blue-600" />
              <h1 className="text-2xl font-bold text-gray-900">Moderazione CharaRef</h1>
            </div>
            <div className="flex items-center space-x-2">
              <Link href="/">
                <Button variant="outline" size="sm">
                  <Home className="h-4 w-4 mr-2" />
                  Home
                </Button>
              </Link>
              <Button variant="outline" size="sm" onClick={logout}>
                <LogOut className="h-4 w-4 mr-2" />
                Logout
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h2 className="text-3xl font-bold text-gray-900 mb-2">Personaggi in Attesa di Approvazione</h2>
          <p className="text-gray-600">
            {pendingCharacters.length} personaggi da revisionare
          </p>
        </div>

        {charactersLoading ? (
          <div className="text-center py-12">
            <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-gray-900 mx-auto mb-4"></div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">Caricamento personaggi...</h3>
          </div>
        ) : pendingCharacters.length === 0 ? (
          <div className="text-center py-12">
            <Shield className="h-16 w-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">Nessun personaggio in attesa</h3>
            <p className="text-gray-600">Tutti i personaggi sono stati revisionati!</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {pendingCharacters.map((character) => (
              <Card key={character.id} className="hover:shadow-lg transition-shadow">
                <CardHeader>
                  <CardTitle className="text-lg">{character.name}</CardTitle>
                  <Badge variant="outline" className="bg-yellow-50 text-yellow-800 border-yellow-200">
                    In Attesa
                  </Badge>
                  <p className="text-sm text-gray-500">{formatDate(character.createdAt)}</p>
                </CardHeader>
                <CardContent>
                  <p className="text-sm font-medium text-gray-900 mb-1">Anime: {character.anime}</p>
                  {character.description && (
                    <p className="text-sm text-gray-600 mb-4">{character.description}</p>
                  )}
                  
                  <div className="mb-4">
                    <h4 className="text-sm font-medium text-gray-900 mb-2">Colori ({character.colors.length})</h4>
                    <div className="grid grid-cols-4 gap-1">
                      {character.colors.slice(0, 8).map((color) => (
                        <div
                          key={color.id}
                          className="w-full h-8 rounded border border-gray-300"
                          style={{ backgroundColor: color.hex }}
                          title={color.name || color.hex}
                        />
                      ))}
                      {character.colors.length > 8 && (
                        <div className="w-full h-8 rounded border border-gray-300 bg-gray-100 flex items-center justify-center text-xs text-gray-500">
                          +{character.colors.length - 8}
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="flex space-x-2">
                    <Dialog>
                      <DialogTrigger asChild>
                        <Button variant="outline" size="sm" className="flex-1">
                          <Eye className="h-4 w-4 mr-1" />
                          Anteprima
                        </Button>
                      </DialogTrigger>
                      <DialogContent className="max-w-2xl">
                        <DialogHeader>
                          <DialogTitle>{character.name} - {character.anime}</DialogTitle>
                        </DialogHeader>
                        <div className="space-y-4">
                          {character.description && (
                            <p className="text-gray-600">{character.description}</p>
                          )}
                          
                          {character.images && character.images.length > 0 && (
                            <div>
                              <h4 className="font-medium mb-2">Reference Sheet</h4>
                              <div className="grid grid-cols-2 gap-4">
                                {character.images.map((image) => (
                                  <div key={image.id} className="text-center">
                                    <img
                                      src={image.filePath}
                                      alt={`Reference for ${character.name}`}
                                      className="w-full h-32 object-cover rounded-lg border-2 border-gray-300 mb-2"
                                    />
                                    <p className="text-xs text-gray-500 truncate">{image.originalName}</p>
                                  </div>
                                ))}
                              </div>
                            </div>
                          )}
                          
                          <div>
                            <h4 className="font-medium mb-2">Palette Colori</h4>
                            <div className="grid grid-cols-4 gap-4">
                              {character.colors.map((color) => (
                                <div key={color.id} className="text-center">
                                  <div
                                    className="w-full h-16 rounded-lg border-2 border-gray-300 mb-2"
                                    style={{ backgroundColor: color.hex }}
                                  />
                                  <div className="text-xs text-gray-600">
                                    <div className="font-medium">{color.name || 'Senza nome'}</div>
                                    <div>{color.hex}</div>
                                    <div className="text-gray-500">{color.rgb}</div>
                                  </div>
                                </div>
                              ))}
                            </div>
                          </div>
                          <div className="flex space-x-2 pt-4">
                            <Button
                              onClick={() => handleApprove(character.id)}
                              className="bg-green-600 hover:bg-green-700 flex-1"
                            >
                              <Check className="h-4 w-4 mr-2" />
                              Approva
                            </Button>
                            <Button
                              onClick={() => handleReject(character.id)}
                              variant="destructive"
                              className="flex-1"
                            >
                              <X className="h-4 w-4 mr-2" />
                              Rifiuta
                            </Button>
                          </div>
                        </div>
                      </DialogContent>
                    </Dialog>
                    
                    <Button
                      onClick={() => handleApprove(character.id)}
                      size="sm"
                      className="bg-green-600 hover:bg-green-700"
                    >
                      <Check className="h-4 w-4" />
                    </Button>
                    <Button
                      onClick={() => handleReject(character.id)}
                      variant="destructive"
                      size="sm"
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </main>
    </div>
  )
}