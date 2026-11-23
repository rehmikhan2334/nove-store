import { useStore } from '../context/StoreContext.jsx'

export default function Toasts() {
  const { toasts } = useStore()
  return (
    <div className="toasts" aria-live="polite">
      {toasts.map((t) => (
        <div key={t.id} className={`toast ${t.type}`}>{t.type === 'success' ? '✓' : 'ℹ'} {t.message}</div>
      ))}
    </div>
  )
}
