/* eslint-disable no-unused-vars */
const express = require('express')
const cors = require('cors')
const db = require('./config/db')
const ExpressApp = express()
const rapportRouter = require('./routes/rapport')
const commissionRouter = require('./routes/commission')
const pvRouter = require('./routes/pv')

ExpressApp.use(cors())

// Your routes and other middleware
ExpressApp.get('/', (req, res) => {
  res.send('Hello from Express with CORS!')
})

ExpressApp.use('/rapport', rapportRouter)
ExpressApp.use('/commission', commissionRouter)
ExpressApp.use('/pv', pvRouter)

module.exports = ExpressApp
