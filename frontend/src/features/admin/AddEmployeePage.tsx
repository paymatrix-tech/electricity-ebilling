import { useState } from 'react'
import { toast } from 'sonner'
import { useCreateEmployeeMutation } from '../../hooks/mutations/use-employee-mutations'
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
  { key: 'designation' as const, label: 'Designation' },
  { key: 'salary' as const, label: 'Salary' },
]

export function AddEmployeePage() {
  const createEmployee = useCreateEmployeeMutation()
  const [form, setForm] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phoneNumber: '',
    designation: '',
    salary: '',
  })

  const submit = (e: React.FormEvent) => {
    e.preventDefault()
    createEmployee.mutate(
      { ...form, salary: Number(form.salary) },
      {
        onSuccess: (res) => toast.success(res.message || 'Employee created'),
        onError: () => toast.error('Failed to create employee'),
      },
    )
  }

  return (
    <div>
      <PageHeader title="Add employee" />
      <Card className="max-w-lg">
        <CardBody>
          <form onSubmit={submit} className="space-y-4">
            {fields.map(({ key, label }) => (
              <div key={key}>
                <Label htmlFor={key}>{label}</Label>
                <Input
                  id={key}
                  type={key === 'salary' ? 'number' : 'text'}
                  value={form[key]}
                  onChange={(e) => setForm({ ...form, [key]: e.target.value })}
                  required
                />
              </div>
            ))}
            <Button type="submit" disabled={createEmployee.isPending}>
              {createEmployee.isPending ? 'Saving…' : 'Save employee'}
            </Button>
          </form>
        </CardBody>
      </Card>
    </div>
  )
}
