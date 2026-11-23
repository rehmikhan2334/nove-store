/* Pages: each returns { html, mount? }. mount() may return a cleanup function. */
const $ = (s, r = document) => r.querySelector(s);
const $$ = (s, r = document) => [...r.querySelectorAll(s)];
const FREE_SHIP = 100;
const calcTotals = (subtotal, promo) => {
  const discount = promo === 'NOVA10' ? subtotal * 0.1 : 0;
  const shipping = subtotal - discount >= FREE_SHIP || subtotal === 0 ? 0 : 9;
  const tax = (subtotal - discount) * 0.05;
  return { discount, shipping, tax, total: subtotal - discount + shipping + tax };
};
const getPromo = () => { try { return sessionStorage.getItem('nova_promo') || ''; } catch { return ''; } };
const crumb = (x) => `<div class="breadcrumb">${x}</div>`;

/* ---------- Home ---------- */
const heroSlides = [
  { tag: 'Electronics · up to 25% off', title: 'Sound that moves you', text: 'Studio-grade headphones, smart watches and speakers built for everyday life.', cta: 'Shop electronics', to: '#/shop?category=electronics', cls: 'sl-indigo', art: HeadphonesArt },
  { tag: 'Fashion · new season', title: 'Step into the season', text: 'Lightweight sneakers and wardrobe staples designed to go anywhere you do.', cta: 'Shop fashion', to: '#/shop?category=fashion', cls: 'sl-sunset', art: SneakerArt },
  { tag: 'Home & Living · from $29', title: 'Make home feel better', text: 'Warm lighting, cosy textiles and decor pieces that turn a room into a retreat.', cta: 'Shop home', to: '#/shop?category=home', cls: 'sl-teal', art: LampArt },
];

function heroHTML() {
  return `<section class="hero-slider" aria-roledescription="carousel" aria-label="Featured collections">
    ${heroSlides.map((s, n) => `<div class="hs-slide ${s.cls} ${n === 0 ? 'on' : ''}" aria-hidden="${n !== 0}" role="group" aria-label="${n + 1} of ${heroSlides.length}">
      <div class="container hs-in"><div class="hs-copy">
        <span class="hs-tag">${s.tag}</span><h1>${s.title}</h1><p>${s.text}</p>
        <div class="hero-cta">
          <a href="${s.to}" class="btn btn-light btn-lg">${s.cta} ${icon('arrowRight', 18)}</a>
          <a href="#/shop?sort=discount" class="btn btn-glass btn-lg">View deals</a>
        </div>
        <div class="hs-perks"><span>${icon('truck', 16)} Free delivery</span><span>${icon('refresh', 16)} 30-day returns</span><span>${icon('shield', 16)} 1-year warranty</span></div>
      </div><div class="hs-art">${s.art()}</div></div></div>`).join('')}
    <button class="hs-arrow prev" aria-label="Previous slide">${icon('arrowLeft')}</button>
    <button class="hs-arrow next" aria-label="Next slide">${icon('arrowRight')}</button>
    <div class="hs-dots" role="tablist">${heroSlides.map((s, n) => `<button role="tab" aria-selected="${n === 0}" aria-label="Slide ${n + 1}" class="${n === 0 ? 'on' : ''}"></button>`).join('')}</div>
  </section>`;
}

function mountHero() {
  const root = $('.hero-slider'); let i = 0, paused = false, startX = null;
  const slides = $$('.hs-slide', root), dots = $$('.hs-dots button', root);
  const go = (n) => {
    i = (n + slides.length) % slides.length;
    slides.forEach((s, k) => { s.classList.toggle('on', k === i); s.setAttribute('aria-hidden', k !== i); $$('a', s).forEach((a) => (a.tabIndex = k === i ? 0 : -1)); });
    dots.forEach((d, k) => { d.classList.toggle('on', k === i); d.setAttribute('aria-selected', k === i); });
  };
  go(0);
  $('.prev', root).onclick = () => go(i - 1);
  $('.next', root).onclick = () => go(i + 1);
  dots.forEach((d, k) => (d.onclick = () => go(k)));
  root.onmouseenter = root.onfocusin = () => (paused = true);
  root.onmouseleave = root.onfocusout = () => (paused = false);
  root.onpointerdown = (e) => (startX = e.clientX);
  root.onpointerup = (e) => { if (startX == null) return; const dx = e.clientX - startX; startX = null; if (Math.abs(dx) > 50) go(i + (dx < 0 ? 1 : -1)); };
  root.onkeydown = (e) => { if (e.key === 'ArrowRight') go(i + 1); if (e.key === 'ArrowLeft') go(i - 1); };
  const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;
  const t = setInterval(() => { if (!paused && !reduce) go(i + 1); }, 6000);
  return () => clearInterval(t);
}

