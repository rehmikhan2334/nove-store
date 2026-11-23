export default function Rating({ value, reviews }) {
  const full = Math.round(value)
  return (
    <span className="rating" aria-label={`${value} out of 5`}>
      <span className="stars">{'★'.repeat(full)}{'☆'.repeat(5 - full)}</span>
      <b>{value.toFixed(1)}</b>
      {reviews != null && <span className="muted">({reviews})</span>}
    </span>
  )
}
