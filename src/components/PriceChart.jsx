import { formatPrice } from '../utils.js'

export default function PriceChart({ history = [], currency = 'USD' }) {
  if (!Array.isArray(history) || history.length < 2) return null

  const points = history
    .map((entry) => {
      const [ts, price] = Array.isArray(entry) ? entry : [entry?.date, entry?.price]
      const t = Number(ts)
      const p = Number(price)
      return Number.isFinite(p) ? { t: Number.isFinite(t) ? t : 0, price: p } : null
    })
    .filter(Boolean)

  if (points.length < 2) return null

  const W = 640
  const H = 150
  const PAD = 6
  const prices = points.map((p) => p.price)
  const min = Math.min(...prices)
  const max = Math.max(...prices)
  const times = points.map((p) => p.t)
  const t0 = Math.min(...times)
  const t1 = Math.max(...times)
  const tSpan = Math.max(1, t1 - t0)
  const pSpan = Math.max(1, max - min)

  const x = (t) => PAD + ((t - t0) / tSpan) * (W - PAD * 2)
  const y = (p) => H - PAD - ((p - min) / pSpan) * (H - PAD * 2)

  const line = points
    .map((p, i) => `${i === 0 ? 'M' : 'L'} ${x(p.t).toFixed(1)} ${y(p.price).toFixed(1)}`)
    .join(' ')

  const area = `${line} L ${x(t1).toFixed(1)} ${H - PAD} L ${x(t0).toFixed(1)} ${H - PAD} Z`

  const startDate = new Date(t0 * 1000)
  const endDate = new Date(t1 * 1000)
  const fmt = (d) =>
    d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })

  return (
    <div className="price-chart">
      <div className="price-chart__head">
        <span className="price-chart__label">Price history</span>
        <span className="price-chart__range">
          {fmt(startDate)} – {fmt(endDate)} · {formatPrice(min, currency)}–{formatPrice(max, currency)}
        </span>
      </div>
      <svg
        viewBox={`0 0 ${W} ${H}`}
        className="price-chart__svg"
        preserveAspectRatio="none"
        role="img"
        aria-label="Flight price history chart"
      >
        <path d={area} fill="rgba(113,165,222,0.16)" />
        <path
          d={line}
          fill="none"
          stroke="#71a5de"
          strokeWidth="2.5"
          strokeLinejoin="round"
          strokeLinecap="round"
        />
      </svg>
    </div>
  )
}
