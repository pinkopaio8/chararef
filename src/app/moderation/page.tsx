'use client'

import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Check, X, Eye, Shield, Home, LogOut, Trash, Edit, Save, Plus } from 'lucide-react'
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
  const [approvedCharacters, setApprovedCharacters] = useState<AnimeCharacter[]>([])
  const [selectedCharacter, setSelectedCharacter] = useState<AnimeCharacter | null>(null)
  const [editingCharacter, setEditingCharacter] = useState<AnimeCharacter | null>(null)
  const [charactersLoading, setCharactersLoading] = useState(true)
  const { toast } = useToast()

  useEffect(() => {
    if (isAuthenticated) {
      fetchAllCharacters()
    }
  }, [isAuthenticated])

  const fetchAllCharacters = async () => {
    try {
      const response = await fetch('/api/characters')
      if (response.ok) {
        const data = await response.json()
        setPendingCharacters(data.filter((char: AnimeCharacter) => char.status === 'PENDING'))
        setApprovedCharacters(data.filter((char: AnimeCharacter) => char.status === 'APPROVED'))
      }
    } catch (error) {
      console.error('Error fetching characters:', error)
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
        await fetchAllCharacters()
        setSelectedCharacter(null)
        toast({
          title: "Character approved!",
          description: "The character is now visible on the site.",
          duration: 3000,
        })
      } else {
        toast({
          title: "Error",
          description: "Unable to approve character.",
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
        await fetchAllCharacters()
        setSelectedCharacter(null)
        toast({
          title: "Character rejected",
          description: "The character has been rejected.",
          duration: 3000,
        })
      } else {
        toast({
          title: "Error",
          description: "Unable to reject character.",
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

  const handleDelete = async (characterId: string) => {
    if (!confirm('Are you sure you want to delete this character? This action cannot be undone.')) {
      return
    }

    try {
      const response = await fetch(`/api/characters/${characterId}`, {
        method: 'DELETE',
      })

      if (response.ok) {
        await fetchAllCharacters()
        setSelectedCharacter(null)
        toast({
          title: "Character deleted",
          description: "The character has been permanently deleted.",
          duration: 3000,
        })
      } else {
        toast({
          title: "Error",
          description: "Unable to delete character.",
          variant: "destructive",
          duration: 3000,
        })
      }
    } catch (error) {
      console.error('Error deleting character:', error)
      toast({
        title: "Error",
        description: "Unable to delete character.",
        variant: "destructive",
        duration: 3000,
      })
    }
  }

  const handleEdit = (character: AnimeCharacter) => {
    setEditingCharacter(character)
    setSelectedCharacter(null)
  }

  const handleSaveEdit = async () => {
    if (!editingCharacter) return

    try {
      const response = await fetch(`/api/characters/${editingCharacter.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: editingCharacter.name,
          anime: editingCharacter.anime,
          description: editingCharacter.description,
          colors: editingCharacter.colors,
          images: editingCharacter.images,
          status: 'PENDING'
        }),
      })

      if (response.ok) {
        await fetchAllCharacters()
        setEditingCharacter(null)
        toast({
          title: "Character updated",
          description: "The character has been successfully updated.",
          duration: 3000,
        })
      } else {
        toast({
          title: "Error",
          description: "Unable to update character.",
          variant: "destructive",
          duration: 3000,
        })
      }
    } catch (error) {
      console.error('Error updating character:', error)
      toast({
        title: "Error",
        description: "Unable to update character.",
        variant: "destructive",
        duration: 3000,
      })
    }
  }

  const handleCancelEdit = () => {
    setEditingCharacter(null)
  }

  const updateCharacterField = (field: string, value: any) => {
    if (!editingCharacter) return
    setEditingCharacter({ ...editingCharacter, [field]: value })
  }

  const updateColorField = (colorIndex: number, field: string, value: string) => {
    if (!editingCharacter) return
    const newColors = [...editingCharacter.colors]
    newColors[colorIndex] = { ...newColors[colorIndex], [field]: value }
    setEditingCharacter({ ...editingCharacter, colors: newColors })
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
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
              <h1 className="text-2xl font-bold text-gray-900">CharaRef Moderation</h1>
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
          <h2 className="text-3xl font-bold text-gray-900 mb-2">Characters Awaiting Approval</h2>
          <p className="text-gray-600">
            {pendingCharacters.length} characters to review
          </p>
        </div>

        {charactersLoading ? (
          <div className="text-center py-12">
            <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-gray-900 mx-auto mb-4"></div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">Loading characters...</h3>
          </div>
        ) : pendingCharacters.length === 0 ? (
          <div className="text-center py-12">
            <Shield className="h-16 w-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No characters waiting</h3>
            <p className="text-gray-600">All characters have been reviewed!</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {pendingCharacters.map((character) => (
              <Card key={character.id} className="hover:shadow-lg transition-shadow cursor-pointer">
                <CardHeader>
                  <CardTitle className="text-lg">{character.name}</CardTitle>
                  <Badge variant="outline" className="bg-yellow-50 text-yellow-800 border-yellow-200">
                    Pending
                  </Badge>
                  <p className="text-sm text-gray-500">{formatDate(character.createdAt)}</p>
                </CardHeader>
                <CardContent>
                  <p className="text-sm font-medium text-gray-900 mb-1">Anime: {character.anime}</p>
                  {character.description && (
                    <p className="text-sm text-gray-600 mb-4">{character.description}</p>
                  )}
                  
                  <div className="mb-4">
                    <h4 className="text-sm font-medium text-gray-900 mb-2">Colors ({character.colors.length})</h4>
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
                          Preview
                        </Button>
                      </DialogTrigger>
                      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
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
                                    <Dialog>
                                      <DialogTrigger asChild>
                                        <img
                                          src={image.filePath}
                                          alt={`Reference for ${character.name}`}
                                          className="w-full h-32 object-cover rounded-lg border-2 border-gray-300 mb-2 cursor-pointer hover:shadow-lg transition-shadow"
                                        />
                                      </DialogTrigger>
                                      <DialogContent className="max-w-4xl">
                                        <DialogHeader>
                                          <DialogTitle>{character.name} - Reference Sheet</DialogTitle>
                                        </DialogHeader>
                                        <div className="text-center">
                                          <img
                                            src={image.filePath}
                                            alt={`Reference for ${character.name}`}
                                            className="max-w-full max-h-96 object-contain rounded-lg border-2 border-gray-300"
                                          />
                                          <p className="text-sm text-gray-500 mt-2">{image.originalName}</p>
                                        </div>
                                      </DialogContent>
                                    </Dialog>
                                    <p className="text-xs text-gray-500 truncate">{image.originalName}</p>
                                  </div>
                                ))}
                              </div>
                            </div>
                          )}
                          
                          <div>
                            <h4 className="font-medium mb-2">Color Palette</h4>
                            <div className="grid grid-cols-4 gap-4">
                              {character.colors.map((color) => (
                                <div key={color.id} className="text-center">
                                  <div
                                    className="w-full h-16 rounded-lg border-2 border-gray-300 mb-2"
                                    style={{ backgroundColor: color.hex }}
                                  />
                                  <div className="text-xs text-gray-600">
                                    <div className="font-medium">{color.name || 'Unnamed'}</div>
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
                              Approve
                            </Button>
                            <Button
                              onClick={() => handleReject(character.id)}
                              variant="destructive"
                              className="flex-1"
                            >
                              <X className="h-4 w-4 mr-2" />
                              Reject
                            </Button>
                          </div>
                        </div>
                      </DialogContent>
                    </Dialog>
                    
                    <Button
                      onClick={() => handleEdit(character)}
                      size="sm"
                      className="bg-blue-600 hover:bg-blue-700"
                    >
                      <Edit className="h-4 w-4" />
                    </Button>
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
        
        {/* Approved Characters Section */}
        <div className="mt-16">
          <div className="mb-8">
            <h2 className="text-3xl font-bold text-gray-900 mb-2">Approved Characters</h2>
            <p className="text-gray-600">
              {approvedCharacters.length} approved characters
            </p>
          </div>

          {approvedCharacters.length === 0 ? (
            <div className="text-center py-12">
              <Shield className="h-16 w-16 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">No approved characters yet</h3>
              <p className="text-gray-600">Approved characters will appear here.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {approvedCharacters.map((character) => (
                <Card key={character.id} className="hover:shadow-lg transition-shadow cursor-pointer">
                  <CardHeader>
                    <CardTitle className="text-lg">{character.name}</CardTitle>
                    <Badge variant="outline" className="bg-green-50 text-green-800 border-green-200">
                      Approved
                    </Badge>
                    <p className="text-sm text-gray-500">{formatDate(character.createdAt)}</p>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm font-medium text-gray-900 mb-1">Anime: {character.anime}</p>
                    {character.description && (
                      <p className="text-sm text-gray-600 mb-4">{character.description}</p>
                    )}
                    
                    <div className="mb-4">
                      <h4 className="text-sm font-medium text-gray-900 mb-2">Colors ({character.colors.length})</h4>
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
                            View
                          </Button>
                        </DialogTrigger>
                        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
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
                                      <Dialog>
                                        <DialogTrigger asChild>
                                          <img
                                            src={image.filePath}
                                            alt={`Reference for ${character.name}`}
                                            className="w-full h-32 object-cover rounded-lg border-2 border-gray-300 mb-2 cursor-pointer hover:shadow-lg transition-shadow"
                                          />
                                        </DialogTrigger>
                                        <DialogContent className="max-w-4xl">
                                          <DialogHeader>
                                            <DialogTitle>{character.name} - Reference Sheet</DialogTitle>
                                          </DialogHeader>
                                          <div className="text-center">
                                            <img
                                              src={image.filePath}
                                              alt={`Reference for ${character.name}`}
                                              className="max-w-full max-h-96 object-contain rounded-lg border-2 border-gray-300"
                                            />
                                            <p className="text-sm text-gray-500 mt-2">{image.originalName}</p>
                                          </div>
                                        </DialogContent>
                                      </Dialog>
                                      <p className="text-xs text-gray-500 truncate">{image.originalName}</p>
                                    </div>
                                  ))}
                                </div>
                              </div>
                            )}
                            
                            <div>
                              <h4 className="font-medium mb-2">Color Palette</h4>
                              <div className="grid grid-cols-4 gap-4">
                                {character.colors.map((color) => (
                                  <div key={color.id} className="text-center">
                                    <div
                                      className="w-full h-16 rounded-lg border-2 border-gray-300 mb-2"
                                      style={{ backgroundColor: color.hex }}
                                    />
                                    <div className="text-xs text-gray-600">
                                      <div className="font-medium">{color.name || 'Unnamed'}</div>
                                      <div>{color.hex}</div>
                                      <div className="text-gray-500">{color.rgb}</div>
                                    </div>
                                  </div>
                                ))}
                              </div>
                            </div>
                          </div>
                        </DialogContent>
                      </Dialog>
                      
                      <Button
                        onClick={() => handleDelete(character.id)}
                        variant="destructive"
                        size="sm"
                      >
                        <Trash className="h-4 w-4" />
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </div>
      </main>

      {/* Edit Character Dialog */}
      <Dialog open={!!editingCharacter} onOpenChange={() => setEditingCharacter(null)}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="flex items-center space-x-2">
              <Edit className="h-5 w-5" />
              <span>Edit Character - {editingCharacter?.name}</span>
            </DialogTitle>
          </DialogHeader>
          {editingCharacter && (
            <div className="space-y-6">
              <div>
                <h3 className="text-lg font-medium text-gray-900 mb-2">Character Information</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="edit-name">Character Name</Label>
                    <Input
                      id="edit-name"
                      value={editingCharacter.name}
                      onChange={(e) => updateCharacterField('name', e.target.value)}
                      required
                    />
                  </div>
                  <div>
                    <Label htmlFor="edit-anime">Anime</Label>
                    <Input
                      id="edit-anime"
                      value={editingCharacter.anime}
                      onChange={(e) => updateCharacterField('anime', e.target.value)}
                      required
                    />
                  </div>
                </div>
                <div>
                  <Label htmlFor="edit-description">Description (Optional)</Label>
                  <Textarea
                    id="edit-description"
                    value={editingCharacter.description || ''}
                    onChange={(e) => updateCharacterField('description', e.target.value)}
                    rows={3}
                  />
                </div>
              </div>
              
              <div>
                <h3 className="text-lg font-medium text-gray-900 mb-4">Color Palette</h3>
                <div className="space-y-4">
                  {editingCharacter.colors.map((color, index) => (
                    <div key={color.id} className="flex items-center space-x-4 p-4 border rounded-lg">
                      <div
                        className="w-12 h-12 rounded border-2 border-gray-300"
                        style={{ backgroundColor: color.hex }}
                      />
                      <div className="flex-1 grid grid-cols-1 md:grid-cols-3 gap-2">
                        <Input
                          placeholder="Color name (optional)"
                          value={color.name || ''}
                          onChange={(e) => updateColorField(index, 'name', e.target.value)}
                        />
                        <Input
                          type="color"
                          value={color.hex}
                          onChange={(e) => updateColorField(index, 'hex', e.target.value)}
                        />
                        <div className="flex items-center space-x-2">
                          <Input
                            value={color.hex}
                            onChange={(e) => updateColorField(index, 'hex', e.target.value)}
                            className="text-xs"
                          />
                          <Button
                            type="button"
                            variant="outline"
                            size="sm"
                            onClick={() => {
                              const newColors = editingCharacter.colors.filter((_, i) => i !== index)
                              updateCharacterField('colors', newColors)
                            }}
                            disabled={editingCharacter.colors.length === 1}
                          >
                            ×
                          </Button>
                        </div>
                      </div>
                    </div>
                  ))}
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() => {
                      const newColors = [...editingCharacter.colors, { name: '', hex: '#000000', rgb: 'rgb(0, 0, 0)' }]
                      updateCharacterField('colors', newColors)
                    }}
                  >
                    <Plus className="h-4 w-4 mr-1" />
                    Add Color
                  </Button>
                </div>
              </div>
              
              <div className="flex justify-end space-x-2">
                <Button variant="outline" onClick={handleCancelEdit}>
                  <X className="h-4 w-4 mr-2" />
                  Cancel
                </Button>
                <Button onClick={handleSaveEdit} className="bg-green-600 hover:bg-green-700">
                  <Save className="h-4 w-4 mr-2" />
                  Save Changes
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  )
}