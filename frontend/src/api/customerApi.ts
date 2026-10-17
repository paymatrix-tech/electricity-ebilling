import { api } from './client'
import type { ApiResponse, PaginationData } from './types'

export interface UserCustomer {
  userId: string
  customerId: string
  firstName: string
  lastName: string
  email: string
  phoneNumber: string
  address: string
}

export async function createCustomer(body: Record<string, unknown>) {
  const { data } = await api.post<ApiResponse<UserCustomer>>('/api/auth/customers', body)
  return data
}

export async function getCustomer(id: string) {
  const { data } = await api.get<ApiResponse<UserCustomer>>(`/api/auth/customers/${id}`)
  return data
}

export async function updateCustomer(id: string, body: Record<string, unknown>) {
  const { data } = await api.put<ApiResponse<UserCustomer>>(`/api/auth/customers/${id}`, body)
  return data
}

export async function deleteCustomer(id: string) {
  const { data } = await api.delete<ApiResponse<null>>(`/api/auth/customers/${id}`)
  return data
}

export async function searchCustomers(params: {
  page?: number
  size?: number
  customerId?: string
  firstName?: string
  lastName?: string
  email?: string
}) {
  const { data } = await api.get<ApiResponse<PaginationData<UserCustomer>>>('/api/auth/customers', { params })
  return data
}

export async function uploadCustomersCsv(file: File) {
  const form = new FormData()
  form.append('customerList', file)
  const { data } = await api.post<ApiResponse<unknown>>('/api/auth/customers/bulk/csv', form, {
    headers: { 'Content-Type': 'multipart/form-data' },
  })
  return data
}
