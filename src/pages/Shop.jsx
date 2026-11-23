import { useMemo, useState } from 'react'
import { useSearchParams } from 'react-router-dom'
import { products, categories } from '../data/products.js'
import ProductCard from '../components/ProductCard.jsx'

const brands = [...new Set(products.map((p) => p.brand))].sort()

export default function Shop() {
  const [params, setParams] = useSearchParams()
  const category = params.get('category') || 'all'
  const sort = params.get('sort') || 'featured'
  const [maxPrice, setMaxPrice] = useState(1000)
  const [minRating, setMinRating] = useState(0)
  const [selBrands, setSelBrands] = useState([])
  const [filtersOpen, setFiltersOpen] = useState(false)

  const setParam = (k, v) => {
    const n = new URLSearchParams(params)
    if (!v || v === 'all' || v === 'featured') n.delete(k)
    else n.set(k, v)
    setParams(n)
  }
  const toggleBrand = (b) => setSelBrands((s) => (s.includes(b) ? s.filter((x) => x !== b) : [...s, b]))
  const reset = () => { setParams({}); setMaxPrice(1000); setMinRating(0); setSelBrands([]) }

  const list = useMemo(() => {
    let r = products.filter((p) =>
      (category === 'all' || p.category === category) &&
      p.price <= maxPrice && p.rating >= minRating &&
      (selBrands.length === 0 || selBrands.includes(p.brand))
    )
    const d = (p) => (p.oldPrice ? 1 - p.price / p.oldPrice : 0)
    const sorters = {
      'price-asc': (a, b) => a.price - b.price,
      'price-desc': (a, b) => b.price - a.price,
      rating: (a, b) => b.rating - a.rating,
      discount: (a, b) => d(b) - d(a),
      popular: (a, b) => b.reviews - a.reviews,
    }
    if (sorters[sort]) r = [...r].sort(sorters[sort])
    return r
  }, [category, sort, maxPrice, minRating, selBrands])

  const title = category === 'all' ? 'All Products' : categories.find((c) => c.id === category)?.name

  return (
    <div className="container page">
      <div className="breadcrumb">Home / <b>{title}</b></div>
      <div className="page-head">
        <div><h1>{title}</h1><p className="muted">{list.length} products</p></div>
        <div className="toolbar">
          <button className="btn btn-outline btn-sm filter-toggle" onClick={() => setFiltersOpen(!filtersOpen)}>⚙ Filters</button>
          <select value={sort} onChange={(e) => setParam('sort', e.target.value)} aria-label="Sort">
            <option value="featured">Featured</option>
            <option value="popular">Most popular</option>
            <option value="price-asc">Price: Low → High</option>
            <option value="price-desc">Price: High → Low</option>
            <option value="rating">Top rated</option>
            <option value="discount">Biggest discount</option>
          </select>
        </div>
      </div>

      <div className="shop-layout">
        <aside className={`filters card ${filtersOpen ? 'open' : ''}`}>
          <div className="filter-group">
            <h4>Category</h4>
            {[{ id: 'all', name: 'All' }, ...categories].map((c) => (
              <label key={c.id} className="radio"><input type="radio" name="cat" checked={category === c.id} onChange={() => setParam('category', c.id)} />{c.name}</label>
            ))}
          </div>
          <div className="filter-group">
            <h4>Max price: <b>${maxPrice}</b></h4>
            <input type="range" min="20" max="1000" step="10" value={maxPrice} onChange={(e) => setMaxPrice(+e.target.value)} />
          </div>
          <div className="filter-group">
            <h4>Minimum rating</h4>
            {[0, 4, 4.5].map((r) => (
              <label key={r} className="radio"><input type="radio" name="rate" checked={minRating === r} onChange={() => setMinRating(r)} />{r === 0 ? 'Any' : `${r}★ & up`}</label>
            ))}
          </div>
          <div className="filter-group">
            <h4>Brand</h4>
            {brands.map((b) => (
              <label key={b} className="radio"><input type="checkbox" checked={selBrands.includes(b)} onChange={() => toggleBrand(b)} />{b}</label>
            ))}
          </div>
          <button className="btn btn-ghost btn-block" onClick={reset}>Reset filters</button>
        </aside>

        <section>
          {list.length ? (
            <div className="grid grid-3">{list.map((p) => <ProductCard key={p.id} product={p} />)}</div>
          ) : (
            <div className="empty card"><span>🔎</span><h3>No products match your filters</h3><button className="btn btn-primary" onClick={reset}>Clear filters</button></div>
          )}
        </section>
      </div>
    </div>
  )
}
