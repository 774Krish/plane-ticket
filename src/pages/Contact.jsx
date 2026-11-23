import { useState } from 'react'
import { MapPin, Phone, Mail, Clock, Send, CheckCircle2 } from 'lucide-react'
import PageHead from '../components/PageHead.jsx'

const info = [
  {
    icon: MapPin,
    title: 'Visit us',
    lines: ['10 Skyline Avenue, London', 'EC2A 4NE, United Kingdom'],
  },
  {
    icon: Phone,
    title: 'Call us',
    lines: ['+44 20 7946 0123', 'Mon–Sat, 9am – 6pm'],
  },
  {
    icon: Mail,
    title: 'Email us',
    lines: ['hello@skyvoyage.com', 'support@skyvoyage.com'],
  },
  {
    icon: Clock,
    title: 'Front desk',
    lines: ['Open 24 hours', 'Check-in from 3pm · Check-out by 11am'],
  },
]

export default function Contact() {
  const [form, setForm] = useState({ name: '', email: '', subject: '', message: '' })
  const [sent, setSent] = useState(false)

  const update = (key) => (e) => setForm((f) => ({ ...f, [key]: e.target.value }))

  const submit = (e) => {
    e.preventDefault()
    setSent(true)
  }

  return (
    <>
      <PageHead
        title="Contact Us"
        subtitle="Questions about a booking, refunds, or special travel needs? We would love to hear from you."
        image="https://images.unsplash.com/photo-1551882547-ff40c63fe5fa?auto=format&fit=crop&w=1800&q=80"
      />

      <section className="section">
        <div className="container contact-grid">
          <div>
            {info.map((item) => (
              <div className="info-card" key={item.title}>
                <span className="info-card__icon">
                  <item.icon />
                </span>
                <div>
                  <h3>{item.title}</h3>
                  {item.lines.map((line) => (
                    <p key={line}>{line}</p>
                  ))}
                </div>
              </div>
            ))}
            <div className="map" style={{ marginTop: 16 }}>
              <span className="map__pin">
                <MapPin />
              </span>
            </div>
          </div>

          <div className="booking-card" style={{ margin: 0 }}>
            {sent ? (
              <div className="success" style={{ padding: '40px 10px' }}>
                <div className="success__icon">
                  <CheckCircle2 />
                </div>
                <h2>Message sent</h2>
                <p>
                  Thanks, {form.name || 'friend'}! Our team will get back to you
                  within one business day.
                </p>
              </div>
            ) : (
              <form onSubmit={submit}>
                <h2>Send us a message</h2>
                <div className="form-row">
                  <label className="field">
                    <span>Full name</span>
                    <input required value={form.name} onChange={update('name')} placeholder="Jane Doe" />
                  </label>
                  <label className="field">
                    <span>Email address</span>
                    <input required type="email" value={form.email} onChange={update('email')} placeholder="jane@example.com" />
                  </label>
                </div>
                <label className="field" style={{ marginTop: 16 }}>
                  <span>Subject</span>
                  <input required value={form.subject} onChange={update('subject')} placeholder="Reservation question" />
                </label>
                <label className="field" style={{ marginTop: 16 }}>
                  <span>Message</span>
                  <textarea
                    required
                    value={form.message}
                    onChange={update('message')}
                    placeholder="Tell us how we can help…"
                  />
                </label>
                <button className="btn btn-primary" type="submit" style={{ marginTop: 22 }}>
                  Send Message <Send size={17} />
                </button>
              </form>
            )}
          </div>
        </div>
      </section>
    </>
  )
}
