import { useMemo, useState } from 'react'
import './App.css'

type SavedChallenge = {
  challenge: string
  category1: string
  category2: string
}

const API_URL = 'https://idea-collision-machine.onrender.com/api/challenge'

const categories1 = ['Healthcare', 'Gaming', 'Education', 'Finance']
const categories2 = ['Agriculture', 'AI', 'Maps', 'Accessibility']

function App() {
  const [category1, setCategory1] = useState('')
  const [category2, setCategory2] = useState('')
  const [challenge, setChallenge] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const [savedChallenges, setSavedChallenges] = useState<SavedChallenge[]>(() => {
    try {
      const saved = localStorage.getItem('savedChallenges')
      if (!saved) return []

      const parsed = JSON.parse(saved)

      return parsed.map((item: string | SavedChallenge) =>
        typeof item === 'string'
          ? { challenge: item, category1: '', category2: '' }
          : item
      )
    } catch {
      return []
    }
  })

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

  function saveChallenges(challenges: SavedChallenge[]) {
    setSavedChallenges(challenges)
    localStorage.setItem('savedChallenges', JSON.stringify(challenges))
  }

  async function generateChallenge() {
    if (!category1 || !category2 || loading) return

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
    if (!savedChallenge.category1 || !savedChallenge.category2 || loading) return

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
    setChallenge('')
    setError('')
    setSeenChallenges([])
  }

  function chooseCategory2(category: string) {
    setCategory2(category)
    setChallenge('')
    setError('')
    setSeenChallenges([])
  }

  function saveCurrentChallenge() {
    if (!challenge || !category1 || !category2) return

    const alreadySaved = savedChallenges.some(
      (item) =>
        item.challenge === challenge &&
        item.category1 === category1 &&
        item.category2 === category2
    )

    if (alreadySaved) return

    saveChallenges([
      ...savedChallenges,
      {
        challenge,
        category1,
        category2,
      },
    ])
  }

  function deleteChallenge(index: number) {
    saveChallenges(
      savedChallenges.filter((_, challengeIndex) => challengeIndex !== index)
    )
  }

  function newRound() {
    setChallenge('')
    setError('')
    setSeenChallenges([])
  }

  return (
    <main className="app-shell">
      <header className="hero">
        <div className="brand-mark">✦</div>

        <p className="eyebrow">CREATIVE IDEA GENERATOR</p>

        <h1>
          Idea Collision
          <span>Machine</span>
        </h1>

        <p className="hero-text">
          Combine unrelated worlds and discover unexpected project ideas.
        </p>
      </header>

      <section className="workspace">
        <div className="section-heading">
          <div>
            <p className="section-label">01 — BUILD A COLLISION</p>
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
                <span className="category-label">FIRST WORLD</span>
                <h3>{category1 || 'Choose a category'}</h3>
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
          </section>

          <div className="collision-symbol" aria-hidden="true">
            <span>×</span>
          </div>

          <section className="category-card">
            <div className="category-header">
              <span className="category-number">B</span>
              <div>
                <span className="category-label">SECOND WORLD</span>
                <h3>{category2 || 'Choose a category'}</h3>
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
            disabled={!category1 || !category2 || loading}
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
                <p className="section-label">02 — YOUR COLLISION</p>
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

              <button className="secondary-action" onClick={generateChallenge}>
                Remix
              </button>

              <button className="secondary-action" onClick={newRound}>
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

      {savedChallenges.length > 0 && (
        <section className="saved-section">
          <div className="section-heading">
            <div>
              <p className="section-label">03 — YOUR COLLECTION</p>
              <h2>Saved challenges</h2>
            </div>

            <span className="saved-count">{savedCount}</span>
          </div>

          <div className="saved-grid">
            {savedChallenges.map((savedChallenge, index) => (
              <article className="saved-card" key={`${savedChallenge.challenge}-${index}`}>
                <div className="saved-card-top">
                  <span>
                    {savedChallenge.category1 || 'Unknown'} ×{' '}
                    {savedChallenge.category2 || 'Unknown'}
                  </span>

                  <button
                    className="delete-button"
                    onClick={() => deleteChallenge(index)}
                    aria-label="Delete saved challenge"
                  >
                    ×
                  </button>
                </div>

                <p>{savedChallenge.challenge}</p>

                <button
                  className="remix-button"
                  onClick={() => remixChallenge(savedChallenge)}
                  disabled={loading}
                >
                  Remix idea →
                </button>
              </article>
            ))}
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