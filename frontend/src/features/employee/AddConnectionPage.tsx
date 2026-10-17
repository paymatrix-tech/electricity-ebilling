import { useState } from 'react'
import { toast } from 'sonner'
import { useConnectionTypesQuery } from '../../hooks/queries/use-connection-types'
import { useCreateConnectionMutation } from '../../hooks/mutations/use-connection-mutations'
import { QueryError, QueryLoading } from '../../components/QueryState'
import { Button } from '../../components/ui/Button'
import { Card, CardBody } from '../../components/ui/Card'
import { Input } from '../../components/ui/Input'
import { Label } from '../../components/ui/Label'
import { PageHeader } from '../../components/ui/PageHeader'
import { Select } from '../../components/ui/Select'

export function AddConnectionPage() {
  const { data: types = [], isLoading, isError, refetch } = useConnectionTypesQuery()
  const createConnection = useCreateConnectionMutation()
  const [customerId, setCustomerId] = useState('')
  const [connectionTypeId, setConnectionTypeId] = useState('')
  const [status, setStatus] = useState('ACTIVE')

  const submit = (e: React.FormEvent) => {
    e.preventDefault()
    createConnection.mutate(
      { customerId, connectionTypeId, status },
      {
        onSuccess: (res) => toast.success(res.message || 'Connection created'),
        onError: () => toast.error('Failed to create connection'),
      },
    )
  }

  return (
    <div>
      <PageHeader title="Add connection" description="Attach a meter connection to a customer." />
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
              <Button type="submit" disabled={createConnection.isPending}>
                {createConnection.isPending ? 'Creating…' : 'Create connection'}
              </Button>
            </form>
          </CardBody>
        </Card>
      )}
    </div>
  )
}
