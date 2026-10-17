import { useQuery } from '@tanstack/react-query'
import { getConnectionTypes } from '../../api/connectionApi'
import { queryKeys } from '../../api/query-keys'

export function useConnectionTypesQuery(page = 0, size = 50) {
  return useQuery({
    queryKey: queryKeys.connectionTypes.list(page, size),
    queryFn: () => getConnectionTypes(page, size),
    select: (response) => response.data?.content ?? [],
  })
}
