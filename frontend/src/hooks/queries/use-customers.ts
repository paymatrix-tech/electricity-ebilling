import { useQuery } from '@tanstack/react-query'
import { getCustomer, searchCustomers } from '../../api/customerApi'
import { queryKeys } from '../../api/query-keys'

const DEFAULT_SIZE = 10

export type CustomerSearchFilters = {
  customerId?: string
  email?: string
  firstName?: string
}

export function useCustomersListQuery(
  page = 0,
  size = DEFAULT_SIZE,
  filters: CustomerSearchFilters = {},
) {
  const filterKey = {
    customerId: filters.customerId ?? '',
    email: filters.email ?? '',
    firstName: filters.firstName ?? '',
  }
  return useQuery({
    queryKey: queryKeys.customers.list(page, size, filterKey),
    queryFn: () =>
      searchCustomers({
        page,
        size,
        customerId: filters.customerId || undefined,
        email: filters.email || undefined,
        firstName: filters.firstName || undefined,
      }),
  })
}

export function useCustomerQuery(customerId: string | undefined) {
  return useQuery({
    queryKey: queryKeys.customers.detail(customerId ?? ''),
    queryFn: () => getCustomer(customerId!),
    enabled: Boolean(customerId),
  })
}
