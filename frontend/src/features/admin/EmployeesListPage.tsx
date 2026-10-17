import { useState } from 'react'
import { Link } from 'react-router-dom'
import { Pencil, Search, Trash2 } from 'lucide-react'
import { toast } from 'sonner'
import { paths } from '../../routes/paths'
import { useEmployeesListQuery } from '../../hooks/queries/use-employees'
import { useDeleteEmployeeMutation } from '../../hooks/mutations/use-employee-mutations'
import { QueryError, QueryLoading } from '../../components/QueryState'
import { Button } from '../../components/ui/Button'
import { Card } from '../../components/ui/Card'
import { Input } from '../../components/ui/Input'
import { PageHeader } from '../../components/ui/PageHeader'
import { PaginationControls } from '../../components/ui/PaginationControls'

const PAGE_SIZE = 10

export function EmployeesListPage() {
  const [page, setPage] = useState(0)
  const [firstName, setFirstName] = useState('')
  const [email, setEmail] = useState('')
  const [applied, setApplied] = useState({ firstName: '', email: '' })

  const { data, isLoading, isError, refetch, isFetching } = useEmployeesListQuery(page, PAGE_SIZE, applied)
  const deleteEmployee = useDeleteEmployeeMutation()

  const employees = data?.data?.content ?? []
  const totalPages = data?.data?.totalPages ?? 1

  const applySearch = () => {
    setPage(0)
    setApplied({ firstName: firstName.trim(), email: email.trim() })
  }

  const remove = (id: string, name: string) => {
    if (!window.confirm(`Delete employee ${name} (${id})?`)) return
    deleteEmployee.mutate(id, {
      onSuccess: (res) => toast.success(res.message || 'Employee deleted'),
      onError: () => toast.error('Delete failed'),
    })
  }

  return (
    <div>
      <PageHeader
        title="Employees"
        description="Browse staff accounts. Add new employees from the sidebar."
      />

      <div className="mb-4 flex flex-wrap items-end gap-3">
        <Input
          className="max-w-xs"
          placeholder="First name"
          value={firstName}
          onChange={(e) => setFirstName(e.target.value)}
        />
        <div className="relative min-w-[12rem] max-w-xs flex-1">
          <Search className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-slate-400" />
          <Input
            className="pl-9"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </div>
        <Button type="button" variant="secondary" onClick={applySearch} disabled={isFetching}>
          Search
        </Button>
      </div>

      {isLoading ? (
        <QueryLoading label="Loading employees…" />
      ) : isError ? (
        <QueryError onRetry={() => refetch()} />
      ) : (
        <Card className="overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full min-w-[720px] text-left text-sm">
              <thead className="border-b border-slate-100 bg-slate-50/80 text-xs font-semibold uppercase tracking-wide text-slate-500">
                <tr>
                  <th className="px-4 py-3">ID</th>
                  <th className="px-4 py-3">Name</th>
                  <th className="px-4 py-3">Email</th>
                  <th className="px-4 py-3">Designation</th>
                  <th className="px-4 py-3">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {employees.length === 0 ? (
                  <tr>
                    <td colSpan={5} className="px-4 py-8 text-center text-slate-500">
                      No employees found.
                    </td>
                  </tr>
                ) : (
                  employees.map((e) => (
                    <tr key={e.employeeId} className="hover:bg-slate-50/50">
                      <td className="px-4 py-3 font-medium">{e.employeeId}</td>
                      <td className="px-4 py-3">{e.firstName} {e.lastName}</td>
                      <td className="px-4 py-3 text-slate-600">{e.email}</td>
                      <td className="px-4 py-3">{e.designation}</td>
                      <td className="px-4 py-3">
                        <div className="flex flex-wrap gap-3">
                          <Link
                            to={paths.admin.employees.edit(e.employeeId)}
                            className="inline-flex items-center gap-1 text-sm font-medium text-brand-600 hover:text-brand-700"
                          >
                            <Pencil className="size-3.5" />
                            Edit
                          </Link>
                          <button
                            type="button"
                            className="inline-flex items-center gap-1 text-sm font-medium text-red-600 hover:text-red-700"
                            onClick={() => remove(e.employeeId, `${e.firstName} ${e.lastName}`)}
                          >
                            <Trash2 className="size-3.5" />
                            Delete
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
          <PaginationControls page={page} totalPages={totalPages} onPageChange={setPage} disabled={isFetching} />
        </Card>
      )}
    </div>
  )
}
