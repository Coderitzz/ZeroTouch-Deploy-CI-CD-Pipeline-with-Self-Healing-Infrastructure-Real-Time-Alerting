import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import client from '../api/client'
import Loader from '../components/Loader'

export default function Orders() {
  const [orders, setOrders] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    client.get('/orders').then((res) => setOrders(res.data)).finally(() => setLoading(false))
  }, [])

  if (loading) return <Loader label="Loading orders..." />

  if (orders.length === 0) {
    return (
      <div className="mx-auto max-w-2xl px-4 py-24 text-center">
        <p className="font-display text-4xl text-ink">No orders yet</p>
        <Link to="/shop" className="mt-6 inline-block rounded-md bg-ink px-6 py-3 font-bold text-volt">
          Start shopping
        </Link>
      </div>
    )
  }

  return (
    <div className="mx-auto max-w-4xl px-4 py-10 sm:px-6 lg:px-8">
      <h1 className="font-display text-5xl text-ink">YOUR ORDERS</h1>
      <div className="mt-8 space-y-4">
        {orders.map((order) => (
          <div key={order.id} className="rounded-lg border border-ink/10 bg-white p-5">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <div>
                <p className="price-chip font-bold text-ink">Order #{order.id}</p>
                <p className="text-xs text-steel">{new Date(order.created_at).toLocaleDateString()}</p>
              </div>
              <span className="rounded-full bg-volt/20 px-3 py-1 text-xs font-bold uppercase text-ink">
                {order.status}
              </span>
            </div>
            <div className="mt-3 space-y-1 border-t border-ink/5 pt-3">
              {order.items.map((item) => (
                <div key={item.id} className="flex justify-between text-sm text-steel">
                  <span>{item.product_name} × {item.quantity}</span>
                  <span className="price-chip">₹{item.subtotal.toLocaleString('en-IN')}</span>
                </div>
              ))}
            </div>
            <div className="mt-3 flex justify-between border-t border-ink/5 pt-3 font-bold text-ink">
              <span>Total</span>
              <span className="price-chip">₹{order.total.toLocaleString('en-IN')}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
