import { Link, useNavigate } from 'react-router-dom'
import { useCart } from '../context/CartContext'

export default function Cart() {
  const { items, total, updateQuantity, removeItem, loading } = useCart()
  const navigate = useNavigate()

  if (!loading && items.length === 0) {
    return (
      <div className="mx-auto max-w-2xl px-4 py-24 text-center">
        <p className="font-display text-4xl text-ink">Your cart is empty</p>
        <p className="mt-2 text-steel">Time to gear up for game day.</p>
        <Link to="/shop" className="mt-6 inline-block rounded-md bg-ink px-6 py-3 font-bold text-volt">
          Browse gear
        </Link>
      </div>
    )
  }

  return (
    <div className="mx-auto max-w-5xl px-4 py-10 sm:px-6 lg:px-8">
      <h1 className="font-display text-5xl text-ink">YOUR CART</h1>

      <div className="mt-8 grid gap-8 md:grid-cols-[1fr_320px]">
        <div className="space-y-4">
          {items.map((item) => (
            <div key={item.id} className="flex gap-4 rounded-lg border border-ink/10 bg-white p-4">
              <Link to={`/product/${item.product.slug}`} className="h-24 w-24 flex-shrink-0 overflow-hidden rounded-md bg-chalk">
                <img src={item.product.image_url} alt={item.product.name} className="h-full w-full object-cover" />
              </Link>
              <div className="flex flex-1 flex-col justify-between">
                <div className="flex justify-between gap-2">
                  <div>
                    <Link to={`/product/${item.product.slug}`} className="font-semibold text-ink hover:text-steel">
                      {item.product.name}
                    </Link>
                    <p className="text-xs text-steel">{item.product.brand}</p>
                  </div>
                  <button onClick={() => removeItem(item.id)} className="text-xs font-semibold text-signal hover:underline">
                    Remove
                  </button>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center rounded-md border border-ink/15">
                    <button
                      onClick={() => updateQuantity(item.id, Math.max(1, item.quantity - 1))}
                      className="px-2.5 py-1 font-bold text-ink hover:text-steel"
                    >
                      −
                    </button>
                    <span className="w-8 text-center font-mono text-sm">{item.quantity}</span>
                    <button
                      onClick={() => updateQuantity(item.id, item.quantity + 1)}
                      className="px-2.5 py-1 font-bold text-ink hover:text-steel"
                    >
                      +
                    </button>
                  </div>
                  <span className="price-chip font-bold text-ink">₹{item.subtotal.toLocaleString('en-IN')}</span>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="h-fit rounded-lg border border-ink/10 bg-white p-6">
          <h2 className="font-display text-2xl text-ink">Order summary</h2>
          <div className="mt-4 flex justify-between text-sm text-steel">
            <span>Subtotal</span>
            <span className="price-chip">₹{total.toLocaleString('en-IN')}</span>
          </div>
          <div className="mt-1 flex justify-between text-sm text-steel">
            <span>Shipping</span>
            <span>Free</span>
          </div>
          <div className="mt-4 flex justify-between border-t border-ink/10 pt-4 font-bold text-ink">
            <span>Total</span>
            <span className="price-chip">₹{total.toLocaleString('en-IN')}</span>
          </div>
          <button
            onClick={() => navigate('/checkout')}
            className="mt-6 w-full rounded-md bg-ink py-3 font-bold text-volt transition-colors hover:bg-volt hover:text-ink"
          >
            Proceed to checkout
          </button>
        </div>
      </div>
    </div>
  )
}
