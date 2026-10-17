import { Wallet } from 'lucide-react'
import { UnavailablePaymentMethod } from './UnavailablePaymentMethod'

export function WalletPaymentPage() {
  return <UnavailablePaymentMethod title="Wallet payment" icon={Wallet} />
}
