// TravelPayouts (Aviasales) Flight API — free affiliate access.
// Docs: https://support.travelpayouts.com/hc/en-us/categories/200358578-Flight-API
//
// Two modes:
//  - With a TRAVELPAYOUTS_MARKER: full itineraries (specific dates, airlines,
//    flight numbers, times) via /v1/flight_search.
//  - Without a marker: cheapest fares per date for the current month via
//    /v2/prices/latest.

const API = 'https://api.travelpayouts.com'
const AUTOCOMPLETE = 'https://autocomplete.travelpayouts.com'

const AIRLINES = {
  SU: 'Aeroflot', BA: 'British Airways', AF: 'Air France', LH: 'Lufthansa',
  EK: 'Emirates', QR: 'Qatar Airways', TK: 'Turkish Airlines', KL: 'KLM',
  AA: 'American Airlines', DL: 'Delta Air Lines', UA: 'United Airlines',
  FR: 'Ryanair', U2: 'easyJet', W6: 'Wizz Air', VY: 'Vueling', IB: 'Iberia',
  AZ: 'ITA Airways', LX: 'SWISS', OS: 'Austrian Airlines', SK: 'SAS',
  DY: 'Norwegian', AY: 'Finnair', LO: 'LOT Polish Airlines', TP: 'TAP Air Portugal',
  EY: 'Etihad Airways', SQ: 'Singapore Airlines', CX: 'Cathay Pacific',
  NH: 'ANA', JL: 'Japan Airlines', KE: 'Korean Air', OZ: 'Asiana Airlines',
  QF: 'Qantas', VS: 'Virgin Atlantic',
}

export function hasCredentials() {
  return Boolean(process.env.TRAVELPAYOUTS_TOKEN)
}

export async function resolveCode(term) {
  const t = String(term || '').trim()
  if (!t) return null
  if (/^[A-Za-z]{3}$/.test(t)) return t.toUpperCase()

  try {
    const res = await fetch(
      `${AUTOCOMPLETE}/places2?term=${encodeURIComponent(t)}&locale=en&types%5B%5D=city`,
    )
    if (!res.ok) return null
    const data = await res.json()
    const match = (Array.isArray(data) ? data : []).find(
      (d) => d.code && /^[A-Z]{3}$/.test(d.code),
    )
    return match ? match.code : null
  } catch {
    return null
  }
}

function toDDMM(iso) {
  if (!iso) return ''
  const [, m, d] = iso.split('-')
  return `${d}${m}`
}

export function bookingUrl({ origin, destination, departDate, returnDate }) {
  const marker = process.env.TRAVELPAYOUTS_MARKER
  let url = `https://www.aviasales.com/search/${origin}${toDDMM(departDate)}${destination}${toDDMM(returnDate)}`
  url += marker ? `?marker=${encodeURIComponent(marker)}` : '?currency=usd'
  return url
}

export async function searchFlights({ origin, destination, departDate, returnDate, adults = 1, currency = 'USD' }) {
  const token = process.env.TRAVELPAYOUTS_TOKEN
  const [o, d] = await Promise.all([resolveCode(origin), resolveCode(destination)])

  if (!o || !d) {
    throw new Error(
      `Could not resolve "${origin}" / "${destination}" to airport codes. Try IATA codes (e.g. LON, PAR).`,
    )
  }

  const cur = String(currency || 'USD').toUpperCase()
  const marker = process.env.TRAVELPAYOUTS_MARKER

  if (marker) {
    try {
      return await searchDetailed({ o, d, departDate, returnDate, adults, token, marker })
    } catch (err) {
      console.warn('[flights] detailed search failed, falling back to month fares:', err.message)
      const month = await searchMonth({ o, d, token, cur })
      return { ...month, departDate, returnDate, adults, warning: err.message }
    }
  }

  const month = await searchMonth({ o, d, token, cur })
  return { ...month, departDate, returnDate, adults }
}

async function searchDetailed({ o, d, departDate, returnDate, adults, token, marker }) {
  const params = new URLSearchParams({
    origin: o,
    destination: d,
    depart_date: departDate,
    adults,
    currency: 'usd',
    trip_class: '0',
    marker,
    token,
  })
  if (returnDate) params.set('return_date', returnDate)

  const res = await fetch(`${API}/v1/flight_search?${params.toString()}`)
  if (!res.ok) {
    const text = await res.text()
    throw new Error(`TravelPayouts flight_search failed (${res.status}): ${text.slice(0, 200)}`)
  }
  const raw = await res.json()
  const list = Array.isArray(raw) ? raw : raw.data || []

  const flights = list.map((f, idx) => {
    const segs = Array.isArray(f.segments) ? f.segments : []
    const first = segs[0] || {}
    const last = segs[segs.length - 1] || {}
    const airlineCodes = [...new Set(segs.map((s) => s.airline).filter(Boolean))]
    const airlineNames = airlineCodes.map((c) => AIRLINES[c] || c)
    const stops = segs.reduce((n, s) => n + (Number(s.number_of_changes) || 0), 0)
    const duration = segs.reduce((n, s) => n + (Number(s.duration) || 0), 0)

    return {
      id: f.signature || `detailed-${idx}`,
      airline: airlineNames.join(' + ') || 'Unknown airline',
      airlineCode: airlineCodes.join('+'),
      flightNumber: first.flight_number || null,
      gate: null,
      price: f.price,
      currency: 'USD',
      origin: first.origin || o,
      destination: last.destination || d,
      departDate: (first.departure || '').slice(0, 10) || departDate,
      departTime: first.departure || null,
      arriveTime: last.arrival || null,
      returnDate: segs.length > 1 ? (last.departure || '').slice(0, 10) : returnDate || null,
      stops,
      duration,
      actual: true,
      bookingUrl: bookingUrl({ origin: o, destination: d, departDate, returnDate }),
    }
  })

  return { source: 'travelpayouts', origin: o, destination: d, departDate, returnDate, adults, detailed: true, flights }
}

async function searchMonth({ o, d, token, cur = 'USD' }) {
  const params = new URLSearchParams({
    currency: cur.toLowerCase(),
    origin: o,
    destination: d,
    period_type: 'month',
    token,
  })

  const res = await fetch(`${API}/v2/prices/latest?${params.toString()}`)
  if (!res.ok) {
    const text = await res.text()
    throw new Error(`TravelPayouts prices failed (${res.status}): ${text.slice(0, 200)}`)
  }
  const data = await res.json()

  const flights = (data.data || []).map((f, idx) => ({
    id: `${f.origin}-${f.destination}-${f.depart_date}-${f.return_date || 'ow'}-${idx}`,
    airline: null,
    airlineCode: null,
    flightNumber: null,
    gate: f.gate || null,
    price: f.value,
    currency: (f.currency || 'USD').toUpperCase(),
    origin: f.origin || o,
    destination: f.destination || d,
    departDate: f.depart_date,
    departTime: null,
    arriveTime: null,
    returnDate: f.return_date || null,
    stops: f.number_of_changes ?? 0,
    duration: null,
    actual: Boolean(f.actual),
    bookingUrl: bookingUrl({
      origin: f.origin || o,
      destination: f.destination || d,
      departDate: f.depart_date,
      returnDate: f.return_date,
    }),
  }))

  flights.sort((a, b) => String(a.departDate).localeCompare(String(b.departDate)))

  return { source: 'travelpayouts', origin: o, destination: d, detailed: false, flights: flights.slice(0, 20) }
}
