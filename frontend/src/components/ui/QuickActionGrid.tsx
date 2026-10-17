import { Link } from 'react-router-dom'
import { ChevronRight } from 'lucide-react'
import type { QuickAction } from '../../routes/navigation'
import { cn } from '../../lib/cn'
import { Card, CardBody } from './Card'

export function QuickActionGrid({ actions }: { actions: QuickAction[] }) {
  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-2 xl:grid-cols-4">
      {actions.map((action) => {
        const Icon = action.icon
        return (
          <Link key={action.to} to={action.to} className="group block focus:outline-none">
            <Card className="h-full transition hover:border-brand-200 hover:shadow-md">
              <CardBody className="flex h-full flex-col">
                <div
                  className={cn(
                    'mb-4 flex size-11 items-center justify-center rounded-lg bg-gradient-to-br',
                    action.accent,
                  )}
                >
                  <Icon className="size-5" strokeWidth={2} />
                </div>
                <h2 className="font-semibold text-slate-900">{action.label}</h2>
                <p className="mt-1 flex-1 text-sm text-slate-500">{action.description}</p>
                <span className="mt-4 inline-flex items-center gap-1 text-sm font-medium text-brand-600 group-hover:gap-2 transition-all">
                  Open
                  <ChevronRight className="size-4" />
                </span>
              </CardBody>
            </Card>
          </Link>
        )
      })}
    </div>
  )
}
