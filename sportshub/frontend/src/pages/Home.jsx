import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import client from '../api/client'
import ProductCard from '../components/ProductCard'
import Loader from '../components/Loader'
import Toast from '../components/Toast'
import { useCart } from '../context/CartContext'
import { useAuth } from '../context/AuthContext'
import { useNavigate } from 'react-router-dom'

const CATEGORY_META = {
  football: { emoji: '⚽', label: 'Football' },
  basketball: { emoji: '🏀', label: 'Basketball' },
  cricket: { emoji: '🏏', label: 'Cricket' },
  running: { emoji: '👟', label: 'Running' },
  fitness: { emoji: '🏋️', label: 'Fitness' },
  yoga: { emoji: '🧘', label: 'Yoga' },
}

export default function Home() {
  const [categories, setCategories] = useState([])
  const [featured, setFeatured] = useState([])
  const [loading, setLoading] = useState(true)
  const [toast, setToast] = useState('')
  const { addToCart } = useCart()
  const { user } = useAuth()
  const navigate = useNavigate()

  useEffect(() => {
    Promise.all([
      client.get('/products/categories/all'),
      client.get('/products?featured=true&per_page=8'),
    ])
      .then(([catRes, prodRes]) => {
        setCategories(catRes.data)
        setFeatured(prodRes.data.items)
      })
      .finally(() => setLoading(false))
  }, [])

  const handleAdd = async (product) => {
    if (!user) return navigate('/login')
    await addToCart(product.id, 1)
    setToast(`${product.name} added to cart`)
    setTimeout(() => setToast(''), 2000)
  }

  return (
    <div>
      {/* Hero */}
      <section className="relative overflow-hidden bg-ink text-chalk">
        <div className="mx-auto grid max-w-7xl items-center gap-10 px-4 py-16 sm:px-6 md:grid-cols-2 lg:px-8 lg:py-24">
          <div>
            <p className="mb-3 font-mono text-xs font-bold uppercase tracking-[0.3em] text-volt">
              New season drops
            </p>
            <h1 className="font-display text-6xl leading-[0.95] sm:text-7xl lg:text-8xl">
              GEAR UP.
              <br />
              <span className="text-volt">SHOW UP.</span>
            </h1>
            <p className="mt-6 max-w-md text-chalk/70">
              Match-ready football boots, court-tested basketballs, and everything
              in between. Performance accessories for every discipline.
            </p>
            <div className="mt-8 flex gap-3">
              <Link
                to="/shop"
                className="rounded-md bg-volt px-6 py-3 font-bold text-ink transition-transform hover:scale-105"
              >
                Shop all gear
              </Link>
              <Link
                to="/shop?featured=true"
                className="rounded-md border border-chalk/30 px-6 py-3 font-bold text-chalk transition-colors hover:border-volt hover:text-volt"
              >
                View featured
              </Link>
            </div>
          </div>
          <div className="relative">
            <div className="stripe-clip aspect-[4/3] overflow-hidden rounded-lg bg-ink-light">
              <img
                src="https://images.unsplash.com/photo-1517649763962-0c623066013b?w=900"
                alt="Sports accessories"
                className="h-full w-full object-cover"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Categories */}
      <section className="mx-auto max-w-7xl px-4 py-14 sm:px-6 lg:px-8">
        <h2 className="font-display text-4xl text-ink">SHOP BY SPORT</h2>
        <div className="mt-6 grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-6">
          {categories.map((c) => (
            <Link
              key={c.id}
              to={`/shop?category=${c.slug}`}
              className="flex flex-col items-center gap-2 rounded-lg border border-ink/10 bg-white p-5 text-center transition-all hover:-translate-y-1 hover:border-volt hover:shadow-md"
            >
              <span className="text-3xl">{CATEGORY_META[c.slug]?.emoji || '🏆'}</span>
              <span className="text-sm font-semibold text-ink">{c.name}</span>
            </Link>
          ))}
        </div>
      </section>

      {/* Featured */}
      <section className="mx-auto max-w-7xl px-4 pb-20 sm:px-6 lg:px-8">
        <div className="mb-6 flex items-end justify-between">
          <h2 className="font-display text-4xl text-ink">FEATURED GEAR</h2>
          <Link to="/shop" className="text-sm font-bold text-steel hover:text-ink">
            View all →
          </Link>
        </div>
        {loading ? (
          <Loader label="Loading gear..." />
        ) : (
          <div className="grid grid-cols-2 gap-5 sm:grid-cols-3 lg:grid-cols-4">
            {featured.map((p) => (
              <ProductCard key={p.id} product={p} onAdd={handleAdd} />
            ))}
          </div>
        )}
      </section>

      <Toast message={toast} show={!!toast} />
    </div>
  )
}
