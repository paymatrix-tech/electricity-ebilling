import { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { useQuery } from '@tanstack/react-query'
import { toast } from 'sonner'
import { getConnectionType } from '../../api/connectionApi'
import { queryKeys } from '../../api/query-keys'
import { paths } from '../../routes/paths'
import { useUpdateConnectionTypeMutation } from '../../hooks/mutations/use-connection-mutations'
import { QueryError, QueryLoading } from '../../components/QueryState'
import { Button } from '../../components/ui/Button'
import { Card, CardBody } from '../../components/ui/Card'
import { Input } from '../../components/ui/Input'
import { Label } from '../../components/ui/Label'
import { PageHeader } from '../../components/ui/PageHeader'

export function UpdateConnectionTypePage() {
  const { typeId } = useParams()
  const navigate = useNavigate()
  const { data, isLoading, isError, refetch } = useQuery({
    queryKey: queryKeys.connectionTypes.detail(typeId ?? ''),
    queryFn: () => getConnectionType(typeId!),
    enabled: Boolean(typeId),
  })
  const updateType = useUpdateConnectionTypeMutation(typeId ?? '')
  const [typeName, setTypeName] = useState('')
  const [description, setDescription] = useState('')

  useEffect(() => {
    const t = data?.data
    if (!t) return
    setTypeName(t.typeName)
    setDescription(t.description ?? '')
  }, [data])

  const submit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!typeId) return
    updateType.mutate(
      { typeName, description },
      {
        onSuccess: (res) => {
          toast.success(res.message || 'Connection type updated')
          navigate(paths.admin.connectionTypes.list)
        },
        onError: () => toast.error('Update failed'),
      },
    )
  }

  return (
    <div>
      <PageHeader title="Edit connection type" />
      {isLoading ? (
        <QueryLoading />
      ) : isError ? (
        <QueryError onRetry={() => refetch()} />
      ) : (
        <Card className="max-w-md">
          <CardBody>
            <form onSubmit={submit} className="space-y-4">
              <div>
                <Label htmlFor="name">Type name</Label>
                <Input id="name" value={typeName} onChange={(e) => setTypeName(e.target.value)} required />
              </div>
              <div>
                <Label htmlFor="desc">Description</Label>
                <textarea
                  id="desc"
                  className="min-h-24 w-full rounded-lg border border-slate-200 px-3 py-2 text-sm shadow-sm focus:border-brand-500 focus:outline-none focus:ring-2 focus:ring-brand-500/20"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                />
              </div>
              <Button type="submit" disabled={updateType.isPending}>
                {updateType.isPending ? 'Saving…' : 'Save changes'}
              </Button>
            </form>
          </CardBody>
        </Card>
      )}
    </div>
  )
}
