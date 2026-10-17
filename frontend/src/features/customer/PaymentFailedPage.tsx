import { Link } from 'react-router-dom'
import { XCircle } from 'lucide-react'
import { paths } from '../../routes/paths'
import { Button } from '../../components/ui/Button'
import { Card, CardBody } from '../../components/ui/Card'

export function PaymentFailedPage() {
  return (
    <Card className="mx-auto max-w-md text-center">
      <CardBody className="space-y-4 py-12">
        <XCircle className="mx-auto size-12 text-red-500" />
        <h1 className="text-xl font-semibold text-slate-900">Payment failed</h1>
        <Link to={paths.customer.bills}>
          <Button type="button">Try again</Button>
        </Link>
      </CardBody>
    </Card>
  )
}
