import { Link } from 'react-router-dom'
import { useStore } from '../context/StoreContext.jsx'
import { formatPrice, getCategory } from '../data/products.js'
import SafeImage from './SafeImage.jsx'
import Rating from './Rating.jsx'

export default function ProductCard({ product }) {
  const { addToCart, toggleWishlist, wishlist } = useStore()
  const liked = wishlist.includes(product.id)
  const discount = product.oldPrice ? Math.round((1 - product.price / product.oldPrice) * 100) : 0
  const cat = getCategory(product.category)

  return (
    <article className="card product-card">
      <div className="pc-media">
        <Link to={`/product/${product.slug}`} aria-label={product.name}>
          <SafeImage src={product.image} alt={product.name} icon={cat?.icon} />
        </Link>
        {product.badge && <span className="badge">{product.badge}</span>}
        {discount > 0 && <span className="badge badge-sale">-{discount}%</span>}
        <button className={`icon-btn pc-heart ${liked ? 'active' : ''}`} onClick={() => toggleWishlist(product)} aria-label="Toggle wishlist">
          {liked ? '♥' : '♡'}
        </button>
      </div>
      <div className="pc-body">
        <span className="pc-cat">{cat?.name}</span>
        <Link to={`/product/${product.slug}`} className="pc-title">{product.name}</Link>
        <Rating value={product.rating} reviews={product.reviews} />
        <div className="pc-foot">
          <div className="price">
            <strong>{formatPrice(product.price)}</strong>
            {product.oldPrice && <s>{formatPrice(product.oldPrice)}</s>}
          </div>
          <button className="btn btn-primary btn-sm" onClick={() => addToCart(product)}>Add</button>
        </div>
      </div>
    </article>
  )
}
