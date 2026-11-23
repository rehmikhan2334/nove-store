import { useState } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom'
import { getProduct, getCategory, products, formatPrice } from '../data/products.js'
import { useStore } from '../context/StoreContext.jsx'
import SafeImage from '../components/SafeImage.jsx'
import Rating from '../components/Rating.jsx'
import ProductCard from '../components/ProductCard.jsx'
import NotFound from './NotFound.jsx'

export default function ProductDetail() {
  const { slug } = useParams()
  const product = getProduct(slug)
  const { addToCart, toggleWishlist, wishlist } = useStore()
  const navigate = useNavigate()
  const [qty, setQty] = useState(1)
  const [color, setColor] = useState(product?.colors?.[0] || null)
  const [tab, setTab] = useState('description')

  if (!product) return <NotFound />
  const cat = getCategory(product.category)
  const liked = wishlist.includes(product.id)
  const discount = product.oldPrice ? Math.round((1 - product.price / product.oldPrice) * 100) : 0
  const related = products.filter((p) => p.category === product.category && p.id !== product.id).slice(0, 4)
  const lowStock = product.stock <= 10

  return (
    <div className="container page">
      <div className="breadcrumb">
        <Link to="/">Home</Link> / <Link to="/shop">Shop</Link> / <Link to={`/shop?category=${product.category}`}>{cat?.name}</Link> / <b>{product.name}</b>
      </div>

      <div className="detail">
        <div className="detail-media card">
          <SafeImage src={product.image} alt={product.name} icon={cat?.icon} />
          {product.badge && <span className="badge">{product.badge}</span>}
        </div>

        <div className="detail-info">
          <span className="pc-cat">{product.brand} · {cat?.name}</span>
          <h1>{product.name}</h1>
          <Rating value={product.rating} reviews={product.reviews} />
          <div className="price price-lg">
            <strong>{formatPrice(product.price)}</strong>
            {product.oldPrice && <><s>{formatPrice(product.oldPrice)}</s><span className="save">Save {discount}%</span></>}
          </div>
          <p className="lead">{product.description}</p>

          {product.colors.length > 0 && (
            <div className="opt">
              <h4>Color</h4>
              <div className="swatches">
                {product.colors.map((c) => (
                  <button key={c} className={`swatch ${color === c ? 'on' : ''}`} style={{ background: c }} onClick={() => setColor(c)} aria-label={`Color ${c}`} />
                ))}
              </div>
            </div>
          )}

          <div className="opt">
            <h4>Quantity</h4>
            <div className="qty">
              <button onClick={() => setQty((q) => Math.max(1, q - 1))} aria-label="Decrease">−</button>
              <span>{qty}</span>
              <button onClick={() => setQty((q) => Math.min(product.stock, q + 1))} aria-label="Increase">+</button>
            </div>
            <span className={`stock ${lowStock ? 'low' : ''}`}>{lowStock ? `Only ${product.stock} left!` : 'In stock'}</span>
          </div>

          <div className="detail-cta">
            <button className="btn btn-primary btn-lg" onClick={() => addToCart(product, qty, color)}>🛒 Add to cart</button>
            <button className="btn btn-dark btn-lg" onClick={() => { addToCart(product, qty, color); navigate('/cart') }}>Buy now</button>
            <button className={`icon-btn big ${liked ? 'active' : ''}`} onClick={() => toggleWishlist(product)} aria-label="Wishlist">{liked ? '♥' : '♡'}</button>
          </div>

          <ul className="trust">
            <li>🚚 Free delivery over $100</li>
            <li>↩️ 30-day easy returns</li>
            <li>🛡️ 1-year warranty</li>
          </ul>
        </div>
      </div>

      <div className="card tabs">
        <div className="tab-head">
          {['description', 'features', 'shipping'].map((t) => (
            <button key={t} className={tab === t ? 'on' : ''} onClick={() => setTab(t)}>{t[0].toUpperCase() + t.slice(1)}</button>
          ))}
        </div>
        <div className="tab-body">
          {tab === 'description' && <p>{product.description} Built with quality materials and backed by our satisfaction guarantee, it is designed to last and look great while doing it.</p>}
          {tab === 'features' && <ul className="check">{product.features.map((f) => <li key={f}>{f}</li>)}</ul>}
          {tab === 'shipping' && <p>Orders ship within 24 hours. Standard delivery takes 3–5 business days and is free on orders over $100. Not happy? Return it within 30 days for a full refund.</p>}
        </div>
      </div>

      {related.length > 0 && (
        <section className="section">
          <div className="section-head"><h2>You may also like</h2></div>
          <div className="grid">{related.map((p) => <ProductCard key={p.id} product={p} />)}</div>
        </section>
      )}
    </div>
  )
}
