import { Link } from 'react-router-dom'

export default function About() {
  return (
    <div className="container page">
      <div className="breadcrumb">Home / <b>About</b></div>
      <section className="about-hero card">
        <span className="pill">Our story</span>
        <h1>We make everyday essentials feel exceptional</h1>
        <p className="lead">NOVA started with a simple idea: great design and quality should not cost a fortune. Today we serve thousands of customers with carefully selected products across tech, fashion and home.</p>
      </section>
      <div className="stats-row">
        {[['50k+', 'Customers'], ['500+', 'Products'], ['30', 'Cities served'], ['4.8★', 'Average rating']].map(([a, b]) => (
          <div key={b} className="card stat"><b>{a}</b><span>{b}</span></div>
        ))}
      </div>
      <div className="grid grid-3">
        {[
          ['🎯', 'Curated quality', 'Every product is tested and hand-picked by our team before it reaches you.'],
          ['🌱', 'Responsible choices', 'We favour durable materials and recyclable packaging wherever possible.'],
          ['🤝', 'People first', 'Fast support, easy returns and fair prices — always.'],
        ].map(([i, t, d]) => (
          <div key={t} className="card value"><span>{i}</span><h3>{t}</h3><p className="muted">{d}</p></div>
        ))}
      </div>
      <div className="center section"><Link to="/shop" className="btn btn-primary btn-lg">Explore the store</Link></div>
    </div>
  )
}
