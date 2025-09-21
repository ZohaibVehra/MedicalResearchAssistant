require('dotenv').config({ override: true })
const OpenAI = require('openai')

const client = new OpenAI({
  apiKey: (process.env.OAK || process.env.OPENAI_API_KEY || '').trim(),
})

module.exports = client
