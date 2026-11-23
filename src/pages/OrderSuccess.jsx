import { Link, useParams } from 'react-router-dom'
import { useStore } from '../context/StoreContext.jsx'
import { formatPrice } from '../data/products.js'

export default function OrderSuccess() {
  const { id } = useParams()
  const { orders } = useStore()
  const order = orders.find((o) => o.id === id)
  return (
    <div className="container page">
      <div className="success card">
        <div className="check-big">✓</div>
        <h1>Thank you for your order!</h1>
        <p className="muted">Order <b>#{id}</b> has been placed. A confirmation will be sent to {order?.details.email || 'your email'}.</p>
        {order && (
          <ul className="mini-list">
            {order.items.map((i) => <li key={i.id}><span>{i.name} × {i.qty}</span><b>{formatPrice(i.price * i.qty)}</b></li>)}
            <li className="total"><span>Total paid</span><b>{formatPrice(order.total)}</b></li>
          </ul>
        )}
        <div className="hero-cta center">
          <Link to="/shop" className="btn btn-primary btn-lg">Continue shopping</Link>
          <Link to="/" className="btn btn-outline btn-lg">Back to home</Link>
        </div>
      </div>
    </div>
  )
}
