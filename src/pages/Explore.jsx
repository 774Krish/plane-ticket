import { useState } from 'react'
import { Link } from 'react-router-dom'
import { Search, ArrowRight, Plane } from 'lucide-react'
import PageHead from '../components/PageHead.jsx'
import { exploreDestinations } from '../api.js'
import { toISO, addDays, formatPrice } from '../utils.js'

export default function Explore() {
  const [origin, setOrigin] = useState('')
  const [budget, setBudget] = useState(500)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [result, setResult] = useState(null)
  const departIn7 = toISO(addDays(new Date(), 7))

  const submit = async (e) => {
    e.preventDefault()
    if (!origin.trim()) {
      setError('Enter your departure city.')
      return
    }
    setLoading(true)
    setError('')
    setResult(null)
    try {
      setResult(await exploreDestinations({ origin: origin.trim(), budget }))
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <>
      <PageHead
        title="Explore by budget"
        subtitle="Find the cheapest places to fly from your city — set a budget and go."
        image="https://images.unsplash.com/photo-1500835556837-99ac94a94552?auto=format&fit=crop&w=1800&q=80"
      />

      <section className="section" style={{ paddingTop: 48 }}>
        <div className="container">
          <form className="searchbar searchbar--wide" onSubmit={submit} style={{ marginTop: -90, position: 'relative', zIndex: 2 }}>
            <label className="searchbar__field">
              <span className="searchbar__label"><Plane /> From</span>
              <input
                type="text"
                className="searchbar__input"
                placeholder="City or code (e.g. London)"
                value={origin}
                onChange={(e) => setOrigin(e.target.value)}
              />
            </label>

            <label className="searchbar__field" style={{ gridColumn: 'span 2' }}>
              <span className="searchbar__label">
                Max budget: <strong style={{ color: 'var(--orange-dark)' }}>{formatPrice(budget)}</strong>
              </span>
              <input
                type="range"
                className="budget-slider"
                min="50"
                max="2000"
                step="10"
                value={budget}
                onChange={(e) => setBudget(Number(e.target.value))}
              />
            </label>

            <button type="submit" className="btn btn-primary" disabled={loading}>
              {loading ? <span className="spinner" /> : <Search size={18} />}
              Explore
            </button>
          </form>

          {error && (
            <div className="empty" style={{ padding: '40px 0' }}>
              <div className="empty__icon">⚠️</div>
              <h2>Something went wrong</h2>
              <p>{error}</p>
            </div>
          )}

          {loading && (
            <div className="loading-row">
              <span className="spinner" />
              Finding cheap destinations…
            </div>
          )}

          {result && !loading && (
            <>
              <div className="source-badge">
                <span className="pill pill--orange">Explore</span>
                <span className="results-count">
                  {result.destinations.length} destinations from {result.origin} · under {formatPrice(budget)}
                </span>
              </div>

              {result.destinations.length === 0 ? (
                <div className="empty">
                  <div className="empty__icon">🌍</div>
                  <h2>No destinations in budget</h2>
                  <p>Try raising your budget a little.</p>
                </div>
              ) : (
                <div className="rooms-grid">
                  {result.destinations.map((d) => (
                    <Link
                      to={`/flights?origin=${encodeURIComponent(origin)}&destination=${encodeURIComponent(d.city)}&departDate=${departIn7}`}
                      className="route-card"
                      key={d.code}
                    >
                      <div className="route-card__route">
                        <strong>{result.origin}</strong>
                        <ArrowRight size={18} />
                        <strong>{d.city}</strong>
                      </div>
                      <div className="route-card__meta">
                        <span className="route-card__price">from {formatPrice(d.price, result.currency)}</span>
                        <span className="route-card__cta">
                          Search fares <ArrowRight size={14} />
                        </span>
                      </div>
                    </Link>
                  ))}
                </div>
              )}
            </>
          )}
        </div>
      </section>
    </>
  )
}
