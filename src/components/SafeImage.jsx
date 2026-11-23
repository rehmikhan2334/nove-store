import { useState } from 'react'
import Icon from './Icons.jsx'

export default function SafeImage({ src, alt, icon = 'bag', className = '' }) {
  const [failed, setFailed] = useState(false)
  if (failed || !src) {
    return (
      <div className={`img-fallback ${className}`} role="img" aria-label={alt}>
        <Icon name={icon} size={64} strokeWidth={1.4} />
      </div>
    )
  }
  return <img src={src} alt={alt} loading="lazy" className={className} onError={() => setFailed(true)} />
}
