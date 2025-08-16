'use client'

import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Plus, Palette, Shield } from 'lucide-react'
import { useToast } from '@/hooks/use-toast'
import Link from 'next/link'
import { ImageUpload } from '@/components/image-upload'
import { Sidebar } from '@/components/sidebar'

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
  colors: CharacterColor[]
  images: CharacterImage[]
}

export default function Home() {
  const [allCharacters, setAllCharacters] = useState<AnimeCharacter[]>([])
  const [characters, setCharacters] = useState<AnimeCharacter[]>([])
  const [isUploadOpen, setIsUploadOpen] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedAnime, setSelectedAnime] = useState<string | null>(null)
  const { toast } = useToast()

  const [formData, setFormData] = useState({
    name: '',
    anime: '',
    description: '',
    colors: [{ name: '', hex: '#000000', rgb: 'rgb(0, 0, 0)' }],
    images: [] as File[]
  })
  const [isUploading, setIsUploading] = useState(false)

  useEffect(() => {
    fetchCharacters()
  }, [])

  useEffect(() => {
    filterCharacters()
  }, [allCharacters, searchQuery, selectedAnime])

  const fetchCharacters = async () => {
    try {
      const response = await fetch('/api/characters')
      if (response.ok) {
        const data = await response.json()
        const approvedCharacters = data.filter((char: AnimeCharacter) => char.status === 'APPROVED')
        setAllCharacters(approvedCharacters)
        setCharacters(approvedCharacters)
      }
    } catch (error) {
      console.error('Error fetching characters:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const filterCharacters = () => {
    let filtered = allCharacters

    // Filter by selected anime
    if (selectedAnime) {
      filtered = filtered.filter(char => char.anime === selectedAnime)
    }

    // Filter by search query
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase().trim()
      filtered = filtered.filter(char => 
        char.name.toLowerCase().includes(query) ||
        char.anime.toLowerCase().includes(query) ||
        (char.description && char.description.toLowerCase().includes(query))
      )
    }

    setCharacters(filtered)
  }

  const handleColorChange = (index: number, field: string, value: string) => {
    const newColors = [...formData.colors]
    newColors[index] = { ...newColors[index], [field]: value }
    
    if (field === 'hex') {
      const hex = value.replace('#', '')
      const r = parseInt(hex.substr(0, 2), 16)
      const g = parseInt(hex.substr(2, 2), 16)
      const b = parseInt(hex.substr(4, 2), 16)
      newColors[index].rgb = `rgb(${r}, ${g}, ${b})`
    }
    
    setFormData({ ...formData, colors: newColors })
  }

  const addColor = () => {
    setFormData({
      ...formData,
      colors: [...formData.colors, { name: '', hex: '#000000', rgb: 'rgb(0, 0, 0)' }]
    })
  }

  const removeColor = (index: number) => {
    const newColors = formData.colors.filter((_, i) => i !== index)
    setFormData({ ...formData, colors: newColors })
  }

  const handleImagesChange = (images: File[]) => {
    setFormData({ ...formData, images })
  }

  const uploadImages = async (files: File[]) => {
    if (files.length === 0) return []

    const formData = new FormData()
    files.forEach(file => {
      formData.append('files', file)
    })

    const response = await fetch('/api/upload', {
      method: 'POST',
      body: formData,
    })

    if (!response.ok) {
      throw new Error('Failed to upload images')
    }

    const result = await response.json()
    return result.files
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsUploading(true)
    
    try {
      // Upload images first
      const uploadedImages = await uploadImages(formData.images)
      
      // Prepare character data
      const characterData = {
        name: formData.name,
        anime: formData.anime,
        description: formData.description,
        colors: formData.colors,
        images: uploadedImages
      }

      const response = await fetch('/api/characters', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(characterData),
      })

      if (response.ok) {
        setIsUploadOpen(false)
        setFormData({
          name: '',
          anime: '',
          description: '',
          colors: [{ name: '', hex: '#000000', rgb: 'rgb(0, 0, 0)' }],
          images: []
        })
        toast({
          title: "Personaggio inviato!",
          description: "Il tuo personaggio è in attesa di approvazione da un moderatore.",
          duration: 5000,
        })
      } else {
        toast({
          title: "Errore",
          description: "Impossibile inviare il personaggio. Riprova più tardi.",
          variant: "destructive",
          duration: 5000,
        })
      }
    } catch (error) {
      console.error('Error submitting character:', error)
      toast({
        title: "Errore",
        description: "Impossibile caricare le immagini. Riprova più tardi.",
        variant: "destructive",
        duration: 5000,
      })
    } finally {
      setIsUploading(false)
    }
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-gray-900"></div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-pink-50">
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <Palette className="h-8 w-8 text-purple-600" />
              <h1 className="text-2xl font-bold text-gray-900">CharaRef</h1>
            </div>
            <div className="flex items-center space-x-4">
              <Link href="/login">
                <Button variant="outline" size="sm">
                  <Shield className="h-4 w-4 mr-2" />
                  Area Moderatori
                </Button>
              </Link>
              <Dialog open={isUploadOpen} onOpenChange={setIsUploadOpen}>
                <DialogTrigger asChild>
                  <Button className="bg-purple-600 hover:bg-purple-700">
                    <Plus className="h-4 w-4 mr-2" />
                    Upload Character
                  </Button>
                </DialogTrigger>
                <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
                  <DialogHeader>
                    <DialogTitle>Upload New Character</DialogTitle>
                  </DialogHeader>
                  <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="name">Character Name</Label>
                        <Input
                          id="name"
                          value={formData.name}
                          onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                          required
                        />
                      </div>
                      <div>
                        <Label htmlFor="anime">Anime</Label>
                        <Input
                          id="anime"
                          value={formData.anime}
                          onChange={(e) => setFormData({ ...formData, anime: e.target.value })}
                          required
                        />
                      </div>
                    </div>
                    <div>
                      <Label htmlFor="description">Description (Optional)</Label>
                      <Textarea
                        id="description"
                        value={formData.description}
                        onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                        rows={3}
                      />
                    </div>
                    <div>
                      <Label>Reference Sheet (Optional)</Label>
                      <ImageUpload
                        images={formData.images}
                        onImagesChange={handleImagesChange}
                        maxImages={5}
                        maxSizeMB={5}
                      />
                    </div>
                    <div>
                      <div className="flex items-center justify-between mb-4">
                        <Label>Color Palette</Label>
                        <Button type="button" variant="outline" size="sm" onClick={addColor}>
                          <Plus className="h-4 w-4 mr-1" />
                          Add Color
                        </Button>
                      </div>
                      <div className="space-y-4">
                        {formData.colors.map((color, index) => (
                          <div key={index} className="flex items-center space-x-4 p-4 border rounded-lg">
                            <div
                              className="w-12 h-12 rounded border-2 border-gray-300"
                              style={{ backgroundColor: color.hex }}
                            />
                            <div className="flex-1 grid grid-cols-1 md:grid-cols-3 gap-2">
                              <Input
                                placeholder="Color name (optional)"
                                value={color.name}
                                onChange={(e) => handleColorChange(index, 'name', e.target.value)}
                              />
                              <Input
                                type="color"
                                value={color.hex}
                                onChange={(e) => handleColorChange(index, 'hex', e.target.value)}
                              />
                              <div className="flex items-center space-x-2">
                                <Input
                                  value={color.hex}
                                  readOnly
                                  className="text-xs"
                                />
                                <Button
                                  type="button"
                                  variant="outline"
                                  size="sm"
                                  onClick={() => removeColor(index)}
                                  disabled={formData.colors.length === 1}
                                >
                                  ×
                                </Button>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                    <div className="flex justify-end space-x-2">
                      <Button type="button" variant="outline" onClick={() => setIsUploadOpen(false)} disabled={isUploading}>
                        Cancel
                      </Button>
                      <Button type="submit" className="bg-purple-600 hover:bg-purple-700" disabled={isUploading}>
                        {isUploading ? 'Uploading...' : 'Submit for Review'}
                      </Button>
                    </div>
                  </form>
                </DialogContent>
              </Dialog>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Sidebar */}
          <div className="lg:w-80 flex-shrink-0">
            <Sidebar
              characters={allCharacters}
              selectedAnime={selectedAnime}
              onAnimeSelect={setSelectedAnime}
              searchQuery={searchQuery}
              onSearchChange={setSearchQuery}
            />
          </div>

          {/* Main Content */}
          <div className="flex-1">
            <div className="text-center mb-8">
              <h2 className="text-3xl font-bold text-gray-900 mb-2">Anime Character Reference</h2>
              <p className="text-gray-600">Discover and share color palettes from your favorite anime characters</p>
              {(selectedAnime || searchQuery) && (
                <div className="mt-4">
                  <p className="text-sm text-gray-500">
                    Mostrando {characters.length} personaggio{characters.length !== 1 ? 'i' : ''}
                    {selectedAnime && ` in "${selectedAnime}"`}
                    {searchQuery && ` per "${searchQuery}"`}
                  </p>
                  <Button
                    variant="link"
                    onClick={() => {
                      setSelectedAnime(null)
                      setSearchQuery('')
                    }}
                    className="text-purple-600"
                  >
                    Cancella filtri
                  </Button>
                </div>
              )}
            </div>

            {characters.length === 0 ? (
              <div className="text-center py-12">
                <Palette className="h-16 w-16 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">
                  {searchQuery || selectedAnime ? 'Nessun personaggio trovato' : 'No characters yet'}
                </h3>
                <p className="text-gray-600 mb-4">
                  {searchQuery || selectedAnime 
                    ? 'Prova a modificare i filtri di ricerca.'
                    : 'Be the first to upload a character!'
                  }
                </p>
              </div>
            ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {characters.map((character) => (
              <Card key={character.id} className="hover:shadow-lg transition-shadow">
                <CardHeader>
                  <CardTitle className="text-lg">{character.name}</CardTitle>
                  <Badge variant="secondary">{character.anime}</Badge>
                </CardHeader>
                <CardContent>
                  {character.description && (
                    <p className="text-sm text-gray-600 mb-4">{character.description}</p>
                  )}
                  
                  {character.images && character.images.length > 0 && (
                    <div className="mb-4">
                      <h4 className="text-sm font-medium text-gray-900 mb-2">Reference Sheet</h4>
                      <div className="grid grid-cols-2 gap-2">
                        {character.images.slice(0, 4).map((image) => (
                          <div key={image.id} className="relative group">
                            <img
                              src={image.filePath}
                              alt={`Reference for ${character.name}`}
                              className="w-full h-24 object-cover rounded border border-gray-300"
                            />
                            {character.images.length > 4 && image.id === character.images[3].id && (
                              <div className="absolute inset-0 bg-black bg-opacity-50 rounded border border-gray-300 flex items-center justify-center text-white text-sm">
                                +{character.images.length - 4}
                              </div>
                            )}
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                  
                  <div>
                    <h4 className="text-sm font-medium text-gray-900 mb-2">Color Palette</h4>
                    <div className="grid grid-cols-4 gap-2">
                      {character.colors.map((color) => (
                        <div key={color.id} className="text-center">
                          <div
                            className="w-full h-12 rounded border-2 border-gray-300 mb-1"
                            style={{ backgroundColor: color.hex }}
                            title={color.name || color.hex}
                          />
                          <div className="text-xs text-gray-600">
                            <div>{color.hex}</div>
                            <div className="text-xs text-gray-500">{color.rgb}</div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
            )}
          </div>
        </div>
      </main>

      {/* Terms of Service Footer */}
      <footer className="bg-gray-900 text-white mt-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="text-center">
            <h3 className="text-lg font-semibold mb-4">Termini di Servizio e Note Legali</h3>
            <div className="max-w-4xl mx-auto text-sm text-gray-300 space-y-4 text-left">
              <p>
                <strong>Diritti d'Autore e Copyright:</strong> Tutti i personaggi anime, immagini e contenuti 
                visualizzati su questo sito sono di proprietà dei rispettivi autori e detentori dei diritti d'autore. 
                CharaRef non rivendica la proprietà di alcun materiale protetto da copyright.
              </p>
              <p>
                <strong>Uso Personale e Non Commerciale:</strong> Questo sito è stato creato esclusivamente per scopi 
                personali, educativi e di riferimento. Tutti i contenuti sono forniti "così come sono" senza alcuna 
                garanzia. CharaRef è un progetto non a scopo di lucro e non genera alcun tipo di reddito.
              </p>
              <p>
                <strong>Fair Use:</strong> L'utilizzo di immagini e materiale protetto da copyright su questo sito 
                avviene secondo i principi di "fair use" (uso leale) come previsto dalla legislazione sul copyright. 
                Le immagini sono utilizzate a scopo di riferimento, critica, commento e ricerca, senza intaccare il 
                mercato potenziale dell'opera originale.
              </p>
              <p>
                <strong>Responsabilità dell'Utente:</strong> Gli utenti sono responsabili per il materiale che caricano. 
                Caricando contenuti su CharaRef, gli utenti dichiarano di avere i diritti necessari per condividere 
                tali materiali o che il loro utilizzo rientra nelle eccezioni di fair use.
              </p>
              <p>
                <strong>Rimozione Contenuti:</strong> Se sei un detentore dei diritti d'autore e ritieni che il tuo 
                materiale sia stato utilizzato in modo improprio, ti preghiamo di contattarci per la rimozione immediata 
                del contenuto.
              </p>
            </div>
            <div className="mt-8 pt-8 border-t border-gray-700">
              <p className="text-xs text-gray-400">
                © 2024 CharaRef. Questo è un progetto fan-made non affiliato con alcuno studio di animazione o detentore dei diritti.
              </p>
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}