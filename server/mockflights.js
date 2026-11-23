// Demo flight data generator — used when no TravelPayouts token is set,
// so the Flights page works out of the box.

import { airlineUrl } from './airlines.js'

const AIRLINES = [
  'Emirates',
  'Qatar Airways',
  'Turkish Airlines',
  'British Airways',
  'Lufthansa',
  'Air France',
  'KLM',
  'Singapore Airlines',
  'Etihad Airways',
  'Delta Air Lines',
]

function hash(str) {
  let h = 0
  for (const c of String(str)) h = (h * 31 + c.charCodeAt(0)) >>> 0
  return h
}

export function getMockFlights({ origin, destination, departDate, returnDate, adults = 1, currency = 'USD' }) {
  const o = String(origin || 'LON').trim().toUpperCase().slice(0, 3)
  const d = String(destination || 'PAR').trim().toUpperCase().slice(0, 3)
  const seed = hash(`${o}-${d}`)

  const flights = Array.from({ length: 8 }, (_, idx) => {
    const n = seed + idx
    const stops = n % 3 === 0 ? 1 : 0
    const duration = 70 + ((n * 25) % 200)
    const dep = departDate || '2026-12-01'
    const depHour = 6 + (n % 12)
    const depMin = (n * 7) % 60
    const arrMin = depHour * 60 + depMin + duration
    const arrHour = Math.floor(arrMin / 60) % 24
    const arrMinF = arrMin % 60
    const pad = (x) => String(x).padStart(2, '0')
    return {
      id: `mock-flight-${seed}-${idx}`,
      airline: AIRLINES[n % AIRLINES.length],
      airlineCode: null,
      airlineUrl: airlineUrl(AIRLINES[n % AIRLINES.length]),
      flightNumber: `SK${1300 + ((n * 17) % 900)}`,
      gate: null,
      price: 120 + ((n * 47) % 380) + stops * 60,
      currency: String(currency || 'USD').toUpperCase(),
      origin: o,
      destination: d,
      departDate: dep,
      departTime: `${dep}T${pad(depHour)}:${pad(depMin)}:00`,
      arriveTime: `${dep}T${pad(arrHour)}:${pad(arrMinF)}:00`,
      returnDate: returnDate || null,
      stops,
      duration,
      actual: true,
      bookingUrl: `https://www.aviasales.com/search/${o}${d}?currency=usd`,
    }
  })

  return { source: 'mock', origin: o, destination: d, departDate, returnDate, adults, flights }
}
