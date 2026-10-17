import { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import { toast } from 'sonner'
import { useCustomerQuery } from '../../hooks/queries/use-customers'
import { useDeleteCustomerMutation, useUpdateCustomerMutation } from '../../hooks/mutations/use-customer-mutations'
import { useNavigate } from 'react-router-dom'
import { paths } from '../../routes/paths'
import { QueryError, QueryLoading } from '../../components/QueryState'
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

export function UpdateCustomerPage() {
  const navigate = useNavigate()
  const { customerId } = useParams()
  const { data, isLoading, isError, refetch } = useCustomerQuery(customerId)
  const updateCustomer = useUpdateCustomerMutation(customerId ?? '')
  const deleteCustomer = useDeleteCustomerMutation()
  const [form, setForm] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phoneNumber: '',
    address: '',
  })

  useEffect(() => {
    const c = data?.data
    if (!c) return
    setForm({
      firstName: c.firstName,
      lastName: c.lastName,
      email: c.email,
      phoneNumber: c.phoneNumber,
      address: c.address,
    })
  }, [data])

  const submit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!customerId) return
    updateCustomer.mutate(form, {
      onSuccess: (res) => toast.success(res.message || 'Customer updated'),
      onError: () => toast.error('Update failed'),
    })
  }

  return (
    <div>
      <PageHeader title="Update customer" description={customerId ? `ID: ${customerId}` : undefined} />
      {isLoading ? (
        <QueryLoading />
      ) : isError ? (
        <QueryError onRetry={() => refetch()} />
      ) : (
        <Card className="max-w-lg">
          <CardBody>
            <form onSubmit={submit} className="space-y-4">
              {fields.map(({ key, label }) => (
                <div key={key}>
                  <Label htmlFor={key}>{label}</Label>
                  <Input
                    id={key}
                    value={form[key]}
                    onChange={(e) => setForm({ ...form, [key]: e.target.value })}
                    required
                  />
                </div>
              ))}
              <div className="flex flex-wrap gap-3">
                <Button type="submit" disabled={updateCustomer.isPending}>
                  {updateCustomer.isPending ? 'Saving…' : 'Save changes'}
                </Button>
                <Button
                  type="button"
                  variant="danger"
                  disabled={deleteCustomer.isPending || !customerId}
                  onClick={() => {
                    if (!customerId || !window.confirm('Delete this customer permanently?')) return
                    deleteCustomer.mutate(customerId, {
                      onSuccess: (res) => {
                        toast.success(res.message || 'Customer deleted')
                        navigate(paths.employee.customers.list)
                      },
                      onError: () => toast.error('Delete failed'),
                    })
                  }}
                >
                  {deleteCustomer.isPending ? 'Deleting…' : 'Delete customer'}
                </Button>
              </div>
            </form>
          </CardBody>
        </Card>
      )}
    </div>
  )
}
