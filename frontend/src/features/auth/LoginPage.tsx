import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { KeyRound, ShieldCheck, Zap } from 'lucide-react'
import { resendOtp, sendOtp, verifyOtp } from '../../api/authApi'
import { getUserRole, isLoggedIn } from '../../auth/session'
import { homePathForRole } from '../../routes/paths'
import { brand } from '../../routes/navigation'
import { useAuth } from '../../contexts/AuthContext'
import { toast } from 'sonner'
import { Button } from '../../components/ui/Button'
import { Card, CardBody } from '../../components/ui/Card'
import { Input } from '../../components/ui/Input'
import { Label } from '../../components/ui/Label'
import { getApiErrorMessage, isValidLoginUserId, normalizeLoginUserId } from '../../lib/api-error'

export function LoginPage() {
  const navigate = useNavigate()
  const { login } = useAuth()
  const [userId, setUserId] = useState('')
  const [otp, setOtp] = useState('')
  const [otpSent, setOtpSent] = useState(false)

  useEffect(() => {
    if (!isLoggedIn()) return
    navigate(homePathForRole(getUserRole()), { replace: true })
  }, [navigate])

  const onSendOtp = async () => {
    const id = normalizeLoginUserId(userId)
    if (!isValidLoginUserId(id)) {
      toast.error('User ID must start with USR, EMP, or CST (e.g. USR1282384)')
      return
    }
    try {
      const res = await sendOtp(id)
      setUserId(id)
      toast.success(res.message || 'OTP sent')
      toast.message('Check the backend console for the OTP if email is not configured.', { duration: 6000 })
      setOtpSent(true)
    } catch (err) {
      toast.error(getApiErrorMessage(err, 'Failed to send OTP'))
    }
  }

  const onResend = async () => {
    const id = normalizeLoginUserId(userId)
    try {
      const res = await resendOtp(id)
      toast.success(res.message || 'OTP resent')
      toast.message('Check the backend console for the OTP if email is not configured.', { duration: 6000 })
    } catch (err) {
      toast.error(getApiErrorMessage(err, 'Failed to resend OTP'))
    }
  }

  const onLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    const id = normalizeLoginUserId(userId)
    try {
      const res = await verifyOtp(id, otp)
      if (!res.data) {
        toast.error('No token returned from server')
        return
      }
      login(res.data)
      toast.success('Signed in successfully')
      navigate(homePathForRole(getUserRole()), { replace: true })
    } catch (err) {
      toast.error(getApiErrorMessage(err, 'Invalid or expired OTP'))
    }
  }

  const BrandIcon = brand.icon

  return (
    <div className="flex min-h-screen">
      <div className="relative hidden w-1/2 overflow-hidden bg-gradient-to-br from-brand-600 via-brand-700 to-slate-900 lg:flex lg:flex-col lg:justify-between lg:p-12">
        <div className="flex items-center gap-3 text-white">
          <span className="flex size-11 items-center justify-center rounded-xl bg-white/15 backdrop-blur">
            <BrandIcon className="size-6" />
          </span>
          <div>
            <p className="text-lg font-semibold">{brand.name}</p>
            <p className="text-sm text-blue-100">{brand.tagline}</p>
          </div>
        </div>
        <div className="space-y-4 text-white">
          <h1 className="text-3xl font-semibold leading-tight">Secure OTP sign-in for staff and customers</h1>
          <p className="max-w-md text-blue-100/90">
            Manage connections, generate bills, and collect UPI payments from one place.
          </p>
          <ul className="space-y-3 text-sm text-blue-50">
            <li className="flex items-center gap-2">
              <ShieldCheck className="size-4 shrink-0" />
              Role-based access for admin, employee, and customer
            </li>
            <li className="flex items-center gap-2">
              <Zap className="size-4 shrink-0" />
              Real-time billing and payment status
            </li>
          </ul>
        </div>
        <p className="text-xs text-blue-200/80">© {new Date().getFullYear()} Electricity eBilling</p>
      </div>

      <div className="flex flex-1 items-center justify-center bg-slate-50 p-6">
        <Card className="w-full max-w-md">
          <CardBody>
            <div className="mb-6 flex items-center gap-2 lg:hidden">
              <span className="flex size-10 items-center justify-center rounded-lg bg-brand-600 text-white">
                <BrandIcon className="size-5" />
              </span>
              <span className="font-semibold text-slate-900">{brand.name}</span>
            </div>
            <h2 className="text-xl font-semibold text-slate-900">Sign in</h2>
            <p className="mt-1 text-sm text-slate-500">
              Enter your <strong className="font-medium text-slate-700">USR</strong>,{' '}
              <strong className="font-medium text-slate-700">EMP</strong>, or{' '}
              <strong className="font-medium text-slate-700">CST</strong> ID (not your email).
            </p>

            <form onSubmit={onLogin} className="mt-6 space-y-4">
              <div>
                <Label htmlFor="userId">User ID</Label>
                <Input
                  id="userId"
                  type="text"
                  autoComplete="username"
                  placeholder="e.g. USR1282384 or EMP3340598"
                  value={userId}
                  onChange={(e) => setUserId(e.target.value)}
                />
              </div>

              {otpSent && (
                <div>
                  <Label htmlFor="otp">One-time password</Label>
                  <Input
                    id="otp"
                    type="text"
                    inputMode="numeric"
                    maxLength={6}
                    placeholder="6-digit OTP"
                    value={otp}
                    onChange={(e) => setOtp(e.target.value.replace(/\D/g, ''))}
                  />
                  <button
                    type="button"
                    onClick={onResend}
                    className="mt-2 text-sm font-medium text-brand-600 hover:text-brand-700"
                  >
                    Resend OTP
                  </button>
                </div>
              )}

              {!otpSent ? (
                <Button
                  type="button"
                  className="w-full"
                  disabled={userId.trim().length < 3}
                  onClick={onSendOtp}
                >
                  <KeyRound className="size-4" />
                  Send OTP
                </Button>
              ) : (
                <Button type="submit" className="w-full" disabled={otp.length !== 6}>
                  Continue
                </Button>
              )}
            </form>
          </CardBody>
        </Card>
      </div>
    </div>
  )
}
