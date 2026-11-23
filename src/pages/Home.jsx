import { Link, useNavigate } from 'react-router-dom'
import {
  ArrowRight,
  ShieldCheck,
  Globe,
  Star,
  Plane,
} from 'lucide-react'
import FlightSearchBar from '../components/FlightSearchBar.jsx'
import { toISO, addDays } from '../utils.js'

const features = [
  {
    icon: ShieldCheck,
    title: 'Best price promise',
    text: 'We compare fares across hundreds of airlines and booking sites to find the lowest price.',
  },
  {
    icon: Globe,
    title: 'Fly anywhere',
    text: 'Over 500 airlines and 150+ countries in one search — one-way, return or multi-city.',
  },
]

const routes = [
  { from: 'London', to: 'Paris', price: 49 },
  { from: 'New York', to: 'London', price: 289 },
  { from: 'Dubai', to: 'Mumbai', price: 169 },
  { from: 'Singapore', to: 'Tokyo', price: 199 },
  { from: 'Sydney', to: 'Bangkok', price: 329 },
  { from: 'Berlin', to: 'Rome', price: 79 },
]

const testimonials = [
  {
    name: 'Amara Okafor',
    role: 'Flew London → Paris',
    initials: 'AO',
    quote:
      'Found a return flight for half of what the airline was charging. Booking took under a minute.',
  },
  {
    name: 'Diego Ramírez',
    role: 'Flew Madrid → Tokyo',
    initials: 'DR',
    quote:
      'The comparison made it effortless to spot the cheapest days to fly. Saved a fortune.',
  },
  {
    name: 'Priya Nair',
    role: 'Flew Mumbai → Dubai',
    initials: 'PN',
    quote:
      'Clean results, no hidden fees, and support actually replied when my plans changed.',
  },
]

export default function Home() {
  const navigate = useNavigate()
  const departIn7 = toISO(addDays(new Date(), 7))

  const goSearch = (vals) => {
    const q = new URLSearchParams()
    for (const [k, v] of Object.entries(vals)) {
      if (v === undefined || v === null || v === '') continue
      q.set(k, Array.isArray(v) ? JSON.stringify(v) : String(v))
    }
    navigate(`/flights?${q.toString()}`)
  }

  return (
    <>
      <section
        className="hero"
        style={{
          backgroundImage:
            "url('https://images.unsplash.com/photo-1436491865332-7a61a109cc05?auto=format&fit=crop&w=1800&q=80')",
        }}
      >
        <div className="container hero__inner">
          <div className="hero__content">
            <span className="hero__tag">
              <Plane size={14} /> Flight Tickets Worldwide
            </span>
            <h1 className="hero__title">
              Fly anywhere, <span>for less</span>
            </h1>
            <p className="hero__text">
              Compare prices across hundreds of airlines and booking sites, and
              find the cheapest flights in seconds.
            </p>
            <div className="hero__actions">
              <Link to="/flights" className="btn btn-primary">
                Browse Flights <ArrowRight size={18} />
              </Link>
              <Link to="/contact" className="btn btn-light">
                Get Help
              </Link>
            </div>
          </div>

          <FlightSearchBar onSubmit={goSearch} />
        </div>
      </section>

      <section className="stats">
        <div className="container">
          <div className="stats__grid">
            <div>
              <div className="stats__value">500+</div>
              <div className="stats__label">Airlines</div>
            </div>
            <div>
              <div className="stats__value">150+</div>
              <div className="stats__label">Countries</div>
            </div>
            <div>
              <div className="stats__value">2M+</div>
              <div className="stats__label">Travellers a year</div>
            </div>
          </div>
        </div>
      </section>

      <section className="section">
        <div className="container">
          <div className="section-head section-head--center">
            <span className="eyebrow">Why SkyVoyage</span>
            <h2 className="section-title">Booking made effortless</h2>
          </div>
          <div className="features">
            {features.map((f) => (
              <div className="feature" key={f.title}>
                <span className="feature__icon">
                  <f.icon />
                </span>
                <h3>{f.title}</h3>
                <p>{f.text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="section section--tint">
        <div className="container">
          <div className="section-head">
            <span className="eyebrow">Popular routes</span>
            <h2 className="section-title">Where people are flying</h2>
            <p className="section-sub">
              Hand-picked routes with great fares — tap any route to search live prices.
            </p>
          </div>
          <div className="rooms-grid">
            {routes.map((r) => (
              <Link
                to={`/flights?origin=${r.from}&destination=${r.to}&departDate=${departIn7}`}
                className="route-card"
                key={`${r.from}-${r.to}`}
              >
                <div className="route-card__route">
                  <strong>{r.from}</strong>
                  <ArrowRight size={18} />
                  <strong>{r.to}</strong>
                </div>
                <div className="route-card__meta">
                  <span className="route-card__price">from ${r.price}</span>
                  <span className="route-card__cta">Search fares <ArrowRight size={14} /></span>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      <section className="section">
        <div className="container">
          <div className="section-head section-head--center">
            <span className="eyebrow">Traveller stories</span>
            <h2 className="section-title">Loved by flyers worldwide</h2>
          </div>
          <div className="testimonials">
            {testimonials.map((t) => (
              <div className="testimonial" key={t.name}>
                <div className="testimonial__stars">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <Star key={i} />
                  ))}
                </div>
                <p className="testimonial__quote">“{t.quote}”</p>
                <div className="testimonial__author">
                  <span className="testimonial__avatar">{t.initials}</span>
                  <div>
                    <div className="testimonial__name">{t.name}</div>
                    <div className="testimonial__role">{t.role}</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="section" style={{ paddingTop: 0 }}>
        <div className="container">
          <div className="cta">
            <div>
              <h2>Ready for takeoff?</h2>
              <p>
                Search thousands of flights in seconds and lock in the best
                fare before it disappears.
              </p>
            </div>
            <Link to="/flights" className="btn btn-light">
              Find a Flight <ArrowRight size={18} />
            </Link>
          </div>
        </div>
      </section>
    </>
  )
}
