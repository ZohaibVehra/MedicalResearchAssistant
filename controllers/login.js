const jwt = require('jsonwebtoken')
const bcrypt = require('bcrypt')
const loginRouter = require('express').Router()
const User = require('../models/user')

loginRouter.post('/', async (request, response) => {
  const { username, password } = request.body

  //find user from username
  const user = await User.findOne({ username })

  //check for right password
  const passwordCorrect = user === null
    ? false //if user doesnt exist login is wrong by default
    : await bcrypt.compare(password, user.passwordHash)

    //only if user exists and the password was correct would we login
    if (!(user && passwordCorrect)) {
      return response.status(401).json({
        error: 'invalid username or password'
    })
  }

  const userForToken = {
    username: user.username,
    id: user._id
  }

  const token = jwt.sign(
    userForToken,
    process.env.SECRET,
    { expiresIn: 60*60*24*3 } //expires 3 days
  )

  response.send({ token, username: user.username })
})

module.exports = loginRouter