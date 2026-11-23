import { useState } from 'react'
import { useStore } from '../context/StoreContext.jsx'
import Icon, { Stars } from './Icons.jsx'

export default function ProductReviews({ product }) {
  const { reviews, addReview, user } = useStore()
  const list = reviews.filter((r) => r.productId === product.id)
  const [f, setF] = useState({ name: user?.name || '', rating: 5, title: '', text: '' })
  const [err, setErr] = useState('')

  const submit = (e) => {
    e.preventDefault()
    if (f.name.trim().length < 2) return setErr('Please enter your name')
    if (f.text.trim().length < 10) return setErr('Please write at least 10 characters')
    setErr('')
    addReview({ productId: product.id, name: f.name.trim(), rating: f.rating, title: f.title.trim() || 'My review', text: f.text.trim(), city: '' })
    setF({ ...f, title: '', text: '' })
  }

  return (
    <div className="pr-wrap">
      <div className="pr-list">
        <div className="pr-head">
          <div className="pr-score"><b>{product.rating.toFixed(1)}</b><Stars value={product.rating} size={18} /><small className="muted">{product.reviews} ratings</small></div>
        </div>
        {list.length === 0 && <p className="muted">No written reviews yet. Be the first to share your thoughts!</p>}
        {list.map((r) => (
          <article key={r.id} className="pr-item">
            <span className="avatar">{r.name[0]}</span>
            <div>
              <div className="pr-top"><b>{r.name}</b><Stars value={r.rating} size={14} /><small className="muted">{r.date}</small></div>
              <h4>{r.title}</h4>
              <p>{r.text}</p>
              {r.verified && <small className="verified"><Icon name="check" size={12} strokeWidth={3} /> Verified buyer</small>}
            </div>
          </article>
        ))}
      </div>

      <form className="pr-form card" onSubmit={submit}>
        <h3>Write a review</h3>
        <div className="star-pick" role="radiogroup" aria-label="Rating">
          {[1, 2, 3, 4, 5].map((n) => (
            <button type="button" key={n} className={n <= f.rating ? 'on' : ''} onClick={() => setF({ ...f, rating: n })} aria-label={`${n} stars`}>
              <Icon name="star" size={26} fill={n <= f.rating} />
            </button>
          ))}
        </div>
        <label className="field"><span>Your name</span><input value={f.name} onChange={(e) => setF({ ...f, name: e.target.value })} /></label>
        <label className="field"><span>Title</span><input value={f.title} onChange={(e) => setF({ ...f, title: e.target.value })} placeholder="Sum it up in a few words" /></label>
        <label className="field"><span>Your review</span><textarea rows="4" value={f.text} onChange={(e) => setF({ ...f, text: e.target.value })} placeholder="What did you like or dislike?" /></label>
        {err && <small className="err">{err}</small>}
        <button className="btn btn-primary btn-block">Post review</button>
      </form>
    </div>
  )
}
