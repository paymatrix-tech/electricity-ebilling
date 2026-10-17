import { CreditCard } from 'lucide-react'
import { UnavailablePaymentMethod } from './UnavailablePaymentMethod'

export function CardPaymentPage() {
  return <UnavailablePaymentMethod title="Card payment" icon={CreditCard} />
}
