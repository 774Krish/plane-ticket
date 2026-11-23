import { createContext, useContext, useEffect, useState } from 'react'

const KEY = 'skyvoyage-favorites'
const FavoritesContext = createContext(null)

export function FavoritesProvider({ children }) {
  const [favorites, setFavorites] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem(KEY) || '[]')
    } catch {
      return []
    }
  })

  useEffect(() => {
    localStorage.setItem(KEY, JSON.stringify(favorites))
  }, [favorites])

  const has = (id) => favorites.some((f) => f.id === id)

  const toggle = (flight) => {
    setFavorites((prev) =>
      prev.some((f) => f.id === flight.id)
        ? prev.filter((f) => f.id !== flight.id)
        : [flight, ...prev],
    )
  }

  const remove = (id) => setFavorites((prev) => prev.filter((f) => f.id !== id))

  return (
    <FavoritesContext.Provider value={{ favorites, has, toggle, remove }}>
      {children}
    </FavoritesContext.Provider>
  )
}

export function useFavorites() {
  return useContext(FavoritesContext)
}
