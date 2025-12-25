import axios from "axios"
const baseUrl = '/api/login'
const registerUrl = '/api/users'

const login = async credentials => {
  const response = await axios.post(baseUrl, credentials)
  return response.data
}

const register = async credentials => {
  const response = await axios.post(registerUrl, credentials)
  return response.data
}

export default { login, register }