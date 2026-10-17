import { Outlet } from 'react-router-dom'
import type { NavItem } from '../../routes/navigation'
import { AppHeader } from './AppHeader'
import { AppMobileNav } from './AppMobileNav'
import { AppSidebar } from './AppSidebar'

type DashboardLayoutProps = {
  sidebarTitle: string
  nav: NavItem[]
  withSidebar?: boolean
}

export function DashboardLayout({ sidebarTitle, nav, withSidebar = true }: DashboardLayoutProps) {
  return (
    <div className="min-h-screen bg-slate-50">
      <AppHeader />
      {withSidebar ? <AppMobileNav items={nav} /> : null}
      <div className="flex">
        {withSidebar ? <AppSidebar items={nav} title={sidebarTitle} /> : null}
        <main className="flex-1 p-4 md:p-8">
          <div className="mx-auto max-w-6xl">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  )
}
