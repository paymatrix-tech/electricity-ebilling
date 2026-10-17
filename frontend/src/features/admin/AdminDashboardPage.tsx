import { adminQuickActions } from '../../routes/navigation'
import { PageHeader } from '../../components/ui/PageHeader'
import { QuickActionGrid } from '../../components/ui/QuickActionGrid'

export function AdminDashboardPage() {
  return (
    <div>
      <PageHeader
        title="Administration"
        description="Configure tariffs, connection types, and employee access."
      />
      <QuickActionGrid actions={adminQuickActions} />
    </div>
  )
}
