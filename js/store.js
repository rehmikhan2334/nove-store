/* Store: cart, wishlist, user, orders, theme, reviews (all saved in localStorage) */
const load = (k, fb) => { try { const r = localStorage.getItem(k); return r ? JSON.parse(r) : fb; } catch { return fb; } };
const save = (k, v) => { try { localStorage.setItem(k, JSON.stringify(v)); } catch {} };

const Store = {
  cart: load('nova_cart', []),
  wishlist: load('nova_wishlist', []),
  user: load('nova_user', null),
  orders: load('nova_orders', []),
  userReviews: load('nova_reviews', []),
  theme: load('nova_theme', window.matchMedia && matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light'),
  listeners: [],
  on(fn) { this.listeners.push(fn); },
  emit() { this.listeners.forEach((f) => f()); },

  toast(message, type = 'success') {
    const box = document.getElementById('toasts');
    const el = document.createElement('div');
    el.className = 'toast ' + type;
    el.innerHTML = icon(type === 'success' ? 'check' : 'tag', 16, { strokeWidth: 3 }) + ' ' + esc(message);
    box.appendChild(el);
    setTimeout(() => el.remove(), 2800);
  },

  setTheme(t) { this.theme = t; save('nova_theme', t); document.documentElement.setAttribute('data-theme', t); this.emit(); },
  toggleTheme() { this.setTheme(this.theme === 'light' ? 'dark' : 'light'); },

  addToCart(product, qty = 1, color = null) {
    const key = product.id + '-' + (color || '');
    const found = this.cart.find((i) => i.key === key);
    if (found) found.qty = Math.min(found.qty + qty, product.stock);
    else this.cart.push({ key, id: product.id, qty, color });
    save('nova_cart', this.cart); this.emit();
    this.toast(product.name + ' added to cart');
  },
  updateQty(key, qty) {
    const i = this.cart.find((x) => x.key === key); if (!i) return;
    const p = products.find((x) => x.id === i.id);
    i.qty = Math.max(1, Math.min(qty, p ? p.stock : 99));
    save('nova_cart', this.cart); this.emit();
  },
  removeFromCart(key) { this.cart = this.cart.filter((i) => i.key !== key); save('nova_cart', this.cart); this.emit(); },
  clearCart() { this.cart = []; save('nova_cart', this.cart); this.emit(); },

  toggleWishlist(product) {
    const has = this.wishlist.includes(product.id);
    this.wishlist = has ? this.wishlist.filter((id) => id !== product.id) : [...this.wishlist, product.id];
    save('nova_wishlist', this.wishlist); this.emit();
    this.toast(has ? 'Removed from wishlist' : 'Saved to wishlist', has ? 'info' : 'success');
    return !has;
  },

  cartItems() { return this.cart.map((i) => ({ ...i, product: products.find((p) => p.id === i.id) })).filter((i) => i.product); },
  cartCount() { return this.cartItems().reduce((s, i) => s + i.qty, 0); },
  subtotal() { return this.cartItems().reduce((s, i) => s + i.qty * i.product.price, 0); },

  reviews() { return [...this.userReviews, ...seedReviews]; },
  addReview(r) {
    this.userReviews.unshift({ ...r, id: 'u' + Date.now(), date: new Date().toISOString().slice(0, 10), verified: false });
    save('nova_reviews', this.userReviews); this.toast('Thanks! Your review was posted');
  },

  login(u) { this.user = u; save('nova_user', u); this.emit(); this.toast('Welcome, ' + u.name + '!'); },
  logout() { this.user = null; save('nova_user', null); this.emit(); this.toast('Signed out', 'info'); },

  placeOrder(details) {
    const items = this.cartItems();
    const order = {
      id: 'NV' + Math.floor(100000 + Math.random() * 900000), date: new Date().toISOString(),
      items: items.map((i) => ({ id: i.id, name: i.product.name, qty: i.qty, price: i.product.price })),
      total: details.total, details,
    };
    this.orders.unshift(order); this.cart = [];
    save('nova_orders', this.orders); save('nova_cart', this.cart); this.emit();
    return order;
  },
};
document.documentElement.setAttribute('data-theme', Store.theme);
