import { useQuery } from '@tanstack/react-query'
import { getEmployee, searchEmployees } from '../../api/employeeApi'
import { queryKeys } from '../../api/query-keys'

const DEFAULT_SIZE = 10

export type EmployeeSearchFilters = {
  email?: string
  firstName?: string
}

export function useEmployeesListQuery(page = 0, size = DEFAULT_SIZE, filters: EmployeeSearchFilters = {}) {
  const filterKey = {
    email: filters.email ?? '',
    firstName: filters.firstName ?? '',
  }
  return useQuery({
    queryKey: queryKeys.employees.list(page, size, filterKey),
    queryFn: () =>
      searchEmployees({
        page,
        size,
        email: filters.email || undefined,
        firstName: filters.firstName || undefined,
      }),
  })
}

export function useEmployeeQuery(employeeId: string | null) {
  return useQuery({
    queryKey: queryKeys.employees.detail(employeeId ?? ''),
    queryFn: () => getEmployee(employeeId!),
    enabled: Boolean(employeeId),
  })
}
