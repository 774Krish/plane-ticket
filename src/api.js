// Frontend API helpers — calls the Express backend (proxied via /api).
async function request(path, params) {
  const q = new URLSearchParams()
  for (const [k, v] of Object.entries(params)) {
    if (v === undefined || v === null || v === '') continue
    q.set(k, Array.isArray(v) ? JSON.stringify(v) : String(v))
  }
  const res = await fetch(`${path}?${q.toString()}`)
  const data = await res.json().catch(() => ({}))
  if (!res.ok) {
    throw new Error(data.error || `Request failed (${res.status})`)
  }
  return data
}

export function searchFlights(params) {
  return request('/api/flights/search', params)
}

export function exploreDestinations(params) {
  return request('/api/explore', params)
}
