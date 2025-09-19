const searchesRouter = require('express').Router()
const Search = require('../models/search')
const jwt = require('jsonwebtoken')
const User = require('../models/user')


//extract token
const getTokenFrom = request => {
  const authorization = request.get('authorization')
  if (authorization && authorization.startsWith('Bearer ')){
    return authorization.replace('Bearer ', '')
  }
  return null
}

searchesRouter.post('/', async (request, response) => {
  const { idkyet } = request.body

  const decodedToken = jwt.verify(getTokenFrom(request), process.env.SECRET)
  if(!decodedToken.id){
    return response.status(401).json({ error: 'invalid token' })
  }

  //if token was valid find the user
  const user = await User.findById(decodedToken.id)
  if(!user) return response.status(400).json({ error: 'userId missing or not valid' })

  const search = new Search({
    idkyet,
    user: user._id
  })

  const savedSearch = await search.save()
  user.searches = user.searches.concat(savedSearch._id)
  await user.save()
  response.status(201).json(savedSearch)
})

searchesRouter.get('/', async (request, response) => {
  const searches = await Search.find({}).populate('user', { username: 1 })
  response.json(searches)
})

//get a particular search
searchesRouter.get('/:id', async (request, response, next) => {
  try {
    const decodedToken = jwt.verify(getTokenFrom(request), process.env.SECRET)
    if (!decodedToken.id) {
      return response.status(401).json({ error: 'token invalid' })
    }

    //compare token user id to the searches user id
    const userId = decodedToken.id
    const search = await Search.findById(request.params.id).populate('user', { username: 1 })
    if (search.user._id.toString() !== userId) {
      return response.status(403).json({ error: 'forbidden: not your search' })
    }

    response.json(search)
  } catch (err) {
    next(err)
  }
})

//delete a particular search
searchesRouter.delete('/:id', async (request, response, next) => {
  try {
    const decodedToken = jwt.verify(getTokenFrom(request), process.env.SECRET)
    if (!decodedToken.id) {
      return response.status(401).json({ error: 'token invalid' })
    }

    //compare token user id to the searches user id
    const userId = decodedToken.id
    const search = await Search.findById(request.params.id).populate('user', { username: 1 })
    if (search.user._id.toString() !== userId) {
      return response.status(403).json({ error: 'forbidden: not your search' })
    }

    await search.deleteOne()
    response.status(204).end()
  } catch (err) {
    next(err)
  }
})

module.exports = searchesRouter