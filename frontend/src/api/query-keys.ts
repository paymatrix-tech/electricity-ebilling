export const queryKeys = {
  customers: {
    all: ['customers'] as const,
    list: (page: number, size: number, filters: Record<string, string>) =>
      [...queryKeys.customers.all, 'list', { page, size, ...filters }] as const,
    detail: (customerId: string) => [...queryKeys.customers.all, 'detail', customerId] as const,
  },
  invoices: {
    all: ['invoices'] as const,
    forCustomer: () => [...queryKeys.invoices.all, 'customer'] as const,
    forStaff: () => [...queryKeys.invoices.all, 'staff'] as const,
    detail: (invoiceId: string) => [...queryKeys.invoices.all, 'detail', invoiceId] as const,
  },
  transactions: {
    all: ['paymentTransactions'] as const,
  },
  connectionTypes: {
    all: ['connectionTypes'] as const,
    list: (page: number, size: number) =>
      [...queryKeys.connectionTypes.all, 'list', { page, size }] as const,
    detail: (id: string) => [...queryKeys.connectionTypes.all, 'detail', id] as const,
  },
  connections: {
    all: ['connections'] as const,
    list: (page: number, size: number, filters: Record<string, string>) =>
      [...queryKeys.connections.all, 'list', { page, size, ...filters }] as const,
    detail: (id: string) => [...queryKeys.connections.all, 'detail', id] as const,
  },
  tariffs: {
    all: ['tariffs'] as const,
    list: (page: number, size: number) => [...queryKeys.tariffs.all, 'list', { page, size }] as const,
    detail: (id: string) => [...queryKeys.tariffs.all, 'detail', id] as const,
  },
  employees: {
    all: ['employees'] as const,
    list: (page: number, size: number, filters: Record<string, string>) =>
      [...queryKeys.employees.all, 'list', { page, size, ...filters }] as const,
    detail: (employeeId: string) => [...queryKeys.employees.all, 'detail', employeeId] as const,
  },
}
