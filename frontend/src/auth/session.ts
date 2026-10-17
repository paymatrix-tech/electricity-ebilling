import { jwtDecode } from 'jwt-decode'
import type { UserRole } from '../api/types'

interface TokenPayload {
  role: UserRole
  sub?: string
  exp?: number
}

export function getToken(): string | null {
  return localStorage.getItem('token')
}

export function setToken(token: string): void {
  localStorage.setItem('token', token)
  try {
    const decoded = jwtDecode<TokenPayload>(token)
    if (decoded.exp) {
      localStorage.setItem('tokenExpiry', String(decoded.exp))
    }
  } catch {
    localStorage.removeItem('tokenExpiry')
  }
}

export function clearSession(): void {
  localStorage.removeItem('token')
  localStorage.removeItem('tokenExpiry')
}

export function getUserRole(): UserRole | null {
  const token = getToken()
  if (!token) return null
  try {
    return jwtDecode<TokenPayload>(token).role
  } catch {
    return null
  }
}

export function isLoggedIn(): boolean {
  const token = getToken()
  const expiry = localStorage.getItem('tokenExpiry')
  if (!token) return false
  if (!expiry) return true
  return Math.floor(Date.now() / 1000) < Number(expiry)
}
