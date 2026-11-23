import { Link } from 'react-router-dom'
import { useStore } from '../context/StoreContext.jsx'
import { products } from '../data/products.js'
import ProductCard from '../components/ProductCard.jsx'

export default function Wishlist() {
  const { wishlist } = useStore()
  const items = products.filter((p) => wishlist.includes(p.id))
  return (
    <div className="container page">
      <div className="breadcrumb">Home / <b>Wishlist</b></div>
      <div className="page-head"><h1>My wishlist</h1><p className="muted">{items.length} saved</p></div>
      {items.length ? (
        <div className="grid">{items.map((p) => <ProductCard key={p.id} product={p} />)}</div>
      ) : (
        <div className="empty card"><span>💜</span><h2>Your wishlist is empty</h2><p className="muted">Tap the heart on any product to save it here.</p><Link to="/shop" className="btn btn-primary btn-lg">Browse products</Link></div>
      )}
    </div>
  )
}
