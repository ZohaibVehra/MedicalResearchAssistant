const searchesRouter = require('express').Router()
const Search = require('../models/search')
const jwt = require('jsonwebtoken')
const User = require('../models/user')
const searchService = require('../services/searchService')

//extract token
const getTokenFrom = request => {
  const authorization = request.get('authorization')
  if (authorization && authorization.startsWith('Bearer ')){
    return authorization.replace('Bearer ', '')
  }
  return null
}

searchesRouter.post('/', async (request, response, next) => {
  try {
    let { rawQuery, freeOnly, max = 50 } = request.body
    rawQuery = String(rawQuery || '').trim()
    if (!rawQuery) return response.status(400).json({ error: 'rawQuery is required' })

    //authentication is optional, but data will only be saved for logged in users
    let user = null
    const token = getTokenFrom(request)
    if (token) {
      try {
        const decoded = jwt.verify(token, process.env.SECRET)
        if (decoded?.id) user = await User.findById(decoded.id)
      } catch (_) {
        //ignore any errors with validation. we just wont save results in this case
      }
    }

    const { total, latest, relevant, mostCited } = await searchService.getTripleResults({ rawQuery, freeOnly, max })

    //check if valid user found, if so then we can save results
    if (user && total > 0) {
      const search = new Search({
        rawQuery,
        total,
        latest,
        relevant,
        mostCited,
        user: user._id
      })
      const savedSearch = await search.save()
      user.searches = user.searches.concat(savedSearch._id)
      await user.save()

      return response.status(201).json({
        saved: true,
        searchId: savedSearch._id,
        rawQuery,
        total,
        latest,
        relevant,
        mostCited
      })
    }

    //if not logged in or no results then return result but dont save
    return response.status(200).json({
      saved: false,
      rawQuery,
      total,
      latest,
      relevant,
      mostCited
    })
  } catch (err) {
    next(err)
  }
})

searchesRouter.get('/user/my-searches', async (req, res, next) => {
  try {
    const token = getTokenFrom(req)
    const decoded = jwt.verify(token, process.env.SECRET)
    if (!decoded?.id) return res.status(401).json({ error: 'invalid token' })

    const searches = await Search.find({ user: decoded.id })
      .sort({ createdAt: -1 }) //sorts by recent searches
      .limit(20) //will only return the last 20 searches ofa user
      .lean()

    res.json({ count: searches.length, searches })
  } catch (err) {
    next(err)
  }
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