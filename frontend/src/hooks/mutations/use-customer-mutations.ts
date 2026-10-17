import { useMutation, useQueryClient } from '@tanstack/react-query'
import { createCustomer, deleteCustomer, updateCustomer, uploadCustomersCsv } from '../../api/customerApi'
import { queryKeys } from '../../api/query-keys'

export function useCreateCustomerMutation() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: createCustomer,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.customers.all })
    },
  })
}

export function useUpdateCustomerMutation(customerId: string) {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (body: Record<string, unknown>) => updateCustomer(customerId, body),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.customers.detail(customerId) })
      queryClient.invalidateQueries({ queryKey: queryKeys.customers.all })
    },
  })
}

export function useDeleteCustomerMutation() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: deleteCustomer,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.customers.all })
    },
  })
}

export function useUploadCustomersCsvMutation() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: uploadCustomersCsv,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.customers.all })
    },
  })
}
