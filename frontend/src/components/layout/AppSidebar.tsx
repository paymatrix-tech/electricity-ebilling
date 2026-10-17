import { NavLink } from 'react-router-dom'
import type { NavItem } from '../../routes/navigation'
import { cn } from '../../lib/cn'

export function AppSidebar({ items, title }: { items: NavItem[]; title: string }) {
  return (
    <aside className="hidden w-60 shrink-0 border-r border-slate-200/80 bg-slate-50/80 md:block">
      <div className="sticky top-14 px-3 py-4">
        <p className="mb-2 px-3 text-xs font-semibold uppercase tracking-wide text-slate-400">{title}</p>
        <nav className="flex flex-col gap-0.5">
          {items.map((item) => {
            const Icon = item.icon
            return (
              <NavLink
                key={item.to}
                to={item.to}
                end={item.end}
                className={({ isActive }) =>
                  cn(
                    'flex items-center gap-2.5 rounded-lg px-3 py-2 text-sm font-medium transition-colors',
                    isActive
                      ? 'bg-white text-brand-700 shadow-sm ring-1 ring-slate-200/80'
                      : 'text-slate-600 hover:bg-white/70 hover:text-slate-900',
                  )
                }
              >
                <Icon className="size-4 shrink-0 opacity-80" />
                {item.label}
              </NavLink>
            )
          })}
        </nav>
      </div>
    </aside>
  )
}
