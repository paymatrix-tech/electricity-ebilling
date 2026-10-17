import { useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { CreditCard } from 'lucide-react'
import { paths } from '../../routes/paths'
import { useCustomerInvoicesQuery } from '../../hooks/queries/use-invoices'
import { QueryError, QueryLoading } from '../../components/QueryState'
import { Badge } from '../../components/ui/Badge'
import { Button } from '../../components/ui/Button'
import { Card } from '../../components/ui/Card'
import { PageHeader } from '../../components/ui/PageHeader'
import { Select } from '../../components/ui/Select'

const STATUSES = ['UNPAID', 'PAID', 'FAILED', 'PENDING'] as const

export function BillsPage() {
  const navigate = useNavigate()
  const [filter, setFilter] = useState('')

  const { data: invoices = [], isLoading, isError, refetch } = useCustomerInvoicesQuery()

  const filtered = useMemo(
    () => (filter ? invoices.filter((i) => i.paymentStatus === filter) : invoices),
    [filter, invoices],
  )

  return (
    <div>
      <PageHeader title="My bills" description="View due amounts and pay outstanding invoices." />

      <div className="mb-4 flex flex-wrap items-center gap-3">
        <Select value={filter} onChange={(e) => setFilter(e.target.value)} aria-label="Filter by status">
          <option value="">All statuses</option>
          {STATUSES.map((s) => (
            <option key={s} value={s}>{s}</option>
          ))}
        </Select>
      </div>

      {isLoading ? (
        <QueryLoading label="Loading bills…" />
      ) : isError ? (
        <QueryError onRetry={() => refetch()} />
      ) : filtered.length === 0 ? (
        <Card className="p-8 text-center text-sm text-slate-500">No bills match this filter.</Card>
      ) : (
        <Card className="overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full min-w-[640px] text-left text-sm">
              <thead className="border-b border-slate-100 bg-slate-50/80 text-xs font-semibold uppercase tracking-wide text-slate-500">
                <tr>
                  <th className="px-4 py-3">Bill ID</th>
                  <th className="px-4 py-3">Due date</th>
                  <th className="px-4 py-3">Amount</th>
                  <th className="px-4 py-3">Status</th>
                  <th className="px-4 py-3">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filtered.map((inv) => {
                  const payable = inv.paymentStatus === 'UNPAID' || inv.paymentStatus === 'PENDING'
                  return (
                    <tr key={inv.id} className="hover:bg-slate-50/50">
                      <td className="px-4 py-3 font-medium text-slate-900">{inv.id}</td>
                      <td className="px-4 py-3 text-slate-600">{inv.dueDate}</td>
                      <td className="px-4 py-3 font-medium">₹{inv.finalAmount ?? inv.billAmount}</td>
                      <td className="px-4 py-3">
                        <Badge status={inv.paymentStatus}>{inv.paymentStatus}</Badge>
                      </td>
                      <td className="px-4 py-3">
                        {payable ? (
                          <Button
                            size="sm"
                            onClick={() =>
                              navigate(paths.customer.pay.upi, {
                                state: { id: inv.id, finalAmount: inv.finalAmount ?? inv.billAmount },
                              })
                            }
                          >
                            <CreditCard className="size-3.5" />
                            Pay with UPI
                          </Button>
                        ) : (
                          <span className="text-slate-400">—</span>
                        )}
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>
        </Card>
      )}
    </div>
  )
}
