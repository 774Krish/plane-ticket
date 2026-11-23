import { useState } from 'react'
import { LogOut } from 'lucide-react'
import PageHead from '../components/PageHead.jsx'
import { useAuth } from '../context/AuthContext.jsx'

export default function Account() {
  const { user, login, signup, logout } = useAuth()
  const [mode, setMode] = useState('login')
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [busy, setBusy] = useState(false)

  if (user) {
    return (
      <>
        <PageHead title="My account" subtitle="You're signed in." />
        <section className="section" style={{ paddingTop: 48 }}>
          <div className="container" style={{ maxWidth: 640 }}>
            <div className="booking-card">
              <div className="account-profile">
                <span className="account-avatar">{user.name.charAt(0).toUpperCase()}</span>
                <div>
                  <h2 style={{ marginBottom: 2 }}>{user.name}</h2>
                  <p className="account-email">{user.email}</p>
                </div>
              </div>
              <button className="btn btn-outline" onClick={logout}>
                <LogOut size={16} /> Sign out
              </button>
            </div>
          </div>
        </section>
      </>
    )
  }

  const submit = async (e) => {
    e.preventDefault()
    setBusy(true)
    setError('')
    try {
      if (mode === 'login') await login({ email, password })
      else await signup({ name, email, password })
    } catch (err) {
      setError(err.message)
    } finally {
      setBusy(false)
    }
  }

  return (
    <>
      <PageHead
        title="Sign in"
        subtitle="Create an account to keep your searches and saved flights in one place."
      />
      <section className="section" style={{ paddingTop: 48 }}>
        <div className="container" style={{ maxWidth: 520 }}>
          <div className="booking-card">
            <div className="auth-tabs">
              <button
                className={`filter-chip${mode === 'login' ? ' active' : ''}`}
                onClick={() => {
                  setMode('login')
                  setError('')
                }}
              >
                Sign in
              </button>
              <button
                className={`filter-chip${mode === 'signup' ? ' active' : ''}`}
                onClick={() => {
                  setMode('signup')
                  setError('')
                }}
              >
                Create account
              </button>
            </div>

            <form onSubmit={submit} className="auth-form">
              {mode === 'signup' && (
                <label className="field">
                  <span>Full name</span>
                  <input
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Jane Doe"
                  />
                </label>
              )}
              <label className="field">
                <span>Email</span>
                <input
                  required
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="jane@example.com"
                />
              </label>
              <label className="field">
                <span>Password</span>
                <input
                  required
                  type="password"
                  minLength={6}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="At least 6 characters"
                />
              </label>
              {error && <p className="auth-error">{error}</p>}
              <button className="btn btn-primary" type="submit" disabled={busy}>
                {busy && <span className="spinner" />}
                {mode === 'login' ? 'Sign in' : 'Create account'}
              </button>
            </form>

            <p className="account-note">
              Demo accounts are stored locally in your browser — nothing is sent to a server.
            </p>
          </div>
        </div>
      </section>
    </>
  )
}
