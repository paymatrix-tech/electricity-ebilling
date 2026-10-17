import { Navigate } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'
import { homePathForRole, paths } from '../routes/paths'

export function RootRedirect() {
  const { isAuthenticated, role } = useAuth()

  if (!isAuthenticated) {
    return <Navigate to={paths.login} replace />
  }

  return <Navigate to={homePathForRole(role)} replace />
}