function reviewsSliderHTML() {
  const rv = Store.reviews();
  const avg = rv.reduce((s, r) => s + r.rating, 0) / rv.length;
  const dist = [5, 4, 3, 2, 1].map((n) => ({ n, c: rv.filter((r) => r.rating === n).length }));
  return `<section class="section container reviews" aria-label="Customer reviews">
    <div class="section-head"><div><span class="eyebrow">Customer reviews</span><h2>Loved by thousands of shoppers</h2></div>
      <div class="rv-arrows"><button class="icon-btn ring" data-rv="-1" aria-label="Previous reviews">${icon('arrowLeft')}</button><button class="icon-btn ring" data-rv="1" aria-label="Next reviews">${icon('arrowRight')}</button></div></div>
    <div class="rv-layout">
      <aside class="card rv-summary"><div class="rv-score">${avg.toFixed(1)}</div>${stars(avg, 20)}
        <p class="muted">Based on ${rv.length * 140 + 18} verified reviews</p>
        <ul class="rv-bars">${dist.map((d) => `<li><span>${d.n}</span>${icon('star', 12, { fill: true })}<i><b style="width:${(d.c / rv.length) * 100}%"></b></i><em>${Math.round((d.c / rv.length) * 100)}%</em></li>`).join('')}</ul>
        <a href="#/shop" class="btn btn-primary btn-block">Shop &amp; write a review</a></aside>
      <div class="rv-track" tabindex="0">${rv.map((r) => {
        const prod = products.find((p) => p.id === r.productId);
        return `<figure class="card rv-card"><svg class="rv-quote" width="34" height="34" viewBox="0 0 24 24" aria-hidden="true"><path d="M3 21c0-5 1-9 5-12l2 2c-2 2-3 4-3 6h4v6H3zm11 0c0-5 1-9 5-12l2 2c-2 2-3 4-3 6h4v6h-8z" /></svg>
          ${stars(r.rating, 16)}<h4>${esc(r.title)}</h4><blockquote>${esc(r.text)}</blockquote>
          <figcaption><span class="avatar">${esc(r.name[0])}</span><div><b>${esc(r.name)}</b><small class="muted">${esc(r.city || 'Pakistan')}${r.verified ? ` · <span class="verified">${icon('check', 12, { strokeWidth: 3 })} Verified buyer</span>` : ''}</small></div></figcaption>
          ${prod ? `<a href="#/product/${prod.slug}" class="rv-prod">Reviewed: ${esc(prod.name)}</a>` : ''}</figure>`;
      }).join('')}</div></div>
    <div class="rv-dots" aria-hidden="true">${rv.map((r, n) => `<i class="${n === 0 ? 'on' : ''}"></i>`).join('')}</div></section>`;
}

function mountReviewsSlider() {
  const el = $('.rv-track'); if (!el) return;
  let paused = false;
  const step = () => (el.firstElementChild ? el.firstElementChild.offsetWidth : 320) + 18;
  $$('[data-rv]').forEach((b) => (b.onclick = () => el.scrollBy({ left: +b.dataset.rv * step(), behavior: 'smooth' })));
  el.onmouseenter = () => (paused = true); el.onmouseleave = () => (paused = false);
  el.onscroll = () => { const a = Math.round(el.scrollLeft / step()); $$('.rv-dots i').forEach((d, n) => d.classList.toggle('on', n === a)); };
  const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;
  const t = setInterval(() => {
    if (paused || reduce) return;
    if (el.scrollLeft + el.clientWidth >= el.scrollWidth - 8) el.scrollTo({ left: 0, behavior: 'smooth' });
    else el.scrollBy({ left: step(), behavior: 'smooth' });
  }, 5500);
  return () => clearInterval(t);
}

function pageHome() {
  const featured = products.filter((p) => ['Best Seller', 'Top Rated', 'New'].includes(p.badge)).slice(0, 4);
  const deals = products.filter((p) => p.oldPrice).sort((a, b) => (1 - b.price / b.oldPrice) - (1 - a.price / a.oldPrice)).slice(0, 4);
  const html = heroHTML() + `
    <section class="container"><div class="stat-strip card">
      <div><b>50k+</b><span>Happy customers</span></div><div><b>4.8</b><span>Average rating</span></div><div><b>500+</b><span>Products</span></div><div><b>24h</b><span>Fast dispatch</span></div></div></section>
    <section class="section container"><div class="section-head"><h2>Shop by category</h2><a href="#/shop">View all</a></div>
      <div class="cat-grid">${categories.map((c) => `<a href="#/shop?category=${c.id}" class="cat-card"><span class="cat-icon">${icon(c.icon, 28)}</span><h3>${c.name}</h3><p>${c.blurb}</p><em>Explore ${icon('arrowRight', 15)}</em></a>`).join('')}</div></section>
    <section class="section container"><div class="section-head"><h2>Featured products</h2><a href="#/shop">See more</a></div>${grid(featured)}</section>
    <section class="container"><div class="promo"><div><span class="pill pill-light">Limited time</span><h2>Get 10% off your first order</h2>
      <p>Use code <b>NOVA10</b> at checkout and enjoy free shipping on orders over $100.</p></div><a href="#/shop" class="btn btn-light btn-lg">Start shopping</a></div></section>
    <section class="section container"><div class="section-head"><h2>Hot deals</h2><a href="#/shop?sort=discount">All deals</a></div>${grid(deals)}</section>` + reviewsSliderHTML();
  return { html, mount: () => { const a = mountHero(), b = mountReviewsSlider(); return () => { a(); b && b(); }; } };
}

