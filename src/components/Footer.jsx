import { useState } from 'react'
import { Link } from 'react-router-dom'
import {
  Plane,
  MapPin,
  Phone,
  Mail,
  Instagram,
  Facebook,
  Twitter,
  Youtube,
  Send,
} from 'lucide-react'

export default function Footer() {
  const [email, setEmail] = useState('')
  const [subscribed, setSubscribed] = useState(false)

  const subscribe = (e) => {
    e.preventDefault()
    if (email.trim()) setSubscribed(true)
  }

  return (
    <footer className="footer">
      <div className="container">
        <div className="footer__grid">
          <div className="footer__brand">
            <Link to="/" className="brand">
              <span className="brand__mark">
                <Plane />
              </span>
              SkyVoyage
            </Link>
            <p className="footer__about">
              Compare hundreds of airlines and booking sites to find the
              cheapest flights — then book in seconds.
            </p>
          </div>

          <div>
            <h4>Explore</h4>
            <ul className="footer__links">
              <li><Link to="/">Home</Link></li>
              <li><Link to="/flights">Search Flights</Link></li>
              <li><Link to="/contact">Contact Us</Link></li>
            </ul>
          </div>

          <div>
            <h4>Support</h4>
            <ul className="footer__links">
              <li><a href="#faq">FAQs</a></li>
              <li><a href="#privacy">Privacy Policy</a></li>
              <li><a href="#terms">Terms of Use</a></li>
              <li><a href="#cancellation">Refund Policy</a></li>
            </ul>
          </div>

          <div>
            <h4>Stay in touch</h4>
            <ul className="footer__contact">
              <li><MapPin /> 10 Skyline Avenue, London</li>
              <li><Phone /> +44 20 7946 0123</li>
              <li><Mail /> hello@skyvoyage.com</li>
            </ul>
            {subscribed ? (
              <p className="pill pill--charcoal" style={{ marginTop: 16 }}>
                Thanks! You're on the list.
              </p>
            ) : (
              <form className="newsletter" onSubmit={subscribe}>
                <input
                  type="email"
                  placeholder="Your email address"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  aria-label="Email address"
                />
                <button type="submit" aria-label="Subscribe">
                  <Send size={17} />
                </button>
              </form>
            )}
          </div>
        </div>

        <div className="footer__bottom">
          <span>© {new Date().getFullYear()} SkyVoyage. All rights reserved.</span>
          <div className="footer__socials">
            <a href="#instagram" aria-label="Instagram"><Instagram /></a>
            <a href="#facebook" aria-label="Facebook"><Facebook /></a>
            <a href="#twitter" aria-label="Twitter"><Twitter /></a>
            <a href="#youtube" aria-label="YouTube"><Youtube /></a>
          </div>
        </div>
      </div>
    </footer>
  )
}
