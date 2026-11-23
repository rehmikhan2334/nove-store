import Icon from '../components/Icons.jsx'
import { useState } from 'react'
import { Link } from 'react-router-dom'
import { useStore } from '../context/StoreContext.jsx'
import { formatPrice } from '../data/products.js'
import SafeImage from '../components/SafeImage.jsx'

export const FREE_SHIP = 100
export const calcTotals = (subtotal, promo) => {
  const discount = promo === 'NOVA10' ? subtotal * 0.1 : 0
  const shipping = subtotal - discount >= FREE_SHIP || subtotal === 0 ? 0 : 9
  const tax = (subtotal - discount) * 0.05
  return { discount, shipping, tax, total: subtotal - discount + shipping + tax }
}

export default function Cart() {
  const { cartItems, subtotal, updateQty, removeFromCart, clearCart } = useStore()
  const [code, setCode] = useState('')
  const [promo, setPromo] = useState(() => sessionStorage.getItem('nova_promo') || '')
  const [msg, setMsg] = useState('')
  const t = calcTotals(subtotal, promo)

  const apply = (e) => {
    e.preventDefault()
    if (code.trim().toUpperCase() === 'NOVA10') {
      setPromo('NOVA10'); sessionStorage.setItem('nova_promo', 'NOVA10'); setMsg('Code applied — 10% off!')
    } else setMsg('Invalid promo code')
  }

  if (!cartItems.length)
    return (
      <div className="container page">
        <div className="empty card"><span className="empty-ic"><Icon name="cart" size={44} /></span><h2>Your cart is empty</h2><p className="muted">Looks like you haven't added anything yet.</p><Link to="/shop" className="btn btn-primary btn-lg">Start shopping</Link></div>
      </div>
    )

  return (
    <div className="container page">
      <div className="breadcrumb">Home / <b>Cart</b></div>
      <div className="page-head"><h1>Shopping cart</h1><button className="btn btn-ghost btn-sm" onClick={clearCart}>Clear cart</button></div>

      <div className="cart-layout">
        <div className="cart-list">
          {subtotal < FREE_SHIP && (
            <div className="ship-bar card">Add <b>{formatPrice(FREE_SHIP - subtotal)}</b> more for free shipping
              <div className="bar"><i style={{ width: `${(subtotal / FREE_SHIP) * 100}%` }} /></div>
            </div>
          )}
          {cartItems.map((i) => (
            <div key={i.key} className="cart-item card">
              <Link to={`/product/${i.product.slug}`} className="ci-img"><SafeImage src={i.product.image} alt={i.product.name} /></Link>
              <div className="ci-info">
                <Link to={`/product/${i.product.slug}`}><h3>{i.product.name}</h3></Link>
                <span className="muted">{i.product.brand}</span>
                {i.color && <span className="dot" style={{ background: i.color }} />}
                <div className="qty sm">
                  <button onClick={() => updateQty(i.key, i.qty - 1)}>−</button><span>{i.qty}</span><button onClick={() => updateQty(i.key, i.qty + 1)}>+</button>
                </div>
              </div>
              <div className="ci-price">
                <strong>{formatPrice(i.product.price * i.qty)}</strong>
                <button className="link-danger" onClick={() => removeFromCart(i.key)}>Remove</button>
              </div>
            </div>
          ))}
        </div>

        <aside className="summary card">
          <h3>Order summary</h3>
          <form className="promo-form" onSubmit={apply}>
            <input value={code} onChange={(e) => setCode(e.target.value)} placeholder="Promo code (NOVA10)" />
            <button className="btn btn-dark btn-sm">Apply</button>
          </form>
          {msg && <small className={msg.startsWith('Invalid') ? 'err' : 'ok'}>{msg}</small>}
          <dl>
            <div><dt>Subtotal</dt><dd>{formatPrice(subtotal)}</dd></div>
            {t.discount > 0 && <div className="ok"><dt>Discount (10%)</dt><dd>−{formatPrice(t.discount)}</dd></div>}
            <div><dt>Shipping</dt><dd>{t.shipping ? formatPrice(t.shipping) : 'Free'}</dd></div>
            <div><dt>Tax (5%)</dt><dd>{formatPrice(t.tax)}</dd></div>
            <div className="total"><dt>Total</dt><dd>{formatPrice(t.total)}</dd></div>
          </dl>
          <Link to="/checkout" className="btn btn-primary btn-lg btn-block">Proceed to checkout</Link>
          <Link to="/shop" className="btn btn-ghost btn-block">Continue shopping</Link>
        </aside>
      </div>
    </div>
  )
}