/* ---------- Shop ---------- */
const shopState = { maxPrice: 1000, minRating: 0, brands: [], open: false };
const allBrands = [...new Set(products.map((p) => p.brand))].sort();

function shopList(category, sort) {
  let r = products.filter((p) => (category === 'all' || p.category === category) && p.price <= shopState.maxPrice && p.rating >= shopState.minRating && (!shopState.brands.length || shopState.brands.includes(p.brand)));
  const d = (p) => (p.oldPrice ? 1 - p.price / p.oldPrice : 0);
  const sorters = { 'price-asc': (a, b) => a.price - b.price, 'price-desc': (a, b) => b.price - a.price, rating: (a, b) => b.rating - a.rating, discount: (a, b) => d(b) - d(a), popular: (a, b) => b.reviews - a.reviews };
  return sorters[sort] ? [...r].sort(sorters[sort]) : r;
}
const shopResults = (list) => list.length ? grid(list, 'grid-3')
  : `<div class="empty card"><span class="empty-ic">${icon('search', 44)}</span><h3>No products match your filters</h3><button class="btn btn-primary" data-action="shop-reset">Clear filters</button></div>`;

function pageShop(_, q, fresh) {
  if (fresh) Object.assign(shopState, { maxPrice: 1000, minRating: 0, brands: [], open: false });
  const category = q.get('category') || 'all', sort = q.get('sort') || 'featured';
  const list = shopList(category, sort);
  const title = category === 'all' ? 'All Products' : (categories.find((c) => c.id === category) || {}).name;
  const sortOpts = [['featured', 'Featured'], ['popular', 'Most popular'], ['price-asc', 'Price: Low → High'], ['price-desc', 'Price: High → Low'], ['rating', 'Top rated'], ['discount', 'Biggest discount']];
  const html = `<div class="container page">${crumb(`Home / <b>${title}</b>`)}
    <div class="page-head"><div><h1>${title}</h1><p class="muted"><span id="shop-count">${list.length}</span> products</p></div>
      <div class="toolbar"><button class="btn btn-outline btn-sm filter-toggle" data-action="shop-filters">${icon('filter', 16)} Filters</button>
        <select id="shop-sort" aria-label="Sort">${sortOpts.map(([v, l]) => `<option value="${v}" ${sort === v ? 'selected' : ''}>${l}</option>`).join('')}</select></div></div>
    <div class="shop-layout"><aside class="filters card ${shopState.open ? 'open' : ''}">
      <div class="filter-group"><h4>Category</h4>${[{ id: 'all', name: 'All' }, ...categories].map((c) => `<label class="radio"><input type="radio" name="cat" value="${c.id}" ${category === c.id ? 'checked' : ''}>${c.name}</label>`).join('')}</div>
      <div class="filter-group"><h4>Max price: <b>$<span id="shop-price">${shopState.maxPrice}</span></b></h4><input type="range" id="shop-range" min="20" max="1000" step="10" value="${shopState.maxPrice}"></div>
      <div class="filter-group"><h4>Minimum rating</h4>${[0, 4, 4.5].map((r) => `<label class="radio"><input type="radio" name="rate" value="${r}" ${shopState.minRating === r ? 'checked' : ''}>${r === 0 ? 'Any' : r + '★ &amp; up'}</label>`).join('')}</div>
      <div class="filter-group"><h4>Brand</h4>${allBrands.map((b) => `<label class="radio"><input type="checkbox" name="brand" value="${b}" ${shopState.brands.includes(b) ? 'checked' : ''}>${b}</label>`).join('')}</div>
      <button class="btn btn-ghost btn-block" data-action="shop-reset">Reset filters</button></aside>
    <section id="shop-results">${shopResults(list)}</section></div></div>`;
  const refresh = () => { const l = shopList(category, sort); $('#shop-results').innerHTML = shopResults(l); $('#shop-count').textContent = l.length; };
  return { html, mount() {
    $('#shop-sort').onchange = (e) => Router.setQuery({ sort: e.target.value === 'featured' ? '' : e.target.value });
    $$('input[name=cat]').forEach((i) => (i.onchange = () => Router.setQuery({ category: i.value === 'all' ? '' : i.value })));
    $('#shop-range').oninput = (e) => { shopState.maxPrice = +e.target.value; $('#shop-price').textContent = shopState.maxPrice; refresh(); };
    $$('input[name=rate]').forEach((i) => (i.onchange = () => { shopState.minRating = +i.value; refresh(); }));
    $$('input[name=brand]').forEach((i) => (i.onchange = () => { shopState.brands = $$('input[name=brand]:checked').map((x) => x.value); refresh(); }));
  } };
}

