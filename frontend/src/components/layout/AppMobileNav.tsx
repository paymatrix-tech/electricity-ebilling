import { NavLink } from 'react-router-dom'
import type { NavItem } from '../../routes/navigation'
import { cn } from '../../lib/cn'

export function AppMobileNav({ items }: { items: NavItem[] }) {
  if (items.length === 0) return null

  return (
    <nav className="border-b border-slate-200/80 bg-white px-2 py-2 md:hidden">
      <div className="flex gap-1 overflow-x-auto pb-1">
        {items.map((item) => {
          const Icon = item.icon
          return (
            <NavLink
              key={item.to}
              to={item.to}
              end={item.end}
              className={({ isActive }) =>
                cn(
                  'flex shrink-0 items-center gap-1.5 rounded-lg px-3 py-2 text-xs font-medium',
                  isActive ? 'bg-brand-50 text-brand-700' : 'text-slate-600',
                )
              }
            >
              <Icon className="size-3.5" />
              {item.label}
            </NavLink>
          )
        })}
      </div>
    </nav>
  )
}
