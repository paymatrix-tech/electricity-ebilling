export interface ApiResponse<T = unknown> {
  status: string
  message: string
  data: T
  statusCode: number
}

export interface PaginationData<T> {
  content: T[]
  totalPages: number
  totalElements: number
  size: number
  number: number
}

export type UserRole = 'CUSTOMER' | 'EMPLOYEE' | 'ADMIN'

export interface Invoice {
  id: string
  customerId: string
  customerName: string
  customerEmail: string
  connectionId: string
  connectionType: string
  month: string
  dueDate: string
  units: number
  billAmount: number
  finalAmount: number
  paymentStatus: string
  rateApplicable: string
}
