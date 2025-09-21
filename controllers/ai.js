const aiRouter = require('express').Router()
const client = require('../services/openapi')

aiRouter.post('/queryrephrase', async (request, response) => {
  const { query } = request.body
  if(!query.trim()) return response.status(400).json({ error: 'enter search text' })

  const base = 'You are a biomedical-search-query assistant for Europe PMC. Return 5 improved or related queries as a JSON array of strings. Prefer quoted phrases, AND/OR, synonyms where helpful.'

  const resp = await client.responses.create({
      model: 'gpt-5-nano',
      input: [
        { role: 'system', content: base },
        { role: 'user', content: `Current query: "${query}"` }
      ]
    })
  
  const text = resp.output_text || '[]'
  let suggestions
  try { suggestions = JSON.parse(text) }
  catch { suggestions = text.split('\n').map(s => s.trim()).filter(Boolean) } //filter boolean removes empty strings
  response.json({ suggestions })
})

aiRouter.post('/querygenerate', async (request, response) => {
  const { topic } = request.body
  if (!topic.trim()) return response.status(400).json({ error: 'enter a topic or information needed' })

  const base = 'You are a biomedical-search-query assistant for Europe PMC. Given a topic or info on what the user needs, generate 5 diverse, precise queries (as a JSON array of strings) that would help retrieve relevant research articles. Prefer quoted phrases, AND/OR, synonyms where helpful.'

  const resp = await client.responses.create({
    model: 'gpt-5-nano',
    input: [
      { role: 'system', content: base },
      { role: 'user', content: `Topic: "${topic}"` }
    ]
  })

  const text = resp.output_text || '[]'
  let suggestions
  try { suggestions = JSON.parse(text) }
  catch { suggestions = text.split('\n').map(s => s.trim()).filter(Boolean) }

  response.json({ suggestions })
})

module.exports = aiRouter