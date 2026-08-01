import { Link } from 'react-router-dom'

export default function ProductCard({ product, onAdd }) {
  const hasDiscount = product.compare_at_price && product.compare_at_price > product.price
  const discountPct = hasDiscount
    ? Math.round(100 - (product.price / product.compare_at_price) * 100)
    : 0

  return (
    <div className="group relative flex flex-col overflow-hidden rounded-lg border border-ink/5 bg-white shadow-sm transition-shadow hover:shadow-xl">
      <Link to={`/product/${product.slug}`} className="relative block aspect-square overflow-hidden bg-chalk">
        <img
          src={product.image_url}
          alt={product.name}
          loading="lazy"
          className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
        />
        {hasDiscount && (
          <span className="absolute left-0 top-3 bg-signal px-3 py-1 text-xs font-bold text-white stripe-clip">
            -{discountPct}%
          </span>
        )}
        {!product.in_stock && (
          <span className="absolute inset-0 flex items-center justify-center bg-ink/60 text-sm font-bold uppercase tracking-wider text-white">
            Out of stock
          </span>
        )}
      </Link>

      <div className="flex flex-1 flex-col p-4">
        <p className="text-[11px] font-semibold uppercase tracking-wider text-steel">{product.brand}</p>
        <Link to={`/product/${product.slug}`} className="mt-1 line-clamp-2 font-semibold text-ink hover:text-steel">
          {product.name}
        </Link>

        <div className="mt-1 flex items-center gap-1 text-xs text-steel">
          <span className="text-volt">★</span>
          <span>{product.rating?.toFixed(1)}</span>
        </div>

        <div className="mt-3 flex items-end justify-between">
          <div className="flex items-baseline gap-2">
            <span className="price-chip rounded bg-ink px-2 py-1 text-sm font-bold text-volt">
              ₹{product.price.toLocaleString('en-IN')}
            </span>
            {hasDiscount && (
              <span className="price-chip text-xs text-steel line-through">
                ₹{product.compare_at_price.toLocaleString('en-IN')}
              </span>
            )}
          </div>
        </div>

        <button
          onClick={() => onAdd(product)}
          disabled={!product.in_stock}
          className="mt-3 w-full rounded-md bg-ink py-2 text-sm font-bold text-chalk transition-colors hover:bg-volt hover:text-ink disabled:cursor-not-allowed disabled:bg-steel/30 disabled:text-steel"
        >
          {product.in_stock ? 'Add to cart' : 'Unavailable'}
        </button>
      </div>
    </div>
  )
}
