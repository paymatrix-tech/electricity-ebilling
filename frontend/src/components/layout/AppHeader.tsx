import { LogOut } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import { brand } from '../../routes/navigation'
import { useAuth } from '../../contexts/AuthContext'
import { paths } from '../../routes/paths'
import { Button } from '../ui/Button'

export function AppHeader() {
  const { logout } = useAuth()
  const navigate = useNavigate()
  const BrandIcon = brand.icon

  return (
    <header className="sticky top-0 z-30 flex h-14 items-center justify-between border-b border-slate-200/80 bg-white/90 px-4 backdrop-blur md:px-6">
      <div className="flex items-center gap-2 text-slate-900">
        <span className="flex size-9 items-center justify-center rounded-lg bg-brand-600 text-white shadow-sm">
          <BrandIcon className="size-5" />
        </span>
        <div className="leading-tight">
          <p className="text-sm font-semibold">{brand.name}</p>
          <p className="hidden text-xs text-slate-500 sm:block">{brand.tagline}</p>
        </div>
      </div>
      <Button
        variant="ghost"
        size="sm"
        onClick={() => {
          logout()
          navigate(paths.login, { replace: true })
        }}
      >
        <LogOut className="size-4" />
        Sign out
      </Button>
    </header>
  )
}
