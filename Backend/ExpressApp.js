const express = require('express')
const cors = require('cors')
const ExpressApp = express()

ExpressApp.use(cors())

// Your routes and other middleware
ExpressApp.get('/', (req, res) => {
  res.send('Hello from Express with CORS!')
})

module.exports = ExpressApp 