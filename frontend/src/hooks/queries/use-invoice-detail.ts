import { useQuery } from '@tanstack/react-query'
import { getInvoiceById } from '../../api/invoiceApi'
import { queryKeys } from '../../api/query-keys'

export function useInvoiceDetailQuery(invoiceId: string | undefined) {
  return useQuery({
    queryKey: queryKeys.invoices.detail(invoiceId ?? ''),
    queryFn: async () => {
      const res = await getInvoiceById(invoiceId!)
      return res.data
    },
    enabled: Boolean(invoiceId),
  })
}
