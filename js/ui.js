/* Small UI helpers: escaping, icons, stars, product card, images */
const esc = (s) => String(s ?? '').replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));

function icon(name = 'bag', size = 20, o = {}) {
  const { fill = false, className = '', strokeWidth = 2 } = o;
  return `<svg class="icon ${className}" width="${size}" height="${size}" viewBox="0 0 24 24" fill="${fill ? 'currentColor' : 'none'}" stroke="currentColor" stroke-width="${strokeWidth}" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${ICONS[name] || ICONS.bag}</svg>`;
}

function stars(value = 5, size = 16) {
  const pts = '12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2';
  let s = '';
  for (let n = 1; n <= 5; n++) s += `<svg width="${size}" height="${size}" viewBox="0 0 24 24" class="${n <= Math.round(value) ? 'on' : ''}" aria-hidden="true"><polygon points="${pts}" /></svg>`;
  return `<span class="stars-svg" role="img" aria-label="${value} out of 5 stars">${s}</span>`;
}

const rating = (value, reviews) =>
  `<span class="rating">${stars(value, 15)}<b>${value.toFixed(1)}</b>${reviews != null ? `<span class="muted">(${reviews})</span>` : ''}</span>`;

const fallbackImg = (alt, ic, cls = '') => `<div class="img-fallback ${cls}" role="img" aria-label="${esc(alt)}">${icon(ic, 64, { strokeWidth: 1.4 })}</div>`;
function safeImage(src, alt, ic = 'bag', cls = '') {
  if (!src) return fallbackImg(alt, ic, cls);
  return `<img src="${esc(src)}" alt="${esc(alt)}" loading="lazy" class="${cls}" data-fb="${ic}">`;
}
// If an image fails to load, swap it for an icon placeholder
document.addEventListener('error', (e) => {
  const img = e.target;
  if (img.tagName !== 'IMG' || !img.dataset.fb) return;
  const d = document.createElement('div');
  d.innerHTML = fallbackImg(img.alt, img.dataset.fb, img.className);
  img.replaceWith(d.firstElementChild);
}, true);

function productCard(p) {
  const liked = Store.wishlist.includes(p.id);
  const discount = p.oldPrice ? Math.round((1 - p.price / p.oldPrice) * 100) : 0;
  const cat = getCategory(p.category);
  return `<article class="card product-card">
    <div class="pc-media">
      <a href="#/product/${p.slug}" aria-label="${esc(p.name)}">${safeImage(p.image, p.name, cat && cat.icon)}</a>
      ${p.badge ? `<span class="badge">${p.badge}</span>` : ''}
      ${discount > 0 ? `<span class="badge badge-sale">-${discount}%</span>` : ''}
      <button class="icon-btn pc-heart ${liked ? 'active' : ''}" data-action="wish" data-id="${p.id}" aria-label="Toggle wishlist">${icon('heart', 18, { fill: liked })}</button>
    </div>
    <div class="pc-body">
      <span class="pc-cat">${cat ? cat.name : ''}</span>
      <a href="#/product/${p.slug}" class="pc-title">${esc(p.name)}</a>
      ${rating(p.rating, p.reviews)}
      <div class="pc-foot">
        <div class="price"><strong>${formatPrice(p.price)}</strong>${p.oldPrice ? `<s>${formatPrice(p.oldPrice)}</s>` : ''}</div>
        <button class="btn btn-primary btn-sm" data-action="add" data-id="${p.id}">Add</button>
      </div>
    </div></article>`;
}
const grid = (list, cls = '') => `<div class="grid ${cls}">${list.map(productCard).join('')}</div>`;
const emptyBox = (ic, title, text, btn) =>
  `<div class="empty card"><span class="empty-ic">${icon(ic, 44)}</span><h2>${title}</h2>${text ? `<p class="muted">${text}</p>` : ''}${btn || ''}</div>`;
