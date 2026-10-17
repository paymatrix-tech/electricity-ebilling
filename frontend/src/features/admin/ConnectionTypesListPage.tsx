import { Link } from 'react-router-dom'
import { Pencil, Plus, Trash2 } from 'lucide-react'
import { toast } from 'sonner'
import { paths } from '../../routes/paths'
import { useConnectionTypesQuery } from '../../hooks/queries/use-connection-types'
import { useDeleteConnectionTypeMutation } from '../../hooks/mutations/use-connection-mutations'
import { QueryError, QueryLoading } from '../../components/QueryState'
import { Button } from '../../components/ui/Button'
import { Card } from '../../components/ui/Card'
import { PageHeader } from '../../components/ui/PageHeader'

export function ConnectionTypesListPage() {
  const { data: types = [], isLoading, isError, refetch } = useConnectionTypesQuery(0, 100)
  const deleteType = useDeleteConnectionTypeMutation()

  const remove = (id: string, name: string) => {
    if (!window.confirm(`Delete connection type "${name}"?`)) return
    deleteType.mutate(id, {
      onSuccess: (res) => toast.success(res.message || 'Deleted'),
      onError: () => toast.error('Delete failed — type may be in use'),
    })
  }

  return (
    <div>
      <div className="mb-6 flex flex-wrap items-start justify-between gap-3">
        <PageHeader title="Connection types" description="Categories used when creating customer connections." />
        <Link to={paths.admin.connectionTypes.new}>
          <Button type="button" size="sm">
            <Plus className="size-4" />
            New type
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
            <table className="w-full min-w-[560px] text-left text-sm">
              <thead className="border-b border-slate-100 bg-slate-50/80 text-xs font-semibold uppercase tracking-wide text-slate-500">
                <tr>
                  <th className="px-4 py-3">Name</th>
                  <th className="px-4 py-3">Description</th>
                  <th className="px-4 py-3">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {types.length === 0 ? (
                  <tr>
                    <td colSpan={3} className="px-4 py-8 text-center text-slate-500">
                      No connection types yet.
                    </td>
                  </tr>
                ) : (
                  types.map((t) => (
                    <tr key={t.id} className="hover:bg-slate-50/50">
                      <td className="px-4 py-3 font-medium">{t.typeName}</td>
                      <td className="px-4 py-3 text-slate-600">{t.description || '—'}</td>
                      <td className="px-4 py-3">
                        <div className="flex flex-wrap gap-3">
                          <Link
                            to={paths.admin.connectionTypes.edit(t.id)}
                            className="inline-flex items-center gap-1 text-sm font-medium text-brand-600 hover:text-brand-700"
                          >
                            <Pencil className="size-3.5" />
                            Edit
                          </Link>
                          <button
                            type="button"
                            className="inline-flex items-center gap-1 text-sm font-medium text-red-600 hover:text-red-700"
                            onClick={() => remove(t.id, t.typeName)}
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
        </Card>
      )}
    </div>
  )
}
