import { api } from './client'
import type { ApiResponse, PaginationData } from './types'

export interface UserEmployee {
  userId: string
  employeeId: string
  firstName: string
  lastName: string
  email: string
  phoneNumber: string
  designation: string
  salary: number
}

export async function createEmployee(body: Record<string, unknown>) {
  const { data } = await api.post<ApiResponse<UserEmployee>>('/api/auth/employees', body)
  return data
}

export async function searchEmployees(params: {
  page?: number
  size?: number
  firstName?: string
  lastName?: string
  email?: string
}) {
  const { data } = await api.get<ApiResponse<PaginationData<UserEmployee>>>('/api/auth/employees', { params })
  return data
}

export async function getEmployee(id: string) {
  const { data } = await api.get<ApiResponse<UserEmployee>>(`/api/auth/employees/${id}`)
  return data
}

export async function updateEmployee(id: string, body: Record<string, unknown>) {
  const { data } = await api.put<ApiResponse<UserEmployee>>(`/api/auth/employees/${id}`, body)
  return data
}

export async function deleteEmployee(id: string) {
  const { data } = await api.delete<ApiResponse<null>>(`/api/auth/employees/${id}`)
  return data
}
