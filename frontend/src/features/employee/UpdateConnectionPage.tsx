import { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { toast } from 'sonner'
import { paths } from '../../routes/paths'
import { useConnectionQuery } from '../../hooks/queries/use-connections'
import { useConnectionTypesQuery } from '../../hooks/queries/use-connection-types'
import { useUpdateConnectionMutation } from '../../hooks/mutations/use-connection-mutations'
import { QueryError, QueryLoading } from '../../components/QueryState'
import { Button } from '../../components/ui/Button'
import { Card, CardBody } from '../../components/ui/Card'
import { Input } from '../../components/ui/Input'
import { Label } from '../../components/ui/Label'
import { PageHeader } from '../../components/ui/PageHeader'
import { Select } from '../../components/ui/Select'

export function UpdateConnectionPage() {
  const { connectionId } = useParams()
  const navigate = useNavigate()
  const { data, isLoading, isError, refetch } = useConnectionQuery(connectionId)
  const { data: types = [] } = useConnectionTypesQuery()
  const updateConnection = useUpdateConnectionMutation(connectionId ?? '')
  const [customerId, setCustomerId] = useState('')
  const [connectionTypeId, setConnectionTypeId] = useState('')
  const [status, setStatus] = useState('ACTIVE')

  useEffect(() => {
    const c = data?.data
    if (!c) return
    setCustomerId(c.customerId)
    setConnectionTypeId(c.connectionTypeId)
    setStatus(c.status)
  }, [data])

  const submit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!connectionId) return
    updateConnection.mutate(
      { customerId, connectionTypeId, status },
      {
        onSuccess: (res) => {
          toast.success(res.message || 'Connection updated')
          navigate(paths.employee.connections.list)
        },
        onError: () => toast.error('Update failed'),
      },
    )
  }

  return (
    <div>
      <PageHeader title="Update connection" description={connectionId ? `ID: ${connectionId}` : undefined} />
      {isLoading ? (
        <QueryLoading />
      ) : isError ? (
        <QueryError onRetry={() => refetch()} />
      ) : (
        <Card className="max-w-md">
          <CardBody>
            <form onSubmit={submit} className="space-y-4">
              <div>
                <Label htmlFor="customerId">Customer ID</Label>
                <Input id="customerId" value={customerId} onChange={(e) => setCustomerId(e.target.value)} required />
              </div>
              <div>
                <Label htmlFor="type">Connection type</Label>
                <Select
                  id="type"
                  value={connectionTypeId}
                  onChange={(e) => setConnectionTypeId(e.target.value)}
                  required
                >
                  <option value="">Select type</option>
                  {types.map((t) => (
                    <option key={t.id} value={t.id}>{t.typeName}</option>
                  ))}
                </Select>
              </div>
              <div>
                <Label htmlFor="status">Status</Label>
                <Select id="status" value={status} onChange={(e) => setStatus(e.target.value)}>
                  <option value="ACTIVE">ACTIVE</option>
                  <option value="INACTIVE">INACTIVE</option>
                </Select>
              </div>
              <Button type="submit" disabled={updateConnection.isPending}>
                {updateConnection.isPending ? 'Saving…' : 'Save changes'}
              </Button>
            </form>
          </CardBody>
        </Card>
      )}
    </div>
  )
}
