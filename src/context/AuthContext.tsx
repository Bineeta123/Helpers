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

  const login = async (email: string, _password: string, role: UserRole) => {
    // TODO: replace with real .NET API call when backend is ready.
    await new Promise((resolve) => setTimeout(resolve, 250))
    const authUser: User = { email, role }
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
