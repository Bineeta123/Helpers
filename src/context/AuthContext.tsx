import { createContext, useContext, useMemo, useState } from 'react'
import type { ReactNode } from 'react'

export type UserRole = 'admin' | 'user'
export type User = {
  email: string
  role: UserRole
  name?: string
}

type StoredAccount = User & {
  password: string
}

type AuthContextType = {
  user: User | null
  login: (email: string, password: string, role: UserRole) => Promise<void>
  signup: (name: string, email: string, password: string, role: UserRole) => Promise<void>
  logout: () => void
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

const STORAGE_KEY = 'study-planner-auth'
const ACCOUNTS_KEY = 'study-planner-accounts'

const getStoredAccounts = () => {
  const stored = localStorage.getItem(ACCOUNTS_KEY)
  if (!stored) return []

  try {
    return JSON.parse(stored) as StoredAccount[]
  } catch {
    localStorage.removeItem(ACCOUNTS_KEY)
    return []
  }
}

const saveStoredAccounts = (accounts: StoredAccount[]) => {
  localStorage.setItem(ACCOUNTS_KEY, JSON.stringify(accounts))
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(() => {
    const stored = localStorage.getItem(STORAGE_KEY)
    if (stored) {
      try {
        return JSON.parse(stored) as User
      } catch {
        localStorage.removeItem(STORAGE_KEY)
      }
    }

    return null
  })

  const login = async (email: string, password: string, role: UserRole) => {
    // TODO: replace with real .NET API call when backend is ready.
    await new Promise((resolve) => setTimeout(resolve, 250))
    const accounts = getStoredAccounts()
    const account = accounts.find(
      (storedAccount) =>
        storedAccount.email.toLowerCase() === email.toLowerCase() &&
        storedAccount.password === password &&
        storedAccount.role === role,
    )

    if (!account) {
      throw new Error('Invalid email, password, or role.')
    }

    const authUser: User = { email: account.email, role: account.role, name: account.name }
    localStorage.setItem(STORAGE_KEY, JSON.stringify(authUser))
    setUser(authUser)
  }

  const signup = async (name: string, email: string, password: string, role: UserRole) => {
    // TODO: replace with real .NET API call when backend is ready.
    await new Promise((resolve) => setTimeout(resolve, 250))
    const accounts = getStoredAccounts()
    const accountExists = accounts.some(
      (storedAccount) => storedAccount.email.toLowerCase() === email.toLowerCase(),
    )

    if (accountExists) {
      throw new Error('An account already exists with this email.')
    }

    const authUser: User = { name, email, role }
    saveStoredAccounts([...accounts, { ...authUser, password }])
    localStorage.setItem(STORAGE_KEY, JSON.stringify(authUser))
    setUser(authUser)
  }

  const logout = () => {
    localStorage.removeItem(STORAGE_KEY)
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
