import type { UserRole } from '../api/types'

/** Canonical app URLs — use these instead of hard-coded strings. */
export const paths = {
  login: '/login',
  notFound: '/404',

  employee: {
    root: '/employee',
    dashboard: '/employee/dashboard',
    customers: {
      list: '/employee/customers',
      new: '/employee/customers/new',
      import: '/employee/customers/import',
      edit: (customerId: string) => `/employee/customers/${customerId}/edit`,
    },
    connections: {
      list: '/employee/connections',
      new: '/employee/connections/new',
      edit: (connectionId: string) => `/employee/connections/${connectionId}/edit`,
    },
    invoices: {
      list: '/employee/invoices',
      new: '/employee/invoices/new',
      detail: (invoiceId: string) => `/employee/invoices/${invoiceId}`,
    },
    transactions: '/employee/transactions',
  },

  customer: {
    root: '/customer',
    bills: '/customer/bills',
    pay: {
      upi: '/customer/pay/upi',
      card: '/customer/pay/card',
      wallet: '/customer/pay/wallet',
      success: '/customer/pay/success',
      failed: '/customer/pay/failed',
    },
  },

  admin: {
    root: '/admin',
    employees: {
      list: '/admin/employees',
      new: '/admin/employees/new',
      edit: (employeeId: string) => `/admin/employees/${employeeId}/edit`,
      editLegacy: '/admin/employees/edit',
    },
    connectionTypes: {
      list: '/admin/connection-types',
      new: '/admin/connection-types/new',
      edit: (typeId: string) => `/admin/connection-types/${typeId}/edit`,
    },
    tariffs: {
      list: '/admin/tariffs',
      new: '/admin/tariffs/new',
      edit: (tariffId: string) => `/admin/tariffs/${tariffId}/edit`,
    },
    invoices: {
      new: '/admin/invoices/new',
    },
  },
} as const

export function homePathForRole(role: UserRole | null): string {
  switch (role) {
    case 'CUSTOMER':
      return paths.customer.bills
    case 'EMPLOYEE':
      return paths.employee.dashboard
    case 'ADMIN':
      return paths.admin.root
    default:
      return paths.login
  }
}
