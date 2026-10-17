import { useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import { Eye } from 'lucide-react'
import { paths } from '../../routes/paths'
import { useStaffInvoicesQuery } from '../../hooks/queries/use-staff-invoices'
import { QueryError, QueryLoading } from '../../components/QueryState'
import { Badge } from '../../components/ui/Badge'
import { Card } from '../../components/ui/Card'
import { PageHeader } from '../../components/ui/PageHeader'
import { Select } from '../../components/ui/Select'

const STATUSES = ['UNPAID', 'PAID', 'FAILED', 'PENDING'] as const

export function StaffInvoicesPage() {
  const [filter, setFilter] = useState('')
  const { data: invoices = [], isLoading, isError, refetch } = useStaffInvoicesQuery()

  const filtered = useMemo(
    () => (filter ? invoices.filter((i) => i.paymentStatus === filter) : invoices),
    [filter, invoices],
  )

  return (
    <div>
      <PageHeader title="All invoices" description="Invoices across all customers." />
      <Select className="mb-4" value={filter} onChange={(e) => setFilter(e.target.value)} aria-label="Filter status">
        <option value="">All statuses</option>
        {STATUSES.map((s) => (
          <option key={s} value={s}>{s}</option>
        ))}
      </Select>
      {isLoading ? (
        <QueryLoading />
      ) : isError ? (
        <QueryError onRetry={() => refetch()} />
      ) : (
        <Card className="overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full min-w-[720px] text-left text-sm">
              <thead className="border-b border-slate-100 bg-slate-50/80 text-xs font-semibold uppercase tracking-wide text-slate-500">
                <tr>
                  <th className="px-4 py-3">Bill ID</th>
                  <th className="px-4 py-3">Customer</th>
                  <th className="px-4 py-3">Due</th>
                  <th className="px-4 py-3">Amount</th>
                  <th className="px-4 py-3">Status</th>
                  <th className="px-4 py-3">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filtered.map((inv) => (
                  <tr key={inv.id} className="hover:bg-slate-50/50">
                    <td className="px-4 py-3 font-medium">{inv.id}</td>
                    <td className="px-4 py-3">{inv.customerName}</td>
                    <td className="px-4 py-3">{inv.dueDate}</td>
                    <td className="px-4 py-3">₹{inv.finalAmount ?? inv.billAmount}</td>
                    <td className="px-4 py-3">
                      <Badge status={inv.paymentStatus}>{inv.paymentStatus}</Badge>
                    </td>
                    <td className="px-4 py-3">
                      <Link
                        to={paths.employee.invoices.detail(inv.id)}
                        className="inline-flex items-center gap-1 text-sm font-medium text-brand-600"
                      >
                        <Eye className="size-3.5" />
                        View
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>
      )}
    </div>
  )
}
