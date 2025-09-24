require('dotenv').config({ override: true })
const OpenAI = require('openai')

const client = new OpenAI({
  apiKey: (process.env.OAK  || '').trim(),
})

module.exports = client
