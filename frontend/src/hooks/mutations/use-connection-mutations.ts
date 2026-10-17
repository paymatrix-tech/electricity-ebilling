import { useMutation, useQueryClient } from '@tanstack/react-query'
import {
  createConnection,
  createConnectionType,
  createTariff,
  deleteConnection,
  deleteConnectionType,
  deleteTariff,
  updateConnection,
  updateConnectionType,
  updateTariff,
} from '../../api/connectionApi'
import { queryKeys } from '../../api/query-keys'

export function useCreateConnectionMutation() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: ({
      customerId,
      connectionTypeId,
      status,
    }: {
      customerId: string
      connectionTypeId: string
      status: string
    }) => createConnection(customerId, connectionTypeId, status),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.connections.all })
    },
  })
}

export function useUpdateConnectionMutation(connectionId: string) {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (body: { customerId: string; connectionTypeId: string; status: string }) =>
      updateConnection(connectionId, body),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.connections.detail(connectionId) })
      queryClient.invalidateQueries({ queryKey: queryKeys.connections.all })
    },
  })
}

export function useDeleteConnectionMutation() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: deleteConnection,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.connections.all })
    },
  })
}

export function useCreateConnectionTypeMutation() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: ({ typeName, description }: { typeName: string; description: string }) =>
      createConnectionType(typeName, description),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.connectionTypes.all })
    },
  })
}

export function useUpdateConnectionTypeMutation(typeId: string) {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: ({ typeName, description }: { typeName: string; description: string }) =>
      updateConnectionType(typeId, typeName, description),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.connectionTypes.detail(typeId) })
      queryClient.invalidateQueries({ queryKey: queryKeys.connectionTypes.all })
    },
  })
}

export function useDeleteConnectionTypeMutation() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: deleteConnectionType,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.connectionTypes.all })
      queryClient.invalidateQueries({ queryKey: queryKeys.tariffs.all })
    },
  })
}

export function useCreateTariffMutation() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: ({
      connectionTypeId,
      minUnits,
      maxUnits,
      ratePerUnit,
    }: {
      connectionTypeId: string
      minUnits: number
      maxUnits: number
      ratePerUnit: number
    }) => createTariff(connectionTypeId, minUnits, maxUnits, ratePerUnit),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.tariffs.all })
    },
  })
}

export function useUpdateTariffMutation(tariffId: string) {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (body: {
      connectionTypeId: string
      minUnits: number
      maxUnits: number
      ratePerUnit: number
    }) => updateTariff(tariffId, body),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.tariffs.detail(tariffId) })
      queryClient.invalidateQueries({ queryKey: queryKeys.tariffs.all })
    },
  })
}

export function useDeleteTariffMutation() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: deleteTariff,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.tariffs.all })
    },
  })
}
