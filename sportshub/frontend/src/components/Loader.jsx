export default function Loader({ label = 'Loading...' }) {
  return (
    <div className="flex flex-col items-center justify-center gap-3 py-20">
      <div className="h-10 w-10 animate-spin rounded-full border-4 border-ink/10 border-t-volt" />
      <p className="text-sm font-semibold text-steel">{label}</p>
    </div>
  )
}
