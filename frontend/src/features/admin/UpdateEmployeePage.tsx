import { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import { Search } from 'lucide-react'
import { toast } from 'sonner'
import { useEmployeeQuery } from '../../hooks/queries/use-employees'
import { useUpdateEmployeeMutation } from '../../hooks/mutations/use-employee-mutations'
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
  { key: 'designation' as const, label: 'Designation' },
  { key: 'salary' as const, label: 'Salary' },
]

export function UpdateEmployeePage() {
  const { employeeId: routeEmployeeId } = useParams()
  const [searchId, setSearchId] = useState(routeEmployeeId ?? '')
  const [activeId, setActiveId] = useState<string | null>(routeEmployeeId ?? null)

  useEffect(() => {
    if (routeEmployeeId) {
      setActiveId(routeEmployeeId)
      setSearchId(routeEmployeeId)
    }
  }, [routeEmployeeId])
  const { data, isFetching, isError, refetch } = useEmployeeQuery(activeId)
  const updateEmployee = useUpdateEmployeeMutation(activeId ?? '')
  const [form, setForm] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phoneNumber: '',
    designation: '',
    salary: '',
  })

  useEffect(() => {
    const e = data?.data as Record<string, string | number> | undefined
    if (!e) return
    setForm({
      firstName: String(e.firstName ?? ''),
      lastName: String(e.lastName ?? ''),
      email: String(e.email ?? ''),
      phoneNumber: String(e.phoneNumber ?? ''),
      designation: String(e.designation ?? ''),
      salary: String(e.salary ?? ''),
    })
  }, [data])

  const load = () => {
    if (!searchId.trim()) {
      toast.error('Enter an employee ID')
      return
    }
    setActiveId(searchId.trim())
  }

  useEffect(() => {
    if (isError && activeId) {
      toast.error('Employee not found')
    }
  }, [isError, activeId])

  const save = (e: React.FormEvent) => {
    e.preventDefault()
    if (!activeId) return
    updateEmployee.mutate(
      { ...form, salary: Number(form.salary) },
      {
        onSuccess: (res) => toast.success(res.message || 'Employee updated'),
        onError: () => toast.error('Update failed'),
      },
    )
  }

  return (
    <div>
      <PageHeader title="Update employee" description="Load by employee ID, then edit details." />
      <Card className="mb-6 max-w-lg">
        <CardBody className="flex flex-col gap-3 sm:flex-row">
          <Input placeholder="Employee ID" value={searchId} onChange={(e) => setSearchId(e.target.value)} />
          <Button type="button" variant="secondary" onClick={load} disabled={isFetching}>
            <Search className="size-4" />
            {isFetching ? 'Loading…' : 'Load'}
          </Button>
        </CardBody>
      </Card>
      {activeId && isFetching ? (
        <QueryLoading />
      ) : activeId && isError ? (
        <QueryError onRetry={() => refetch()} />
      ) : activeId ? (
        <Card className="max-w-lg">
          <CardBody>
            <form onSubmit={save} className="space-y-4">
              {fields.map(({ key, label }) => (
                <div key={key}>
                  <Label htmlFor={key}>{label}</Label>
                  <Input
                    id={key}
                    type={key === 'salary' ? 'number' : 'text'}
                    value={form[key]}
                    onChange={(e) => setForm({ ...form, [key]: e.target.value })}
                  />
                </div>
              ))}
              <Button type="submit" disabled={updateEmployee.isPending}>
                {updateEmployee.isPending ? 'Saving…' : 'Save changes'}
              </Button>
            </form>
          </CardBody>
        </Card>
      ) : null}
    </div>
  )
}
