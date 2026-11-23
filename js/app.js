/* App shell: router, header, footer and global click handling */
const Router = {
  routes: [
    [/^\/$/, pageHome], [/^\/shop$/, pageShop], [/^\/search$/, pageSearch], [/^\/product\/([^/]+)$/, pageProduct],
    [/^\/cart$/, pageCart], [/^\/checkout$/, pageCheckout], [/^\/order-success\/([^/]+)$/, pageOrderSuccess],
    [/^\/wishlist$/, pageWishlist], [/^\/login$/, pageAuth], [/^\/about$/, pageAbout], [/^\/contact$/, pageContact],
  ],
  cleanup: null, lastPath: null,
  parse(h = location.hash) { const [path, qs = ''] = (h.slice(1) || '/').split('?'); return { path, q: new URLSearchParams(qs) }; },
  setQuery(obj) {
    const { path, q } = this.parse();
    Object.entries(obj).forEach(([k, v]) => (v ? q.set(k, v) : q.delete(k)));
    const s = q.toString(); location.hash = path + (s ? '?' + s : '');
  },
  render() {
    if (this.cleanup) { this.cleanup(); this.cleanup = null; }
    const { path, q } = this.parse(), fresh = path !== this.lastPath;
    let page = null;
    for (const [re, fn] of this.routes) { const m = path.match(re); if (m) { page = fn(m.slice(1), q, fresh); break; } }
    if (!page) page = pageNotFound();
    $('#view').innerHTML = page.html;
    if (fresh) window.scrollTo(0, 0);
    this.lastPath = path;
    if (page.mount) this.cleanup = page.mount() || null;
    closeMenu(); updateHeader();
  },
};

const closeMenu = () => { const n = $('.main-nav'); if (n) { n.classList.remove('open'); $('#menu-btn').innerHTML = icon('menu'); } };

function buildHeader() {
  $('#header').innerHTML = `<div class="topbar"><div class="container topbar-in"><span class="tb-item">${icon('truck', 15)} Free shipping on orders over $100</span><span class="hide-sm">Use code <b>NOVA10</b> for 10% off your first order</span></div></div>
    <div class="container nav"><button class="icon-btn menu-btn" id="menu-btn" data-action="menu" aria-label="Menu">${icon('menu')}</button>
      <a href="#/" class="logo"><span class="logo-mark">N</span>NOVA</a>
      <form class="search-box" id="hdr-search"><input placeholder="Search products, brands…" aria-label="Search"><button type="submit" aria-label="Search">${icon('search', 18)}</button></form>
      <div class="nav-actions"><button class="icon-btn" id="hdr-theme" data-action="theme" aria-label="Toggle theme" title="Toggle theme"></button>
        <a href="#/wishlist" class="icon-btn with-count" id="hdr-wish" aria-label="Wishlist"></a><a href="#/cart" class="icon-btn with-count" id="hdr-cart" aria-label="Cart"></a><span id="hdr-auth"></span></div></div>
    <nav class="main-nav"><div class="container main-nav-in"><a href="#/">Home</a><a href="#/shop">All Products</a>${categories.map((c) => `<a href="#/shop?category=${c.id}">${c.name}</a>`).join('')}<a href="#/about">About</a><a href="#/contact">Contact</a></div></nav>`;
  $('#hdr-search').onsubmit = (e) => { e.preventDefault(); location.hash = '#/search?q=' + encodeURIComponent(e.target.querySelector('input').value.trim()); closeMenu(); };
}

function updateHeader() {
  const badge = (n) => (n > 0 ? `<i>${n}</i>` : '');
  $('#hdr-theme').innerHTML = icon(Store.theme === 'light' ? 'moon' : 'sun');
  $('#hdr-wish').innerHTML = icon('heart') + badge(Store.wishlist.length);
  $('#hdr-cart').innerHTML = icon('cart') + badge(Store.cartCount());
  $('#hdr-auth').innerHTML = Store.user
    ? `<button class="btn btn-ghost btn-sm hide-sm" data-action="logout">Hi, ${esc(Store.user.name.split(' ')[0])} · Logout</button>`
    : '<a href="#/login" class="btn btn-primary btn-sm">Sign in</a>';
  const { path, q } = Router.parse();
  $$('.main-nav a').forEach((a) => {
    const l = Router.parse(a.getAttribute('href'));
    const on = l.path === path && (path !== '/shop' || (l.q.get('category') || '') === (q.get('category') || ''));
    a.classList.toggle('active', on);
  });
}

