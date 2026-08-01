import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

export default function Register() {
  const { register } = useAuth()
  const navigate = useNavigate()
  const [form, setForm] = useState({ name: '', email: '', password: '' })
  const [error, setError] = useState('')
  const [submitting, setSubmitting] = useState(false)

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setSubmitting(true)
    try {
      await register(form.name, form.email, form.password)
      navigate('/')
    } catch (err) {
      setError(err.response?.data?.error || 'Registration failed')
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div className="mx-auto flex min-h-[70vh] max-w-md flex-col justify-center px-4 py-12">
      <h1 className="font-display text-5xl text-ink">CREATE ACCOUNT</h1>
      <p className="mt-2 text-steel">Join SPRINT and start gearing up.</p>

      <form onSubmit={handleSubmit} className="mt-8 space-y-4">
        {error && <p className="rounded-md bg-signal/10 px-3 py-2 text-sm font-semibold text-signal">{error}</p>}
        <div>
          <label className="mb-1 block text-xs font-bold uppercase tracking-wider text-steel">Full name</label>
          <input
            required
            value={form.name}
            onChange={(e) => setForm({ ...form, name: e.target.value })}
            className="w-full rounded-md border border-ink/15 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-volt"
          />
        </div>
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
            minLength={6}
            value={form.password}
            onChange={(e) => setForm({ ...form, password: e.target.value })}
            className="w-full rounded-md border border-ink/15 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-volt"
          />
          <p className="mt-1 text-xs text-steel">At least 6 characters.</p>
        </div>
        <button
          type="submit"
          disabled={submitting}
          className="w-full rounded-md bg-ink py-3 font-bold text-volt transition-colors hover:bg-volt hover:text-ink disabled:opacity-60"
        >
          {submitting ? 'Creating account...' : 'Create account'}
        </button>
      </form>

      <p className="mt-6 text-center text-sm text-steel">
        Already have an account?{' '}
        <Link to="/login" className="font-bold text-ink hover:text-volt">
          Sign in
        </Link>
      </p>
    </div>
  )
}
