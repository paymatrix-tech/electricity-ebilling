import { LayoutDashboard } from 'lucide-react'
import { employeeQuickActions } from '../../routes/navigation'
import { PageHeader } from '../../components/ui/PageHeader'
import { QuickActionGrid } from '../../components/ui/QuickActionGrid'

export function DashboardPage() {
  return (
    <div>
      <PageHeader
        title="Employee dashboard"
        description="Shortcuts to daily billing and customer operations."
      />
      <div className="mb-6 flex items-center gap-2 rounded-lg border border-dashed border-slate-200 bg-white px-4 py-3 text-sm text-slate-600">
        <LayoutDashboard className="size-4 text-brand-600" />
        Pick a task below or use the sidebar for full navigation.
      </div>
      <QuickActionGrid actions={employeeQuickActions} />
    </div>
  )
}
