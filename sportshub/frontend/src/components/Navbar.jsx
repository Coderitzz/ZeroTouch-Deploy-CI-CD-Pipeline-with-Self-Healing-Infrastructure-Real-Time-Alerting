import { useState } from 'react'
import { Link, NavLink, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { useCart } from '../context/CartContext'

export default function Navbar() {
  const { user, logout } = useAuth()
  const { count } = useCart()
  const navigate = useNavigate()
  const [query, setQuery] = useState('')
  const [menuOpen, setMenuOpen] = useState(false)

  const handleSearch = (e) => {
    e.preventDefault()
    navigate(query.trim() ? `/shop?q=${encodeURIComponent(query.trim())}` : '/shop')
    setMenuOpen(false)
  }

  const linkClass = ({ isActive }) =>
    `relative pb-1 text-sm font-semibold tracking-wide transition-colors ${
      isActive ? 'text-volt' : 'text-chalk/80 hover:text-chalk'
    } after:absolute after:left-0 after:-bottom-1 after:h-[2px] after:bg-volt after:transition-all ${
      isActive ? 'after:w-full' : 'after:w-0 hover:after:w-full'
    }`

  return (
    <header className="sticky top-0 z-40 bg-ink text-chalk shadow-lg">
      <div className="mx-auto flex max-w-7xl items-center gap-4 px-4 py-3 sm:px-6 lg:px-8">
        <Link to="/" className="flex items-center gap-1 font-display text-3xl leading-none">
          <span className="text-chalk">SPRINT</span>
          <span className="text-volt">.</span>
        </Link>

        <nav className="ml-6 hidden items-center gap-6 md:flex">
          <NavLink to="/" end className={linkClass}>Home</NavLink>
          <NavLink to="/shop" className={linkClass}>Shop</NavLink>
          {user && <NavLink to="/orders" className={linkClass}>Orders</NavLink>}
        </nav>

        <form onSubmit={handleSearch} className="ml-auto hidden flex-1 max-w-sm items-center md:flex">
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            type="text"
            placeholder="Search gear, brands..."
            className="w-full rounded-l-md border-none bg-ink-light px-3 py-2 text-sm text-chalk placeholder:text-steel focus:outline-none focus:ring-2 focus:ring-volt"
          />
          <button type="submit" className="rounded-r-md bg-volt px-3 py-2 text-sm font-bold text-ink">
            Go
          </button>
        </form>

        <div className="ml-auto flex items-center gap-4 md:ml-4">
          <Link to="/cart" className="relative flex items-center gap-1 text-sm font-semibold">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M3 3h2l.4 2M7 13h10l3.6-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
            </svg>
            {count > 0 && (
              <span className="absolute -right-2 -top-2 flex h-4 w-4 items-center justify-center rounded-full bg-signal text-[10px] font-bold text-white">
                {count}
              </span>
            )}
          </Link>

          {user ? (
            <div className="hidden items-center gap-3 md:flex">
              <span className="text-sm text-chalk/80">Hi, {user.name.split(' ')[0]}</span>
              <button onClick={logout} className="rounded border border-chalk/30 px-3 py-1.5 text-xs font-semibold hover:border-volt hover:text-volt">
                Logout
              </button>
            </div>
          ) : (
            <Link to="/login" className="hidden rounded bg-volt px-3 py-1.5 text-xs font-bold text-ink md:block">
              Sign in
            </Link>
          )}

          <button className="md:hidden" onClick={() => setMenuOpen((v) => !v)} aria-label="Toggle menu">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </button>
        </div>
      </div>

      {menuOpen && (
        <div className="border-t border-ink-light bg-ink px-4 py-4 md:hidden">
          <form onSubmit={handleSearch} className="mb-4 flex">
            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              type="text"
              placeholder="Search gear, brands..."
              className="w-full rounded-l-md bg-ink-light px-3 py-2 text-sm text-chalk placeholder:text-steel focus:outline-none"
            />
            <button type="submit" className="rounded-r-md bg-volt px-3 py-2 text-sm font-bold text-ink">Go</button>
          </form>
          <div className="flex flex-col gap-3">
            <Link to="/" onClick={() => setMenuOpen(false)} className="text-sm font-semibold">Home</Link>
            <Link to="/shop" onClick={() => setMenuOpen(false)} className="text-sm font-semibold">Shop</Link>
            {user && <Link to="/orders" onClick={() => setMenuOpen(false)} className="text-sm font-semibold">Orders</Link>}
            {user ? (
              <button onClick={() => { logout(); setMenuOpen(false) }} className="text-left text-sm font-semibold text-signal">Logout</button>
            ) : (
              <Link to="/login" onClick={() => setMenuOpen(false)} className="text-sm font-semibold text-volt">Sign in</Link>
            )}
          </div>
        </div>
      )}
    </header>
  )
}
