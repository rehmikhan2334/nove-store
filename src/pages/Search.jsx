import { useEffect, useMemo, useState } from 'react'
import { Link, useSearchParams } from 'react-router-dom'
import { products, categories } from '../data/products.js'
import ProductCard from '../components/ProductCard.jsx'

export default function Search() {
  const [params, setParams] = useSearchParams()
  const initial = params.get('q') || ''
  const [q, setQ] = useState(initial)
  const [cat, setCat] = useState('all')

  useEffect(() => setQ(params.get('q') || ''), [params])

  const results = useMemo(() => {
    const t = q.trim().toLowerCase()
    return products.filter((p) =>
      (cat === 'all' || p.category === cat) &&
      (!t || [p.name, p.brand, p.category, p.description].join(' ').toLowerCase().includes(t))
    )
  }, [q, cat])

  const onChange = (v) => { setQ(v); setParams(v ? { q: v } : {}, { replace: true }) }
  const suggestions = ['Headphones', 'Watch', 'Sneakers', 'Backpack', 'Lamp']

  return (
    <div className="container page">
      <div className="breadcrumb">Home / <b>Search</b></div>
      <div className="search-hero card">
        <h1>Search products</h1>
        <div className="search-big">
          <span>🔍</span>
          <input autoFocus value={q} onChange={(e) => onChange(e.target.value)} placeholder="Search by name, brand or category…" />
          {q && <button className="icon-btn" onClick={() => onChange('')} aria-label="Clear">✕</button>}
        </div>
        <div className="chips">
          <button className={`chip ${cat === 'all' ? 'on' : ''}`} onClick={() => setCat('all')}>All</button>
          {categories.map((c) => (
            <button key={c.id} className={`chip ${cat === c.id ? 'on' : ''}`} onClick={() => setCat(c.id)}>{c.icon} {c.name}</button>
          ))}
        </div>
        {!q && (
          <div className="chips"><span className="muted">Popular:</span>
            {suggestions.map((s) => <button key={s} className="chip" onClick={() => onChange(s)}>{s}</button>)}
          </div>
        )}
      </div>

      <p className="muted results-count">{results.length} result{results.length !== 1 && 's'}{q && <> for “<b>{q}</b>”</>}</p>
      {results.length ? (
        <div className="grid">{results.map((p) => <ProductCard key={p.id} product={p} />)}</div>
      ) : (
        <div className="empty card"><span>😕</span><h3>Nothing found</h3><p className="muted">Try a different keyword or browse all products.</p><Link to="/shop" className="btn btn-primary">Browse shop</Link></div>
      )}
    </div>
  )
}
