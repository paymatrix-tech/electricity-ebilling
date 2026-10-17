import { Button } from './Button'

type Props = {
  page: number
  totalPages: number
  onPageChange: (page: number) => void
  disabled?: boolean
}

export function PaginationControls({ page, totalPages, onPageChange, disabled }: Props) {
  if (totalPages <= 1) return null

  return (
    <div className="flex items-center justify-between gap-3 border-t border-slate-100 px-4 py-3 text-sm text-slate-600">
      <span>
        Page {page + 1} of {totalPages}
      </span>
      <div className="flex gap-2">
        <Button
          type="button"
          size="sm"
          variant="secondary"
          disabled={disabled || page <= 0}
          onClick={() => onPageChange(page - 1)}
        >
          Previous
        </Button>
        <Button
          type="button"
          size="sm"
          variant="secondary"
          disabled={disabled || page >= totalPages - 1}
          onClick={() => onPageChange(page + 1)}
        >
          Next
        </Button>
      </div>
    </div>
  )
}
