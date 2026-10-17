import { AlertCircle } from 'lucide-react'
import { Button } from './ui/Button'
import { Card, CardBody } from './ui/Card'
import { Spinner } from './ui/Spinner'

export function QueryLoading({ label = 'Loading…' }: { label?: string }) {
  return (
    <div className="flex flex-col items-center justify-center gap-2 py-16">
      <Spinner className="size-8" />
      <p className="text-sm text-slate-500">{label}</p>
    </div>
  )
}

export function QueryError({
  message = 'Something went wrong loading data.',
  onRetry,
}: {
  message?: string
  onRetry?: () => void
}) {
  return (
    <Card className="border-red-100">
      <CardBody className="flex flex-col items-center gap-3 py-8 text-center">
        <AlertCircle className="size-8 text-red-500" />
        <p className="text-sm text-slate-600">{message}</p>
        {onRetry ? (
          <Button type="button" variant="secondary" size="sm" onClick={onRetry}>
            Try again
          </Button>
        ) : null}
      </CardBody>
    </Card>
  )
}
