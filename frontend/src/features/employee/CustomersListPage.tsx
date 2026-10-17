import { useState } from 'react'
import { Link } from 'react-router-dom'
import { Pencil, Search, Trash2 } from 'lucide-react'
import { toast } from 'sonner'
import { paths } from '../../routes/paths'
import { useCustomersListQuery } from '../../hooks/queries/use-customers'
import { useDeleteCustomerMutation } from '../../hooks/mutations/use-customer-mutations'
import { QueryError, QueryLoading } from '../../components/QueryState'
import { Button } from '../../components/ui/Button'
import { Card } from '../../components/ui/Card'
import { Input } from '../../components/ui/Input'
import { PageHeader } from '../../components/ui/PageHeader'
import { PaginationControls } from '../../components/ui/PaginationControls'

const PAGE_SIZE = 10

export function CustomersListPage() {
  const [page, setPage] = useState(0)
  const [customerId, setCustomerId] = useState('')
  const [email, setEmail] = useState('')
  const [applied, setApplied] = useState({ customerId: '', email: '' })

  const { data, isLoading, isError, refetch, isFetching } = useCustomersListQuery(page, PAGE_SIZE, applied)
  const deleteCustomer = useDeleteCustomerMutation()

  const customers = data?.data?.content ?? []
  const totalPages = data?.data?.totalPages ?? 1

  const applySearch = () => {
    setPage(0)
    setApplied({
      customerId: customerId.trim(),
      email: email.trim(),
    })
  }

  const remove = (id: string, name: string) => {
    if (!window.confirm(`Delete customer ${name} (${id})? This cannot be undone.`)) return
    deleteCustomer.mutate(id, {
      onSuccess: (res) => toast.success(res.message || 'Customer deleted'),
      onError: () => toast.error('Delete failed'),
    })
  }

  return (
    <div>
      <PageHeader title="All customers" description="Search on the server by customer ID or email." />

      <div className="mb-4 flex flex-wrap items-end gap-3">
        <div className="relative min-w-[12rem] flex-1 max-w-xs">
          <Search className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-slate-400" />
          <Input
            className="pl-9"
            placeholder="Customer ID"
            value={customerId}
            onChange={(e) => setCustomerId(e.target.value)}
          />
        </div>
        <Input
          className="max-w-xs flex-1"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <Button type="button" variant="secondary" onClick={applySearch} disabled={isFetching}>
          Search
        </Button>
      </div>

      {isLoading ? (
        <QueryLoading label="Loading customers…" />
      ) : isError ? (
        <QueryError onRetry={() => refetch()} />
      ) : (
        <Card className="overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full min-w-[640px] text-left text-sm">
              <thead className="border-b border-slate-100 bg-slate-50/80 text-xs font-semibold uppercase tracking-wide text-slate-500">
                <tr>
                  <th className="px-4 py-3">ID</th>
                  <th className="px-4 py-3">Name</th>
                  <th className="px-4 py-3">Email</th>
                  <th className="px-4 py-3">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {customers.length === 0 ? (
                  <tr>
                    <td colSpan={4} className="px-4 py-8 text-center text-slate-500">
                      No customers match your search.
                    </td>
                  </tr>
                ) : (
                  customers.map((c) => (
                    <tr key={c.customerId} className="hover:bg-slate-50/50">
                      <td className="px-4 py-3 font-medium">{c.customerId}</td>
                      <td className="px-4 py-3">{c.firstName} {c.lastName}</td>
                      <td className="px-4 py-3 text-slate-600">{c.email}</td>
                      <td className="px-4 py-3">
                        <div className="flex flex-wrap gap-3">
                          <Link
                            to={paths.employee.customers.edit(c.customerId)}
                            className="inline-flex items-center gap-1 text-sm font-medium text-brand-600 hover:text-brand-700"
                          >
                            <Pencil className="size-3.5" />
                            Edit
                          </Link>
                          <button
                            type="button"
                            className="inline-flex items-center gap-1 text-sm font-medium text-red-600 hover:text-red-700"
                            onClick={() => remove(c.customerId, `${c.firstName} ${c.lastName}`)}
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
          <PaginationControls
            page={page}
            totalPages={totalPages}
            onPageChange={setPage}
            disabled={isFetching}
          />
        </Card>
      )}
    </div>
  )
}
