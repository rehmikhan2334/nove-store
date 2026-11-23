import { Link } from 'react-router-dom'
import { products, categories } from '../data/products.js'
import ProductCard from '../components/ProductCard.jsx'
import SafeImage from '../components/SafeImage.jsx'

export default function Home() {
  const featured = products.filter((p) => p.badge === 'Best Seller' || p.badge === 'Top Rated' || p.badge === 'New').slice(0, 4)
  const deals = products.filter((p) => p.oldPrice).sort((a, b) => (1 - b.price / b.oldPrice) - (1 - a.price / a.oldPrice)).slice(0, 4)
  const hero = products[0]

  return (
    <>
      <section className="hero">
        <div className="container hero-in">
          <div className="hero-copy">
            <span className="pill">✨ New season collection</span>
            <h1>Upgrade your everyday with <span className="grad">modern essentials</span></h1>
            <p>Discover premium tech, fashion and home pieces — thoughtfully designed, fairly priced and delivered fast.</p>
            <div className="hero-cta">
              <Link to="/shop" className="btn btn-primary btn-lg">Shop now →</Link>
              <Link to="/shop?sort=discount" className="btn btn-outline btn-lg">View deals</Link>
            </div>
            <div className="hero-stats">
              <div><b>50k+</b><span>Happy customers</span></div>
              <div><b>4.8★</b><span>Average rating</span></div>
              <div><b>24h</b><span>Fast dispatch</span></div>
            </div>
          </div>
          <div className="hero-visual">
            <div className="hero-blob" />
            <SafeImage src={hero.image} alt={hero.name} icon="🎧" className="hero-img" />
            <Link to={`/product/${hero.slug}`} className="hero-float">
              <small>Featured</small>
              <b>{hero.name}</b>
              <span>From ${hero.price}</span>
            </Link>
          </div>
        </div>
      </section>

      <section className="section container">
        <div className="section-head"><h2>Shop by category</h2><Link to="/shop">View all →</Link></div>
        <div className="cat-grid">
          {categories.map((c) => (
            <Link key={c.id} to={`/shop?category=${c.id}`} className="cat-card">
              <span className="cat-icon">{c.icon}</span>
              <h3>{c.name}</h3>
              <p>{c.blurb}</p>
              <em>Explore →</em>
            </Link>
          ))}
        </div>
      </section>

      <section className="section container">
        <div className="section-head"><h2>Featured products</h2><Link to="/shop">See more →</Link></div>
        <div className="grid">{featured.map((p) => <ProductCard key={p.id} product={p} />)}</div>
      </section>

      <section className="container">
        <div className="promo">
          <div>
            <span className="pill pill-light">Limited time</span>
            <h2>Get 10% off your first order</h2>
            <p>Use code <b>NOVA10</b> at checkout and enjoy free shipping on orders over $100.</p>
          </div>
          <Link to="/shop" className="btn btn-light btn-lg">Start shopping</Link>
        </div>
      </section>

      <section className="section container">
        <div className="section-head"><h2>Hot deals</h2><Link to="/shop?sort=discount">All deals →</Link></div>
        <div className="grid">{deals.map((p) => <ProductCard key={p.id} product={p} />)}</div>
      </section>

      <section className="section container">
        <div className="section-head"><h2>Loved by customers</h2></div>
        <div className="testi-grid">
          {[
            ['Ayesha K.', 'Delivery was super fast and the headphones sound unbelievable. Packaging felt premium too!'],
            ['Hamza R.', 'Great prices and genuinely good quality. The sneakers are the most comfortable I have owned.'],
            ['Sara M.', 'Easy returns and friendly support. This is now my go-to store for gifts and home decor.'],
          ].map(([n, t]) => (
            <figure key={n} className="card testi">
              <div className="stars">★★★★★</div>
              <blockquote>{t}</blockquote>
              <figcaption><span className="avatar">{n[0]}</span>{n}</figcaption>
            </figure>
          ))}
        </div>
      </section>
    </>
  )
}
