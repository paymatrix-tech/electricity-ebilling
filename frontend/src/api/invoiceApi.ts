import { api } from './client'
import type { ApiResponse, Invoice } from './types'

const INVOICES = '/api/billing/connections/invoices'

export async function getInvoicesByStatus(paymentStatus?: string) {
  const params = paymentStatus ? { paymentStatus } : {}
  const { data } = await api.get<ApiResponse<Invoice[]>>(INVOICES, { params })
  return data
}

export async function createInvoice(payload: {
  customerId: string
  dueDate: string
  month: string
  units: number
}) {
  const { data } = await api.post<ApiResponse<Invoice>>(INVOICES, payload)
  return data
}

export async function createInvoicesBulk(invoices: {
  customerId: string
  dueDate: string
  month: string
  units: number
}[]) {
  const { data } = await api.post<ApiResponse<unknown>>(`${INVOICES}/bulk`, { invoices })
  return data
}

export async function uploadInvoicesCsv(file: File) {
  const form = new FormData()
  form.append('invoiceFile', file)
  const { data } = await api.post<ApiResponse<unknown>>(`${INVOICES}/bulk/csv`, form, {
    headers: { 'Content-Type': 'multipart/form-data' },
  })
  return data
}

export async function payInvoiceByUpi(invoiceId: string, senderUpiId: string, senderPin: string) {
  const { data } = await api.post<ApiResponse<unknown>>(`${INVOICES}/payment/upi`, {
    invoiceId,
    senderUpiId,
    senderPin,
  })
  return data
}

export async function getStaffInvoices() {
  const { data } = await api.get<ApiResponse<Invoice[]>>(`${INVOICES}/all`)
  return data
}

export async function getInvoiceById(invoiceId: string) {
  const { data } = await api.get<ApiResponse<Invoice>>(`${INVOICES}/${invoiceId}`)
  return data
}

export async function downloadInvoicePdf(invoiceId: string): Promise<Blob> {
  const { data } = await api.get<Blob>(`${INVOICES}/${invoiceId}/pdf`, { responseType: 'blob' })
  return data
}
