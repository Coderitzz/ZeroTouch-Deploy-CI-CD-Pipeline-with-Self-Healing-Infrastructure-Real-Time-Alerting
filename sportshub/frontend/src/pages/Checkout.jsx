import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import client from '../api/client'
import { useCart } from '../context/CartContext'

export default function Checkout() {
  const { items, total, refreshCart } = useCart()
  const navigate = useNavigate()
  const [form, setForm] = useState({
    shipping_name: '',
    shipping_address: '',
    shipping_city: '',
    shipping_zip: '',
    shipping_phone: '',
  })
  const [error, setError] = useState('')
  const [submitting, setSubmitting] = useState(false)

  if (items.length === 0) {
    navigate('/cart')
    return null
  }

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value })

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setSubmitting(true)
    try {
      const res = await client.post('/orders/checkout', form)
      await refreshCart()
      navigate(`/order-success/${res.data.id}`)
    } catch (err) {
      setError(err.response?.data?.error || 'Checkout failed. Please try again.')
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div className="mx-auto max-w-5xl px-4 py-10 sm:px-6 lg:px-8">
      <h1 className="font-display text-5xl text-ink">CHECKOUT</h1>

      <div className="mt-8 grid gap-8 md:grid-cols-[1fr_320px]">
        <form onSubmit={handleSubmit} className="space-y-4 rounded-lg border border-ink/10 bg-white p-6">
          <h2 className="font-display text-2xl text-ink">Shipping details</h2>

          {error && <p className="rounded-md bg-signal/10 px-3 py-2 text-sm font-semibold text-signal">{error}</p>}

          <div>
            <label className="mb-1 block text-xs font-bold uppercase tracking-wider text-steel">Full name</label>
            <input
              name="shipping_name"
              required
              value={form.shipping_name}
              onChange={handleChange}
              className="w-full rounded-md border border-ink/15 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-volt"
            />
          </div>
          <div>
            <label className="mb-1 block text-xs font-bold uppercase tracking-wider text-steel">Address</label>
            <input
              name="shipping_address"
              required
              value={form.shipping_address}
              onChange={handleChange}
              className="w-full rounded-md border border-ink/15 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-volt"
            />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="mb-1 block text-xs font-bold uppercase tracking-wider text-steel">City</label>
              <input
                name="shipping_city"
                required
                value={form.shipping_city}
                onChange={handleChange}
                className="w-full rounded-md border border-ink/15 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-volt"
              />
            </div>
            <div>
              <label className="mb-1 block text-xs font-bold uppercase tracking-wider text-steel">ZIP / Postal code</label>
              <input
                name="shipping_zip"
                required
                value={form.shipping_zip}
                onChange={handleChange}
                className="w-full rounded-md border border-ink/15 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-volt"
              />
            </div>
          </div>
          <div>
            <label className="mb-1 block text-xs font-bold uppercase tracking-wider text-steel">Phone number</label>
            <input
              name="shipping_phone"
              required
              value={form.shipping_phone}
              onChange={handleChange}
              className="w-full rounded-md border border-ink/15 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-volt"
            />
          </div>

          <button
            type="submit"
            disabled={submitting}
            className="w-full rounded-md bg-ink py-3 font-bold text-volt transition-colors hover:bg-volt hover:text-ink disabled:opacity-60"
          >
            {submitting ? 'Placing order...' : `Place order — ₹${total.toLocaleString('en-IN')}`}
          </button>
          <p className="text-center text-xs text-steel">Demo checkout — no real payment is processed.</p>
        </form>

        <div className="h-fit rounded-lg border border-ink/10 bg-white p-6">
          <h2 className="font-display text-2xl text-ink">Order items</h2>
          <div className="mt-4 space-y-3">
            {items.map((item) => (
              <div key={item.id} className="flex justify-between text-sm">
                <span className="text-steel">{item.product.name} × {item.quantity}</span>
                <span className="price-chip font-semibold text-ink">₹{item.subtotal.toLocaleString('en-IN')}</span>
              </div>
            ))}
          </div>
          <div className="mt-4 flex justify-between border-t border-ink/10 pt-4 font-bold text-ink">
            <span>Total</span>
            <span className="price-chip">₹{total.toLocaleString('en-IN')}</span>
          </div>
        </div>
      </div>
    </div>
  )
}
