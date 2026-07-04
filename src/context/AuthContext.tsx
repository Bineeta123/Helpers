import { createContext, useContext, useEffect, useMemo, useState } from 'react'
import type { ReactNode } from 'react'

export type UserRole = 'admin' | 'user'
export type User = {
  email: string
  role: UserRole
}

type AuthContextType = {
  user: User | null
  login: (email: string, password: string, role: UserRole) => Promise<void>
  logout: () => void
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

const STORAGE_KEY = 'study-planner-auth'

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null)

  useEffect(() => {
    const stored = localStorage.getItem(STORAGE_KEY)
    if (stored) {
      try {
        setUser(JSON.parse(stored) as User)
      } catch {
        localStorage.removeItem(STORAGE_KEY)
      }
    }
  }, [])

  const login = async (email: string, password: string, role: UserRole) => {
    await new Promise((resolve) => setTimeout(resolve, 250))

    const normalizedEmail = email.trim().toLowerCase()
    const demoAccounts: Record<string, { password: string; role: UserRole }> = {
      'admin@example.com': { password: 'admin123', role: 'admin' },
      'student@example.com': { password: 'student123', role: 'user' },
    }

    const account = demoAccounts[normalizedEmail]

    if (!account || account.password !== password || account.role !== role) {
      throw new Error('Invalid credentials')
    }

    const authUser: User = { email: normalizedEmail, role }
    localStorage.setItem(STORAGE_KEY, JSON.stringify(authUser))
    setUser(authUser)
  }

  const logout = () => {
    localStorage.removeItem(STORAGE_KEY)
    setUser(null)
  }

  const value = useMemo(() => ({ user, login, logout }), [user])

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error('useAuth must be used inside AuthProvider')
  }
  return context
}
