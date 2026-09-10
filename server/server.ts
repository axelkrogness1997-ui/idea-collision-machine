import express, { type Request, type Response } from 'express'
import cors from 'cors'

const app = express()

app.use(cors())
app.use(express.json())

app.get('/', (req: Request, res: Response) => {
  res.json({ message: 'Hello from the Idea Collision API!' })
})

app.post('/api/challenge', (req: Request, res: Response) => {
const {
  category1: rawCategory1,
  category2: rawCategory2,
  seenChallenges = [],
} = req.body

const category1 = rawCategory1?.trim()
const category2 = rawCategory2?.trim()

let challenges = []

  if (category1 === 'Healthcare' && category2 === 'AI') {
    challenges = [
      'Design an AI tool that helps patients understand their health information.',
      'Create an AI assistant that helps doctors identify important patient information.',
      'Design an AI system that helps people build healthier daily habits.',
      'Create an AI tool that helps healthcare workers organise important information.',
      'Design an AI-powered game that teaches people about healthy living.'
    ]
  } else if (category1 === 'Healthcare' && category2 === 'Agriculture') {
    challenges = [
      'Design a system that connects farming and healthcare to improve rural wellbeing.',
      'Create a platform that helps farmers monitor how environmental conditions affect community health.',
      'Design a tool that helps farmers understand how their work affects local health.',
      'Create a service that connects rural communities with healthcare resources.',
      'Design a smart farming system that helps improve the health of rural communities.'
    ]
  } else if (category1 === 'Healthcare' && category2 === 'Maps') {
    challenges = [
      'Design a map that helps people find nearby healthcare services.',
      'Create a mapping tool that shows areas with limited access to healthcare.',
      'Design a map that helps patients find the quickest route to medical support.',
      'Create a system that maps healthcare resources in rural communities.',
      'Design an interactive map that helps communities identify local health needs.'
    ]
  } else if (category1 === 'Healthcare' && category2 === 'Accessibility') {
    challenges = [
      'Design a healthcare service that is easier for people with disabilities to use.',
      'Create an accessible tool that helps patients understand medical information.',
      'Design a system that helps people with disabilities access healthcare independently.',
      'Create an accessible appointment system for healthcare services.',
      'Design a healthcare app that works well for people with different accessibility needs.'
    ]
  } else if (category1 === 'Gaming' && category2 === 'AI') {
    challenges = [
      'Create an AI-powered game that helps people learn a useful skill.',
      'Design a game where AI adapts the difficulty to each player.',
      'Create a game where AI characters learn from the player’s behaviour.',
      'Design an AI-powered game that helps people practise teamwork.',
      'Create a game that uses AI to turn everyday problems into fun challenges.'
    ]
  } else if (category1 === 'Gaming' && category2 === 'Agriculture') {
    challenges = [
      'Design a game that teaches people how to grow food sustainably.',
      'Create a farming game where players learn about protecting the environment.',
      'Design a game that teaches children where their food comes from.',
      'Create a game where players manage a farm while learning about climate change.',
      'Design a farming game that rewards players for using sustainable methods.'
    ]
  } else if (category1 === 'Gaming' && category2 === 'Maps') {
    challenges = [
      'Create a game where players explore a real-world map to solve challenges.',
      'Design a game that teaches geography through interactive maps.',
      'Create a map-based game that encourages people to discover their local area.',
      'Design a game where players complete challenges at different locations.',
      'Create an adventure game that uses maps to teach people about different cultures.'
    ]
  } else if (category1 === 'Gaming' && category2 === 'Accessibility') {
    challenges = [
      'Design a game that can be enjoyed by players with different disabilities.',
      'Create an accessible game that uses multiple ways to control the player.',
      'Design a game that teaches developers about accessibility through gameplay.',
      'Create a game where accessibility features are part of the main experience.',
      'Design an inclusive game that allows players with different abilities to compete together.'
    ]
  } else if (category1 === 'Education' && category2 === 'AI') {
    challenges = [
      'Design an AI tutor that adapts lessons to each student.',
      'Create an AI tool that helps teachers identify where students need support.',
      'Design an AI learning assistant that explains difficult topics in different ways.',
      'Create an AI system that helps students practise skills through personalised challenges.',
      'Design an AI-powered classroom tool that makes learning more engaging.'
    ]
  } else if (category1 === 'Education' && category2 === 'Maps') {
    challenges = [
      'Design an interactive map that helps students explore historical events.',
      'Create a map-based learning tool that teaches students about different countries.',
      'Design an educational game where students learn by exploring a map.',
      'Create a map that connects local places with educational information.',
      'Design a virtual field trip that lets students explore places through an interactive map.'
    ]
  } else if (category1 === 'Education' && category2 === 'Accessibility') {
    challenges = [
      'Design a learning platform that works for students with different accessibility needs.',
      'Create an educational tool that makes complex information easier to understand.',
      'Design accessible learning activities for students with different abilities.',
      'Create a classroom tool that helps teachers make lessons more inclusive.',
      'Design an accessible study app that supports different ways of learning.'
    ]
  } else if (category1 === 'Education' && category2 === 'Agriculture') {
    challenges = [
      'Design an educational game that teaches students how food is produced.',
      'Create a learning platform that teaches sustainable farming.',
      'Design a tool that helps students understand where their food comes from.',
      'Create an interactive lesson about agriculture and climate change.',
      'Design a school project that connects students with local farmers.'
    ]
  } else if (category1 === 'Finance' && category2 === 'AI') {
    challenges = [
      'Design an AI tool that helps people understand their spending.',
      'Create an AI assistant that helps people make better financial decisions.',
      'Design an AI system that helps people create realistic budgets.',
      'Create an AI tool that explains financial concepts in simple language.',
      'Design an AI assistant that helps people plan for future expenses.'
    ]
  } else if (category1 === 'Finance' && category2 === 'Maps') {
    challenges = [
      'Design a map that shows the cost of living in different areas.',
      'Create a map that helps people find affordable local services.',
      'Design an interactive map that compares financial opportunities across communities.',
      'Create a map that helps people discover local businesses and prices.',
      'Design a tool that maps financial resources available in different communities.'
    ]
  } else if (category1 === 'Finance' && category2 === 'Accessibility') {
    challenges = [
      'Design a banking service that is easier for people with disabilities to use.',
      'Create an accessible budgeting tool for people with different needs.',
      'Design a financial app that explains money concepts in simple ways.',
      'Create an accessible payment system that works for a wide range of users.',
      'Design a financial planning tool that supports different accessibility needs.'
    ]
  } else if (category1 === 'Finance' && category2 === 'Agriculture') {
    challenges = [
      'Design a financial tool that helps farmers manage their income.',
      'Create a platform that helps small farmers access financial support.',
      'Design a budgeting tool specifically for agricultural businesses.',
      'Create a system that helps farmers plan for seasonal expenses.',
      'Design a service that connects farmers with sustainable investment opportunities.'
    ]
  } else {
    challenges = [
      `Create a ${category1} project inspired by ${category2}.`,
      `Design a tool that combines ${category1} with ${category2}.`,
      `Imagine how ${category2} could transform a ${category1} experience.`,
      `Create an unexpected solution by combining ${category1} and ${category2}.`,
      `Design a new product that brings ${category1} and ${category2} together.`
    ]
  }

  const availableChallenges = challenges.filter(
    item => !seenChallenges.includes(item)
  )

  if (availableChallenges.length === 0) {
    return res.json({
      challenge: 'ALL_CHALLENGES_USED'
    })
  }

  const randomIndex = Math.floor(
    Math.random() * availableChallenges.length
  )

  const challenge = availableChallenges[randomIndex]

  res.json({ challenge })
})

const PORT = process.env.PORT || 3001

app.listen(PORT, '0.0.0.0', () => {
  console.log(`API running on port ${PORT}`)
})