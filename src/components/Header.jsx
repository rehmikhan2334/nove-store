import { useState } from 'react'
import { Link, NavLink, useNavigate } from 'react-router-dom'
import { useStore } from '../context/StoreContext.jsx'
import { categories } from '../data/products.js'
import Icon from './Icons.jsx'

export default function Header() {
  const { cartCount, wishlist, user, logout, theme, toggleTheme } = useStore()
  const [open, setOpen] = useState(false)
  const [q, setQ] = useState('')
  const navigate = useNavigate()

  const submit = (e) => {
    e.preventDefault()
    navigate(`/search?q=${encodeURIComponent(q.trim())}`)
    setOpen(false)
  }

  return (
    <header className="site-header">
      <div className="topbar">
        <div className="container topbar-in">
          <span className="tb-item"><Icon name="truck" size={15} /> Free shipping on orders over $100</span>
          <span className="hide-sm">Use code <b>NOVA10</b> for 10% off your first order</span>
        </div>
      </div>
      <div className="container nav">
        <button className="icon-btn menu-btn" onClick={() => setOpen(!open)} aria-label="Menu"><Icon name={open ? 'close' : 'menu'} /></button>
        <Link to="/" className="logo" onClick={() => setOpen(false)}>
          <span className="logo-mark">N</span>NOVA
        </Link>

        <form className="search-box" onSubmit={submit}>
          <input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Search products, brands…" aria-label="Search" />
          <button type="submit" aria-label="Search"><Icon name="search" size={18} /></button>
        </form>

        <div className="nav-actions">
          <button className="icon-btn" onClick={toggleTheme} aria-label="Toggle theme" title="Toggle theme"><Icon name={theme === 'light' ? 'moon' : 'sun'} /></button>
          <Link to="/wishlist" className="icon-btn with-count" aria-label="Wishlist"><Icon name="heart" />{wishlist.length > 0 && <i>{wishlist.length}</i>}</Link>
          <Link to="/cart" className="icon-btn with-count" aria-label="Cart"><Icon name="cart" />{cartCount > 0 && <i>{cartCount}</i>}</Link>
          {user ? (
            <button className="btn btn-ghost btn-sm hide-sm" onClick={logout}>Hi, {user.name.split(' ')[0]} · Logout</button>
          ) : (
            <Link to="/login" className="btn btn-primary btn-sm">Sign in</Link>
          )}
        </div>
      </div>

      <nav className={`main-nav ${open ? 'open' : ''}`}>
        <div className="container main-nav-in">
          <NavLink to="/" end onClick={() => setOpen(false)}>Home</NavLink>
          <NavLink to="/shop" end onClick={() => setOpen(false)}>All Products</NavLink>
          {categories.map((c) => (
            <NavLink key={c.id} to={`/shop?category=${c.id}`} onClick={() => setOpen(false)}>{c.name}</NavLink>
          ))}
          <NavLink to="/about" onClick={() => setOpen(false)}>About</NavLink>
          <NavLink to="/contact" onClick={() => setOpen(false)}>Contact</NavLink>
        </div>
      </nav>
    </header>
  )
}
