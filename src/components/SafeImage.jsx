import { useState } from 'react'

export default function SafeImage({ src, alt, icon = '🛍️', className = '' }) {
  const [failed, setFailed] = useState(false)
  if (failed || !src) {
    return (
      <div className={`img-fallback ${className}`} role="img" aria-label={alt}>
        <span>{icon}</span>
      </div>
    )
  }
  return <img src={src} alt={alt} loading="lazy" className={className} onError={() => setFailed(true)} />
}
