import { Navigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import type { ReactNode } from 'react'
import type { UserRole } from '../context/AuthContext'

type ProtectedRouteProps = {
  children: ReactNode
  role?: UserRole
}

export default function ProtectedRoute({ children, role }: ProtectedRouteProps) {
  const { user } = useAuth()

  if (!user) {
    return <Navigate to="/signin" replace />
  }

  if (role && user.role !== role) {
    return <Navigate to={user.role === 'admin' ? '/admin' : '/dashboard'} replace />
  }

  return <>{children}</>
}
