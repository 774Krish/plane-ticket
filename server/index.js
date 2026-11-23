import 'dotenv/config'
import express from 'express'
import cors from 'cors'
import { getMockFlights } from './mockflights.js'
import { hasCredentials as hasTpKey, searchFlights } from './travelpayouts.js'
import { hasCredentials as hasSerpKey, searchSerpapi } from './serpapi.js'
import { exploreDestinations } from './explore.js'

const app = express()
const PORT = process.env.PORT || 3001

app.use(cors())
app.use(express.json())

app.get('/api/health', (_req, res) => {
  res.json({
    ok: true,
    live: hasSerpKey() || hasTpKey(),
    serpapi: hasSerpKey(),
    travelpayouts: hasTpKey(),
  })
})

app.get('/api/flights/search', async (req, res) => {
  // Multi-city: legs arrive as a JSON-encoded array.
  let legs = []
  try {
    const parsed = req.query.legs ? JSON.parse(req.query.legs) : []
    if (Array.isArray(parsed)) legs = parsed
  } catch {
    legs = []
  }

  const firstLeg = legs[0] || {}
  const origin = String(req.query.origin || firstLeg.origin || '').trim()
  const destination = String(req.query.destination || firstLeg.destination || '').trim()
  const departDate = req.query.departDate || firstLeg.date || ''

  if (!origin || !destination || !departDate) {
    return res.status(400).json({ error: '"origin", "destination" and "departDate" are required.' })
  }

  const params = {
    origin,
    destination,
    departDate,
    returnDate: req.query.returnDate || null,
    adults: Math.min(9, Math.max(1, Number(req.query.adults) || 1)),
    currency: String(req.query.currency || 'USD').toUpperCase(),
    cabin: req.query.cabin || 'economy',
    legs,
  }

  try {
    if (hasSerpKey()) {
      return res.json(await searchSerpapi(params))
    }
    if (hasTpKey()) {
      return res.json(await searchFlights(params))
    }
    return res.json(getMockFlights(params))
  } catch (err) {
    console.error('[flights]', err.message)
    // Fall back to TravelPayouts monthly fares if available, else demo data.
    if (hasTpKey()) {
      try {
        const month = await searchFlights(params)
        return res.json({ ...month, warning: err.message })
      } catch {
        /* fall through to mock */
      }
    }
    return res.json({ ...getMockFlights(params), warning: err.message })
  }
})

app.get('/api/explore', async (req, res) => {
  const { origin, currency, budget } = req.query
  if (!origin || !String(origin).trim()) {
    return res.status(400).json({ error: '"origin" (departure city) is required.' })
  }
  try {
    const result = await exploreDestinations({
      origin: String(origin).trim(),
      currency: String(currency || 'USD').toUpperCase(),
      budget: Number(budget) || 0,
    })
    return res.json(result)
  } catch (err) {
    console.error('[explore]', err.message)
    return res.status(500).json({ error: err.message })
  }
})

app.listen(PORT, () => {
  let mode = 'MOCK (no flight API keys)'
  if (hasSerpKey()) mode = 'LIVE (SerpAPI / Google Flights)'
  else if (hasTpKey()) mode = 'LIVE (TravelPayouts monthly fares)'
  console.log(`Flight API server listening on http://localhost:${PORT} — ${mode}`)
})
