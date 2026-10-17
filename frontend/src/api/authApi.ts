import { api } from './client'
import type { ApiResponse } from './types'

export async function sendOtp(userId: string) {
  const { data } = await api.post<ApiResponse<null>>('/auth/otp/generate-otp', { userId })
  return data
}

export async function resendOtp(userId: string) {
  const { data } = await api.post<ApiResponse<null>>('/auth/otp/resend-otp', { userId })
  return data
}

export async function verifyOtp(userId: string, otpCode: string) {
  const { data } = await api.post<ApiResponse<string>>('/auth/otp/verify-otp', { userId, otpCode })
  return data
}
