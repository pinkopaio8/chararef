'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { BookOpen, Hash } from 'lucide-react'

interface AnimeCategory {
  name: string
  count: number
}

interface SidebarProps {
  characters: any[]
  selectedAnime: string | null
  onAnimeSelect: (anime: string | null) => void
  searchQuery: string
  onSearchChange: (query: string) => void
}

export function Sidebar({ characters, selectedAnime, onAnimeSelect, searchQuery, onSearchChange }: SidebarProps) {
  const [animeCategories, setAnimeCategories] = useState<AnimeCategory[]>([])

  useEffect(() => {
    // Calculate anime categories and counts
    const animeCounts = characters.reduce((acc, character) => {
      const anime = character.anime
      acc[anime] = (acc[anime] || 0) + 1
      return acc
    }, {} as Record<string, number>)

    const categories = Object.entries(animeCounts)
      .map(([name, count]) => ({ name, count }))
      .sort((a, b) => a.name.localeCompare(b.name))

    setAnimeCategories(categories)
  }, [characters])

  return (
    <div className="space-y-6">
      {/* Search Bar */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center text-lg">
            <Hash className="h-5 w-5 mr-2" />
            Cerca Personaggi
          </CardTitle>
        </CardHeader>
        <CardContent>
          <input
            type="text"
            placeholder="Cerca per nome o anime..."
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
          />
        </CardContent>
      </Card>

      {/* Anime Categories */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center text-lg">
            <BookOpen className="h-5 w-5 mr-2" />
            Anime ({animeCategories.length})
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-2 max-h-96 overflow-y-auto">
            <Button
              variant={selectedAnime === null ? "default" : "ghost"}
              className="w-full justify-start"
              onClick={() => onAnimeSelect(null)}
            >
              Tutti gli Anime
              <Badge variant="secondary" className="ml-auto">
                {characters.length}
              </Badge>
            </Button>
            
            {animeCategories.map((category) => (
              <Button
                key={category.name}
                variant={selectedAnime === category.name ? "default" : "ghost"}
                className="w-full justify-start"
                onClick={() => onAnimeSelect(category.name)}
              >
                <span className="truncate">{category.name}</span>
                <Badge variant="secondary" className="ml-auto flex-shrink-0">
                  {category.count}
                </Badge>
              </Button>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}