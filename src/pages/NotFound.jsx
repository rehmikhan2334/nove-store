import Icon from '../components/Icons.jsx'
import { Link } from 'react-router-dom'

export default function NotFound() {
  return (
    <div className="container page">
      <div className="empty card"><span className="empty-ic"><Icon name="compass" size={44} /></span><h1>404 — Page not found</h1><p className="muted">The page you are looking for does not exist or has moved.</p><Link to="/" className="btn btn-primary btn-lg">Back to home</Link></div>
    </div>
  )
}
