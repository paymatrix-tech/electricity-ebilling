import { useState } from 'react'
import { Link } from 'react-router-dom'
import { Pencil, Trash2 } from 'lucide-react'
import { toast } from 'sonner'
import { paths } from '../../routes/paths'
import { useConnectionsListQuery } from '../../hooks/queries/use-connections'
import { useDeleteConnectionMutation } from '../../hooks/mutations/use-connection-mutations'
import { QueryError, QueryLoading } from '../../components/QueryState'
import { Button } from '../../components/ui/Button'
import { Card } from '../../components/ui/Card'
import { Input } from '../../components/ui/Input'
import { PageHeader } from '../../components/ui/PageHeader'
import { PaginationControls } from '../../components/ui/PaginationControls'
import { Select } from '../../components/ui/Select'

const PAGE_SIZE = 10

export function ConnectionsListPage() {
  const [page, setPage] = useState(0)
  const [customerId, setCustomerId] = useState('')
  const [status, setStatus] = useState('')
  const [applied, setApplied] = useState({ customerId: '', status: '' })

  const { data, isLoading, isError, refetch, isFetching } = useConnectionsListQuery(page, PAGE_SIZE, applied)
  const deleteConnection = useDeleteConnectionMutation()

  const connections = data?.data?.content ?? []
  const totalPages = data?.data?.totalPages ?? 1

  const applyFilters = () => {
    setPage(0)
    setApplied({ customerId: customerId.trim(), status })
  }

  const remove = (id: string) => {
    if (!window.confirm(`Delete connection ${id}?`)) return
    deleteConnection.mutate(id, {
      onSuccess: (res) => toast.success(res.message || 'Connection deleted'),
      onError: () => toast.error('Delete failed'),
    })
  }

  return (
    <div>
      <PageHeader title="Connections" description="Meter connections linked to customers." />

      <div className="mb-4 flex flex-wrap items-end gap-3">
        <Input
          className="max-w-xs"
          placeholder="Customer ID"
          value={customerId}
          onChange={(e) => setCustomerId(e.target.value)}
        />
        <Select value={status} onChange={(e) => setStatus(e.target.value)} aria-label="Status filter">
          <option value="">All statuses</option>
          <option value="ACTIVE">ACTIVE</option>
          <option value="INACTIVE">INACTIVE</option>
        </Select>
        <Button type="button" variant="secondary" onClick={applyFilters} disabled={isFetching}>
          Filter
        </Button>
        <Link to={paths.employee.connections.new}>
          <Button type="button">Add connection</Button>
        </Link>
      </div>

      {isLoading ? (
        <QueryLoading label="Loading connections…" />
      ) : isError ? (
        <QueryError onRetry={() => refetch()} />
      ) : (
        <Card className="overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full min-w-[800px] text-left text-sm">
              <thead className="border-b border-slate-100 bg-slate-50/80 text-xs font-semibold uppercase tracking-wide text-slate-500">
                <tr>
                  <th className="px-4 py-3">Connection</th>
                  <th className="px-4 py-3">Customer</th>
                  <th className="px-4 py-3">Type</th>
                  <th className="px-4 py-3">Status</th>
                  <th className="px-4 py-3">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {connections.length === 0 ? (
                  <tr>
                    <td colSpan={5} className="px-4 py-8 text-center text-slate-500">
                      No connections match your filters.
                    </td>
                  </tr>
                ) : (
                  connections.map((c) => (
                    <tr key={c.id} className="hover:bg-slate-50/50">
                      <td className="px-4 py-3 font-medium">{c.id}</td>
                      <td className="px-4 py-3">
                        <div>{c.customerName}</div>
                        <div className="text-xs text-slate-500">{c.customerId}</div>
                      </td>
                      <td className="px-4 py-3">{c.connectionTypeName}</td>
                      <td className="px-4 py-3">{c.status}</td>
                      <td className="px-4 py-3">
                        <div className="flex flex-wrap gap-3">
                          <Link
                            to={paths.employee.connections.edit(c.id)}
                            className="inline-flex items-center gap-1 text-sm font-medium text-brand-600 hover:text-brand-700"
                          >
                            <Pencil className="size-3.5" />
                            Edit
                          </Link>
                          <button
                            type="button"
                            className="inline-flex items-center gap-1 text-sm font-medium text-red-600 hover:text-red-700"
                            onClick={() => remove(c.id)}
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
