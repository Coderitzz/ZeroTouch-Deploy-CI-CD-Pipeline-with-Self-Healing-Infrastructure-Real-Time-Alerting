import { Link } from 'react-router-dom'

export default function NotFound() {
  return (
    <div className="mx-auto max-w-2xl px-4 py-24 text-center">
      <p className="font-display text-7xl text-ink">404</p>
      <p className="mt-2 text-steel">This page got substituted out.</p>
      <Link to="/" className="mt-6 inline-block rounded-md bg-ink px-6 py-3 font-bold text-volt">
        Back to home
      </Link>
    </div>
  )
}
