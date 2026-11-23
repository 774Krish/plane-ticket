# SkyVoyage — Flight Ticket Website

A React + Vite flight search site with a cool blue palette
(`#f8f9fb` · `#e1ecf7` · `#aecbeb` · `#83b0e1` · `#71a5de`), powered by
[Google Flights via SerpAPI](https://serpapi.com/google-flights-api) with
[TravelPayouts](https://www.travelpayouts.com) as a fallback.

## ✨ Feature list

**Flight search**
- Live flight search with real airlines, flight numbers, times, durations and prices
- One-way and round-trip search
- **Multi-city** search (up to 4 legs)
- **Cabin class** — Economy, Premium economy, Business, First
- **Passenger count** — 1–9 adults
- **Currency selector** — USD, EUR, GBP, INR

**Smart travel tools**
- **Price insights** — lowest price, "prices are low/high" signal, typical range
- **Price history graph** — 60-day SVG chart
- **Explore by budget** — cheapest destinations from your city with a budget slider
- Popular routes on the home page

**Personalisation**
- **User accounts** — sign up, sign in, sign out (hashed passwords, stored locally)
- **Saved flights** — bookmark fares with a heart and view them on `/saved`
- **Recent search history** — one-click re-search of past routes
- **Dark mode** — light/dark theme toggle

**Details**
- Book buttons link to the **airline's own website** (with Ryanair & Wizz deep links)
- Fully **responsive** (mobile menu, no horizontal scroll)
- Graceful fallbacks: SerpAPI → TravelPayouts → demo data

## Pages

| Route | What it does |
|---|---|
| `/` | Home — hero search, popular routes, features, testimonials |
| `/flights` | Search + results, price insights & chart |
| `/explore` | Explore by budget |
| `/saved` | Your saved flights |
| `/account` | Sign in / sign up |
| `/contact` | Contact form |

## Backend (Express)

- `GET /api/flights/search` — full search (SerpAPI → TravelPayouts → demo)
- `GET /api/explore` — cheapest destinations for a route
- `GET /api/health` — which provider is active

## Quick start (demo mode)

```powershell
npm install
npm run dev:all
```

Open http://localhost:5173 — no API keys needed; you'll get demo results.

- Frontend: http://localhost:5173
- Backend: http://localhost:3001

## Enable live flight data

### Option A — SerpAPI (recommended: real airlines + specific dates)

1. Create a free account at https://serpapi.com (free tier: ~100 searches/month).
2. Copy your **API key** from the dashboard.
3. Copy the template:

   ```powershell
   Copy-Item .env.example .env
   ```

4. Edit `.env` and fill in:

   ```
   SERPAPI_API_KEY=your_api_key
   ```

5. Restart (`npm run dev:all`). The Flights page shows real airlines,
   flight numbers, times and prices for your exact dates, with the badge
   **"Live data · Google Flights"**.

### Option B — TravelPayouts (fallback: monthly cheapest fares)

Set `TRAVELPAYOUTS_TOKEN` in `.env` (free at https://www.travelpayouts.com →
Tools → API). Without a SerpAPI key, the site uses TravelPayouts' cheapest
fares for the current month.

## Individual commands

| Command | What it does |
|---|---|
| `npm run dev` | Frontend only |
| `npm run server` | Backend only |
| `npm run dev:all` | Both together |
| `npm run build` | Production build |

## Project structure

```
src/            React app (pages, components, styles, contexts)
server/         Express API (SerpAPI + TravelPayouts + demo fallback)
  index.js          API server
  serpapi.js        Google Flights (SerpAPI) search logic
  travelpayouts.js  TravelPayouts monthly-fares logic
  explore.js        Cheapest-destinations logic
  airlines.js       Airline → website + deep-link mapping
  mockflights.js    Demo flight data generator
public/favicon.svg  Site icon
.env.example    Template for API credentials
```

## Note

- `.env` is git-ignored — never commit your API keys.
- Accounts are **frontend-only demos** (stored in localStorage) — wire up a
  real backend + database for production.
- Flight results link out to the airline/Google Flights to book; no payment
  is processed on this site itself.
