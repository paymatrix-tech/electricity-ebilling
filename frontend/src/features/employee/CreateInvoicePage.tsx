import { useState } from 'react'
import { toast } from 'sonner'
import {
  useCreateInvoiceMutation,
  useUploadInvoicesCsvMutation,
} from '../../hooks/mutations/use-invoice-mutations'
import { Button } from '../../components/ui/Button'
import { Card, CardBody, CardHeader } from '../../components/ui/Card'
import { Input } from '../../components/ui/Input'
import { Label } from '../../components/ui/Label'
import { PageHeader } from '../../components/ui/PageHeader'

export function CreateInvoicePage() {
  const createInvoice = useCreateInvoiceMutation()
  const uploadCsv = useUploadInvoicesCsvMutation()
  const [customerId, setCustomerId] = useState('')
  const [dueDate, setDueDate] = useState('')
  const [month, setMonth] = useState('')
  const [units, setUnits] = useState('')
  const [file, setFile] = useState<File | null>(null)

  const submit = (e: React.FormEvent) => {
    e.preventDefault()
    createInvoice.mutate(
      { customerId, dueDate, month, units: Number(units) },
      {
        onSuccess: (res) => toast.success(res.message || 'Invoice created'),
        onError: () => toast.error('Failed to create invoice'),
      },
    )
  }

  const upload = () => {
    if (!file) return
    uploadCsv.mutate(file, {
      onSuccess: (res) => toast.success(res.message || 'CSV uploaded'),
      onError: () => toast.error('CSV upload failed'),
    })
  }

  return (
    <div className="space-y-6">
      <PageHeader title="Create invoice" description="Issue a single bill or import many via CSV." />
      <Card className="max-w-md">
        <CardHeader>
          <h2 className="font-medium text-slate-900">Single invoice</h2>
        </CardHeader>
        <CardBody>
          <form onSubmit={submit} className="space-y-4">
            <div>
              <Label htmlFor="customerId">Customer ID</Label>
              <Input id="customerId" value={customerId} onChange={(e) => setCustomerId(e.target.value)} required />
            </div>
            <div>
              <Label htmlFor="dueDate">Due date</Label>
              <Input id="dueDate" type="date" value={dueDate} onChange={(e) => setDueDate(e.target.value)} required />
            </div>
            <div>
              <Label htmlFor="month">Billing month</Label>
              <Input id="month" type="date" value={month} onChange={(e) => setMonth(e.target.value)} required />
            </div>
            <div>
              <Label htmlFor="units">Units</Label>
              <Input id="units" type="number" value={units} onChange={(e) => setUnits(e.target.value)} required />
            </div>
            <Button type="submit" disabled={createInvoice.isPending}>
              {createInvoice.isPending ? 'Creating…' : 'Create invoice'}
            </Button>
          </form>
        </CardBody>
      </Card>
      <Card className="max-w-md">
        <CardHeader>
          <h2 className="font-medium text-slate-900">Bulk CSV</h2>
        </CardHeader>
        <CardBody className="space-y-4">
          <input
            type="file"
            accept=".csv"
            className="block w-full text-sm file:mr-4 file:rounded-lg file:border-0 file:bg-slate-100 file:px-4 file:py-2 file:text-sm file:font-medium"
            onChange={(e) => setFile(e.target.files?.[0] ?? null)}
          />
          <Button
            type="button"
            variant="secondary"
            onClick={upload}
            disabled={!file || uploadCsv.isPending}
          >
            {uploadCsv.isPending ? 'Uploading…' : 'Upload CSV'}
          </Button>
        </CardBody>
      </Card>
    </div>
  )
}
