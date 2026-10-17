import { useQuery } from '@tanstack/react-query'
import { getConnection, searchConnections } from '../../api/connectionApi'
import { queryKeys } from '../../api/query-keys'

const DEFAULT_SIZE = 10

export type ConnectionSearchFilters = {
  customerId?: string
  status?: string
}

export function useConnectionsListQuery(
  page = 0,
  size = DEFAULT_SIZE,
  filters: ConnectionSearchFilters = {},
) {
  const filterKey = {
    customerId: filters.customerId ?? '',
    status: filters.status ?? '',
  }
  return useQuery({
    queryKey: queryKeys.connections.list(page, size, filterKey),
    queryFn: () =>
      searchConnections({
        page,
        size,
        customerId: filters.customerId || undefined,
        status: filters.status || undefined,
      }),
  })
}

export function useConnectionQuery(connectionId: string | undefined) {
  return useQuery({
    queryKey: queryKeys.connections.detail(connectionId ?? ''),
    queryFn: () => getConnection(connectionId!),
    enabled: Boolean(connectionId),
  })
}
