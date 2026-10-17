import { createContext, useCallback, useContext, useMemo, useState, type ReactNode } from 'react'
import type { UserRole } from '../api/types'
import { clearSession, getUserRole, isLoggedIn, setToken as persistToken } from '../auth/session'

type AuthContextValue = {
  isAuthenticated: boolean
  role: UserRole | null
  login: (token: string) => void
  logout: () => void
  refresh: () => void
}

const AuthContext = createContext<AuthContextValue | null>(null)

export function AuthProvider({ children }: { children: ReactNode }) {
  const [role, setRole] = useState<UserRole | null>(() => (isLoggedIn() ? getUserRole() : null))

  const refresh = useCallback(() => {
    setRole(isLoggedIn() ? getUserRole() : null)
  }, [])

  const login = useCallback(
    (token: string) => {
      persistToken(token)
      refresh()
    },
    [refresh],
  )

  const logout = useCallback(() => {
    clearSession()
    setRole(null)
  }, [])

  const value = useMemo(
    () => ({
      isAuthenticated: isLoggedIn() && role !== null,
      role,
      login,
      logout,
      refresh,
    }),
    [role, login, logout, refresh],
  )

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export function useAuth(): AuthContextValue {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuth must be used within AuthProvider')
  return ctx
}
