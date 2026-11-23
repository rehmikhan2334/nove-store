import { Link } from 'react-router-dom'
import { products, categories } from '../data/products.js'
import ProductCard from '../components/ProductCard.jsx'
import HeroSlider from '../components/HeroSlider.jsx'
import ReviewsSlider from '../components/ReviewsSlider.jsx'
import Icon from '../components/Icons.jsx'

export default function Home() {
  const featured = products.filter((p) => p.badge === 'Best Seller' || p.badge === 'Top Rated' || p.badge === 'New').slice(0, 4)
  const deals = products.filter((p) => p.oldPrice).sort((a, b) => (1 - b.price / b.oldPrice) - (1 - a.price / a.oldPrice)).slice(0, 4)

  return (
    <>
      <HeroSlider />

      <section className="container">
        <div className="stat-strip card">
          <div><b>50k+</b><span>Happy customers</span></div>
          <div><b>4.8</b><span>Average rating</span></div>
          <div><b>500+</b><span>Products</span></div>
          <div><b>24h</b><span>Fast dispatch</span></div>
        </div>
      </section>

      <section className="section container">
        <div className="section-head"><h2>Shop by category</h2><Link to="/shop">View all</Link></div>
        <div className="cat-grid">
          {categories.map((c) => (
            <Link key={c.id} to={`/shop?category=${c.id}`} className="cat-card">
              <span className="cat-icon"><Icon name={c.icon} size={28} /></span>
              <h3>{c.name}</h3>
              <p>{c.blurb}</p>
              <em>Explore <Icon name="arrowRight" size={15} /></em>
            </Link>
          ))}
        </div>
      </section>

      <section className="section container">
        <div className="section-head"><h2>Featured products</h2><Link to="/shop">See more</Link></div>
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
        <div className="section-head"><h2>Hot deals</h2><Link to="/shop?sort=discount">All deals</Link></div>
        <div className="grid">{deals.map((p) => <ProductCard key={p.id} product={p} />)}</div>
      </section>

      <ReviewsSlider />
    </>
  )
}
