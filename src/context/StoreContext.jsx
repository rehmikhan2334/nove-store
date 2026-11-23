import { createContext, useContext, useEffect, useMemo, useState, useCallback } from 'react'
import { products } from '../data/products.js'

const StoreContext = createContext(null)

const load = (key, fallback) => {
  try {
    const raw = localStorage.getItem(key)
    return raw ? JSON.parse(raw) : fallback
  } catch {
    return fallback
  }
}

export function StoreProvider({ children }) {
  const [cart, setCart] = useState(() => load('nova_cart', []))
  const [wishlist, setWishlist] = useState(() => load('nova_wishlist', []))
  const [user, setUser] = useState(() => load('nova_user', null))
  const [orders, setOrders] = useState(() => load('nova_orders', []))
  const [theme, setTheme] = useState(() => load('nova_theme', 'light'))
  const [toasts, setToasts] = useState([])

  useEffect(() => localStorage.setItem('nova_cart', JSON.stringify(cart)), [cart])
  useEffect(() => localStorage.setItem('nova_wishlist', JSON.stringify(wishlist)), [wishlist])
  useEffect(() => localStorage.setItem('nova_user', JSON.stringify(user)), [user])
  useEffect(() => localStorage.setItem('nova_orders', JSON.stringify(orders)), [orders])
  useEffect(() => {
    localStorage.setItem('nova_theme', JSON.stringify(theme))
    document.documentElement.setAttribute('data-theme', theme)
  }, [theme])

  const toast = useCallback((message, type = 'success') => {
    const id = Date.now() + Math.random()
    setToasts((t) => [...t, { id, message, type }])
    setTimeout(() => setToasts((t) => t.filter((x) => x.id !== id)), 2800)
  }, [])

  const addToCart = useCallback((product, qty = 1, color = null) => {
    setCart((c) => {
      const key = `${product.id}-${color || ''}`
      const found = c.find((i) => i.key === key)
      if (found) return c.map((i) => (i.key === key ? { ...i, qty: Math.min(i.qty + qty, product.stock) } : i))
      return [...c, { key, id: product.id, qty, color }]
    })
    toast(`${product.name} added to cart`)
  }, [toast])

  const updateQty = (key, qty) =>
    setCart((c) =>
      c.map((i) => {
        if (i.key !== key) return i
        const p = products.find((x) => x.id === i.id)
        return { ...i, qty: Math.max(1, Math.min(qty, p?.stock ?? 99)) }
      })
    )
  const removeFromCart = (key) => setCart((c) => c.filter((i) => i.key !== key))
  const clearCart = () => setCart([])

  const toggleWishlist = useCallback((product) => {
    setWishlist((w) => {
      const has = w.includes(product.id)
      toast(has ? 'Removed from wishlist' : 'Saved to wishlist', has ? 'info' : 'success')
      return has ? w.filter((id) => id !== product.id) : [...w, product.id]
    })
  }, [toast])

  const cartItems = useMemo(
    () => cart.map((i) => ({ ...i, product: products.find((p) => p.id === i.id) })).filter((i) => i.product),
    [cart]
  )
  const cartCount = cartItems.reduce((s, i) => s + i.qty, 0)
  const subtotal = cartItems.reduce((s, i) => s + i.qty * i.product.price, 0)

  const login = (u) => { setUser(u); toast(`Welcome, ${u.name}!`) }
  const logout = () => { setUser(null); toast('Signed out', 'info') }
  const placeOrder = (details) => {
    const order = {
      id: 'NV' + Math.floor(100000 + Math.random() * 900000),
      date: new Date().toISOString(),
      items: cartItems.map((i) => ({ id: i.id, name: i.product.name, qty: i.qty, price: i.product.price })),
      total: details.total,
      details,
    }
    setOrders((o) => [order, ...o])
    setCart([])
    return order
  }

  const value = {
    cart, cartItems, cartCount, subtotal, addToCart, updateQty, removeFromCart, clearCart,
    wishlist, toggleWishlist, user, login, logout, orders, placeOrder,
    theme, toggleTheme: () => setTheme((t) => (t === 'light' ? 'dark' : 'light')),
    toasts, toast,
  }
  return <StoreContext.Provider value={value}>{children}</StoreContext.Provider>
}

export const useStore = () => useContext(StoreContext)
