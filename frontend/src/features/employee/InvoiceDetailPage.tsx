import { Link, useParams } from 'react-router-dom'
import { ArrowLeft, Download } from 'lucide-react'
import { toast } from 'sonner'
import { downloadInvoicePdf } from '../../api/invoiceApi'
import { paths } from '../../routes/paths'
import { useInvoiceDetailQuery } from '../../hooks/queries/use-invoice-detail'
import { QueryError, QueryLoading } from '../../components/QueryState'
import { Badge } from '../../components/ui/Badge'
import { Button } from '../../components/ui/Button'
import { Card, CardBody } from '../../components/ui/Card'
import { PageHeader } from '../../components/ui/PageHeader'

export function InvoiceDetailPage() {
  const { invoiceId } = useParams()
  const { data: invoice, isLoading, isError, refetch } = useInvoiceDetailQuery(invoiceId)

  const onDownloadPdf = async () => {
    if (!invoiceId) return
    try {
      const blob = await downloadInvoicePdf(invoiceId)
      const url = URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      a.download = `invoice-${invoiceId}.pdf`
      a.click()
      URL.revokeObjectURL(url)
    } catch {
      toast.error('Failed to download PDF')
    }
  }

  return (
    <div>
      <Link
        to={paths.employee.invoices.list}
        className="mb-4 inline-flex items-center gap-1 text-sm font-medium text-brand-600"
      >
        <ArrowLeft className="size-4" />
        All invoices
      </Link>
      <PageHeader title="Invoice detail" description={invoiceId ? `ID: ${invoiceId}` : undefined} />
      {isLoading ? (
        <QueryLoading />
      ) : isError || !invoice ? (
        <QueryError onRetry={() => refetch()} />
      ) : (
        <Card className="max-w-lg">
          <CardBody className="space-y-3 text-sm">
            <p><span className="text-slate-500">Customer:</span> {invoice.customerName}</p>
            <p><span className="text-slate-500">Email:</span> {invoice.customerEmail}</p>
            <p><span className="text-slate-500">Connection:</span> {invoice.connectionType}</p>
            <p><span className="text-slate-500">Due date:</span> {invoice.dueDate}</p>
            <p><span className="text-slate-500">Units:</span> {invoice.units}</p>
            <p><span className="text-slate-500">Amount:</span> ₹{invoice.finalAmount ?? invoice.billAmount}</p>
            <p className="flex items-center gap-2">
              <span className="text-slate-500">Status:</span>
              <Badge status={invoice.paymentStatus}>{invoice.paymentStatus}</Badge>
            </p>
            <Button type="button" onClick={onDownloadPdf}>
              <Download className="size-4" />
              Download PDF
            </Button>
          </CardBody>
        </Card>
      )}
    </div>
  )
}
