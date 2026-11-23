// Small date/price helpers used across pages.
export function toISO(d) {
  const y = d.getFullYear()
  const m = String(d.getMonth() + 1).padStart(2, '0')
  const day = String(d.getDate()).padStart(2, '0')
  return `${y}-${m}-${day}`
}

export function addDays(d, n) {
  const r = new Date(d)
  r.setDate(r.getDate() + n)
  return r
}

export function nightsBetween(a, b) {
  if (!a || !b) return 1
  const ms = new Date(b) - new Date(a)
  return Math.max(1, Math.round(ms / 86400000))
}

export function formatDate(iso) {
  if (!iso) return '—'
  const d = new Date(`${iso}T00:00:00`)
  return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
}

const CURRENCY_SYMBOLS = {
  USD: '$',
  EUR: '€',
  GBP: '£',
  INR: '₹',
  JPY: '¥',
  CAD: 'C$',
  AUD: 'A$',
  SGD: 'S$',
  AED: 'AED ',
}

export function currencySymbol(code) {
  const c = String(code || 'USD').toUpperCase()
  return CURRENCY_SYMBOLS[c] || `${c} `
}

export function formatPrice(n, currency) {
  return `${currencySymbol(currency)}${Number(n).toLocaleString()}`
}

export function formatTime(iso) {
  if (!iso) return ''
  const d = new Date(iso)
  if (Number.isNaN(d.getTime())) return ''
  return d.toLocaleTimeString('en-US', {
    hour: '2-digit',
    minute: '2-digit',
    hour12: false,
  })
}

export function formatDuration(mins) {
  const m = Number(mins)
  if (!m) return ''
  const h = Math.floor(m / 60)
  const mm = m % 60
  return h ? `${h}h ${mm}m` : `${mm}m`
}
