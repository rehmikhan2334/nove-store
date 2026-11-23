import { useState } from 'react'
import { Link } from 'react-router-dom'
import { categories } from '../data/products.js'
import { useStore } from '../context/StoreContext.jsx'
import Icon from './Icons.jsx'

export default function Footer() {
  const [email, setEmail] = useState('')
  const { toast } = useStore()
  const subscribe = (e) => {
    e.preventDefault()
    toast('Thanks for subscribing!')
    setEmail('')
  }
  return (
    <footer className="site-footer">
      <div className="container">
        <div className="perks">
          <div><span><Icon name="truck" size={22} /></span><b>Free Delivery</b><small>On orders over $100</small></div>
          <div><span><Icon name="refresh" size={22} /></span><b>30-Day Returns</b><small>Hassle-free refunds</small></div>
          <div><span><Icon name="lock" size={22} /></span><b>Secure Payment</b><small>256-bit encryption</small></div>
          <div><span><Icon name="chat" size={22} /></span><b>24/7 Support</b><small>We're here to help</small></div>
        </div>

        <div className="footer-grid">
          <div>
            <Link to="/" className="logo light"><span className="logo-mark">N</span>NOVA</Link>
            <p className="muted-light">Modern essentials for tech, fashion and home — designed to make everyday life better.</p>
            <form className="newsletter" onSubmit={subscribe}>
              <input type="email" required value={email} onChange={(e) => setEmail(e.target.value)} placeholder="Your email address" />
              <button className="btn btn-primary">Subscribe</button>
            </form>
          </div>
          <div>
            <h4>Shop</h4>
            {categories.map((c) => <Link key={c.id} to={`/shop?category=${c.id}`}>{c.name}</Link>)}
            <Link to="/shop">All Products</Link>
          </div>
          <div>
            <h4>Company</h4>
            <Link to="/about">About Us</Link>
            <Link to="/contact">Contact</Link>
            <Link to="/wishlist">Wishlist</Link>
            <Link to="/cart">Cart</Link>
          </div>
          <div>
            <h4>Contact</h4>
            <p className="muted-light ci"><Icon name="pin" size={16} /> Lahore, Pakistan</p>
            <p className="muted-light ci"><Icon name="mail" size={16} /> support@novastore.com</p>
            <p className="muted-light ci"><Icon name="phone" size={16} /> +92 300 0000000</p>
          </div>
        </div>

        <div className="footer-bottom">
          <span>© {new Date().getFullYear()} NOVA Store. All rights reserved.</span>
          <span>Visa · Mastercard · PayPal · Cash on Delivery</span>
        </div>
      </div>
    </footer>
  )
}
