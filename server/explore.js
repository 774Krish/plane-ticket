// "Explore by budget" — cheapest destinations from an origin.
// Uses TravelPayouts month-matrix when a token is set, else curated demo data.

import { resolveCode } from './travelpayouts.js'

const API = 'https://api.travelpayouts.com'

const CITY_NAMES = {
  LON: 'London', PAR: 'Paris', BER: 'Berlin', ROM: 'Rome', MAD: 'Madrid',
  BCN: 'Barcelona', AMS: 'Amsterdam', DUB: 'Dublin', LIS: 'Lisbon', VIE: 'Vienna',
  PRG: 'Prague', BUD: 'Budapest', IST: 'Istanbul', DXB: 'Dubai', DOH: 'Doha',
  BKK: 'Bangkok', SIN: 'Singapore', KUL: 'Kuala Lumpur', HKG: 'Hong Kong',
  TYO: 'Tokyo', OSA: 'Osaka', ICN: 'Seoul', BOM: 'Mumbai', DEL: 'Delhi',
  KTM: 'Kathmandu', NYC: 'New York', LAX: 'Los Angeles', CHI: 'Chicago',
  MIA: 'Miami', SFO: 'San Francisco', YYZ: 'Toronto', SYD: 'Sydney',
  MEL: 'Melbourne', AUH: 'Abu Dhabi', RUH: 'Riyadh', CAI: 'Cairo',
  ATH: 'Athens', CPH: 'Copenhagen', OSL: 'Oslo', STO: 'Stockholm', HEL: 'Helsinki',
  WAW: 'Warsaw', KRK: 'Krakow', ZRH: 'Zurich', GVA: 'Geneva', BRU: 'Brussels',
  FRA: 'Frankfurt', MUC: 'Munich', HAM: 'Hamburg', DUS: 'Dusseldorf',
}

const MOCK_DESTINATIONS = [
  { code: 'PAR', price: 49 }, { code: 'BCN', price: 59 }, { code: 'AMS', price: 65 },
  { code: 'DUB', price: 55 }, { code: 'ROM', price: 79 }, { code: 'BER', price: 69 },
  { code: 'PRG', price: 74 }, { code: 'LIS', price: 89 }, { code: 'ATH', price: 99 },
  { code: 'IST', price: 129 }, { code: 'DXB', price: 199 }, { code: 'BKK', price: 249 },
  { code: 'SIN', price: 219 }, { code: 'BOM', price: 239 }, { code: 'TYO', price: 289 },
]

export async function exploreDestinations({ origin, currency = 'USD', budget = 0 }) {
  const cur = String(currency || 'USD').toUpperCase()
  const code = await resolveCode(origin)
  const token = process.env.TRAVELPAYOUTS_TOKEN

  if (token && code) {
    try {
      const params = new URLSearchParams({
        currency: cur.toLowerCase(),
        origin: code,
        show_to_affiliates: 'false',
        token,
      })
      const res = await fetch(`${API}/v2/prices/month-matrix?${params.toString()}`)
      if (!res.ok) throw new Error(`month-matrix failed (${res.status})`)
      const data = await res.json()

      let rows = (data.data || []).map((r) => ({
        code: r.destination,
        city: CITY_NAMES[r.destination] || r.destination,
        price: r.value,
        departDate: r.depart_date,
        returnDate: r.return_date,
        stops: r.number_of_changes ?? 0,
      }))
      rows = rows.filter((r) => !budget || r.price <= Number(budget))
      rows.sort((a, b) => a.price - b.price)

      return { source: 'travelpayouts', origin: code, currency: cur, destinations: rows.slice(0, 15) }
    } catch (err) {
      console.warn('[explore] live failed, using demo data:', err.message)
    }
  }

  let rows = MOCK_DESTINATIONS.map((d, i) => ({
    code: d.code,
    city: CITY_NAMES[d.code] || d.code,
    price: d.price + ((i * 7) % 40),
    departDate: null,
    returnDate: null,
    stops: i % 3 === 0 ? 1 : 0,
  }))
  rows = rows.filter((r) => !budget || r.price <= Number(budget))

  return {
    source: 'mock',
    origin: code || String(origin).trim().toUpperCase(),
    currency: cur,
    destinations: rows,
  }
}
