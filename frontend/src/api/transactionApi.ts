import { api } from './client'
import type { ApiResponse } from './types'

export interface PaymentTransaction {
  id: string
  invoiceId: string
  customerId: string
  paymentDate: string
  paymentAmount: number
  paymentType: string
  paymentStatus: string
}

export async function listPaymentTransactions() {
  const { data } = await api.get<ApiResponse<PaymentTransaction[]>>(
    '/api/billing/connections/payment-transactions',
  )
  return data
}
