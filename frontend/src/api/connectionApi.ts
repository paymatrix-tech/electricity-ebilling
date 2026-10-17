import { api } from './client'
import type { ApiResponse, PaginationData } from './types'

export interface ConnectionType {
  id: string
  typeName: string
  description: string
}

export interface Connection {
  id: string
  customerId: string
  customerName: string
  customerEmail: string
  connectionTypeId: string
  connectionTypeName: string
  startDate: string
  status: string
}

export interface Tariff {
  id: string
  connectionTypeId: string
  minUnits: number
  maxUnits: number
  ratePerUnit: number
}

export async function getConnectionTypes(page = 0, size = 50) {
  const { data } = await api.get<ApiResponse<PaginationData<ConnectionType>>>(
    '/api/billing/connections/types',
    { params: { page, size } },
  )
  return data
}

export async function getConnectionType(id: string) {
  const { data } = await api.get<ApiResponse<ConnectionType>>(`/api/billing/connections/types/${id}`)
  return data
}

export async function createConnectionType(typeName: string, description: string) {
  const { data } = await api.post<ApiResponse<ConnectionType>>('/api/billing/connections/types', {
    typeName,
    description,
  })
  return data
}

export async function updateConnectionType(id: string, typeName: string, description: string) {
  const { data } = await api.put<ApiResponse<ConnectionType>>(`/api/billing/connections/types/${id}`, {
    typeName,
    description,
  })
  return data
}

export async function deleteConnectionType(id: string) {
  const { data } = await api.delete<ApiResponse<null>>(`/api/billing/connections/types/${id}`)
  return data
}

export async function searchConnections(params: {
  page?: number
  size?: number
  customerId?: string
  connectionTypeId?: string
  status?: string
}) {
  const { data } = await api.get<ApiResponse<PaginationData<Connection>>>(
    '/api/billing/connections',
    { params },
  )
  return data
}

export async function getConnection(id: string) {
  const { data } = await api.get<ApiResponse<Connection>>(`/api/billing/connections/${id}`)
  return data
}

export async function createConnection(customerId: string, connectionTypeId: string, status: string) {
  const { data } = await api.post<ApiResponse<Connection>>('/api/billing/connections', {
    customerId,
    connectionTypeId,
    status,
  })
  return data
}

export async function updateConnection(
  id: string,
  body: { customerId: string; connectionTypeId: string; status: string },
) {
  const { data } = await api.put<ApiResponse<Connection>>(`/api/billing/connections/${id}`, body)
  return data
}

export async function deleteConnection(id: string) {
  const { data } = await api.delete<ApiResponse<null>>(`/api/billing/connections/${id}`)
  return data
}

export async function getTariffs(page = 0, size = 50) {
  const { data } = await api.get<ApiResponse<PaginationData<Tariff>>>(
    '/api/billing/connections/tariffs',
    { params: { page, size } },
  )
  return data
}

export async function getTariff(id: string) {
  const { data } = await api.get<ApiResponse<Tariff>>(`/api/billing/connections/tariffs/${id}`)
  return data
}

export async function createTariff(
  connectionTypeId: string,
  minUnits: number,
  maxUnits: number,
  ratePerUnit: number,
) {
  const { data } = await api.post<ApiResponse<Tariff>>('/api/billing/connections/tariffs', {
    connectionTypeId,
    minUnits,
    maxUnits,
    ratePerUnit,
  })
  return data
}

export async function updateTariff(
  id: string,
  body: { connectionTypeId: string; minUnits: number; maxUnits: number; ratePerUnit: number },
) {
  const { data } = await api.put<ApiResponse<Tariff>>(`/api/billing/connections/tariffs/${id}`, body)
  return data
}

export async function deleteTariff(id: string) {
  const { data } = await api.delete<ApiResponse<null>>(`/api/billing/connections/tariffs/${id}`)
  return data
}
