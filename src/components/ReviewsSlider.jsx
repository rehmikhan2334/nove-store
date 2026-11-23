import { useEffect, useRef, useState } from 'react'
import { useStore } from '../context/StoreContext.jsx'
import { products } from '../data/products.js'
import Icon, { Stars } from './Icons.jsx'
import { Link } from 'react-router-dom'

export default function ReviewsSlider() {
  const { reviews } = useStore()
  const ref = useRef(null)
  const [paused, setPaused] = useState(false)
  const [active, setActive] = useState(0)

  const avg = reviews.reduce((s, r) => s + r.rating, 0) / reviews.length
  const dist = [5, 4, 3, 2, 1].map((n) => ({ n, c: reviews.filter((r) => r.rating === n).length }))

  const step = () => (ref.current?.firstElementChild?.offsetWidth || 320) + 18
  const scrollDir = (d) => ref.current?.scrollBy({ left: d * step(), behavior: 'smooth' })

  useEffect(() => {
    const reduce = window.matchMedia?.('(prefers-reduced-motion: reduce)').matches
    if (paused || reduce) return
    const t = setInterval(() => {
      const el = ref.current
      if (!el) return
      if (el.scrollLeft + el.clientWidth >= el.scrollWidth - 8) el.scrollTo({ left: 0, behavior: 'smooth' })
      else el.scrollBy({ left: step(), behavior: 'smooth' })
    }, 5500)
    return () => clearInterval(t)
  }, [paused])

  const onScroll = () => {
    const el = ref.current
    if (el) setActive(Math.round(el.scrollLeft / step()))
  }

  return (
    <section className="section container reviews" aria-label="Customer reviews">
      <div className="section-head">
        <div><span className="eyebrow">Customer reviews</span><h2>Loved by thousands of shoppers</h2></div>
        <div className="rv-arrows">
          <button className="icon-btn ring" onClick={() => scrollDir(-1)} aria-label="Previous reviews"><Icon name="arrowLeft" /></button>
          <button className="icon-btn ring" onClick={() => scrollDir(1)} aria-label="Next reviews"><Icon name="arrowRight" /></button>
        </div>
      </div>

      <div className="rv-layout">
        <aside className="card rv-summary">
          <div className="rv-score">{avg.toFixed(1)}</div>
          <Stars value={avg} size={20} />
          <p className="muted">Based on {reviews.length * 140 + 18} verified reviews</p>
          <ul className="rv-bars">
            {dist.map((d) => (
              <li key={d.n}>
                <span>{d.n}</span><Icon name="star" size={12} fill />
                <i><b style={{ width: `${(d.c / reviews.length) * 100}%` }} /></i>
                <em>{Math.round((d.c / reviews.length) * 100)}%</em>
              </li>
            ))}
          </ul>
          <Link to="/shop" className="btn btn-primary btn-block">Shop & write a review</Link>
        </aside>

        <div className="rv-track" ref={ref} onScroll={onScroll} onMouseEnter={() => setPaused(true)} onMouseLeave={() => setPaused(false)} tabIndex={0}>
          {reviews.map((r) => {
            const prod = products.find((p) => p.id === r.productId)
            return (
              <figure key={r.id} className="card rv-card">
                <svg className="rv-quote" width="34" height="34" viewBox="0 0 24 24" aria-hidden="true"><path d="M3 21c0-5 1-9 5-12l2 2c-2 2-3 4-3 6h4v6H3zm11 0c0-5 1-9 5-12l2 2c-2 2-3 4-3 6h4v6h-8z" /></svg>
                <Stars value={r.rating} size={16} />
                <h4>{r.title}</h4>
                <blockquote>{r.text}</blockquote>
                <figcaption>
                  <span className="avatar">{r.name[0]}</span>
                  <div>
                    <b>{r.name}</b>
                    <small className="muted">{r.city || 'Pakistan'}{r.verified && <> · <span className="verified"><Icon name="check" size={12} strokeWidth={3} /> Verified buyer</span></>}</small>
                  </div>
                </figcaption>
                {prod && <Link to={`/product/${prod.slug}`} className="rv-prod">Reviewed: {prod.name}</Link>}
              </figure>
            )
          })}
        </div>
      </div>
      <div className="rv-dots" aria-hidden="true">
        {reviews.map((r, n) => <i key={r.id} className={n === active ? 'on' : ''} />)}
      </div>
    </section>
  )
}
