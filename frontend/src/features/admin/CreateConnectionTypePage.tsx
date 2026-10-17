import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { toast } from 'sonner'
import { paths } from '../../routes/paths'
import { useCreateConnectionTypeMutation } from '../../hooks/mutations/use-connection-mutations'
import { Button } from '../../components/ui/Button'
import { Card, CardBody } from '../../components/ui/Card'
import { Input } from '../../components/ui/Input'
import { Label } from '../../components/ui/Label'
import { PageHeader } from '../../components/ui/PageHeader'

export function CreateConnectionTypePage() {
  const navigate = useNavigate()
  const createType = useCreateConnectionTypeMutation()
  const [typeName, setTypeName] = useState('')
  const [description, setDescription] = useState('')

  const submit = (e: React.FormEvent) => {
    e.preventDefault()
    createType.mutate(
      { typeName, description },
      {
        onSuccess: (res) => {
          toast.success(res.message || 'Connection type created')
          navigate(paths.admin.connectionTypes.list)
        },
        onError: () => toast.error('Failed to create connection type'),
      },
    )
  }

  return (
    <div>
      <PageHeader title="Connection type" description="Add a category for customer connections." />
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
            <Button type="submit" disabled={createType.isPending}>
              {createType.isPending ? 'Creating…' : 'Create'}
            </Button>
          </form>
        </CardBody>
      </Card>
    </div>
  )
}
