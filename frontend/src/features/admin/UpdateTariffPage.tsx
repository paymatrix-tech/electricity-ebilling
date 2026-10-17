import { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { toast } from 'sonner'
import { paths } from '../../routes/paths'
import { useConnectionTypesQuery } from '../../hooks/queries/use-connection-types'
import { useTariffQuery } from '../../hooks/queries/use-tariffs'
import { useUpdateTariffMutation } from '../../hooks/mutations/use-connection-mutations'
import { QueryError, QueryLoading } from '../../components/QueryState'
import { Button } from '../../components/ui/Button'
import { Card, CardBody } from '../../components/ui/Card'
import { Input } from '../../components/ui/Input'
import { Label } from '../../components/ui/Label'
import { PageHeader } from '../../components/ui/PageHeader'
import { Select } from '../../components/ui/Select'

export function UpdateTariffPage() {
  const { tariffId } = useParams()
  const navigate = useNavigate()
  const { data, isLoading, isError, refetch } = useTariffQuery(tariffId)
  const { data: types = [], isLoading: typesLoading } = useConnectionTypesQuery()
  const updateTariff = useUpdateTariffMutation(tariffId ?? '')
  const [connectionTypeId, setConnectionTypeId] = useState('')
  const [minUnits, setMinUnits] = useState('')
  const [maxUnits, setMaxUnits] = useState('')
  const [ratePerUnit, setRatePerUnit] = useState('')

  useEffect(() => {
    const t = data?.data
    if (!t) return
    setConnectionTypeId(t.connectionTypeId)
    setMinUnits(String(t.minUnits))
    setMaxUnits(String(t.maxUnits))
    setRatePerUnit(String(t.ratePerUnit))
  }, [data])

  const submit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!tariffId) return
    updateTariff.mutate(
      {
        connectionTypeId,
        minUnits: Number(minUnits),
        maxUnits: Number(maxUnits),
        ratePerUnit: Number(ratePerUnit),
      },
      {
        onSuccess: (res) => {
          toast.success(res.message || 'Tariff updated')
          navigate(paths.admin.tariffs.list)
        },
        onError: () => toast.error('Update failed — check unit range overlaps'),
      },
    )
  }

  if (isLoading || typesLoading) return <QueryLoading />
  if (isError) return <QueryError onRetry={() => refetch()} />

  return (
    <div>
      <PageHeader title="Edit tariff" />
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
            <Button type="submit" disabled={updateTariff.isPending}>
              {updateTariff.isPending ? 'Saving…' : 'Save changes'}
            </Button>
          </form>
        </CardBody>
      </Card>
    </div>
  )
}
