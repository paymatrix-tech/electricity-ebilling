import { useState } from 'react'
import { Upload } from 'lucide-react'
import { toast } from 'sonner'
import { useUploadCustomersCsvMutation } from '../../hooks/mutations/use-customer-mutations'
import { Button } from '../../components/ui/Button'
import { Card, CardBody } from '../../components/ui/Card'
import { PageHeader } from '../../components/ui/PageHeader'

export function BulkCustomersPage() {
  const [file, setFile] = useState<File | null>(null)
  const uploadCsv = useUploadCustomersCsvMutation()

  const upload = () => {
    if (!file) return
    uploadCsv.mutate(file, {
      onSuccess: (res) => toast.success(res.message || 'Upload complete'),
      onError: () => toast.error('Upload failed'),
    })
  }

  return (
    <div>
      <PageHeader title="Bulk import" description="Upload a CSV file to create multiple customers." />
      <Card className="max-w-lg">
        <CardBody className="space-y-4">
          <input
            type="file"
            accept=".csv"
            className="block w-full text-sm text-slate-600 file:mr-4 file:rounded-lg file:border-0 file:bg-brand-50 file:px-4 file:py-2 file:text-sm file:font-medium file:text-brand-700"
            onChange={(e) => setFile(e.target.files?.[0] ?? null)}
          />
          <Button type="button" onClick={upload} disabled={!file || uploadCsv.isPending}>
            <Upload className="size-4" />
            {uploadCsv.isPending ? 'Uploading…' : 'Upload CSV'}
          </Button>
        </CardBody>
      </Card>
    </div>
  )
}