/* ---------- Search ---------- */
const searchState = { q: '', cat: 'all' };
function searchResults() {
  const t = searchState.q.trim().toLowerCase();
  const r = products.filter((p) => (searchState.cat === 'all' || p.category === searchState.cat) && (!t || [p.name, p.brand, p.category, p.description].join(' ').toLowerCase().includes(t)));
  return `<p class="muted results-count">${r.length} result${r.length !== 1 ? 's' : ''}${searchState.q ? ` for “<b>${esc(searchState.q)}</b>”` : ''}</p>` +
    (r.length ? grid(r) : `<div class="empty card"><span class="empty-ic">${icon('search2', 44)}</span><h3>Nothing found</h3><p class="muted">Try a different keyword or browse all products.</p><a href="#/shop" class="btn btn-primary">Browse shop</a></div>`);
}
function pageSearch(_, q) {
  searchState.q = q.get('q') || ''; searchState.cat = 'all';
  const chips = () => `<button class="chip ${searchState.cat === 'all' ? 'on' : ''}" data-cat="all">All</button>` + categories.map((c) => `<button class="chip ${searchState.cat === c.id ? 'on' : ''}" data-cat="${c.id}">${icon(c.icon, 15)} ${c.name}</button>`).join('');
  const html = `<div class="container page">${crumb('Home / <b>Search</b>')}
    <div class="search-hero card"><h1>Search products</h1>
      <div class="search-big">${icon('search', 22)}<input id="s-input" autofocus value="${esc(searchState.q)}" placeholder="Search by name, brand or category…"><button class="icon-btn" id="s-clear" aria-label="Clear" style="${searchState.q ? '' : 'display:none'}">${icon('close', 18)}</button></div>
      <div class="chips" id="s-chips">${chips()}</div>
      <div class="chips" id="s-pop" style="${searchState.q ? 'display:none' : ''}"><span class="muted">Popular:</span>${['Headphones', 'Watch', 'Sneakers', 'Backpack', 'Lamp'].map((s) => `<button class="chip" data-pop="${s}">${s}</button>`).join('')}</div></div>
    <div id="s-results">${searchResults()}</div></div>`;
  return { html, mount() {
    const input = $('#s-input');
    const update = (v) => {
      searchState.q = v; input.value = v;
      history.replaceState(null, '', v ? '#/search?q=' + encodeURIComponent(v) : '#/search');
      $('#s-clear').style.display = v ? '' : 'none'; $('#s-pop').style.display = v ? 'none' : '';
      $('#s-results').innerHTML = searchResults();
    };
    input.oninput = () => update(input.value);
    $('#s-clear').onclick = () => update('');
    $('#s-chips').onclick = (e) => { const b = e.target.closest('[data-cat]'); if (!b) return; searchState.cat = b.dataset.cat; $('#s-chips').innerHTML = chips(); $('#s-results').innerHTML = searchResults(); };
    $('#s-pop').onclick = (e) => { const b = e.target.closest('[data-pop]'); if (b) update(b.dataset.pop); };
    input.focus();
  } };
}

