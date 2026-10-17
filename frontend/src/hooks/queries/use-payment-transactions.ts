import { useQuery } from '@tanstack/react-query'
import { listPaymentTransactions } from '../../api/transactionApi'
import { queryKeys } from '../../api/query-keys'

export function usePaymentTransactionsQuery() {
  return useQuery({
    queryKey: queryKeys.transactions.all,
    queryFn: async () => {
      const res = await listPaymentTransactions()
      return res.data ?? []
    },
  })
}
