import { Link } from 'react-router-dom'
import { CheckCircle2 } from 'lucide-react'
import { paths } from '../../routes/paths'
import { Button } from '../../components/ui/Button'
import { Card, CardBody } from '../../components/ui/Card'

export function PaymentSuccessPage() {
  return (
    <Card className="mx-auto max-w-md text-center">
      <CardBody className="space-y-4 py-12">
        <CheckCircle2 className="mx-auto size-12 text-emerald-500" />
        <h1 className="text-xl font-semibold text-slate-900">Payment successful</h1>
        <Link to={paths.customer.bills}>
          <Button type="button" variant="secondary">Back to bills</Button>
        </Link>
      </CardBody>
    </Card>
  )
}
