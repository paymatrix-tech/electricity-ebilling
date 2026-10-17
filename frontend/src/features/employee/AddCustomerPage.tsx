import { useState } from 'react'
import { toast } from 'sonner'
import { useCreateCustomerMutation } from '../../hooks/mutations/use-customer-mutations'
import { Button } from '../../components/ui/Button'
import { Card, CardBody } from '../../components/ui/Card'
import { Input } from '../../components/ui/Input'
import { Label } from '../../components/ui/Label'
import { PageHeader } from '../../components/ui/PageHeader'

const fields = [
  { key: 'firstName' as const, label: 'First name' },
  { key: 'lastName' as const, label: 'Last name' },
  { key: 'email' as const, label: 'Email' },
  { key: 'phoneNumber' as const, label: 'Phone' },
  { key: 'address' as const, label: 'Address' },
]

export function AddCustomerPage() {
  const createCustomer = useCreateCustomerMutation()
  const [form, setForm] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phoneNumber: '',
    address: '',
  })

  const submit = (e: React.FormEvent) => {
    e.preventDefault()
    createCustomer.mutate(form, {
      onSuccess: (res) => toast.success(res.message || 'Customer created'),
      onError: () => toast.error('Failed to create customer'),
    })
  }

  return (
    <div>
      <PageHeader title="Add customer" description="Create a new consumer account." />
      <Card className="max-w-lg">
        <CardBody>
          <form onSubmit={submit} className="space-y-4">
            {fields.map(({ key, label }) => (
              <div key={key}>
                <Label htmlFor={key}>{label}</Label>
                <Input
                  id={key}
                  required
                  value={form[key]}
                  onChange={(e) => setForm({ ...form, [key]: e.target.value })}
                />
              </div>
            ))}
            <Button type="submit" className="w-full sm:w-auto" disabled={createCustomer.isPending}>
              {createCustomer.isPending ? 'Saving…' : 'Save customer'}
            </Button>
          </form>
        </CardBody>
      </Card>
    </div>
  )
}
