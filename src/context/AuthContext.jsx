import { createContext, useContext, useEffect, useState } from 'react'

const USERS_KEY = 'skyvoyage-users'
const SESSION_KEY = 'skyvoyage-session'
const AuthContext = createContext(null)

async function hashPassword(pw) {
  const data = new TextEncoder().encode(String(pw))
  const buf = await crypto.subtle.digest('SHA-256', data)
  return Array.from(new Uint8Array(buf))
    .map((b) => b.toString(16).padStart(2, '0'))
    .join('')
}

export function AuthProvider({ children }) {
  const [users, setUsers] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem(USERS_KEY) || '[]')
    } catch {
      return []
    }
  })
  const [user, setUser] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem(SESSION_KEY) || 'null')
    } catch {
      return null
    }
  })

  useEffect(() => {
    localStorage.setItem(USERS_KEY, JSON.stringify(users))
  }, [users])

  useEffect(() => {
    localStorage.setItem(SESSION_KEY, JSON.stringify(user))
  }, [user])

  const signup = async ({ name, email, password }) => {
    const norm = String(email).trim().toLowerCase()
    if (!String(name).trim()) throw new Error('Please enter your name.')
    if (users.some((u) => u.email === norm)) {
      throw new Error('An account with this email already exists.')
    }
    const passwordHash = await hashPassword(password)
    const newUser = { name: String(name).trim(), email: norm, passwordHash }
    setUsers((prev) => [...prev, newUser])
    setUser({ name: newUser.name, email: newUser.email })
    return newUser
  }

  const login = async ({ email, password }) => {
    const norm = String(email).trim().toLowerCase()
    const found = users.find((u) => u.email === norm)
    if (!found) throw new Error('No account found with this email.')
    const passwordHash = await hashPassword(password)
    if (found.passwordHash !== passwordHash) throw new Error('Incorrect password.')
    setUser({ name: found.name, email: found.email })
    return found
  }

  const logout = () => setUser(null)

  return (
    <AuthContext.Provider value={{ user, signup, login, logout }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  return useContext(AuthContext)
}
