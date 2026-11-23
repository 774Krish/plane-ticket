import { useEffect, useRef, useState } from 'react'
import { useSearchParams } from 'react-router-dom'
import { BadgeCheck, Info, History, TrendingDown } from 'lucide-react'
import PageHead from '../components/PageHead.jsx'
import FlightSearchBar from '../components/FlightSearchBar.jsx'
import FlightCard from '../components/FlightCard.jsx'
import PriceChart from '../components/PriceChart.jsx'
import { searchFlights } from '../api.js'
import { useFavorites } from '../context/FavoritesContext.jsx'
import { formatPrice, formatDate } from '../utils.js'

const HISTORY_KEY = 'skyvoyage-history'
const LEVEL_LABELS = {
  low: 'Prices are low — book now',
  typical: 'Prices are typical',
  high: 'Prices are high — consider nearby dates',
}

function readHistory() {
  try {
    return JSON.parse(localStorage.getItem(HISTORY_KEY) || '[]')
  } catch {
    return []
  }
}

function saveHistory(entry) {
  const list = readHistory().filter(
    (h) => !(h.origin === entry.origin && h.destination === entry.destination && h.departDate === entry.departDate),
  )
  list.unshift(entry)
  localStorage.setItem(HISTORY_KEY, JSON.stringify(list.slice(0, 6)))
}

export default function Flights() {
  const [params] = useSearchParams()
  const { has, toggle } = useFavorites()

  let initialLegs = []
  try {
    const parsed = params.get('legs') ? JSON.parse(params.get('legs')) : []
    if (Array.isArray(parsed)) initialLegs = parsed
  } catch {
    initialLegs = []
  }

  const initial = {
    origin: params.get('origin') || '',
    destination: params.get('destination') || '',
    departDate: params.get('departDate') || '',
    returnDate: params.get('returnDate') || '',
    currency: params.get('currency') || 'USD',
    cabin: params.get('cabin') || 'economy',
    adults: Number(params.get('adults')) || 1,
    legs: initialLegs,
  }

  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [result, setResult] = useState(null)
  const [history, setHistory] = useState(readHistory)
  const started = useRef(false)

  const runSearch = async (vals) => {
    setLoading(true)
    setError('')
    setResult(null)
    try {
      const data = await searchFlights(vals)
      setResult(data)
      if (!vals.legs) {
        saveHistory({
          origin: vals.origin,
          destination: vals.destination,
          departDate: vals.departDate,
          returnDate: vals.returnDate || '',
          currency: vals.currency,
          cabin: vals.cabin,
        })
        setHistory(readHistory())
      }
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    const hasInitial = initial.legs.length >= 2 || (initial.origin && initial.destination && initial.departDate)
    if (!started.current && hasInitial) {
      started.current = true
      const vals = initial.legs.length >= 2
        ? { legs: initial.legs, currency: initial.currency, cabin: initial.cabin, adults: initial.adults }
        : initial
      runSearch(vals)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  return (
    <>
      <PageHead
        title="Find your flight"
        subtitle="Search and compare flight prices worldwide — powered by Google Flights, with instant demo results when no API key is set."
        image="https://images.unsplash.com/photo-1436491865332-7a61a109cc05?auto=format&fit=crop&w=1800&q=80"
      />

      <section className="section" style={{ paddingTop: 48 }}>
        <div className="container">
          <div style={{ marginTop: -90, position: 'relative', zIndex: 2 }}>
            <FlightSearchBar initial={initial} onSubmit={runSearch} loading={loading} />
          </div>

          {history.length > 0 && !loading && (
            <div className="history">
              <span className="history__label"><History size={15} /> Recent</span>
              {history.map((h, i) => (
                <button key={i} className="filter-chip" onClick={() => runSearch(h)}>
                  {h.origin} → {h.destination} · {formatDate(h.departDate)}
                </button>
              ))}
            </div>
          )}

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
              Searching flights…
            </div>
          )}

          {result && !loading && (
            <>
              {result.priceInsights && (
                <>
                  <div className="price-insights">
                    <TrendingDown size={18} />
                    <span>
                      Lowest price on this route:{' '}
                      <strong>{formatPrice(result.priceInsights.lowest_price, result.currency)}</strong>
                    </span>
                    {result.priceInsights.price_level && (
                      <span className="pill pill--charcoal">
                        {LEVEL_LABELS[result.priceInsights.price_level] || result.priceInsights.price_level}
                      </span>
                    )}
                    {result.priceInsights.typical_price_range && (
                      <span className="price-insights__range">
                        typical {formatPrice(result.priceInsights.typical_price_range[0], result.currency)} –{' '}
                        {formatPrice(result.priceInsights.typical_price_range[1], result.currency)}
                      </span>
                    )}
                  </div>
                  <PriceChart
                    history={result.priceInsights.price_history}
                    currency={result.currency}
                  />
                </>
              )}

              <div className="source-badge">
                {result.source === 'serpapi' ? (
                  <span className="pill pill--orange">
                    <BadgeCheck size={14} /> Live data · Google Flights
                  </span>
                ) : result.source === 'travelpayouts' ? (
                  <span className="pill pill--orange">
                    <BadgeCheck size={14} /> Live prices · TravelPayouts
                  </span>
                ) : (
                  <span className="pill pill--charcoal">
                    <Info size={14} /> Demo data — add a SerpAPI key in .env for live flights
                  </span>
                )}
                {result.flights.length > 0 && (
                  <span className="results-count">
                    {result.flights.length} fares · {result.origin} → {result.destination}
                    {result.source === 'travelpayouts' ? ' · this month' : ''}
                  </span>
                )}
              </div>

              {result.warning && (
                <p className="source-badge" style={{ marginTop: 0, color: 'var(--brown-dark)', fontSize: '0.88rem' }}>
                  <Info size={15} /> {result.warning}
                </p>
              )}

              {result.flights.length === 0 ? (
                <div className="empty">
                  <div className="empty__icon">✈️</div>
                  <h2>No flights found</h2>
                  <p>Try different dates or another route.</p>
                </div>
              ) : (
                <div className="flight-list">
                  {result.flights.map((f) => (
                    <FlightCard
                      key={f.id}
                      flight={f}
                      isFavorite={has(f.id)}
                      onToggleFavorite={toggle}
                    />
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
