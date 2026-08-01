export default function Toast({ message, show }) {
  if (!show) return null
  return (
    <div className="fixed bottom-6 left-1/2 z-50 -translate-x-1/2 rounded-md bg-ink px-5 py-3 text-sm font-semibold text-volt shadow-xl">
      {message}
    </div>
  )
}
