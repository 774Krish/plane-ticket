import { Routes, Route } from 'react-router-dom'
import Navbar from './components/Navbar.jsx'
import Footer from './components/Footer.jsx'
import ScrollToTop from './components/ScrollToTop.jsx'
import { ThemeProvider } from './context/ThemeContext.jsx'
import { FavoritesProvider } from './context/FavoritesContext.jsx'
import { AuthProvider } from './context/AuthContext.jsx'
import Home from './pages/Home.jsx'
import Flights from './pages/Flights.jsx'
import Saved from './pages/Saved.jsx'
import Explore from './pages/Explore.jsx'
import Account from './pages/Account.jsx'
import Contact from './pages/Contact.jsx'

export default function App() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <FavoritesProvider>
          <ScrollToTop />
          <Navbar />
          <main>
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/flights" element={<Flights />} />
              <Route path="/explore" element={<Explore />} />
              <Route path="/saved" element={<Saved />} />
              <Route path="/account" element={<Account />} />
              <Route path="/contact" element={<Contact />} />
              <Route path="*" element={<Home />} />
            </Routes>
          </main>
          <Footer />
        </FavoritesProvider>
      </AuthProvider>
    </ThemeProvider>
  )
}
