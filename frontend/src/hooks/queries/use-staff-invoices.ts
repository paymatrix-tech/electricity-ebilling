import { useQuery } from '@tanstack/react-query'
import { getStaffInvoices } from '../../api/invoiceApi'
import { queryKeys } from '../../api/query-keys'

export function useStaffInvoicesQuery() {
  return useQuery({
    queryKey: queryKeys.invoices.forStaff(),
    queryFn: async () => {
      const res = await getStaffInvoices()
      return res.data ?? []
    },
  })
}
