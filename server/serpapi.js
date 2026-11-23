// SerpAPI — Google Flights search (real airlines, specific dates, prices).
// Docs: https://serpapi.com/google-flights-api
// Free tier: ~100 searches/month at https://serpapi.com

import { airlineUrl, airlineDeepLink } from './airlines.js'

const API = 'https://serpapi.com/search.json'
const AUTOCOMPLETE = 'https://autocomplete.travelpayouts.com'

const TRAVEL_CLASS = {
  economy: '1',
  premium_economy: '2',
  business: '3',
  first: '4',
}

export function hasCredentials() {
  return Boolean(process.env.SERPAPI_API_KEY)
}

async function resolveAirport(term) {
  const t = String(term || '').trim()
  if (!t) return null
  if (/^[A-Za-z]{3}$/.test(t)) return t.toUpperCase()

  // Prefer a specific airport; fall back to the city code (some cities have
  // no airport entries in the autocomplete data, e.g. Berlin).
  for (const type of ['airport', 'city']) {
    try {
      const res = await fetch(
        `${AUTOCOMPLETE}/places2?term=${encodeURIComponent(t)}&locale=en&types%5B%5D=${type}`,
      )
      if (!res.ok) continue
      const data = await res.json()
      const match = (Array.isArray(data) ? data : []).find(
        (d) => d.code && /^[A-Z]{3}$/.test(d.code),
      )
      if (match) return match.code
    } catch {
      /* try next type */
    }
  }
  return null
}

// "2026-12-15 08:00" -> "2026-12-15T08:00:00"
function toTime(value) {
  if (!value) return null
  return String(value).replace(' ', 'T')
}

function mapFlights({ items, o, d, departDate, returnDate, gflightsUrl, currency = 'USD' }) {
  return items.map((f, idx) => {
    const segs = Array.isArray(f.flights) ? f.flights : []
    const first = segs[0] || {}
    const last = segs[segs.length - 1] || {}
    const airlines = [...new Set(segs.map((s) => s.airline).filter(Boolean))]
    const firstAirline = first.airline || null

    return {
      id: `sf-${o}-${d}-${departDate}-${idx}`,
      airline: airlines.join(' + ') || 'Unknown airline',
      airlineCode: null,
      flightNumber: first.flight_number || null,
      gate: null,
      price: f.price,
      currency,
      origin: o,
      destination: d,
      departDate: (toTime(first.departure_airport?.time) || departDate).slice(0, 10),
      departTime: toTime(first.departure_airport?.time),
      arriveTime: toTime(last.arrival_airport?.time),
      returnDate: returnDate || null,
      stops: (f.layovers || []).length || Math.max(0, segs.length - 1),
      duration: f.total_duration || null,
      actual: true,
      airlineUrl:
        (firstAirline &&
          airlineDeepLink(firstAirline, { origin: o, destination: d, departDate, returnDate })) ||
        (firstAirline ? airlineUrl(firstAirline) : null),
      bookingUrl: gflightsUrl,
    }
  })
}

export async function searchSerpapi({
  origin,
  destination,
  departDate,
  returnDate,
  adults = 1,
  currency = 'USD',
  cabin = 'economy',
  legs = [],
}) {
  const key = process.env.SERPAPI_API_KEY
  const travelClass = TRAVEL_CLASS[cabin] || '1'
  const cur = String(currency || 'USD').toUpperCase()
  const isMultiCity = Array.isArray(legs) && legs.length >= 2

  let params
  let o
  let d

  if (isMultiCity) {
    const resolvedLegs = []
    for (const leg of legs) {
      const [lo, ld] = await Promise.all([resolveAirport(leg.origin), resolveAirport(leg.destination)])
      if (!lo || !ld) {
        throw new Error(`Could not resolve "${leg.origin}" / "${leg.destination}" to airport codes.`)
      }
      resolvedLegs.push({ departure_id: lo, arrival_id: ld, date: leg.date })
    }
    o = resolvedLegs[0].departure_id
    d = resolvedLegs[resolvedLegs.length - 1].arrival_id

    params = new URLSearchParams({
      engine: 'google_flights',
      type: '3',
      multi_city_json: JSON.stringify(resolvedLegs),
      currency: cur,
      hl: 'en',
      gl: 'us',
      api_key: key,
      travel_class: travelClass,
      adults: String(adults),
    })
  } else {
    ;[o, d] = await Promise.all([resolveAirport(origin), resolveAirport(destination)])
    if (!o || !d) {
      throw new Error(
        `Could not resolve "${origin}" / "${destination}" to airport codes. Try IATA codes (e.g. LHR, CDG).`,
      )
    }

    params = new URLSearchParams({
      engine: 'google_flights',
      departure_id: o,
      arrival_id: d,
      outbound_date: departDate,
      currency: cur,
      hl: 'en',
      gl: 'us',
      api_key: key,
      travel_class: travelClass,
      adults: String(adults),
    })
    if (returnDate) {
      params.set('type', '1') // Round trip
      params.set('return_date', returnDate)
    } else {
      params.set('type', '2') // One way
    }
  }

  const res = await fetch(`${API}?${params.toString()}`)
  if (!res.ok) {
    const text = await res.text()
    throw new Error(`SerpAPI failed (${res.status}): ${text.slice(0, 200)}`)
  }
  const data = await res.json()
  if (data.error) {
    throw new Error(`SerpAPI error: ${data.error}`)
  }

  const gflightsUrl =
    data.search_metadata?.google_flights_url ||
    `https://www.google.com/travel/flights?q=Flights%20from%20${o}%20to%20${d}`

  const items = [...(data.best_flights || []), ...(data.other_flights || [])]
  const flights = mapFlights({ items, o, d, departDate, returnDate, gflightsUrl, currency: cur })

  return {
    source: 'serpapi',
    origin: o,
    destination: d,
    departDate,
    returnDate,
    adults,
    currency: cur,
    cabin,
    detailed: true,
    priceInsights: data.price_insights || null,
    flights: flights.slice(0, 20),
  }
}
