import type { ReactNode } from 'react'
import { Navigate, createBrowserRouter } from 'react-router-dom'
import type { UserRole } from '../api/types'
import { DashboardLayout } from '../components/layout/DashboardLayout'
import { LoginPage } from '../features/auth/LoginPage'
import { AdminDashboardPage } from '../features/admin/AdminDashboardPage'
import { AddEmployeePage } from '../features/admin/AddEmployeePage'
import { ConnectionTypesListPage } from '../features/admin/ConnectionTypesListPage'
import { CreateConnectionTypePage } from '../features/admin/CreateConnectionTypePage'
import { CreateTariffPage } from '../features/admin/CreateTariffPage'
import { EmployeesListPage } from '../features/admin/EmployeesListPage'
import { TariffsListPage } from '../features/admin/TariffsListPage'
import { UpdateConnectionTypePage } from '../features/admin/UpdateConnectionTypePage'
import { UpdateEmployeePage } from '../features/admin/UpdateEmployeePage'
import { UpdateTariffPage } from '../features/admin/UpdateTariffPage'
import { NotFoundPage } from '../features/common/NotFoundPage'
import { InvoiceDetailPage } from '../features/employee/InvoiceDetailPage'
import { StaffInvoicesPage } from '../features/employee/StaffInvoicesPage'
import { TransactionHistoryPage } from '../features/employee/TransactionHistoryPage'
import { BillsPage } from '../features/customer/BillsPage'
import { CardPaymentPage } from '../features/customer/CardPaymentPage'
import { PaymentFailedPage } from '../features/customer/PaymentFailedPage'
import { PaymentSuccessPage } from '../features/customer/PaymentSuccessPage'
import { UpiPaymentPage } from '../features/customer/UpiPaymentPage'
import { WalletPaymentPage } from '../features/customer/WalletPaymentPage'
import { AddConnectionPage } from '../features/employee/AddConnectionPage'
import { AddCustomerPage } from '../features/employee/AddCustomerPage'
import { BulkCustomersPage } from '../features/employee/BulkCustomersPage'
import { ConnectionsListPage } from '../features/employee/ConnectionsListPage'
import { CreateInvoicePage } from '../features/employee/CreateInvoicePage'
import { CustomersListPage } from '../features/employee/CustomersListPage'
import { DashboardPage } from '../features/employee/DashboardPage'
import { UpdateConnectionPage } from '../features/employee/UpdateConnectionPage'
import { UpdateCustomerPage } from '../features/employee/UpdateCustomerPage'
import { adminNav, customerNav, employeeNav } from './navigation'
import { paths } from './paths'
import { ProtectedRoute } from './ProtectedRoute'
import { RootRedirect } from './RootRedirect'

function guard(roles: UserRole[], element: ReactNode) {
  return <ProtectedRoute roles={roles}>{element}</ProtectedRoute>
}

export const router = createBrowserRouter([
  { path: '/', element: <RootRedirect /> },
  { path: paths.login, element: <LoginPage /> },
  { path: paths.notFound, element: <NotFoundPage /> },

  {
    path: paths.employee.root,
    element: guard(
      ['EMPLOYEE'],
      <DashboardLayout sidebarTitle="Operations" nav={employeeNav} />,
    ),
    children: [
      { index: true, element: <Navigate to="dashboard" replace /> },
      { path: 'dashboard', element: <DashboardPage /> },
      { path: 'customers', element: <CustomersListPage /> },
      { path: 'customers/new', element: <AddCustomerPage /> },
      { path: 'customers/import', element: <BulkCustomersPage /> },
      { path: 'customers/:customerId/edit', element: <UpdateCustomerPage /> },
      { path: 'connections', element: <ConnectionsListPage /> },
      { path: 'connections/new', element: <AddConnectionPage /> },
      { path: 'connections/:connectionId/edit', element: <UpdateConnectionPage /> },
      { path: 'invoices/new', element: <CreateInvoicePage /> },
      { path: 'invoices', element: <StaffInvoicesPage /> },
      { path: 'invoices/:invoiceId', element: <InvoiceDetailPage /> },
      { path: 'transactions', element: <TransactionHistoryPage /> },
      { path: '*', element: <NotFoundPage /> },
    ],
  },

  {
    path: paths.customer.root,
    element: guard(
      ['CUSTOMER'],
      <DashboardLayout sidebarTitle="Account" nav={customerNav} />,
    ),
    children: [
      { index: true, element: <Navigate to="bills" replace /> },
      { path: 'bills', element: <BillsPage /> },
      { path: 'pay/upi', element: <UpiPaymentPage /> },
      { path: 'pay/card', element: <CardPaymentPage /> },
      { path: 'pay/wallet', element: <WalletPaymentPage /> },
      { path: 'pay/success', element: <PaymentSuccessPage /> },
      { path: 'pay/failed', element: <PaymentFailedPage /> },
      { path: '*', element: <NotFoundPage /> },
    ],
  },

  {
    path: paths.admin.root,
    element: guard(
      ['ADMIN'],
      <DashboardLayout sidebarTitle="Administration" nav={adminNav} />,
    ),
    children: [
      { index: true, element: <AdminDashboardPage /> },
      { path: 'employees', element: <EmployeesListPage /> },
      { path: 'employees/new', element: <AddEmployeePage /> },
      { path: 'employees/edit', element: <UpdateEmployeePage /> },
      { path: 'employees/:employeeId/edit', element: <UpdateEmployeePage /> },
      { path: 'connection-types', element: <ConnectionTypesListPage /> },
      { path: 'connection-types/new', element: <CreateConnectionTypePage /> },
      { path: 'connection-types/:typeId/edit', element: <UpdateConnectionTypePage /> },
      { path: 'tariffs', element: <TariffsListPage /> },
      { path: 'tariffs/new', element: <CreateTariffPage /> },
      { path: 'tariffs/:tariffId/edit', element: <UpdateTariffPage /> },
      { path: 'invoices/new', element: <CreateInvoicePage /> },
      { path: '*', element: <NotFoundPage /> },
    ],
  },

  { path: '*', element: <Navigate to={paths.notFound} replace /> },
])
