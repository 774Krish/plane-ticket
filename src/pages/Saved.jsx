import { Link } from 'react-router-dom'
import PageHead from '../components/PageHead.jsx'
import FlightCard from '../components/FlightCard.jsx'
import { useFavorites } from '../context/FavoritesContext.jsx'

export default function Saved() {
  const { favorites, remove } = useFavorites()

  return (
    <>
      <PageHead title="Saved flights" subtitle="Flights you've bookmarked for later." />
      <section className="section" style={{ paddingTop: 48 }}>
        <div className="container">
          {favorites.length === 0 ? (
            <div className="empty">
              <div className="empty__icon">💙</div>
              <h2>No saved flights</h2>
              <p>Tap the heart on any flight to save it here.</p>
              <Link to="/flights" className="btn btn-primary">
                Search flights
              </Link>
            </div>
          ) : (
            <div className="flight-list">
              {favorites.map((f) => (
                <FlightCard
                  key={f.id}
                  flight={f}
                  isFavorite
                  onToggleFavorite={() => remove(f.id)}
                />
              ))}
            </div>
          )}
        </div>
      </section>
    </>
  )
}