/* ---------- Product detail ---------- */
function pageProduct([slug]) {
  const p = getProduct(slug); if (!p) return pageNotFound();
  const cat = getCategory(p.category), discount = p.oldPrice ? Math.round((1 - p.price / p.oldPrice) * 100) : 0;
  const related = products.filter((x) => x.category === p.category && x.id !== p.id).slice(0, 4);
  const low = p.stock <= 10, st = { qty: 1, color: (p.colors || [])[0] || null, tab: 'description', rating: 5 };
  const liked = Store.wishlist.includes(p.id);
  const html = `<div class="container page">${crumb(`<a href="#/">Home</a> / <a href="#/shop">Shop</a> / <a href="#/shop?category=${p.category}">${cat.name}</a> / <b>${esc(p.name)}</b>`)}
    <div class="detail"><div class="detail-media card">${safeImage(p.image, p.name, cat.icon)}${p.badge ? `<span class="badge">${p.badge}</span>` : ''}</div>
      <div class="detail-info"><span class="pc-cat">${p.brand} · ${cat.name}</span><h1>${esc(p.name)}</h1>${rating(p.rating, p.reviews)}
        <div class="price price-lg"><strong>${formatPrice(p.price)}</strong>${p.oldPrice ? `<s>${formatPrice(p.oldPrice)}</s><span class="save">Save ${discount}%</span>` : ''}</div>
        <p class="lead">${esc(p.description)}</p>
        ${p.colors.length ? `<div class="opt"><h4>Color</h4><div class="swatches">${p.colors.map((c, n) => `<button class="swatch ${n === 0 ? 'on' : ''}" data-color="${c}" style="background:${c}" aria-label="Color ${c}"></button>`).join('')}</div></div>` : ''}
        <div class="opt"><h4>Quantity</h4><div class="qty"><button data-q="-1" aria-label="Decrease">−</button><span id="pd-qty">1</span><button data-q="1" aria-label="Increase">+</button></div>
          <span class="stock ${low ? 'low' : ''}">${low ? `Only ${p.stock} left!` : 'In stock'}</span></div>
        <div class="detail-cta"><button class="btn btn-primary btn-lg" id="pd-add">${icon('cart', 18)} Add to cart</button><button class="btn btn-dark btn-lg" id="pd-buy">Buy now</button>
          <button class="icon-btn big ${liked ? 'active' : ''}" data-action="wish" data-id="${p.id}" aria-label="Wishlist">${icon('heart', 24, { fill: liked })}</button></div>
        <ul class="trust"><li>${icon('truck', 18)} Free delivery over $100</li><li>${icon('refresh', 18)} 30-day easy returns</li><li>${icon('shield', 18)} 1-year warranty</li></ul></div></div>
    <div class="card tabs"><div class="tab-head">${['description', 'features', 'reviews', 'shipping'].map((t) => `<button data-tab="${t}" class="${t === 'description' ? 'on' : ''}">${t[0].toUpperCase() + t.slice(1)}</button>`).join('')}</div><div class="tab-body" id="tab-body"></div></div>
    ${related.length ? `<section class="section"><div class="section-head"><h2>You may also like</h2></div>${grid(related)}</section>` : ''}</div>`;

  const reviewsTab = (keep = {}) => {
    const list = Store.reviews().filter((r) => r.productId === p.id);
    return `<div class="pr-wrap"><div class="pr-list"><div class="pr-head"><div class="pr-score"><b>${p.rating.toFixed(1)}</b>${stars(p.rating, 18)}<small class="muted">${p.reviews} ratings</small></div></div>
      ${list.length ? '' : '<p class="muted">No written reviews yet. Be the first to share your thoughts!</p>'}
      ${list.map((r) => `<article class="pr-item"><span class="avatar">${esc(r.name[0])}</span><div><div class="pr-top"><b>${esc(r.name)}</b>${stars(r.rating, 14)}<small class="muted">${r.date}</small></div><h4>${esc(r.title)}</h4><p>${esc(r.text)}</p>${r.verified ? `<small class="verified">${icon('check', 12, { strokeWidth: 3 })} Verified buyer</small>` : ''}</div></article>`).join('')}</div>
      <form class="pr-form card" id="rv-form"><h3>Write a review</h3>
        <div class="star-pick" role="radiogroup" aria-label="Rating">${[1, 2, 3, 4, 5].map((n) => `<button type="button" data-star="${n}" class="${n <= st.rating ? 'on' : ''}" aria-label="${n} stars">${icon('star', 26, { fill: n <= st.rating })}</button>`).join('')}</div>
        <label class="field"><span>Your name</span><input name="name" value="${esc(keep.name ?? (Store.user ? Store.user.name : ''))}"></label>
        <label class="field"><span>Title</span><input name="title" placeholder="Sum it up in a few words"></label>
        <label class="field"><span>Your review</span><textarea name="text" rows="4" placeholder="What did you like or dislike?"></textarea></label>
        <small class="err" id="rv-err"></small><button class="btn btn-primary btn-block">Post review</button></form></div>`;
  };
  return { html, mount() {
    const body = $('#tab-body');
    const showTab = () => {
      $$('[data-tab]').forEach((b) => b.classList.toggle('on', b.dataset.tab === st.tab));
      if (st.tab === 'description') body.innerHTML = `<p>${esc(p.description)} Built with quality materials and backed by our satisfaction guarantee, it is designed to last and look great while doing it.</p>`;
      else if (st.tab === 'features') body.innerHTML = `<ul class="check">${p.features.map((f) => `<li>${esc(f)}</li>`).join('')}</ul>`;
      else if (st.tab === 'shipping') body.innerHTML = '<p>Orders ship within 24 hours. Standard delivery takes 3–5 business days and is free on orders over $100. Not happy? Return it within 30 days for a full refund.</p>';
      else bindReviews(reviewsTab());
    };
    const bindReviews = (htmlStr) => {
      body.innerHTML = htmlStr;
      $$('[data-star]', body).forEach((b) => (b.onclick = () => { st.rating = +b.dataset.star; const name = $('[name=name]', body).value; bindReviews(reviewsTab({ name })); }));
      $('#rv-form').onsubmit = (e) => {
        e.preventDefault(); const f = e.target, name = f.elements.name.value.trim(), text = f.elements.text.value.trim();
        if (name.length < 2) return ($('#rv-err').textContent = 'Please enter your name');
        if (text.length < 10) return ($('#rv-err').textContent = 'Please write at least 10 characters');
        Store.addReview({ productId: p.id, name, rating: st.rating, title: f.elements.title.value.trim() || 'My review', text, city: '' });
        bindReviews(reviewsTab({ name }));
      };
    };
    showTab();
    $$('[data-tab]').forEach((b) => (b.onclick = () => { st.tab = b.dataset.tab; showTab(); }));
    $$('[data-color]').forEach((b) => (b.onclick = () => { st.color = b.dataset.color; $$('[data-color]').forEach((x) => x.classList.toggle('on', x === b)); }));
    $$('[data-q]').forEach((b) => (b.onclick = () => { st.qty = Math.max(1, Math.min(p.stock, st.qty + +b.dataset.q)); $('#pd-qty').textContent = st.qty; }));
    $('#pd-add').onclick = () => Store.addToCart(p, st.qty, st.color);
    $('#pd-buy').onclick = () => { Store.addToCart(p, st.qty, st.color); location.hash = '#/cart'; };
  } };
}

