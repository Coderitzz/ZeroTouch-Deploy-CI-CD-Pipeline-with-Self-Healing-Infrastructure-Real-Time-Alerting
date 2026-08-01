import { useEffect, useState, useCallback } from 'react'
import { useSearchParams, useNavigate } from 'react-router-dom'
import client from '../api/client'
import ProductCard from '../components/ProductCard'
import Loader from '../components/Loader'
import Toast from '../components/Toast'
import { useCart } from '../context/CartContext'
import { useAuth } from '../context/AuthContext'

export default function Shop() {
  const [searchParams, setSearchParams] = useSearchParams()
  const [products, setProducts] = useState([])
  const [categories, setCategories] = useState([])
  const [pages, setPages] = useState(1)
  const [loading, setLoading] = useState(true)
  const [toast, setToast] = useState('')
  const { addToCart } = useCart()
  const { user } = useAuth()
  const navigate = useNavigate()

  const category = searchParams.get('category') || ''
  const q = searchParams.get('q') || ''
  const sort = searchParams.get('sort') || ''
  const page = parseInt(searchParams.get('page') || '1', 10)

  useEffect(() => {
    client.get('/products/categories/all').then((res) => setCategories(res.data))
  }, [])

  const loadProducts = useCallback(() => {
    setLoading(true)
    const params = { page, per_page: 12 }
    if (category) params.category = category
    if (q) params.q = q
    if (sort) params.sort = sort
    client
      .get('/products', { params })
      .then((res) => {
        setProducts(res.data.items)
        setPages(res.data.pages || 1)
      })
      .finally(() => setLoading(false))
  }, [category, q, sort, page])

  useEffect(() => {
    loadProducts()
  }, [loadProducts])

  const updateParam = (key, value) => {
    const next = new URLSearchParams(searchParams)
    if (value) next.set(key, value)
    else next.delete(key)
    next.delete('page')
    setSearchParams(next)
  }

  const handleAdd = async (product) => {
    if (!user) return navigate('/login')
    await addToCart(product.id, 1)
    setToast(`${product.name} added to cart`)
    setTimeout(() => setToast(''), 2000)
  }

  return (
    <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
      <h1 className="font-display text-5xl text-ink">
        {category ? categories.find((c) => c.slug === category)?.name || 'Shop' : 'All Gear'}
      </h1>
      {q && <p className="mt-1 text-steel">Results for "{q}"</p>}

      <div className="mt-8 grid gap-8 md:grid-cols-[220px_1fr]">
        {/* Filters */}
        <aside className="space-y-6">
          <div>
            <h3 className="mb-3 text-xs font-bold uppercase tracking-wider text-steel">Category</h3>
            <ul className="space-y-1">
              <li>
                <button
                  onClick={() => updateParam('category', '')}
                  className={`text-sm ${!category ? 'font-bold text-ink' : 'text-steel hover:text-ink'}`}
                >
                  All
                </button>
              </li>
              {categories.map((c) => (
                <li key={c.id}>
                  <button
                    onClick={() => updateParam('category', c.slug)}
                    className={`text-sm ${category === c.slug ? 'font-bold text-ink' : 'text-steel hover:text-ink'}`}
                  >
                    {c.name}
                  </button>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="mb-3 text-xs font-bold uppercase tracking-wider text-steel">Sort by</h3>
            <select
              value={sort}
              onChange={(e) => updateParam('sort', e.target.value)}
              className="w-full rounded-md border border-ink/10 bg-white px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-volt"
            >
              <option value="">Newest</option>
              <option value="price_asc">Price: Low to High</option>
              <option value="price_desc">Price: High to Low</option>
              <option value="rating">Top Rated</option>
            </select>
          </div>
        </aside>

        {/* Products */}
        <div>
          {loading ? (
            <Loader label="Loading gear..." />
          ) : products.length === 0 ? (
            <div className="rounded-lg border border-dashed border-ink/20 py-20 text-center">
              <p className="font-display text-2xl text-ink">No gear found</p>
              <p className="mt-1 text-sm text-steel">Try a different search or category.</p>
            </div>
          ) : (
            <>
              <div className="grid grid-cols-2 gap-5 sm:grid-cols-3 lg:grid-cols-3 xl:grid-cols-4">
                {products.map((p) => (
                  <ProductCard key={p.id} product={p} onAdd={handleAdd} />
                ))}
              </div>

              {pages > 1 && (
                <div className="mt-10 flex items-center justify-center gap-2">
                  {Array.from({ length: pages }, (_, i) => i + 1).map((p) => (
                    <button
                      key={p}
                      onClick={() => updateParam('page', String(p))}
                      className={`h-9 w-9 rounded-md text-sm font-semibold ${
                        p === page ? 'bg-ink text-volt' : 'bg-white text-steel hover:bg-ink/5'
                      }`}
                    >
                      {p}
                    </button>
                  ))}
                </div>
              )}
            </>
          )}
        </div>
      </div>

      <Toast message={toast} show={!!toast} />
    </div>
  )
}
