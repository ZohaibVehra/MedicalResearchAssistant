require('dotenv').config({ override: true })
const OpenAI = require('openai')

if (!process.env.OAK) {
  throw new Error('Missing OpenAI API key (OAK)')
}

const client = new OpenAI({
  apiKey: (process.env.OAK  || '').trim(),
})

module.exports = client
