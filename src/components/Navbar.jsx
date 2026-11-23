import { useState } from 'react'
import { Link, NavLink } from 'react-router-dom'
import { Menu, X, Phone, Globe, Plane, Sun, Moon, Heart, LogOut, User } from 'lucide-react'
import { useTheme } from '../context/ThemeContext.jsx'
import { useFavorites } from '../context/FavoritesContext.jsx'
import { useAuth } from '../context/AuthContext.jsx'

const links = [
  { to: '/', label: 'Home' },
  { to: '/flights', label: 'Flights' },
  { to: '/explore', label: 'Explore' },
  { to: '/contact', label: 'Contact' },
]

export default function Navbar() {
  const [open, setOpen] = useState(false)
  const { theme, toggle } = useTheme()
  const { favorites } = useFavorites()
  const { user, logout } = useAuth()

  return (
    <>
      <div className="topbar">
        <div className="container topbar__inner">
          <div className="topbar__group">
            <span className="topbar__item">
              <Phone /> +44 20 7946 0123
            </span>
            <span className="topbar__item">
              <Globe /> 150+ countries · 500+ airlines
            </span>
          </div>
          <div className="topbar__group">
            <span className="topbar__item">Compare & save on every flight</span>
          </div>
        </div>
      </div>

      <header className="navbar">
        <div className="container navbar__inner">
          <Link to="/" className="brand" onClick={() => setOpen(false)}>
            <span className="brand__mark">
              <Plane />
            </span>
            SkyVoyage
          </Link>

          <nav className="navbar__links">
            {links.map((l) => (
              <NavLink
                key={l.to}
                to={l.to}
                end={l.to === '/'}
                className={({ isActive }) =>
                  `navbar__link${isActive ? ' active' : ''}`
                }
              >
                {l.label}
              </NavLink>
            ))}
          </nav>

          <div className="navbar__cta">
            <button
              className="navbar__icon-btn"
              onClick={toggle}
              aria-label="Toggle dark mode"
              title="Toggle dark mode"
            >
              {theme === 'dark' ? <Sun /> : <Moon />}
            </button>
            <Link to="/saved" className="navbar__icon-btn" aria-label="Saved flights" title="Saved flights">
              <Heart fill={favorites.length ? 'currentColor' : 'none'} />
              {favorites.length > 0 && <span className="navbar__badge">{favorites.length}</span>}
            </Link>
            {user ? (
              <>
                <Link to="/account" className="navbar__user" title={user.email}>
                  <User size={16} /> {user.name.split(' ')[0]}
                </Link>
                <button className="navbar__icon-btn" onClick={logout} aria-label="Sign out" title="Sign out">
                  <LogOut />
                </button>
              </>
            ) : (
              <Link to="/account" className="btn btn-outline btn-sm">
                Sign in
              </Link>
            )}
            <Link to="/flights" className="btn btn-primary btn-sm">
              Book a Flight
            </Link>
          </div>

          <button
            className="navbar__toggle"
            aria-label="Toggle menu"
            aria-expanded={open}
            onClick={() => setOpen((v) => !v)}
          >
            {open ? <X /> : <Menu />}
          </button>
        </div>

        <nav className={`mobile-menu${open ? ' open' : ''}`}>
          {links.map((l) => (
            <NavLink
              key={l.to}
              to={l.to}
              end={l.to === '/'}
              className={({ isActive }) =>
                `navbar__link${isActive ? ' active' : ''}`
              }
              onClick={() => setOpen(false)}
            >
              {l.label}
            </NavLink>
          ))}
          <div className="mobile-menu__actions">
            <button
              className="navbar__icon-btn"
              onClick={toggle}
              aria-label="Toggle dark mode"
            >
              {theme === 'dark' ? <Sun /> : <Moon />}
            </button>
            <Link to="/saved" className="navbar__icon-btn" aria-label="Saved flights" onClick={() => setOpen(false)}>
              <Heart fill={favorites.length ? 'currentColor' : 'none'} />
              {favorites.length > 0 && <span className="navbar__badge">{favorites.length}</span>}
            </Link>
            {user ? (
              <Link to="/account" className="btn btn-outline btn-sm" onClick={() => setOpen(false)}>
                <User size={15} /> {user.name.split(' ')[0]}
              </Link>
            ) : (
              <Link to="/account" className="btn btn-outline btn-sm" onClick={() => setOpen(false)}>
                Sign in
              </Link>
            )}
          </div>

          <Link to="/flights" className="btn btn-primary" onClick={() => setOpen(false)}>
            Book a Flight
          </Link>
        </nav>
      </header>
    </>
  )
}
