# NOVA Store — Modern E-commerce (React + Vite)

A fully functional, responsive e-commerce front-end built with **React 18, React Router, Vite and plain modern CSS**.

## Features
- Home, Shop (filters + sorting), Search (live), Product Detail, Cart, Checkout, Order Success
- Wishlist, Login / Register (demo, stored in browser), About, Contact, 404
- Cart & wishlist saved in `localStorage`, promo code `NOVA10` (10% off), free shipping over $100
- Light / Dark theme toggle, toasts, fully mobile responsive header & footer

## Run locally
```bash
npm install
npm run dev        # development server
npm run build      # production build in /dist
npm run preview    # preview the build
```

## Project structure
```
src/
  components/   Header, Footer, ProductCard, Rating, SafeImage, Toasts
  context/      StoreContext (cart, wishlist, user, theme)
  data/         products.js (edit products here)
  pages/        Home, Shop, Search, ProductDetail, Cart, Checkout, ...
  index.css     complete design system / theme (colors at the top)
```

Change the brand colors in the `:root` block at the top of `src/index.css`.
Uses `HashRouter`, so it also works on GitHub Pages without extra config.