function buildFooter() {
  $('#footer').innerHTML = `<footer class="site-footer"><div class="container">
    <div class="perks"><div><span>${icon('truck', 22)}</span><b>Free Delivery</b><small>On orders over $100</small></div><div><span>${icon('refresh', 22)}</span><b>30-Day Returns</b><small>Hassle-free refunds</small></div>
      <div><span>${icon('lock', 22)}</span><b>Secure Payment</b><small>256-bit encryption</small></div><div><span>${icon('chat', 22)}</span><b>24/7 Support</b><small>We're here to help</small></div></div>
    <div class="footer-grid"><div><a href="#/" class="logo light"><span class="logo-mark">N</span>NOVA</a>
        <p class="muted-light">Modern essentials for tech, fashion and home — designed to make everyday life better.</p>
        <form class="newsletter" id="newsletter"><input type="email" required placeholder="Your email address"><button class="btn btn-primary">Subscribe</button></form></div>
      <div><h4>Shop</h4>${categories.map((c) => `<a href="#/shop?category=${c.id}">${c.name}</a>`).join('')}<a href="#/shop">All Products</a></div>
      <div><h4>Company</h4><a href="#/about">About Us</a><a href="#/contact">Contact</a><a href="#/wishlist">Wishlist</a><a href="#/cart">Cart</a></div>
      <div><h4>Contact</h4><p class="muted-light ci">${icon('pin', 16)} Lahore, Pakistan</p><p class="muted-light ci">${icon('mail', 16)} support@novastore.com</p><p class="muted-light ci">${icon('phone', 16)} +92 300 0000000</p></div></div>
    <div class="footer-bottom"><span>© ${new Date().getFullYear()} NOVA Store. All rights reserved.</span><span>Visa · Mastercard · PayPal · Cash on Delivery</span></div></div></footer>`;
  $('#newsletter').onsubmit = (e) => { e.preventDefault(); Store.toast('Thanks for subscribing!'); e.target.reset(); };
}

/* Global click actions (data-action="...") */
const Actions = {
  menu() { const n = $('.main-nav'); const open = n.classList.toggle('open'); $('#menu-btn').innerHTML = icon(open ? 'close' : 'menu'); },
  theme() { Store.toggleTheme(); },
  logout() { Store.logout(); },
  add(el) { Store.addToCart(products.find((p) => p.id === +el.dataset.id)); },
  wish(el) {
    const id = +el.dataset.id, liked = Store.toggleWishlist(products.find((p) => p.id === id));
    $$(`[data-action=wish][data-id="${id}"]`).forEach((b) => { b.classList.toggle('active', liked); const s = $('svg', b); if (s) s.setAttribute('fill', liked ? 'currentColor' : 'none'); });
    if (Router.lastPath === '/wishlist') Router.render();
  },
  'cart-qty'(el) { const i = Store.cart.find((x) => x.key === el.dataset.key); if (i) { Store.updateQty(i.key, i.qty + +el.dataset.d); Router.render(); } },
  'cart-remove'(el) { Store.removeFromCart(el.dataset.key); Router.render(); },
  'cart-clear'() { Store.clearCart(); Router.render(); },
  'shop-filters'() { shopState.open = $('.filters').classList.toggle('open'); },
  'shop-reset'() { Object.assign(shopState, { maxPrice: 1000, minRating: 0, brands: [] }); history.replaceState(null, '', '#/shop'); Router.render(); },
};
document.addEventListener('click', (e) => {
  if (e.target.closest('.main-nav a, .logo')) closeMenu();
  const el = e.target.closest('[data-action]');
  if (el && Actions[el.dataset.action]) { e.preventDefault(); Actions[el.dataset.action](el); }
});

Store.on(updateHeader);
window.addEventListener('hashchange', () => Router.render());
buildHeader(); buildFooter(); Router.render();
