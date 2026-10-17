import axios from 'axios'

export function getApiErrorMessage(error: unknown, fallback = 'Request failed'): string {
  if (axios.isAxiosError(error)) {
    const data = error.response?.data as { message?: string } | undefined
    if (data?.message) return data.message
    if (error.response?.status === 401) {
      return 'Not signed in or session expired. Please log in again.'
    }
    if (error.response?.status === 403) {
      return 'You do not have permission to perform this action.'
    }
    return error.message || fallback
  }
  if (error instanceof Error) return error.message
  return fallback
}

const LOGIN_ID_PATTERN = /^(USR|EMP|CST)/i

export function normalizeLoginUserId(raw: string): string {
  return raw.trim().toUpperCase()
}

export function isValidLoginUserId(userId: string): boolean {
  return LOGIN_ID_PATTERN.test(userId)
}
