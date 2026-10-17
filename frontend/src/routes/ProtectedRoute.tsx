import { Navigate, useLocation } from 'react-router-dom'
import type { UserRole } from '../api/types'
import { useAuth } from '../contexts/AuthContext'
import { homePathForRole, paths } from '../routes/paths'

export function ProtectedRoute({
  children,
  roles,
}: {
  children: React.ReactNode
  roles: UserRole[]
}) {
  const location = useLocation()
  const { isAuthenticated, role } = useAuth()

  if (!isAuthenticated) {
    return <Navigate to={paths.login} replace state={{ from: location }} />
  }

  if (!role || !roles.includes(role)) {
    return <Navigate to={homePathForRole(role)} replace />
  }

  return <>{children}</>
}
