import { createContext, useContext, useMemo, useState } from 'react'
import type { ReactNode } from 'react'

export type UserRole = 'admin' | 'student'
export type User = {
  email: string
  role: UserRole
  name?: string
}

type AuthContextType = {
  user: User | null
  login: (email: string, password: string) => Promise<void>
  signup: (email: string, password: string, role: UserRole) => Promise<void>
  logout: () => void
}

type BackendAuthResponse = {
  token?: string
  email?: string
  role?: string
  message?: string
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

const STORAGE_KEY = 'study-planner-auth'
const TOKEN_KEY = 'study-planner-token'
const API_BASE_URL = (
  import.meta.env.VITE_API_URL ||
  import.meta.env.NEXT_PUBLIC_API_URL ||
  'https://localhost:7161'
).replace(/\/$/, '')

const normalizeRole = (role?: string): UserRole => {
  if (role?.toLowerCase() === 'admin') {
    return 'admin'
  }

  return 'student'
}

const readStoredUser = (): User | null => {
  const stored = localStorage.getItem(STORAGE_KEY)
  if (!stored) {
    return null
  }

  try {
    return JSON.parse(stored) as User
  } catch {
    localStorage.removeItem(STORAGE_KEY)
    return null
  }
}

const parseResponseBody = async (response: Response) => {
  const text = await response.text().catch(() => '')

  if (!text) {
    return { text: '', data: {} as BackendAuthResponse }
  }

  try {
    return { text, data: JSON.parse(text) as BackendAuthResponse }
  } catch {
    return { text, data: {} as BackendAuthResponse }
  }
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(() => readStoredUser())

  const login = async (email: string, password: string) => {
    const response = await fetch(`${API_BASE_URL}/api/Auth/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ email, password }),
    })

    const { text, data } = await parseResponseBody(response)
    const message = response.ok
      ? data.message
      : data.message || text || 'Invalid email or password.'

    if (!response.ok) {
      throw new Error(message)
    }

    const authUser: User = {
      email: data.email || email,
      role: normalizeRole(data.role),
      name: data.email || email,
    }

    localStorage.setItem(STORAGE_KEY, JSON.stringify(authUser))
    if (data.token) {
      localStorage.setItem(TOKEN_KEY, data.token)
    }
    setUser(authUser)
  }

  const signup = async (email: string, password: string, role: UserRole) => {
    const response = await fetch(`${API_BASE_URL}/api/Auth/register`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        email,
        password,
        confirmPassword: password,
        role: role === 'admin' ? 'Admin' : 'Student',
      }),
    })

    const { text, data } = await parseResponseBody(response)
    const message = response.ok
      ? data.message
      : data.message || text || 'Signup failed. Please try again.'

    if (!response.ok) {
      throw new Error(message)
    }

    const authUser: User = {
      email,
      role,
      name: email,
    }

    localStorage.setItem(STORAGE_KEY, JSON.stringify(authUser))
    if (data.token) {
      localStorage.setItem(TOKEN_KEY, data.token)
    }
    setUser(authUser)
  }

  const logout = () => {
    localStorage.removeItem(STORAGE_KEY)
    localStorage.removeItem(TOKEN_KEY)
    setUser(null)
  }

  const value = useMemo(() => ({ user, login, signup, logout }), [user])

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error('useAuth must be used inside AuthProvider')
  }
  return context
}
