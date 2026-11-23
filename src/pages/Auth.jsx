import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useStore } from '../context/StoreContext.jsx'

export default function Auth() {
  const { login } = useStore()
  const navigate = useNavigate()
  const [mode, setMode] = useState('login')
  const [f, setF] = useState({ name: '', email: '', password: '' })
  const [err, setErr] = useState('')
  const set = (k) => (e) => setF({ ...f, [k]: e.target.value })

  const submit = (e) => {
    e.preventDefault()
    if (mode === 'register' && f.name.trim().length < 2) return setErr('Please enter your name')
    if (!/^\S+@\S+\.\S+$/.test(f.email)) return setErr('Enter a valid email')
    if (f.password.length < 6) return setErr('Password must be at least 6 characters')
    setErr('')
    login({ name: f.name.trim() || f.email.split('@')[0], email: f.email })
    navigate('/')
  }

  return (
    <div className="container page auth-wrap">
      <div className="auth-side">
        <div className="logo light"><span className="logo-mark">N</span>NOVA</div>
        <h2>Welcome to the future of shopping</h2>
        <ul className="check light">
          <li>Track orders & save your wishlist</li>
          <li>Exclusive member-only deals</li>
          <li>Faster checkout every time</li>
        </ul>
      </div>
      <form className="card auth-card" onSubmit={submit} noValidate>
        <div className="seg">
          <button type="button" className={mode === 'login' ? 'on' : ''} onClick={() => setMode('login')}>Sign in</button>
          <button type="button" className={mode === 'register' ? 'on' : ''} onClick={() => setMode('register')}>Create account</button>
        </div>
        <h2>{mode === 'login' ? 'Welcome back' : 'Join NOVA'}</h2>
        {mode === 'register' && <label className="field"><span>Full name</span><input value={f.name} onChange={set('name')} placeholder="Your name" /></label>}
        <label className="field"><span>Email</span><input type="email" value={f.email} onChange={set('email')} placeholder="you@email.com" /></label>
        <label className="field"><span>Password</span><input type="password" value={f.password} onChange={set('password')} placeholder="••••••••" /></label>
        {err && <small className="err">{err}</small>}
        <button className="btn btn-primary btn-lg btn-block">{mode === 'login' ? 'Sign in' : 'Create account'}</button>
        <small className="muted">Demo only — accounts are stored in your browser.</small>
      </form>
    </div>
  )
}
