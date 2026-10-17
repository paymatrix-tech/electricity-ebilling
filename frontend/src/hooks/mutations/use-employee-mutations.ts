import { useMutation, useQueryClient } from '@tanstack/react-query'
import { createEmployee, deleteEmployee, updateEmployee } from '../../api/employeeApi'
import { queryKeys } from '../../api/query-keys'

export function useCreateEmployeeMutation() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: createEmployee,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.employees.all })
    },
  })
}

export function useUpdateEmployeeMutation(employeeId: string) {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (body: Record<string, unknown>) => updateEmployee(employeeId, body),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.employees.detail(employeeId) })
      queryClient.invalidateQueries({ queryKey: queryKeys.employees.all })
    },
  })
}

export function useDeleteEmployeeMutation() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: deleteEmployee,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.employees.all })
    },
  })
}
