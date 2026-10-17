import { Link, useNavigate } from 'react-router-dom'
import type { LucideIcon } from 'lucide-react'
import { ArrowLeft } from 'lucide-react'
import { paths } from '../../routes/paths'
import { Button } from '../../components/ui/Button'
import { Card, CardBody } from '../../components/ui/Card'
import { PageHeader } from '../../components/ui/PageHeader'

export function UnavailablePaymentMethod({ title, icon: Icon }: { title: string; icon: LucideIcon }) {
  const navigate = useNavigate()

  return (
    <div className="max-w-md">
      <Link
        to={paths.customer.bills}
        className="mb-4 inline-flex items-center gap-1 text-sm font-medium text-brand-600"
      >
        <ArrowLeft className="size-4" />
        Back to bills
      </Link>
      <PageHeader title={title} />
      <Card>
        <CardBody className="space-y-4 text-sm text-slate-600">
          <Icon className="size-8 text-slate-400" />
          <p>This payment method is not available on the API yet. Please pay with UPI from My bills.</p>
          <Button type="button" onClick={() => navigate(paths.customer.bills)}>Go to bills</Button>
        </CardBody>
      </Card>
    </div>
  )
}
