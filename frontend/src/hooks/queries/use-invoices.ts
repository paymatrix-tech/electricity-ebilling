import { useQuery } from '@tanstack/react-query'
import { getInvoicesByStatus } from '../../api/invoiceApi'
import { queryKeys } from '../../api/query-keys'
import type { Invoice } from '../../api/types'

const CUSTOMER_INVOICE_STATUSES = ['UNPAID', 'PAID', 'FAILED', 'PENDING'] as const

async function fetchCustomerInvoices(): Promise<Invoice[]> {
  const batches = await Promise.all(
    CUSTOMER_INVOICE_STATUSES.map(async (status) => {
      const res = await getInvoicesByStatus(status)
      return res.data ?? []
    }),
  )
  return batches.flat()
}

export function useCustomerInvoicesQuery() {
  return useQuery({
    queryKey: queryKeys.invoices.forCustomer(),
    queryFn: fetchCustomerInvoices,
  })
}