/* ---------- Cart ---------- */
let cartMsg = '';
function pageCart() {
  const items = Store.cartItems(), sub = Store.subtotal(), promo = getPromo(), t = calcTotals(sub, promo);
  if (!items.length) return { html: `<div class="container page">${emptyBox('cart', 'Your cart is empty', "Looks like you haven't added anything yet.", '<a href="#/shop" class="btn btn-primary btn-lg">Start shopping</a>')}</div>` };
  const html = `<div class="container page">${crumb('Home / <b>Cart</b>')}
    <div class="page-head"><h1>Shopping cart</h1><button class="btn btn-ghost btn-sm" data-action="cart-clear">Clear cart</button></div>
    <div class="cart-layout"><div class="cart-list">
      ${sub < FREE_SHIP ? `<div class="ship-bar card">Add <b>${formatPrice(FREE_SHIP - sub)}</b> more for free shipping<div class="bar"><i style="width:${(sub / FREE_SHIP) * 100}%"></i></div></div>` : ''}
      ${items.map((i) => `<div class="cart-item card"><a href="#/product/${i.product.slug}" class="ci-img">${safeImage(i.product.image, i.product.name)}</a>
        <div class="ci-info"><a href="#/product/${i.product.slug}"><h3>${esc(i.product.name)}</h3></a><span class="muted">${i.product.brand}</span>${i.color ? `<span class="dot" style="background:${i.color}"></span>` : ''}
          <div class="qty sm"><button data-action="cart-qty" data-key="${esc(i.key)}" data-d="-1">−</button><span>${i.qty}</span><button data-action="cart-qty" data-key="${esc(i.key)}" data-d="1">+</button></div></div>
        <div class="ci-price"><strong>${formatPrice(i.product.price * i.qty)}</strong><button class="link-danger" data-action="cart-remove" data-key="${esc(i.key)}">Remove</button></div></div>`).join('')}
    </div><aside class="summary card"><h3>Order summary</h3>
      <form class="promo-form" id="promo-form"><input name="code" placeholder="Promo code (NOVA10)"><button class="btn btn-dark btn-sm">Apply</button></form>
      ${cartMsg ? `<small class="${cartMsg.startsWith('Invalid') ? 'err' : 'ok'}">${cartMsg}</small>` : ''}
      <dl><div><dt>Subtotal</dt><dd>${formatPrice(sub)}</dd></div>
        ${t.discount > 0 ? `<div class="ok"><dt>Discount (10%)</dt><dd>−${formatPrice(t.discount)}</dd></div>` : ''}
        <div><dt>Shipping</dt><dd>${t.shipping ? formatPrice(t.shipping) : 'Free'}</dd></div><div><dt>Tax (5%)</dt><dd>${formatPrice(t.tax)}</dd></div>
        <div class="total"><dt>Total</dt><dd>${formatPrice(t.total)}</dd></div></dl>
      <a href="#/checkout" class="btn btn-primary btn-lg btn-block">Proceed to checkout</a><a href="#/shop" class="btn btn-ghost btn-block">Continue shopping</a></aside></div></div>`;
  return { html, mount() {
    $('#promo-form').onsubmit = (e) => {
      e.preventDefault();
      if (e.target.elements.code.value.trim().toUpperCase() === 'NOVA10') { try { sessionStorage.setItem('nova_promo', 'NOVA10'); } catch {} cartMsg = 'Code applied — 10% off!'; }
      else cartMsg = 'Invalid promo code';
      Router.render();
    };
  } };
}

