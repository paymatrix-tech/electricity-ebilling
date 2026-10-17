import { useQuery } from '@tanstack/react-query'
import { getTariff, getTariffs } from '../../api/connectionApi'
import { queryKeys } from '../../api/query-keys'

const DEFAULT_SIZE = 10

export function useTariffsListQuery(page = 0, size = DEFAULT_SIZE) {
  return useQuery({
    queryKey: queryKeys.tariffs.list(page, size),
    queryFn: () => getTariffs(page, size),
  })
}

export function useTariffQuery(tariffId: string | undefined) {
  return useQuery({
    queryKey: queryKeys.tariffs.detail(tariffId ?? ''),
    queryFn: () => getTariff(tariffId!),
    enabled: Boolean(tariffId),
  })
}
