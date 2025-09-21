const express = require('express')
const mongoose = require('mongoose')
const config = require('./utils/config')
const logger = require('./utils/logger')
const middleware = require('./utils/middleware')
const searchesRouter = require('./controllers/searches')
const usersRouter = require('./controllers/users')
const loginRouter = require('./controllers/login')
const aiRouter = require('./controllers/ai')

const app = express()

logger.info('connecting to MongoDB')


//connect to database and log any errors connecting
mongoose
  .connect(config.DBURL)
  .then(() => {
    logger.info('connected to MongoDB')
  })
  .catch((error) => {
    logger.error('error connection to MongoDB:', error.message)
  })

//.static dist is for frontend
app.use(express.static('dist'))
app.use(express.json())
app.use(middleware.requestLogger)

app.use('/api/searches', searchesRouter)
app.use('/api/users', usersRouter)
app.use('/api/login', loginRouter)
app.use('/api/ai', aiRouter)

app.use(middleware.unknownEndpoint)
app.use(middleware.errorHandler)

module.exports = app