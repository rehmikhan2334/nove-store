import { useState } from 'react'
import { useStore } from '../context/StoreContext.jsx'

export default function Contact() {
  const { toast } = useStore()
  const [f, setF] = useState({ name: '', email: '', subject: '', message: '' })
  const set = (k) => (e) => setF({ ...f, [k]: e.target.value })
  const submit = (e) => {
    e.preventDefault()
    toast('Message sent — we will reply within 24 hours')
    setF({ name: '', email: '', subject: '', message: '' })
  }
  return (
    <div className="container page">
      <div className="breadcrumb">Home / <b>Contact</b></div>
      <h1>Get in touch</h1>
      <div className="contact-layout">
        <div className="contact-info">
          {[['📍', 'Visit us', 'Gulberg III, Lahore, Pakistan'], ['✉️', 'Email', 'support@novastore.com'], ['📞', 'Call', '+92 300 0000000'], ['🕘', 'Hours', 'Mon–Sat, 9am – 8pm']].map(([i, t, d]) => (
            <div key={t} className="card info-item"><span>{i}</span><div><b>{t}</b><p className="muted">{d}</p></div></div>
          ))}
        </div>
        <form className="card form-card" onSubmit={submit}>
          <div className="form-grid">
            <label className="field half"><span>Name</span><input required value={f.name} onChange={set('name')} /></label>
            <label className="field half"><span>Email</span><input required type="email" value={f.email} onChange={set('email')} /></label>
            <label className="field"><span>Subject</span><input required value={f.subject} onChange={set('subject')} /></label>
            <label className="field"><span>Message</span><textarea required rows="5" value={f.message} onChange={set('message')} /></label>
          </div>
          <button className="btn btn-primary btn-lg">Send message</button>
        </form>
      </div>
    </div>
  )
}