/* ---------- Checkout ---------- */
function pageCheckout() {
  if (!Store.cartItems().length) { location.replace('#/cart'); return { html: '' }; }
  const items = Store.cartItems(), sub = Store.subtotal(), t = calcTotals(sub, getPromo()), u = Store.user || {};
  const F = (k, label, ph, val = '', half = false, type = 'text') => `<label class="field ${half ? 'half' : ''}"><span>${label}</span><input name="${k}" type="${type}" value="${esc(val)}" placeholder="${ph}"></label>`;
  const html = `<div class="container page">${crumb('<a href="#/cart">Cart</a> / <b>Checkout</b>')}<h1>Checkout</h1>
    <form class="cart-layout" id="co-form" novalidate><div class="checkout-forms">
      <section class="card form-card"><h3>1. Contact &amp; shipping</h3><div class="form-grid">
        ${F('name', 'Full name', 'Rehmat Ullah', u.name, true)}${F('email', 'Email', 'you@email.com', u.email, true, 'email')}${F('phone', 'Phone', '03XX XXXXXXX')}
        ${F('address', 'Street address', 'House #, street, area')}${F('city', 'City', 'Lahore', '', true)}${F('zip', 'Postal code', '54000', '', true)}</div></section>
      <section class="card form-card"><h3>2. Payment method</h3>
        <div class="pay-opts">${[['card', 'Credit / Debit card', 'card'], ['cod', 'Cash on delivery', 'cash']].map(([v, l, ic]) => `<label class="pay ${v === 'card' ? 'on' : ''}"><input type="radio" name="pay" value="${v}" ${v === 'card' ? 'checked' : ''}>${icon(ic, 20)}${l}</label>`).join('')}</div>
        <div class="form-grid" id="card-fields">${F('card', 'Card number', '1234 5678 9012 3456')}${F('exp', 'Expiry', 'MM/YY', '', true)}${F('cvc', 'CVC', '123', '', true)}<small class="muted">Demo store — no real payment is processed.</small></div></section></div>
      <aside class="summary card"><h3>Your order</h3>
        <ul class="mini-list">${items.map((i) => `<li><span>${esc(i.product.name)} × ${i.qty}</span><b>${formatPrice(i.product.price * i.qty)}</b></li>`).join('')}</ul>
        <dl><div><dt>Subtotal</dt><dd>${formatPrice(sub)}</dd></div>${t.discount > 0 ? `<div class="ok"><dt>Discount</dt><dd>−${formatPrice(t.discount)}</dd></div>` : ''}
          <div><dt>Shipping</dt><dd>${t.shipping ? formatPrice(t.shipping) : 'Free'}</dd></div><div><dt>Tax</dt><dd>${formatPrice(t.tax)}</dd></div><div class="total"><dt>Total</dt><dd>${formatPrice(t.total)}</dd></div></dl>
        <button class="btn btn-primary btn-lg btn-block">Place order</button></aside></form></div>`;
  return { html, mount() {
    const form = $('#co-form');
    $$('input[name=pay]', form).forEach((r) => (r.onchange = () => {
      $$('.pay', form).forEach((l) => l.classList.toggle('on', $('input', l).checked));
      $('#card-fields').style.display = r.value === 'card' ? '' : 'none';
    }));
    form.onsubmit = (e) => {
      e.preventDefault(); const v = (k) => form.elements[k].value, pay = form.elements.pay.value, er = {};
      if (v('name').trim().length < 2) er.name = 'Enter your full name';
      if (!/^\S+@\S+\.\S+$/.test(v('email'))) er.email = 'Enter a valid email';
      if (v('phone').replace(/\D/g, '').length < 10) er.phone = 'Enter a valid phone number';
      if (v('address').trim().length < 5) er.address = 'Enter your address';
      if (!v('city').trim()) er.city = 'Enter your city';
      if (pay === 'card') {
        if (v('card').replace(/\s/g, '').length < 16) er.card = 'Enter a 16-digit card number';
        if (!/^\d{2}\/\d{2}$/.test(v('exp'))) er.exp = 'MM/YY';
        if (v('cvc').length < 3) er.cvc = 'CVC';
      }
      $$('.field small.err', form).forEach((x) => x.remove()); $$('input.invalid', form).forEach((x) => x.classList.remove('invalid'));
      Object.entries(er).forEach(([k, m]) => { const inp = form.elements[k]; inp.classList.add('invalid'); inp.insertAdjacentHTML('afterend', `<small class="err">${m}</small>`); });
      if (Object.keys(er).length) return;
      const order = Store.placeOrder({ name: v('name'), email: v('email'), phone: v('phone'), address: `${v('address')}, ${v('city')} ${v('zip')}`, payment: pay, total: t.total });
      try { sessionStorage.removeItem('nova_promo'); } catch {}
      cartMsg = ''; location.hash = '#/order-success/' + order.id;
    };
  } };
}

function pageOrderSuccess([id]) {
  const o = Store.orders.find((x) => x.id === id);
  return { html: `<div class="container page"><div class="success card"><div class="check-big">${icon('check', 44, { strokeWidth: 3 })}</div><h1>Thank you for your order!</h1>
    <p class="muted">Order <b>#${esc(id)}</b> has been placed. A confirmation will be sent to ${esc(o ? o.details.email : 'your email')}.</p>
    ${o ? `<ul class="mini-list">${o.items.map((i) => `<li><span>${esc(i.name)} × ${i.qty}</span><b>${formatPrice(i.price * i.qty)}</b></li>`).join('')}<li class="total"><span>Total paid</span><b>${formatPrice(o.total)}</b></li></ul>` : ''}
    <div class="hero-cta center"><a href="#/shop" class="btn btn-primary btn-lg">Continue shopping</a><a href="#/" class="btn btn-outline btn-lg">Back to home</a></div></div></div>` };
}

/* ---------- Wishlist / Auth / About / Contact / 404 ---------- */
function pageWishlist() {
  const items = products.filter((p) => Store.wishlist.includes(p.id));
  return { html: `<div class="container page">${crumb('Home / <b>Wishlist</b>')}<div class="page-head"><h1>My wishlist</h1><p class="muted">${items.length} saved</p></div>
    ${items.length ? grid(items) : emptyBox('heart', 'Your wishlist is empty', 'Tap the heart on any product to save it here.', '<a href="#/shop" class="btn btn-primary btn-lg">Browse products</a>')}</div>` };
}

