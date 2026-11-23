import { Stars } from './Icons.jsx'

export default function Rating({ value, reviews }) {
  return (
    <span className="rating">
      <Stars value={value} size={15} />
      <b>{value.toFixed(1)}</b>
      {reviews != null && <span className="muted">({reviews})</span>}
    </span>
  )
}
