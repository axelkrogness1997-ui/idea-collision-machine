import { useState } from 'react'
import './App.css'

type SavedChallenge = {
  challenge: string
  category1: string
  category2: string
}

function App() {
  const [category1, setCategory1] = useState('')
  const [category2, setCategory2] = useState('')
  const [challenge, setChallenge] = useState('')
  const [savedChallenges, setSavedChallenges] = useState<SavedChallenge[]>(() => {
    const saved = localStorage.getItem('savedChallenges')

    if (!saved) {
      return []
    }

    const oldChallenges = JSON.parse(saved)

    return oldChallenges.map((item: string | SavedChallenge) => {
      if (typeof item === 'string') {
        return {
          challenge: item,
          category1: '',
          category2: '',
        }
      }

      return item
    })
  })

  const [seenChallenges, setSeenChallenges] = useState<string[]>([])

  async function generateChallenge() {
    const response = await fetch('https://idea-collision-machine.onrender.com/api/challenge', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        category1: category1,
        category2: category2,
        seenChallenges: seenChallenges,
      }),
    })

    const data = await response.json()

    console.log('Challenge received:', data.challenge)

    if (data.challenge === 'ALL_CHALLENGES_USED') {
      setChallenge(
        'You have explored all the challenges for this collision! Start a new round.'
      )
      setSeenChallenges([])
      return
    }

    setChallenge(data.challenge)
    setSeenChallenges([...seenChallenges, data.challenge])
  }

  async function remixChallenge(savedChallenge: SavedChallenge) {
    const response = await fetch('https://idea-collision-machine.onrender.com/api/challenge', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        category1: savedChallenge.category1,
        category2: savedChallenge.category2,
        seenChallenges: [
          savedChallenge.challenge,
          challenge,
        ],
      }),
    })

    const data = await response.json()

    console.log('Remix received:', data.challenge)

    setCategory1(savedChallenge.category1)
    setCategory2(savedChallenge.category2)
    setChallenge(data.challenge)
  }

  function chooseCategory1(category: string) {
    setCategory1(category)
    setChallenge('')
    setSeenChallenges([])
  }

  function chooseCategory2(category: string) {
    setCategory2(category)
    setChallenge('')
    setSeenChallenges([])
  }

  return (
    <main>
      <h1>Idea Collision Machine</h1>

      <p>Combine two unrelated categories to create a project idea.</p>

      <h2>Choose your categories</h2>

      <div className="category-section">
        <h3>Category 1</h3>

        <button
          className={category1 === 'Healthcare' ? 'selected' : ''}
          onClick={() => chooseCategory1('Healthcare')}
        >
          Healthcare
        </button>

        <button
          className={category1 === 'Gaming' ? 'selected' : ''}
          onClick={() => chooseCategory1('Gaming')}
        >
          Gaming
        </button>

        <button
          className={category1 === 'Education' ? 'selected' : ''}
          onClick={() => chooseCategory1('Education')}
        >
          Education
        </button>

        <button
          className={category1 === 'Finance' ? 'selected' : ''}
          onClick={() => chooseCategory1('Finance')}
        >
          Finance
        </button>
      </div>

      <div className="category-section">
        <h3>Category 2</h3>

        <button
          className={category2 === 'Agriculture' ? 'selected' : ''}
          onClick={() => chooseCategory2('Agriculture')}
        >
          Agriculture
        </button>

        <button
          className={category2 === 'AI' ? 'selected' : ''}
          onClick={() => chooseCategory2('AI')}
        >
          AI
        </button>

        <button
          className={category2 === 'Maps' ? 'selected' : ''}
          onClick={() => chooseCategory2('Maps')}
        >
          Maps
        </button>

        <button
          className={category2 === 'Accessibility' ? 'selected' : ''}
          onClick={() => chooseCategory2('Accessibility')}
        >
          Accessibility
        </button>
      </div>

      <p>First category: {category1}</p>
      <p>Second category: {category2}</p>

      <button
        className="collision-button"
        onClick={generateChallenge}
        disabled={!category1 || !category2}
      >
        Create Collision
      </button>

      {challenge && (
        <div className="challenge">
          <h2>Your Challenge</h2>
          <p>{challenge}</p>

          <button
            onClick={() => {
              const savedChallenge = {
                challenge: challenge,
                category1: category1,
                category2: category2,
              }

              const updatedChallenges = [
                ...savedChallenges,
                savedChallenge,
              ]

              setSavedChallenges(updatedChallenges)

              localStorage.setItem(
                'savedChallenges',
                JSON.stringify(updatedChallenges)
              )
            }}
          >
            Save Challenge
          </button>
        </div>
      )}

      {savedChallenges.length > 0 && (
        <div className="saved-challenges">
          <h2>Saved Challenges</h2>

          <ul>
            {savedChallenges.map((savedChallenge, index) => (
              <li key={index}>
                <strong>
                  {savedChallenge.category1} + {savedChallenge.category2}
                </strong>

                <p>{savedChallenge.challenge}</p>

                <button
                  onClick={() => remixChallenge(savedChallenge)}
                >
                  Remix
                </button>
              </li>
            ))}
          </ul>
        </div>
      )}
       <footer>
       Powered by Codyza
       </footer>
    </main>
  )
}

export default App