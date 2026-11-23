import { useStore } from '../context/StoreContext.jsx'
import Icon from './Icons.jsx'

export default function Toasts() {
  const { toasts } = useStore()
  return (
    <div className="toasts" aria-live="polite">
      {toasts.map((t) => (
        <div key={t.id} className={`toast ${t.type}`}><Icon name={t.type === 'success' ? 'check' : 'tag'} size={16} strokeWidth={3} /> {t.message}</div>
      ))}
    </div>
  )
}
