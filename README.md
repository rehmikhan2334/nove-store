# NOVA Store — Plain HTML / CSS / JS (no Node.js)

Node.js, npm, Vite, React — kuch install karne ki zaroorat nahi.
`index.html` ko browser me double-click karke open karein, bas.

## Structure
```
index.html
css/style.css     -> same design (colors :root me top par)
js/data.js        -> products, categories, reviews (yahan edit karein)
js/icons.js       -> SVG icons + hero illustrations
js/ui.js          -> helpers (product card, stars, images)
js/store.js       -> cart, wishlist, login, orders, theme (localStorage)
js/pages.js       -> sab pages (Home, Shop, Cart, Checkout ...)
js/app.js         -> router (#/shop, #/cart ...), header, footer
```

## Features (pehle jaisi)
Home + sliders, Shop filters/sort, live Search, Product detail + reviews, Cart (promo `NOVA10`),
Checkout, Wishlist, Login/Register (demo), About, Contact, 404, Light/Dark theme.

Hosting: kisi bhi static hosting / cPanel / GitHub Pages par folder upload kar dein.
