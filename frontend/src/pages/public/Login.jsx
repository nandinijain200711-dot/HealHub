import { useState } from 'react'
import { Link, useNavigate, useLocation } from 'react-router-dom'
import { useAuth } from '../../hooks/useAuth'
import { ROUTES } from '../../lib/constants'

export default function Login() {
  const { login, adminLogin } = useAuth()
  const navigate = useNavigate()
  const location = useLocation()
  const from = location.state?.from?.pathname

  const [form, setForm] = useState({ email: '', password: '' })
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const [isAdmin, setIsAdmin] = useState(false)

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setLoading(true)
    try {
      if (isAdmin) {
        await adminLogin({ username: form.email, password: form.password })
        navigate(ROUTES.ADMIN_DASHBOARD, { replace: true })
      } else {
        await login(form)
        navigate(from || ROUTES.USER_DASHBOARD, { replace: true })
      }
    } catch (err) {
      setError(err.response?.data?.detail || 'Invalid credentials')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-[80vh] flex items-center justify-center px-4 py-12">
      <div className="card w-full max-w-md">
        <h1 className="text-2xl font-bold text-gray-900 text-center mb-6">
          {isAdmin ? 'Admin Sign In' : 'Sign In'}
        </h1>

        {error && (
          <div className="mb-4 p-3 bg-red-50 border border-red-200 text-red-700 text-sm rounded-lg">{error}</div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              {isAdmin ? 'Username' : 'Email'}
            </label>
            <input
              type={isAdmin ? 'text' : 'email'}
              className="input-field"
              value={form.email}
              onChange={(e) => setForm({ ...form, email: e.target.value })}
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Password</label>
            <input
              type="password"
              className="input-field"
              value={form.password}
              onChange={(e) => setForm({ ...form, password: e.target.value })}
              required
            />
          </div>
          <button type="submit" className="btn-primary w-full" disabled={loading}>
            {loading ? 'Signing in...' : 'Sign In'}
          </button>
        </form>

        {!isAdmin && (
          <p className="mt-4 text-center text-sm text-gray-600">
            Don't have an account?{' '}
            <Link to={ROUTES.REGISTER} className="text-primary-600 font-medium hover:underline">Register</Link>
          </p>
        )}

        <button
          onClick={() => { setIsAdmin(!isAdmin); setError('') }}
          className="mt-4 w-full text-center text-sm text-gray-500 hover:text-primary-600 transition-colors"
        >
          {isAdmin ? 'Switch to User Login' : 'Admin Login'}
        </button>
      </div>
    </div>
  )
}