let authMode = 'login';
function pageAuth() {
  const reg = authMode === 'register';
  const html = `<div class="container page auth-wrap"><div class="auth-side"><div class="logo light"><span class="logo-mark">N</span>NOVA</div><h2>Welcome to the future of shopping</h2>
    <ul class="check light"><li>Track orders &amp; save your wishlist</li><li>Exclusive member-only deals</li><li>Faster checkout every time</li></ul></div>
    <form class="card auth-card" id="auth-form" novalidate><div class="seg"><button type="button" data-mode="login" class="${reg ? '' : 'on'}">Sign in</button><button type="button" data-mode="register" class="${reg ? 'on' : ''}">Create account</button></div>
      <h2>${reg ? 'Join NOVA' : 'Welcome back'}</h2>
      ${reg ? '<label class="field"><span>Full name</span><input name="name" placeholder="Your name"></label>' : ''}
      <label class="field"><span>Email</span><input name="email" type="email" placeholder="you@email.com"></label>
      <label class="field"><span>Password</span><input name="password" type="password" placeholder="••••••••"></label>
      <small class="err" id="auth-err"></small><button class="btn btn-primary btn-lg btn-block">${reg ? 'Create account' : 'Sign in'}</button>
      <small class="muted">Demo only — accounts are stored in your browser.</small></form></div>`;
  return { html, mount() {
    const f = $('#auth-form');
    $$('[data-mode]', f).forEach((b) => (b.onclick = () => { authMode = b.dataset.mode; Router.render(); }));
    f.onsubmit = (e) => {
      e.preventDefault(); const name = f.elements.name ? f.elements.name.value.trim() : '', email = f.elements.email.value, pw = f.elements.password.value, err = $('#auth-err');
      if (reg && name.length < 2) return (err.textContent = 'Please enter your name');
      if (!/^\S+@\S+\.\S+$/.test(email)) return (err.textContent = 'Enter a valid email');
      if (pw.length < 6) return (err.textContent = 'Password must be at least 6 characters');
      Store.login({ name: name || email.split('@')[0], email }); location.hash = '#/';
    };
  } };
}

function pageAbout() {
  return { html: `<div class="container page">${crumb('Home / <b>About</b>')}
    <section class="about-hero card"><span class="pill">Our story</span><h1>We make everyday essentials feel exceptional</h1>
      <p class="lead">NOVA started with a simple idea: great design and quality should not cost a fortune. Today we serve thousands of customers with carefully selected products across tech, fashion and home.</p></section>
    <div class="stats-row">${[['50k+', 'Customers'], ['500+', 'Products'], ['30', 'Cities served'], ['4.8', 'Average rating']].map(([a, b]) => `<div class="card stat"><b>${a}</b><span>${b}</span></div>`).join('')}</div>
    <div class="grid grid-3">${[['target', 'Curated quality', 'Every product is tested and hand-picked by our team before it reaches you.'], ['leaf', 'Responsible choices', 'We favour durable materials and recyclable packaging wherever possible.'], ['users', 'People first', 'Fast support, easy returns and fair prices — always.']]
      .map(([i, t, d]) => `<div class="card value"><span class="val-ic">${icon(i, 26)}</span><h3>${t}</h3><p class="muted">${d}</p></div>`).join('')}</div>
    <div class="center section"><a href="#/shop" class="btn btn-primary btn-lg">Explore the store</a></div></div>` };
}

function pageContact() {
  const info = [['pin', 'Visit us', 'Gulberg III, Lahore, Pakistan'], ['mail', 'Email', 'support@novastore.com'], ['phone', 'Call', '+92 300 0000000'], ['clock', 'Hours', 'Mon–Sat, 9am – 8pm']];
  return { html: `<div class="container page">${crumb('Home / <b>Contact</b>')}<h1>Get in touch</h1><div class="contact-layout">
    <div class="contact-info">${info.map(([i, t, d]) => `<div class="card info-item"><span>${icon(i, 22)}</span><div><b>${t}</b><p class="muted">${d}</p></div></div>`).join('')}</div>
    <form class="card form-card" id="contact-form"><div class="form-grid">
      <label class="field half"><span>Name</span><input required></label><label class="field half"><span>Email</span><input required type="email"></label>
      <label class="field"><span>Subject</span><input required></label><label class="field"><span>Message</span><textarea required rows="5"></textarea></label></div>
      <button class="btn btn-primary btn-lg">Send message</button></form></div></div>`,
    mount() { $('#contact-form').onsubmit = (e) => { e.preventDefault(); Store.toast('Message sent — we will reply within 24 hours'); e.target.reset(); }; } };
}

function pageNotFound() {
  return { html: `<div class="container page"><div class="empty card"><span class="empty-ic">${icon('compass', 44)}</span><h1>404 — Page not found</h1><p class="muted">The page you are looking for does not exist or has moved.</p><a href="#/" class="btn btn-primary btn-lg">Back to home</a></div></div>` };
}
