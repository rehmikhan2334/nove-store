import { useCallback, useEffect, useRef, useState } from 'react'
import { Link } from 'react-router-dom'
import Icon from './Icons.jsx'
import { HeadphonesArt, SneakerArt, LampArt } from './HeroArt.jsx'

const slides = [
  { tag: 'Electronics · up to 25% off', title: 'Sound that moves you', text: 'Studio-grade headphones, smart watches and speakers built for everyday life.', cta: 'Shop electronics', to: '/shop?category=electronics', cls: 'sl-indigo', Art: HeadphonesArt },
  { tag: 'Fashion · new season', title: 'Step into the season', text: 'Lightweight sneakers and wardrobe staples designed to go anywhere you do.', cta: 'Shop fashion', to: '/shop?category=fashion', cls: 'sl-sunset', Art: SneakerArt },
  { tag: 'Home & Living · from $29', title: 'Make home feel better', text: 'Warm lighting, cosy textiles and decor pieces that turn a room into a retreat.', cta: 'Shop home', to: '/shop?category=home', cls: 'sl-teal', Art: LampArt },
]

export default function HeroSlider() {
  const [i, setI] = useState(0)
  const [paused, setPaused] = useState(false)
  const startX = useRef(null)
  const go = useCallback((n) => setI((n + slides.length) % slides.length), [])

  useEffect(() => {
    const reduce = window.matchMedia?.('(prefers-reduced-motion: reduce)').matches
    if (paused || reduce) return
    const t = setInterval(() => setI((x) => (x + 1) % slides.length), 6000)
    return () => clearInterval(t)
  }, [paused])

  const onUp = (e) => {
    if (startX.current == null) return
    const dx = e.clientX - startX.current
    startX.current = null
    if (Math.abs(dx) > 50) go(i + (dx < 0 ? 1 : -1))
  }

  return (
    <section
      className="hero-slider"
      aria-roledescription="carousel"
      aria-label="Featured collections"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
      onFocus={() => setPaused(true)}
      onBlur={() => setPaused(false)}
      onPointerDown={(e) => { startX.current = e.clientX }}
      onPointerUp={onUp}
      onKeyDown={(e) => { if (e.key === 'ArrowRight') go(i + 1); if (e.key === 'ArrowLeft') go(i - 1) }}
    >
      {slides.map((s, n) => (
        <div key={s.title} className={`hs-slide ${s.cls} ${n === i ? 'on' : ''}`} aria-hidden={n !== i} role="group" aria-label={`${n + 1} of ${slides.length}`}>
          <div className="container hs-in">
            <div className="hs-copy">
              <span className="hs-tag">{s.tag}</span>
              <h1>{s.title}</h1>
              <p>{s.text}</p>
              <div className="hero-cta">
                <Link to={s.to} className="btn btn-light btn-lg" tabIndex={n === i ? 0 : -1}>{s.cta} <Icon name="arrowRight" size={18} /></Link>
                <Link to="/shop?sort=discount" className="btn btn-glass btn-lg" tabIndex={n === i ? 0 : -1}>View deals</Link>
              </div>
              <div className="hs-perks">
                <span><Icon name="truck" size={16} /> Free delivery</span>
                <span><Icon name="refresh" size={16} /> 30-day returns</span>
                <span><Icon name="shield" size={16} /> 1-year warranty</span>
              </div>
            </div>
            <div className="hs-art"><s.Art /></div>
          </div>
        </div>
      ))}

      <button className="hs-arrow prev" onClick={() => go(i - 1)} aria-label="Previous slide"><Icon name="arrowLeft" /></button>
      <button className="hs-arrow next" onClick={() => go(i + 1)} aria-label="Next slide"><Icon name="arrowRight" /></button>
      <div className="hs-dots" role="tablist">
        {slides.map((s, n) => (
          <button key={s.title} role="tab" aria-selected={n === i} aria-label={`Slide ${n + 1}`} className={n === i ? 'on' : ''} onClick={() => setI(n)} />
        ))}
      </div>
    </section>
  )
}
