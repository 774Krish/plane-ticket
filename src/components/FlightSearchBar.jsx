import { useState } from 'react'
import {
  PlaneTakeoff,
  PlaneLanding,
  CalendarDays,
  Users,
  Search,
  Plus,
  X,
  Layers,
} from 'lucide-react'
import { toISO, addDays } from '../utils.js'

const CURRENCIES = ['USD', 'EUR', 'GBP', 'INR']
const CABINS = [
  { value: 'economy', label: 'Economy' },
  { value: 'premium_economy', label: 'Premium economy' },
  { value: 'business', label: 'Business' },
  { value: 'first', label: 'First' },
]

function emptyLeg() {
  return { origin: '', destination: '', date: toISO(addDays(new Date(), 7)) }
}

export default function FlightSearchBar({ initial = {}, onSubmit, loading = false }) {
  const today = toISO(new Date())
  const [multi, setMulti] = useState(false)

  const [origin, setOrigin] = useState(initial.origin || '')
  const [destination, setDestination] = useState(initial.destination || '')
  const [departDate, setDepartDate] = useState(initial.departDate || toISO(addDays(new Date(), 7)))
  const [returnDate, setReturnDate] = useState(initial.returnDate || '')
  const [adults, setAdults] = useState(String(initial.adults || 1))
  const [cabin, setCabin] = useState(initial.cabin || 'economy')
  const [currency, setCurrency] = useState(initial.currency || 'USD')
  const [legs, setLegs] = useState(() => {
    if (Array.isArray(initial.legs) && initial.legs.length >= 2) return initial.legs
    return [emptyLeg(), emptyLeg()]
  })

  const updateLeg = (i, key, value) =>
    setLegs((prev) => prev.map((l, idx) => (idx === i ? { ...l, [key]: value } : l)))

  const addLeg = () => {
    if (legs.length < 4) setLegs((prev) => [...prev, emptyLeg()])
  }

  const removeLeg = (i) => {
    if (legs.length > 2) setLegs((prev) => prev.filter((_, idx) => idx !== i))
  }

  const submit = (e) => {
    e.preventDefault()
    if (multi) {
      const validLegs = legs.filter((l) => l.origin && l.destination && l.date)
      if (validLegs.length < 2) return
      onSubmit({ legs: validLegs, currency, cabin, adults: Number(adults) })
    } else {
      if (!origin.trim() || !destination.trim()) return
      onSubmit({
        origin: origin.trim(),
        destination: destination.trim(),
        departDate,
        returnDate: returnDate || '',
        currency,
        cabin,
        adults: Number(adults),
      })
    }
  }

  return (
    <form onSubmit={submit}>
      {multi ? (
        <div className="searchbar searchbar--legs">
          {legs.map((leg, i) => (
            <div className="leg-row" key={i}>
              <span className="leg-row__num">{i + 1}</span>
              <label className="searchbar__field">
                <span className="searchbar__label"><PlaneTakeoff /> From</span>
                <input
                  type="text"
                  className="searchbar__input"
                  placeholder="City or code"
                  value={leg.origin}
                  onChange={(e) => updateLeg(i, 'origin', e.target.value)}
                />
              </label>
              <label className="searchbar__field">
                <span className="searchbar__label"><PlaneLanding /> To</span>
                <input
                  type="text"
                  className="searchbar__input"
                  placeholder="City or code"
                  value={leg.destination}
                  onChange={(e) => updateLeg(i, 'destination', e.target.value)}
                />
              </label>
              <label className="searchbar__field">
                <span className="searchbar__label"><CalendarDays /> Date</span>
                <input
                  type="date"
                  className="searchbar__input"
                  value={leg.date}
                  min={today}
                  onChange={(e) => updateLeg(i, 'date', e.target.value)}
                />
              </label>
              {legs.length > 2 && (
                <button type="button" className="leg-row__remove" onClick={() => removeLeg(i)} aria-label="Remove leg">
                  <X />
                </button>
              )}
            </div>
          ))}
          {legs.length < 4 && (
            <button type="button" className="leg-add" onClick={addLeg}>
              <Plus size={16} /> Add leg
            </button>
          )}
        </div>
      ) : (
        <div className="searchbar searchbar--wide">
          <label className="searchbar__field">
            <span className="searchbar__label"><PlaneTakeoff /> From</span>
            <input
              type="text"
              className="searchbar__input"
              placeholder="City or code (e.g. London)"
              value={origin}
              onChange={(e) => setOrigin(e.target.value)}
            />
          </label>

          <label className="searchbar__field">
            <span className="searchbar__label"><PlaneLanding /> To</span>
            <input
              type="text"
              className="searchbar__input"
              placeholder="City or code (e.g. Paris)"
              value={destination}
              onChange={(e) => setDestination(e.target.value)}
            />
          </label>

          <label className="searchbar__field">
            <span className="searchbar__label"><CalendarDays /> Depart</span>
            <input
              type="date"
              className="searchbar__input"
              value={departDate}
              min={today}
              onChange={(e) => setDepartDate(e.target.value)}
            />
          </label>

          <label className="searchbar__field">
            <span className="searchbar__label"><CalendarDays /> Return</span>
            <input
              type="date"
              className="searchbar__input"
              value={returnDate}
              min={departDate}
              onChange={(e) => setReturnDate(e.target.value)}
              placeholder="One-way"
            />
          </label>
        </div>
      )}

      <div className="search-options">
        <label className="search-options__field">
          <Users size={15} />
          <select value={adults} onChange={(e) => setAdults(e.target.value)}>
            {[1, 2, 3, 4, 5, 6, 7, 8, 9].map((n) => (
              <option key={n} value={n}>{n} {n === 1 ? 'Adult' : 'Adults'}</option>
            ))}
          </select>
        </label>

        <label className="search-options__field">
          <span>Cabin</span>
          <select value={cabin} onChange={(e) => setCabin(e.target.value)}>
            {CABINS.map((c) => (
              <option key={c.value} value={c.value}>{c.label}</option>
            ))}
          </select>
        </label>

        <label className="search-options__field">
          <span>Currency</span>
          <select value={currency} onChange={(e) => setCurrency(e.target.value)}>
            {CURRENCIES.map((c) => (
              <option key={c} value={c}>{c}</option>
            ))}
          </select>
        </label>

        <button
          type="button"
          className={`filter-chip${multi ? ' active' : ''}`}
          onClick={() => setMulti((v) => !v)}
        >
          <Layers size={15} /> Multi-city
        </button>

        <button type="submit" className="btn btn-primary" disabled={loading}>
          {loading ? <span className="spinner" /> : <Search size={18} />}
          Search
        </button>
      </div>
    </form>
  )
}
