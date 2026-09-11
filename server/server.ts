import express, { type Request, type Response } from 'express'
import cors from 'cors'

const app = express()

app.use(cors())
app.use(express.json())

app.get('/', (req: Request, res: Response) => {
  res.json({ message: 'Hello from the Idea Collision API!' })
})

function cleanWord(value: unknown): string {
  if (typeof value !== 'string') return ''
  return value.trim().replace(/\s+/g, ' ')
}

function createCollision(category1: string, category2: string): string {
  const a = category1.toLowerCase()
  const b = category2.toLowerCase()

  const ideas = [
    `Create a ${a}-inspired ${b} experience where people can experiment, discover unexpected connections, and solve real-world problems.`,
    `Design a ${b} tool that borrows the most useful behaviour from ${a} to create a completely new way of solving everyday problems.`,
    `Imagine a service where ${a} and ${b} work together: users interact with one, while the other provides an unexpected advantage.`,
    `Turn ${a} into a new source of ideas for ${b}, creating an interactive experience that helps people discover solutions they would not normally consider.`,
    `Design a product that combines the unpredictability of ${a} with the practical purpose of ${b} to solve a specific human problem.`,
    `Create a system where principles from ${a} are used to reinvent how people experience ${b}.`,
    `Build an experience that makes the normally unrelated worlds of ${a} and ${b} useful to each other.`,
    `Create a challenge where people use techniques from ${a} to rethink a problem normally associated with ${b}.`,
  ]

  // Deterministic selection gives a different result for different
  // combinations without needing a slow external AI model.
  const seed = `${a}:${b}`
    .split('')
    .reduce((total, char) => total + char.charCodeAt(0), 0)

return ideas[seed % ideas.length]!
}

app.post('/api/challenge', (req: Request, res: Response) => {
  console.log('Collision request:', req.body)

  const category1 = cleanWord(req.body.category1)
  const category2 = cleanWord(req.body.category2)

  const seenChallenges = Array.isArray(req.body.seenChallenges)
    ? req.body.seenChallenges
    : []

  if (!category1 || !category2) {
    return res.status(400).json({
      error: 'Please provide two categories.',
    })
  }

  const baseChallenge = createCollision(category1, category2)

  // Generate several variations so Remix still works.
  const variations = [
    baseChallenge,

    `Design an unexpected ${category1} × ${category2} concept that helps people solve a problem in a completely different way.`,

    `What if ${category1} became the secret ingredient behind a new ${category2} experience? Design the idea.`,

    `Combine the behaviours, tools, or principles of ${category1} and ${category2} into one useful new concept.`,

    `Create something people would never expect from ${category1} and ${category2}, but would genuinely find useful.`,
  ]

  const availableChallenges = variations.filter(
    (challenge) => !seenChallenges.includes(challenge)
  )

  if (availableChallenges.length === 0) {
    return res.json({
      challenge: 'ALL_CHALLENGES_USED',
    })
  }

  const randomIndex = Math.floor(
    Math.random() * availableChallenges.length
  )

  return res.json({
    challenge: availableChallenges[randomIndex],
  })
})

const PORT = Number(process.env.PORT) || 3001

app.listen(PORT, '0.0.0.0', () => {
  console.log(`API running on port ${PORT}`)
})