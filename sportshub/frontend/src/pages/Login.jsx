import { useState } from 'react'
import { Link, useNavigate, useLocation } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

export default function Login() {
  const { login } = useAuth()
  const navigate = useNavigate()
  const location = useLocation()
  const [form, setForm] = useState({ email: '', password: '' })
  const [error, setError] = useState('')
  const [submitting, setSubmitting] = useState(false)

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setSubmitting(true)
    try {
      await login(form.email, form.password)
      navigate(location.state?.from?.pathname || '/')
    } catch (err) {
      setError(err.response?.data?.error || 'Login failed')
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div className="mx-auto flex min-h-[70vh] max-w-md flex-col justify-center px-4 py-12">
      <h1 className="font-display text-5xl text-ink">SIGN IN</h1>
      <p className="mt-2 text-steel">Welcome back to SPRINT.</p>

      <form onSubmit={handleSubmit} className="mt-8 space-y-4">
        {error && <p className="rounded-md bg-signal/10 px-3 py-2 text-sm font-semibold text-signal">{error}</p>}
        <div>
          <label className="mb-1 block text-xs font-bold uppercase tracking-wider text-steel">Email</label>
          <input
            type="email"
            required
            value={form.email}
            onChange={(e) => setForm({ ...form, email: e.target.value })}
            className="w-full rounded-md border border-ink/15 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-volt"
          />
        </div>
        <div>
          <label className="mb-1 block text-xs font-bold uppercase tracking-wider text-steel">Password</label>
          <input
            type="password"
            required
            value={form.password}
            onChange={(e) => setForm({ ...form, password: e.target.value })}
            className="w-full rounded-md border border-ink/15 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-volt"
          />
        </div>
        <button
          type="submit"
          disabled={submitting}
          className="w-full rounded-md bg-ink py-3 font-bold text-volt transition-colors hover:bg-volt hover:text-ink disabled:opacity-60"
        >
          {submitting ? 'Signing in...' : 'Sign in'}
        </button>
      </form>

      <p className="mt-6 text-center text-sm text-steel">
        New here?{' '}
        <Link to="/register" className="font-bold text-ink hover:text-volt">
          Create an account
        </Link>
      </p>
    </div>
  )
}
