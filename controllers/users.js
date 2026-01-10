const bcrypt = require('bcrypt')
const usersRouter = require('express').Router()
const User = require('../models/user')
const jwt = require('jsonwebtoken')

//extract token
const getTokenFrom = request => {
  const authorization = request.get('authorization')
  if (authorization && authorization.startsWith('Bearer ')){
    return authorization.replace('Bearer ', '')
  }
  return null
}

usersRouter.post('/', async (request, response) => {
  const { username, password } = request.body
  const saltRounds = 10
  const passwordHash = await bcrypt.hash(password, saltRounds)

  const user = new User({
    username,
    passwordHash
  })

  const savedUser = await user.save()
  response.status(201).json(savedUser)
})

usersRouter.get('/', async (request, response) => {
  const users = await User.find({}).populate('searches', { rawQuery: 1 })
  response.json(users)
})

usersRouter.get('/user/my-searches', async (req, res, next) => {
  try {
    const token = getTokenFrom(req)
    const decoded = jwt.verify(token, process.env.SECRET)
    if (!decoded?.id) {
      return res.status(401).json({ error: 'invalid token' })
    }

    const user = await User.findById(decoded.id)
      .populate('searches', { rawQuery: 1 })

    if (!user) {
      return res.status(404).json({ error: 'user not found' })
    }

    res.json(user)
  } catch (err) {
    next(err)
  }
})

/*
usersRouter.get('/:id', async (req, res, next) => {
  try {
    const user = await User.findById(req.params.id)
      .populate('searches', { rawQuery: 1 })

    if (!user) {
      return res.status(404).json({ error: 'user not found' })
    }

    res.json(user)
  } catch (err) {
    next(err)
  }
})
*/



module.exports = usersRouter

