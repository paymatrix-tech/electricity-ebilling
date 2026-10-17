import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { toast } from 'sonner'
import { paths } from '../../routes/paths'
import { useConnectionTypesQuery } from '../../hooks/queries/use-connection-types'
import { useCreateTariffMutation } from '../../hooks/mutations/use-connection-mutations'
import { QueryError, QueryLoading } from '../../components/QueryState'
import { Button } from '../../components/ui/Button'
import { Card, CardBody } from '../../components/ui/Card'
import { Input } from '../../components/ui/Input'
import { Label } from '../../components/ui/Label'
import { PageHeader } from '../../components/ui/PageHeader'
import { Select } from '../../components/ui/Select'

export function CreateTariffPage() {
  const navigate = useNavigate()
  const { data: types = [], isLoading, isError, refetch } = useConnectionTypesQuery()
  const createTariff = useCreateTariffMutation()
  const [connectionTypeId, setConnectionTypeId] = useState('')
  const [minUnits, setMinUnits] = useState('')
  const [maxUnits, setMaxUnits] = useState('')
  const [ratePerUnit, setRatePerUnit] = useState('')

  const submit = (e: React.FormEvent) => {
    e.preventDefault()
    createTariff.mutate(
      {
        connectionTypeId,
        minUnits: Number(minUnits),
        maxUnits: Number(maxUnits),
        ratePerUnit: Number(ratePerUnit),
      },
      {
        onSuccess: (res) => {
          toast.success(res.message || 'Tariff created')
          navigate(paths.admin.tariffs.list)
        },
        onError: () => toast.error('Failed to create tariff'),
      },
    )
  }

  return (
    <div>
      <PageHeader title="Create tariff" description="Define unit slabs and rates per connection type." />
      {isLoading ? (
        <QueryLoading />
      ) : isError ? (
        <QueryError onRetry={() => refetch()} />
      ) : (
        <Card className="max-w-md">
          <CardBody>
            <form onSubmit={submit} className="space-y-4">
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
                <Label htmlFor="min">Min units</Label>
                <Input id="min" type="number" value={minUnits} onChange={(e) => setMinUnits(e.target.value)} required />
              </div>
              <div>
                <Label htmlFor="max">Max units</Label>
                <Input id="max" type="number" value={maxUnits} onChange={(e) => setMaxUnits(e.target.value)} required />
              </div>
              <div>
                <Label htmlFor="rate">Rate per unit</Label>
                <Input id="rate" type="number" value={ratePerUnit} onChange={(e) => setRatePerUnit(e.target.value)} required />
              </div>
              <Button type="submit" disabled={createTariff.isPending}>
                {createTariff.isPending ? 'Creating…' : 'Create tariff'}
              </Button>
            </form>
          </CardBody>
        </Card>
      )}
    </div>
  )
}
