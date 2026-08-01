import { useEffect, useState } from 'react'
import { useParams, useNavigate, Link } from 'react-router-dom'
import client from '../api/client'
import Loader from '../components/Loader'
import Toast from '../components/Toast'
import { useCart } from '../context/CartContext'
import { useAuth } from '../context/AuthContext'

export default function ProductDetail() {
  const { slug } = useParams()
  const [product, setProduct] = useState(null)
  const [loading, setLoading] = useState(true)
  const [qty, setQty] = useState(1)
  const [toast, setToast] = useState('')
  const { addToCart } = useCart()
  const { user } = useAuth()
  const navigate = useNavigate()

  useEffect(() => {
    setLoading(true)
    client
      .get(`/products/${slug}`)
      .then((res) => setProduct(res.data))
      .catch(() => setProduct(null))
      .finally(() => setLoading(false))
  }, [slug])

  if (loading) return <Loader label="Loading product..." />
  if (!product) {
    return (
      <div className="mx-auto max-w-7xl px-4 py-24 text-center">
        <p className="font-display text-3xl">Product not found</p>
        <Link to="/shop" className="mt-4 inline-block text-sm font-bold text-steel hover:text-ink">
          ← Back to shop
        </Link>
      </div>
    )
  }

  const hasDiscount = product.compare_at_price && product.compare_at_price > product.price
  const discountPct = hasDiscount
    ? Math.round(100 - (product.price / product.compare_at_price) * 100)
    : 0

  const handleAdd = async () => {
    if (!user) return navigate('/login')
    await addToCart(product.id, qty)
    setToast(`${product.name} added to cart`)
    setTimeout(() => setToast(''), 2000)
  }

  return (
    <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
      <nav className="mb-6 text-xs text-steel">
        <Link to="/shop" className="hover:text-ink">Shop</Link>
        <span className="mx-1">/</span>
        <Link to={`/shop?category=${product.category?.slug}`} className="hover:text-ink">
          {product.category?.name}
        </Link>
        <span className="mx-1">/</span>
        <span className="text-ink">{product.name}</span>
      </nav>

      <div className="grid gap-10 md:grid-cols-2">
        <div className="relative overflow-hidden rounded-lg bg-chalk">
          <img src={product.image_url} alt={product.name} className="aspect-square w-full object-cover" />
          {hasDiscount && (
            <span className="absolute left-0 top-4 bg-signal px-4 py-1.5 text-sm font-bold text-white stripe-clip">
              -{discountPct}% OFF
            </span>
          )}
        </div>

        <div>
          <p className="text-xs font-semibold uppercase tracking-wider text-steel">{product.brand}</p>
          <h1 className="mt-1 font-display text-4xl text-ink">{product.name}</h1>

          <div className="mt-2 flex items-center gap-2 text-sm text-steel">
            <span className="text-volt">{'★'.repeat(Math.round(product.rating))}</span>
            <span>{product.rating?.toFixed(1)} rating</span>
          </div>

          <div className="mt-5 flex items-baseline gap-3">
            <span className="price-chip rounded bg-ink px-3 py-1.5 text-xl font-bold text-volt">
              ₹{product.price.toLocaleString('en-IN')}
            </span>
            {hasDiscount && (
              <span className="price-chip text-steel line-through">
                ₹{product.compare_at_price.toLocaleString('en-IN')}
              </span>
            )}
          </div>

          <p className="mt-6 leading-relaxed text-steel">{product.description}</p>

          <p className={`mt-4 text-sm font-semibold ${product.in_stock ? 'text-green-600' : 'text-signal'}`}>
            {product.in_stock ? `In stock — ${product.stock} available` : 'Out of stock'}
          </p>

          {product.in_stock && (
            <div className="mt-6 flex items-center gap-4">
              <div className="flex items-center rounded-md border border-ink/15">
                <button
                  onClick={() => setQty((q) => Math.max(1, q - 1))}
                  className="px-3 py-2 text-lg font-bold text-ink hover:text-steel"
                >
                  −
                </button>
                <span className="w-10 text-center font-mono">{qty}</span>
                <button
                  onClick={() => setQty((q) => Math.min(product.stock, q + 1))}
                  className="px-3 py-2 text-lg font-bold text-ink hover:text-steel"
                >
                  +
                </button>
              </div>
              <button
                onClick={handleAdd}
                className="flex-1 rounded-md bg-ink py-3 font-bold text-chalk transition-colors hover:bg-volt hover:text-ink"
              >
                Add to cart
              </button>
            </div>
          )}
        </div>
      </div>

      <Toast message={toast} show={!!toast} />
    </div>
  )
}
