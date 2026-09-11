import { useEffect, useMemo, useState } from 'react'
import './App.css'

type SavedChallenge = {
  id: number
  challenge: string
  category1: string
  category2: string
}

const AUTH_API_URL = 'http://127.0.0.1:8000'

const categories1 = ['Healthcare', 'Gaming', 'Education', 'Finance']
const categories2 = ['Agriculture', 'AI', 'Maps', 'Accessibility']

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [showAuthScreen, setShowAuthScreen] = useState(false)
  const [currentUsername, setCurrentUsername] = useState('')

  useEffect(() => {
    const token = localStorage.getItem('access_token')

    if (!token) return

    fetch(`${AUTH_API_URL}/auth/me`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error('Invalid session')
        }

        return response.json()
      })
      .then((user) => {
        setCurrentUsername(user.username)
        setIsAuthenticated(true)
      })
      .catch(() => {
        localStorage.removeItem('access_token')
        setIsAuthenticated(false)
      })
  }, [])

  const [authMode, setAuthMode] = useState<'login' | 'register'>('login')
  const [username, setUsername] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [authError, setAuthError] = useState('')
  const [authLoading, setAuthLoading] = useState(false)

  const [category1, setCategory1] = useState('')
  const [category2, setCategory2] = useState('')
  const [customCategory1, setCustomCategory1] = useState('')
  const [customCategory2, setCustomCategory2] = useState('')

  const [challenge, setChallenge] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const API_URL = import.meta.env.PROD
    ? 'https://idea-collision-machine.onrender.com/api/challenge'
    : 'http://localhost:3001/api/challenge'

  const [savedChallenges, setSavedChallenges] = useState<SavedChallenge[]>([])
  const [seenChallenges, setSeenChallenges] = useState<string[]>([])

  const savedCount = savedChallenges.length

  const categoriesUsed = useMemo(() => {
    const categories = new Set<string>()

    savedChallenges.forEach((item) => {
      if (item.category1) categories.add(item.category1)
      if (item.category2) categories.add(item.category2)
    })

    return categories.size
  }, [savedChallenges])

  const savedCategoryCounts = useMemo(() => {
    const counts: Record<string, number> = {}

    savedChallenges.forEach((item) => {
      if (item.category1) {
        counts[item.category1] = (counts[item.category1] || 0) + 1
      }

      if (item.category2) {
        counts[item.category2] = (counts[item.category2] || 0) + 1
      }
    })

    return Object.entries(counts)
  }, [savedChallenges])

  function saveChallenges(challenges: SavedChallenge[]) {
    setSavedChallenges(challenges)
  }

  async function handleAuth() {
    setAuthLoading(true)
    setAuthError('')

    try {
      if (authMode === 'register') {
        const registerResponse = await fetch(
          `${AUTH_API_URL}/auth/register`,
          {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              username,
              email,
              password,
            }),
          }
        )

        if (!registerResponse.ok) {
          const data = await registerResponse.json()
          throw new Error(data.detail || 'Registration failed.')
        }
      }

      const loginBody = new URLSearchParams()
      loginBody.append('username', username)
      loginBody.append('password', password)

      const loginResponse = await fetch(
        `${AUTH_API_URL}/auth/login`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
          },
          body: loginBody,
        }
      )

      if (!loginResponse.ok) {
        const data = await loginResponse.json()
        throw new Error(data.detail || 'Login failed.')
      }

      const data = await loginResponse.json()

      localStorage.setItem('access_token', data.access_token)

      const meResponse = await fetch(`${AUTH_API_URL}/auth/me`, {
        headers: {
          Authorization: `Bearer ${data.access_token}`,
        },
      })

      if (!meResponse.ok) {
        throw new Error('Unable to load your account.')
      }

      const user = await meResponse.json()

      setCurrentUsername(user.username)
      setIsAuthenticated(true)
      setChallenge('')
      setCategory1('')
      setCategory2('')
      setSeenChallenges([])
      setError('')
      loadSavedChallenges()
      setAuthError('')
    } catch (error) {
      setAuthError(
        error instanceof Error
          ? error.message
          : 'Something went wrong.'
      )
    } finally {
      setAuthLoading(false)
    }
  }

  async function generateChallenge() {
    const selectedCategory1 = category1.trim()
    const selectedCategory2 = category2.trim()

    if (!selectedCategory1 || !selectedCategory2 || loading) return

    setLoading(true)
    setError('')

    try {
      const response = await fetch(API_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          category1,
          category2,
          seenChallenges,
        }),
      })

      if (!response.ok) {
        throw new Error('Unable to generate a challenge.')
      }

      const data = await response.json()

      if (data.challenge === 'ALL_CHALLENGES_USED') {
        setChallenge(
          'You have explored all the challenges for this collision. Start a new round!'
        )
        setSeenChallenges([])
        return
      }

      setChallenge(data.challenge)
      setSeenChallenges((current) => [...current, data.challenge])
    } catch {
      setError(
        'Something went wrong while creating your collision. Please try again.'
      )
    } finally {
      setLoading(false)
    }
  }

  async function remixChallenge(savedChallenge: SavedChallenge) {
    if (
      !savedChallenge.category1 ||
      !savedChallenge.category2 ||
      loading
    ) {
      return
    }

    setLoading(true)
    setError('')

    try {
      const response = await fetch(API_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          category1: savedChallenge.category1,
          category2: savedChallenge.category2,
          seenChallenges: [savedChallenge.challenge, challenge],
        }),
      })

      if (!response.ok) {
        throw new Error('Unable to remix challenge.')
      }

      const data = await response.json()

      setCategory1(savedChallenge.category1)
      setCategory2(savedChallenge.category2)
      setChallenge(data.challenge)
    } catch {
      setError('Unable to remix this challenge. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  function chooseCategory1(category: string) {
    setCategory1(category)
    setCustomCategory1('')
    setChallenge('')
    setError('')
    setSeenChallenges([])
  }

  function chooseCategory2(category: string) {
    setCategory2(category)
    setCustomCategory2('')
    setChallenge('')
    setError('')
    setSeenChallenges([])
  }

  async function loadSavedChallenges() {
    const token = localStorage.getItem('access_token')

    if (!token) return

    try {
      const response = await fetch(`${AUTH_API_URL}/challenges`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })

      if (!response.ok) {
        throw new Error('Failed to load saved challenges')
      }

      const data = await response.json()

      setSavedChallenges(data)
    } catch (error) {
      console.error('Error loading saved challenges:', error)
    }
  }

  async function saveCurrentChallenge() {
    if (!challenge || !category1 || !category2) return

    const alreadySaved = savedChallenges.some(
      (item) =>
        item.challenge === challenge &&
        item.category1 === category1 &&
        item.category2 === category2
    )

    if (alreadySaved) return

    const token = localStorage.getItem('access_token')

    if (!token) {
      setShowAuthScreen(true)
      return
    }

    try {
      const response = await fetch(`${AUTH_API_URL}/challenges/save`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          challenge,
          category1,
          category2,
        }),
      })

      if (!response.ok) {
        throw new Error('Failed to save challenge')
      }

      const data = await response.json()

      saveChallenges([
        ...savedChallenges,
        {
          id: data.id,
          challenge,
          category1,
          category2,
        },
      ])
    } catch (error) {
      console.error('Error saving challenge:', error)
    }
  }

  async function deleteChallenge(id: number) {
    const token = localStorage.getItem('access_token')

    if (!token) {
      return
    }

    try {
      const response = await fetch(
        `${AUTH_API_URL}/challenges/${id}`,
        {
          method: 'DELETE',
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      )

      if (!response.ok) {
        throw new Error('Failed to delete challenge')
      }

      saveChallenges(
        savedChallenges.filter((item) => item.id !== id)
      )
    } catch (error) {
      console.error('Error deleting challenge:', error)
    }
  }

  function newRound() {
    setChallenge('')
    setError('')
    setSeenChallenges([])
  }

  function logout() {
    localStorage.removeItem('access_token')
    setCurrentUsername('')
    setIsAuthenticated(false)
    setSavedChallenges([])
    setChallenge('')
    setCategory1('')
    setCategory2('')
    setCustomCategory1('')
    setCustomCategory2('')
    setSeenChallenges([])
    setError('')
  }

  function renderAuthScreen() {
    return (
      <main className="auth-screen">
        <div className="auth-card">
          <div className="brand-mark">✦</div>

          <p className="eyebrow">IDEA COLLISION MACHINE</p>

          <h1>
            {authMode === 'login'
              ? 'Welcome back'
              : 'Create your account'}
          </h1>

          <p className="auth-subtitle">
            {authMode === 'login'
              ? 'Log in to continue creating unexpected ideas.'
              : 'Create an account to save your creative collisions.'}
          </p>

          <form
            onSubmit={(event) => {
              event.preventDefault()
              handleAuth()
            }}
          >
            <label>
              Username
              <input
                type="text"
                value={username}
                onChange={(event) =>
                  setUsername(event.target.value)
                }
                required
              />
            </label>

            {authMode === 'register' && (
              <label>
                Email
                <input
                  type="email"
                  value={email}
                  onChange={(event) =>
                    setEmail(event.target.value)
                  }
                  required
                />
              </label>
            )}

            <label>
              Password
              <input
                type="password"
                value={password}
                onChange={(event) =>
                  setPassword(event.target.value)
                }
                required
              />
            </label>

            {authError && (
              <p className="auth-error" role="alert">
                {authError}
              </p>
            )}

            <button
              className="auth-button"
              type="submit"
              disabled={authLoading}
            >
              {authLoading
                ? 'Please wait…'
                : authMode === 'login'
                  ? 'Log in'
                  : 'Create account'}
            </button>
          </form>

          <button
            className="auth-switch"
            type="button"
            onClick={() => {
              setAuthMode(
                authMode === 'login' ? 'register' : 'login'
              )
              setAuthError('')
            }}
          >
            {authMode === 'login'
              ? 'Need an account? Create one'
              : 'Already have an account? Log in'}
          </button>

          <button
            className="auth-switch"
            type="button"
            onClick={() => setShowAuthScreen(false)}
          >
            Go back without signing in
          </button>
        </div>
      </main>
    )
  }

  if (showAuthScreen && !isAuthenticated) {
    return renderAuthScreen()
  }

  return (
    <main className="app-shell">
      <video
        className="background-video"
        autoPlay
        muted
        loop
        playsInline
        aria-hidden="true"
      >
        <source src="/Planets.mp4" type="video/mp4" />
      </video>

      <header className="hero">
        <div className="account-bar">
          {isAuthenticated ? (
            <>
              <span>Logged in as {currentUsername}</span>

              <button type="button" onClick={logout}>
                Log out
              </button>
            </>
          ) : (
            <button
              type="button"
              onClick={() => setShowAuthScreen(true)}
            >
              Sign in
            </button>
          )}
        </div>

        <div className="brand-mark">✦</div>

        <p className="eyebrow">CREATIVE IDEA GENERATOR</p>

        <h1>Idea Collision Machine</h1>

        <p className="hero-text">
          Combine unrelated worlds and discover unexpected project ideas.
        </p>
      </header>

      <section className="workspace">
        <div className="section-heading">
          <div>
            <p className="section-label">
              01 — BUILD A COLLISION
            </p>

            <h2>Choose two worlds</h2>
          </div>

          <p className="section-description">
            Pick one category from each side, then collide them.
          </p>
        </div>

        <div className="category-grid">
          <section className="category-card">
            <div className="category-header">
              <span className="category-number">A</span>

              <div>
                <span className="category-label">
                  FIRST WORLD
                </span>

                <h3>
                  {category1 || 'Choose a category'}
                </h3>
              </div>
            </div>

            <div className="category-options">
              {categories1.map((category) => (
                <button
                  key={category}
                  className={`category-button ${
                    category1 === category ? 'selected' : ''
                  }`}
                  onClick={() => chooseCategory1(category)}
                  aria-pressed={category1 === category}
                >
                  <span>{category}</span>
                  <span className="button-arrow">→</span>
                </button>
              ))}
            </div>

            <div className="custom-category-wrapper">
              <input
                type="text"
                className="custom-category-input"
                placeholder="Or enter your own idea…"
                value={customCategory1}
                onChange={(event) => {
                  setCustomCategory1(event.target.value)
                  setCategory1(event.target.value)
                  setChallenge('')
                  setError('')
                  setSeenChallenges([])
                }}
              />
            </div>
          </section>

          <div
            className="collision-symbol"
            aria-hidden="true"
          >
            <span>×</span>
          </div>

          <section className="category-card">
            <div className="category-header">
              <span className="category-number">B</span>

              <div>
                <span className="category-label">
                  SECOND WORLD
                </span>

                <h3>
                  {category2 || 'Choose a category'}
                </h3>
              </div>
            </div>

            <div className="category-options">
              {categories2.map((category) => (
                <button
                  key={category}
                  className={`category-button ${
                    category2 === category ? 'selected' : ''
                  }`}
                  onClick={() => chooseCategory2(category)}
                  aria-pressed={category2 === category}
                >
                  <span>{category}</span>
                  <span className="button-arrow">→</span>
                </button>
              ))}
            </div>

            <div className="custom-category-wrapper">
              <input
                type="text"
                className="custom-category-input"
                placeholder="Or enter your own idea…"
                value={customCategory2}
                onChange={(event) => {
                  setCustomCategory2(event.target.value)
                  setCategory2(event.target.value)
                  setChallenge('')
                  setError('')
                  setSeenChallenges([])
                }}
              />
            </div>
          </section>
        </div>

        <div className="collision-preview">
          <div className="preview-item">
            <span>WORLD A</span>
            <strong>{category1 || '—'}</strong>
          </div>

          <div className="preview-plus">+</div>

          <div className="preview-item">
            <span>WORLD B</span>
            <strong>{category2 || '—'}</strong>
          </div>

          <button
            className="collision-button"
            onClick={generateChallenge}
            disabled={
              !category1.trim() ||
              !category2.trim() ||
              loading
            }
          >
            {loading ? 'Creating…' : 'Create Collision'}

            {!loading && <span>↗</span>}
          </button>
        </div>

        {error && (
          <div className="error-message" role="alert">
            {error}
          </div>
        )}

        {challenge && (
          <section className="challenge-card">
            <div className="challenge-top">
              <div>
                <p className="section-label">
                  02 — YOUR COLLISION
                </p>

                <span className="collision-tag">
                  {category1} × {category2}
                </span>
              </div>

              <span className="challenge-icon">✦</span>
            </div>

            <h2>{challenge}</h2>

            <div className="challenge-actions">
              <button
                className="primary-action"
                onClick={saveCurrentChallenge}
              >
                Save Challenge
              </button>

              <button
                className="secondary-action"
                onClick={generateChallenge}
              >
                Remix
              </button>

              <button
                className="secondary-action"
                onClick={newRound}
              >
                New Round
              </button>
            </div>
          </section>
        )}
      </section>

      <section className="stats-section">
        <div className="stat">
          <strong>{savedCount}</strong>
          <span>Saved ideas</span>
        </div>

        <div className="stat">
          <strong>{categoriesUsed}</strong>
          <span>Worlds explored</span>
        </div>

        <div className="stat">
          <strong>{seenChallenges.length}</strong>
          <span>Collisions this round</span>
        </div>
      </section>

      {savedCategoryCounts.length > 0 && (
        <section className="activity-section">
          <div className="section-heading">
            <div>
              <p className="section-label">
                04 — YOUR ACTIVITY
              </p>

              <h2>Worlds behind your ideas</h2>
            </div>

            <p className="section-description">
              See which worlds appear most often in your saved ideas.
            </p>
          </div>

          <div className="activity-chart">
            {savedCategoryCounts.map(([category, count]) => (
              <div className="chart-row" key={category}>
                <div className="chart-label">
                  <span>{category}</span>
                  <strong>{count}</strong>
                </div>

                <div className="chart-track">
                  <div
                    className="chart-bar"
                    style={{
                      width: `${
                        (count /
                          Math.max(
                            ...savedCategoryCounts.map(
                              ([, value]) => value
                            )
                          )) *
                        100
                      }%`,
                    }}
                  />
                </div>
              </div>
            ))}
          </div>
        </section>
      )}

      {savedChallenges.length > 0 && (
        <section className="saved-section">
          <div className="section-heading">
            <div>
              <p className="section-label">
                03 — YOUR COLLECTION
              </p>

              <h2>Saved challenges</h2>
            </div>

            <span className="saved-count">
              {savedCount}
            </span>
          </div>

          <div className="saved-grid">
            {savedChallenges.map(
              (savedChallenge, index) => (
                <article
                  className="saved-card"
                  key={`${savedChallenge.challenge}-${index}`}
                >
                  <div className="saved-card-top">
                    <span>
                      {savedChallenge.category1 || 'Unknown'} ×{' '}
                      {savedChallenge.category2 || 'Unknown'}
                    </span>

                    <button
                      className="delete-button"
                      onClick={() =>
                        deleteChallenge(savedChallenge.id)
                      }
                      aria-label={`Delete saved challenge: ${savedChallenge.challenge}`}
                    >
                      ×
                    </button>
                  </div>

                  <p>{savedChallenge.challenge}</p>

                  <button
                    className="remix-button"
                    onClick={() =>
                      remixChallenge(savedChallenge)
                    }
                    disabled={loading}
                  >
                    Remix idea →
                  </button>
                </article>
              )
            )}
          </div>
        </section>
      )}

      <footer>
        <span>Idea Collision Machine</span>
        <span>Powered by Codyza</span>
      </footer>
    </main>
  )
}

export default App
