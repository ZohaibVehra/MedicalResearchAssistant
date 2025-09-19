require('dotenv').config()

const PORT = process.env.PORT
const DBURL = process.env.NODE_ENV === 'test'
  ? process.env.TEST_DBURL
  : process.env.DBURL

module.exports = { DBURL, PORT }