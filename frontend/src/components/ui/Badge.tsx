import { cn } from '../../lib/cn'

const tones: Record<string, string> = {
  PAID: 'bg-emerald-50 text-emerald-700 ring-emerald-600/20',
  UNPAID: 'bg-amber-50 text-amber-800 ring-amber-600/20',
  PENDING: 'bg-sky-50 text-sky-700 ring-sky-600/20',
  FAILED: 'bg-red-50 text-red-700 ring-red-600/20',
  default: 'bg-slate-100 text-slate-700 ring-slate-500/20',
}

export function Badge({ children, status }: { children: React.ReactNode; status?: string }) {
  const tone = status && tones[status] ? tones[status] : tones.default
  return (
    <span
      className={cn(
        'inline-flex rounded-full px-2.5 py-0.5 text-xs font-medium ring-1 ring-inset',
        tone,
      )}
    >
      {children}
    </span>
  )
}
