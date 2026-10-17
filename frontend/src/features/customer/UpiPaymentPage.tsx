import { useState } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { ArrowLeft, IndianRupee } from 'lucide-react'
import { paths } from '../../routes/paths'
import { toast } from 'sonner'
import { usePayInvoiceByUpiMutation } from '../../hooks/mutations/use-invoice-mutations'
import { Button } from '../../components/ui/Button'
import { Card, CardBody } from '../../components/ui/Card'
import { Input } from '../../components/ui/Input'
import { Label } from '../../components/ui/Label'
import { PageHeader } from '../../components/ui/PageHeader'

export function UpiPaymentPage() {
  const navigate = useNavigate()
  const location = useLocation()
  const payInvoice = usePayInvoiceByUpiMutation()
  const state = location.state as { id?: string; finalAmount?: number } | null
  const [upiId, setUpiId] = useState('demo@upi')
  const [pin, setPin] = useState('1234')

  const invoiceId = state?.id
  const amount = state?.finalAmount

  const pay = () => {
    if (!invoiceId) {
      toast.error('Open a bill from My bills to pay.')
      return
    }
    payInvoice.mutate(
      { invoiceId, senderUpiId: upiId, senderPin: pin },
      {
        onSuccess: () => {
          toast.success('Payment successful')
          navigate(paths.customer.pay.success)
        },
        onError: () => {
          toast.error('Payment failed')
          navigate(paths.customer.pay.failed)
        },
      },
    )
  }

  return (
    <div className="max-w-md">
      <Link
        to={paths.customer.bills}
        className="mb-4 inline-flex items-center gap-1 text-sm font-medium text-brand-600 hover:text-brand-700"
      >
        <ArrowLeft className="size-4" />
        Back to bills
      </Link>
      <PageHeader title="Pay with UPI" description="Enter your UPI ID and PIN to complete payment." />
      <Card>
        <CardBody className="space-y-4">
          {amount != null && (
            <p className="flex items-center gap-1 text-lg font-semibold text-slate-900">
              <IndianRupee className="size-5" />
              {amount}
            </p>
          )}
          <div>
            <Label htmlFor="upi">UPI ID</Label>
            <Input
              id="upi"
              placeholder="demo@upi (local dev)"
              value={upiId}
              onChange={(e) => setUpiId(e.target.value)}
            />
          </div>
          <div>
            <Label htmlFor="pin">PIN</Label>
            <Input
              id="pin"
              type="password"
              value={pin}
              onChange={(e) => setPin(e.target.value)}
            />
          </div>
          <Button type="button" className="w-full" onClick={pay} disabled={payInvoice.isPending}>
            {payInvoice.isPending ? 'Processing…' : 'Pay now'}
          </Button>
        </CardBody>
      </Card>
    </div>
  )
}
