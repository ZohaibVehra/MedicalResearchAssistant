import axios from "axios"

let token = null
const baseUrl = '/api/searches'

const setToken = newToken => {
  token = `Bearer ${newToken}`
}

const getById = async (id) => {
  const config = {
    headers: { Authorization: token }
  }
  const response = await axios.get(`${baseUrl}/${id}`, config)
  return response.data
}

const create = async queryObject => {
  const config = {
    headers: { Authorization: token }
  }
  const response = await axios.post(baseUrl, queryObject, config)
  return response.data
}

const findMine = async () => {
  const config = {
    headers: { Authorization: token }
  }
  const response = await axios.get('/api/users/user/my-searches', config)
  return response.data
}

const deleteSearch = async id => {
  const config = {
    headers: { Authorization: token }
  }
  const response = await axios.delete(`${baseUrl}/${id}`, config)
  return response.data
}

export default { setToken, create, findMine, deleteSearch, getById }