import { Link } from 'react-router-dom'
import { FileQuestion } from 'lucide-react'
import { useAuth } from '../../contexts/AuthContext'
import { homePathForRole, paths } from '../../routes/paths'
import { Button } from '../../components/ui/Button'
import { Card, CardBody } from '../../components/ui/Card'

export function NotFoundPage() {
  const { isAuthenticated, role } = useAuth()
  const home = isAuthenticated ? homePathForRole(role) : paths.login

  return (
    <div className="flex min-h-[50vh] items-center justify-center">
      <Card className="max-w-md w-full text-center">
        <CardBody className="space-y-4 py-10">
          <FileQuestion className="mx-auto size-12 text-slate-400" />
          <h1 className="text-xl font-semibold text-slate-900">Page not found</h1>
          <p className="text-sm text-slate-500">
            The URL may be wrong or the page was moved. Check the address or return home.
          </p>
          <Link to={home}>
            <Button type="button">{isAuthenticated ? 'Go to dashboard' : 'Sign in'}</Button>
          </Link>
        </CardBody>
      </Card>
    </div>
  )
}
