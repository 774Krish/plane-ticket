import { Heart, Plane, ArrowRight } from 'lucide-react'
import { formatPrice, formatDate, formatTime, formatDuration } from '../utils.js'

export default function FlightCard({ flight: f, isFavorite, onToggleFavorite, showFavorite = true }) {
  return (
    <article className="flight-card">
      <div className="flight-card__top">
        <span className="flight-card__airline">
          <Plane size={16} /> {f.airline || f.gate || 'Best available fare'}
          {f.flightNumber && <span className="flight-card__flightno">#{f.flightNumber}</span>}
        </span>
        <div className="flight-card__pricewrap">
          {showFavorite && (
            <button
              className={`flight-card__fav${isFavorite ? ' active' : ''}`}
              onClick={() => onToggleFavorite(f)}
              aria-label={isFavorite ? 'Remove from saved' : 'Save flight'}
              title={isFavorite ? 'Remove from saved' : 'Save flight'}
            >
              <Heart fill={isFavorite ? 'currentColor' : 'none'} />
            </button>
          )}
          <span className="flight-card__price">{formatPrice(f.price, f.currency)}</span>
        </div>
      </div>

      <div className="flight-card__route">
        <span className="flight-card__leg">
          <strong>{f.origin}</strong> {formatDate(f.departDate)}
          {f.departTime ? ` · ${formatTime(f.departTime)}` : ''}
        </span>
        <span className="flight-card__arrow"><ArrowRight size={16} /></span>
        <span className="flight-card__leg">
          <strong>{f.destination}</strong>{' '}
          {f.arriveTime
            ? `${formatDate(f.arriveTime.slice(0, 10))} · ${formatTime(f.arriveTime)}`
            : f.returnDate
              ? formatDate(f.returnDate)
              : ''}
        </span>
        {f.duration ? (
          <span className="pill pill--charcoal">{formatDuration(f.duration)}</span>
        ) : null}
        <span className="pill pill--charcoal">
          {f.stops === 0 ? 'Direct' : `${f.stops} stop${f.stops > 1 ? 's' : ''}`}
        </span>
      </div>

      <div className="flight-card__footer">
        <span className="flight-card__currency">{f.currency}</span>
        <a
          className="btn btn-primary btn-sm"
          href={f.airlineUrl || f.bookingUrl}
          target="_blank"
          rel="noreferrer"
        >
          Book <ArrowRight size={15} />
        </a>
      </div>
    </article>
  )
}
