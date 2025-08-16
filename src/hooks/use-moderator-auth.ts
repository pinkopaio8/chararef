'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'

export function useModeratorAuth() {
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const router = useRouter()

  useEffect(() => {
    const checkAuth = () => {
      const isModerator = localStorage.getItem('isModerator') === 'true'
      setIsAuthenticated(isModerator)
      setIsLoading(false)

      if (!isModerator) {
        router.push('/login')
      }
    }

    checkAuth()
  }, [router])

  const logout = () => {
    localStorage.removeItem('isModerator')
    setIsAuthenticated(false)
    router.push('/')
  }

  return { isAuthenticated, isLoading, logout }
}