import axios from 'axios'

export const rephrase = async query => {
  const { data } = await axios.post('/api/ai/queryrephrase', { query })
  return data.suggestions || []
}

export const generateFromTopic = async topic => {
  const { data } = await axios.post('/api/ai/querygenerate', { topic })
  return data.suggestions || []
}

export default { rephrase, generateFromTopic }