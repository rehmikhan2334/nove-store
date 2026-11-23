import Icon from '../components/Icons.jsx'
import { useState } from 'react'
import { Link, Navigate, useNavigate } from 'react-router-dom'
import { useStore } from '../context/StoreContext.jsx'
import { formatPrice } from '../data/products.js'
import { calcTotals } from './Cart.jsx'

function Field({ k, label, type = 'text', placeholder, half, f, set, errors }) {
  return (
    <label className={`field ${half ? 'half' : ''}`}>
      <span>{label}</span>
      <input type={type} value={f[k]} onChange={set(k)} placeholder={placeholder} className={errors[k] ? 'invalid' : ''} />
      {errors[k] && <small className="err">{errors[k]}</small>}
    </label>
  )
}

export default function Checkout() {
  const { cartItems, subtotal, placeOrder, user } = useStore()
  const navigate = useNavigate()
  const promo = sessionStorage.getItem('nova_promo') || ''
  const t = calcTotals(subtotal, promo)
  const [pay, setPay] = useState('card')
  const [f, setF] = useState({
    name: user?.name || '', email: user?.email || '', phone: '', address: '', city: '', zip: '',
    card: '', exp: '', cvc: '',
  })
  const [errors, setErrors] = useState({})

  if (!cartItems.length) return <Navigate to="/cart" replace />

  const set = (k) => (e) => setF({ ...f, [k]: e.target.value })

  const submit = (e) => {
    e.preventDefault()
    const er = {}
    if (f.name.trim().length < 2) er.name = 'Enter your full name'
    if (!/^\S+@\S+\.\S+$/.test(f.email)) er.email = 'Enter a valid email'
    if (f.phone.replace(/\D/g, '').length < 10) er.phone = 'Enter a valid phone number'
    if (f.address.trim().length < 5) er.address = 'Enter your address'
    if (!f.city.trim()) er.city = 'Enter your city'
    if (pay === 'card') {
      if (f.card.replace(/\s/g, '').length < 16) er.card = 'Enter a 16-digit card number'
      if (!/^\d{2}\/\d{2}$/.test(f.exp)) er.exp = 'MM/YY'
      if (f.cvc.length < 3) er.cvc = 'CVC'
    }
    setErrors(er)
    if (Object.keys(er).length) return
    const order = placeOrder({ name: f.name, email: f.email, phone: f.phone, address: `${f.address}, ${f.city} ${f.zip}`, payment: pay, total: t.total })
    sessionStorage.removeItem('nova_promo')
    navigate(`/order-success/${order.id}`)
  }

  return (
    <div className="container page">
      <div className="breadcrumb"><Link to="/cart">Cart</Link> / <b>Checkout</b></div>
      <h1>Checkout</h1>
      <form className="cart-layout" onSubmit={submit} noValidate>
        <div className="checkout-forms">
          <section className="card form-card">
            <h3>1. Contact & shipping</h3>
            <div className="form-grid">
              <Field f={f} set={set} errors={errors} k="name" label="Full name" placeholder="Rehmat Ullah" half />
              <Field f={f} set={set} errors={errors} k="email" label="Email" type="email" placeholder="you@email.com" half />
              <Field f={f} set={set} errors={errors} k="phone" label="Phone" placeholder="03XX XXXXXXX" />
              <Field f={f} set={set} errors={errors} k="address" label="Street address" placeholder="House #, street, area" />
              <Field f={f} set={set} errors={errors} k="city" label="City" placeholder="Lahore" half />
              <Field f={f} set={set} errors={errors} k="zip" label="Postal code" placeholder="54000" half />
            </div>
          </section>
          <section className="card form-card">
            <h3>2. Payment method</h3>
            <div className="pay-opts">
              {[['card', 'Credit / Debit card', 'card'], ['cod', 'Cash on delivery', 'cash']].map(([v, l, ic]) => (
                <label key={v} className={`pay ${pay === v ? 'on' : ''}`}><input type="radio" checked={pay === v} onChange={() => setPay(v)} /><Icon name={ic} size={20} />{l}</label>
              ))}
            </div>
            {pay === 'card' && (
              <div className="form-grid">
                <Field f={f} set={set} errors={errors} k="card" label="Card number" placeholder="1234 5678 9012 3456" />
                <Field f={f} set={set} errors={errors} k="exp" label="Expiry" placeholder="MM/YY" half />
                <Field f={f} set={set} errors={errors} k="cvc" label="CVC" placeholder="123" half />
                <small className="muted">Demo store — no real payment is processed.</small>
              </div>
            )}
          </section>
        </div>

        <aside className="summary card">
          <h3>Your order</h3>
          <ul className="mini-list">
            {cartItems.map((i) => (
              <li key={i.key}><span>{i.product.name} × {i.qty}</span><b>{formatPrice(i.product.price * i.qty)}</b></li>
            ))}
          </ul>
          <dl>
            <div><dt>Subtotal</dt><dd>{formatPrice(subtotal)}</dd></div>
            {t.discount > 0 && <div className="ok"><dt>Discount</dt><dd>−{formatPrice(t.discount)}</dd></div>}
            <div><dt>Shipping</dt><dd>{t.shipping ? formatPrice(t.shipping) : 'Free'}</dd></div>
            <div><dt>Tax</dt><dd>{formatPrice(t.tax)}</dd></div>
            <div className="total"><dt>Total</dt><dd>{formatPrice(t.total)}</dd></div>
          </dl>
          <button className="btn btn-primary btn-lg btn-block">Place order</button>
        </aside>
      </form>
    </div>
  )
}
