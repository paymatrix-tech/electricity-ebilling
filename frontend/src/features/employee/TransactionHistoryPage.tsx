import { usePaymentTransactionsQuery } from '../../hooks/queries/use-payment-transactions'
import { QueryError, QueryLoading } from '../../components/QueryState'
import { Badge } from '../../components/ui/Badge'
import { Card } from '../../components/ui/Card'
import { PageHeader } from '../../components/ui/PageHeader'

export function TransactionHistoryPage() {
  const { data: transactions = [], isLoading, isError, refetch } = usePaymentTransactionsQuery()

  return (
    <div>
      <PageHeader title="Transaction history" description="Payments recorded against invoices." />
      {isLoading ? (
        <QueryLoading />
      ) : isError ? (
        <QueryError onRetry={() => refetch()} />
      ) : transactions.length === 0 ? (
        <Card className="p-8 text-center text-sm text-slate-500">No transactions yet.</Card>
      ) : (
        <Card className="overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full min-w-[720px] text-left text-sm">
              <thead className="border-b border-slate-100 bg-slate-50/80 text-xs font-semibold uppercase tracking-wide text-slate-500">
                <tr>
                  <th className="px-4 py-3">Date</th>
                  <th className="px-4 py-3">Customer</th>
                  <th className="px-4 py-3">Invoice</th>
                  <th className="px-4 py-3">Type</th>
                  <th className="px-4 py-3">Amount</th>
                  <th className="px-4 py-3">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {transactions.map((tx) => (
                  <tr key={tx.id}>
                    <td className="px-4 py-3">{new Date(tx.paymentDate).toLocaleString()}</td>
                    <td className="px-4 py-3">{tx.customerId}</td>
                    <td className="px-4 py-3">{tx.invoiceId}</td>
                    <td className="px-4 py-3">{tx.paymentType}</td>
                    <td className="px-4 py-3">₹{tx.paymentAmount}</td>
                    <td className="px-4 py-3">
                      <Badge status={tx.paymentStatus}>{tx.paymentStatus}</Badge>
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
