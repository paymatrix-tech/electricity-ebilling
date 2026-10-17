import type { LucideIcon } from 'lucide-react'
import {
  BadgeIndianRupee,
  FileText,
  History,
  Home,
  Layers,
  Link2,
  Receipt,
  UserCog,
  UserPlus,
  Users,
  Zap,
} from 'lucide-react'
import { paths } from './paths'

export type NavItem = {
  to: string
  label: string
  icon: LucideIcon
  end?: boolean
}

export const employeeNav: NavItem[] = [
  { to: paths.employee.dashboard, label: 'Dashboard', icon: Home, end: true },
  { to: paths.employee.customers.new, label: 'Add customer', icon: UserPlus },
  { to: paths.employee.customers.import, label: 'Bulk import', icon: Users },
  { to: paths.employee.customers.list, label: 'All customers', icon: Users },
  { to: paths.employee.connections.list, label: 'Connections', icon: Link2 },
  { to: paths.employee.invoices.new, label: 'Create invoice', icon: Receipt },
  { to: paths.employee.transactions, label: 'Transactions', icon: History },
  { to: paths.employee.invoices.list, label: 'All invoices', icon: FileText },
]

export const customerNav: NavItem[] = [
  { to: paths.customer.bills, label: 'My bills', icon: FileText, end: true },
]

export const adminNav: NavItem[] = [
  { to: paths.admin.root, label: 'Dashboard', icon: Home, end: true },
  { to: paths.admin.employees.list, label: 'Employees', icon: Users },
  { to: paths.admin.employees.new, label: 'Add employee', icon: UserPlus },
  { to: paths.admin.connectionTypes.list, label: 'Connection types', icon: Layers },
  { to: paths.admin.tariffs.list, label: 'Tariffs', icon: BadgeIndianRupee },
  { to: paths.admin.employees.editLegacy, label: 'Find employee', icon: UserCog },
]

export type QuickAction = {
  to: string
  label: string
  description: string
  icon: LucideIcon
  accent: string
}

export const employeeQuickActions: QuickAction[] = [
  {
    to: paths.employee.customers.new,
    label: 'Add customer',
    description: 'Register a new consumer',
    icon: UserPlus,
    accent: 'from-violet-500/15 to-violet-600/5 text-violet-700',
  },
  {
    to: paths.employee.customers.list,
    label: 'View customers',
    description: 'Search and manage accounts',
    icon: Users,
    accent: 'from-sky-500/15 to-sky-600/5 text-sky-700',
  },
  {
    to: paths.employee.connections.list,
    label: 'Connections',
    description: 'List and edit meter links',
    icon: Link2,
    accent: 'from-amber-500/15 to-amber-600/5 text-amber-800',
  },
  {
    to: paths.employee.customers.import,
    label: 'Bulk import',
    description: 'Upload customers via CSV',
    icon: Users,
    accent: 'from-emerald-500/15 to-emerald-600/5 text-emerald-700',
  },
]

export const adminQuickActions: QuickAction[] = [
  {
    to: paths.admin.employees.list,
    label: 'Employees',
    description: 'Browse and manage staff',
    icon: Users,
    accent: 'from-sky-500/15 to-sky-600/5 text-sky-700',
  },
  {
    to: paths.admin.connectionTypes.list,
    label: 'Connection types',
    description: 'Define service categories',
    icon: Layers,
    accent: 'from-violet-500/15 to-violet-600/5 text-violet-700',
  },
  {
    to: paths.admin.tariffs.list,
    label: 'Tariffs',
    description: 'Configure billing rates',
    icon: BadgeIndianRupee,
    accent: 'from-amber-500/15 to-amber-600/5 text-amber-800',
  },
  {
    to: paths.admin.employees.new,
    label: 'Add employee',
    description: 'Onboard staff access',
    icon: UserPlus,
    accent: 'from-emerald-500/15 to-emerald-600/5 text-emerald-700',
  },
]

export const brand = {
  name: 'Electricity eBilling',
  icon: Zap,
  tagline: 'Meter-to-cash, simplified',
}
