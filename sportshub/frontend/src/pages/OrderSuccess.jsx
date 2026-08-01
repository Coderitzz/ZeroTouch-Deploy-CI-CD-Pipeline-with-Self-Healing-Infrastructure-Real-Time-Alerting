import { useEffect, useState } from 'react'
import { useParams, Link } from 'react-router-dom'
import client from '../api/client'
import Loader from '../components/Loader'

export default function OrderSuccess() {
  const { orderId } = useParams()
  const [order, setOrder] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    client.get(`/orders/${orderId}`).then((res) => setOrder(res.data)).finally(() => setLoading(false))
  }, [orderId])

  if (loading) return <Loader label="Confirming order..." />
  if (!order) return <p className="py-24 text-center">Order not found.</p>

  return (
    <div className="mx-auto max-w-2xl px-4 py-20 text-center">
      <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-volt text-3xl">✓</div>
      <h1 className="mt-6 font-display text-5xl text-ink">ORDER CONFIRMED</h1>
      <p className="mt-2 text-steel">
        Order <span className="price-chip font-bold text-ink">#{order.id}</span> is on its way to {order.shipping_city}.
      </p>

      <div className="mt-8 rounded-lg border border-ink/10 bg-white p-6 text-left">
        {order.items.map((item) => (
          <div key={item.id} className="flex justify-between border-b border-ink/5 py-2 text-sm last:border-0">
            <span className="text-steel">{item.product_name} × {item.quantity}</span>
            <span className="price-chip font-semibold text-ink">₹{item.subtotal.toLocaleString('en-IN')}</span>
          </div>
        ))}
        <div className="mt-3 flex justify-between font-bold text-ink">
          <span>Total</span>
          <span className="price-chip">₹{order.total.toLocaleString('en-IN')}</span>
        </div>
      </div>

      <Link to="/shop" className="mt-8 inline-block rounded-md bg-ink px-6 py-3 font-bold text-volt">
        Continue shopping
      </Link>
    </div>
  )
}
