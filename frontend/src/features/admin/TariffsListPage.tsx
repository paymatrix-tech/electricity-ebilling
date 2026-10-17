import { Link } from 'react-router-dom'
import { Pencil, Plus, Trash2 } from 'lucide-react'
import { toast } from 'sonner'
import { paths } from '../../routes/paths'
import { useConnectionTypesQuery } from '../../hooks/queries/use-connection-types'
import { useTariffsListQuery } from '../../hooks/queries/use-tariffs'
import { useDeleteTariffMutation } from '../../hooks/mutations/use-connection-mutations'
import { QueryError, QueryLoading } from '../../components/QueryState'
import { Button } from '../../components/ui/Button'
import { Card } from '../../components/ui/Card'
import { PageHeader } from '../../components/ui/PageHeader'
import { PaginationControls } from '../../components/ui/PaginationControls'
import { useState } from 'react'

const PAGE_SIZE = 10

export function TariffsListPage() {
  const [page, setPage] = useState(0)
  const { data, isLoading, isError, refetch, isFetching } = useTariffsListQuery(page, PAGE_SIZE)
  const { data: types = [] } = useConnectionTypesQuery(0, 100)
  const deleteTariff = useDeleteTariffMutation()

  const tariffs = data?.data?.content ?? []
  const totalPages = data?.data?.totalPages ?? 1
  const typeName = (id: string) => types.find((t) => t.id === id)?.typeName ?? id

  const remove = (id: string) => {
    if (!window.confirm(`Delete tariff ${id}?`)) return
    deleteTariff.mutate(id, {
      onSuccess: (res) => toast.success(res.message || 'Tariff deleted'),
      onError: () => toast.error('Delete failed'),
    })
  }

  return (
    <div>
      <div className="mb-6 flex flex-wrap items-start justify-between gap-3">
        <PageHeader title="Tariffs" description="Unit slabs and rates per connection type." />
        <Link to={paths.admin.tariffs.new}>
          <Button type="button" size="sm">
            <Plus className="size-4" />
            New tariff
          </Button>
        </Link>
      </div>

      {isLoading ? (
        <QueryLoading />
      ) : isError ? (
        <QueryError onRetry={() => refetch()} />
      ) : (
        <Card className="overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full min-w-[640px] text-left text-sm">
              <thead className="border-b border-slate-100 bg-slate-50/80 text-xs font-semibold uppercase tracking-wide text-slate-500">
                <tr>
                  <th className="px-4 py-3">Connection type</th>
                  <th className="px-4 py-3">Units</th>
                  <th className="px-4 py-3">Rate / unit</th>
                  <th className="px-4 py-3">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {tariffs.length === 0 ? (
                  <tr>
                    <td colSpan={4} className="px-4 py-8 text-center text-slate-500">
                      No tariffs configured.
                    </td>
                  </tr>
                ) : (
                  tariffs.map((t) => (
                    <tr key={t.id} className="hover:bg-slate-50/50">
                      <td className="px-4 py-3">{typeName(t.connectionTypeId)}</td>
                      <td className="px-4 py-3">{t.minUnits} – {t.maxUnits}</td>
                      <td className="px-4 py-3">₹{t.ratePerUnit}</td>
                      <td className="px-4 py-3">
                        <div className="flex flex-wrap gap-3">
                          <Link
                            to={paths.admin.tariffs.edit(t.id)}
                            className="inline-flex items-center gap-1 text-sm font-medium text-brand-600 hover:text-brand-700"
                          >
                            <Pencil className="size-3.5" />
                            Edit
                          </Link>
                          <button
                            type="button"
                            className="inline-flex items-center gap-1 text-sm font-medium text-red-600 hover:text-red-700"
                            onClick={() => remove(t.id)}
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
