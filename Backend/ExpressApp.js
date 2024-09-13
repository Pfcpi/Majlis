/* eslint-disable prettier/prettier */
/* eslint-disable no-unused-vars */
const express = require('express')
const cors = require('cors')
const db = require('./config/db')
const ExpressApp = express()
const rapportRouter = require('./routes/rapport')
const commissionRouter = require('./routes/commission')
const pvRouter = require('./routes/pv')
const authRouter = require('./routes/auth')
const archiveRouter = require('./routes/archive')

ExpressApp.use(cors())
ExpressApp.use(express.json())

ExpressApp.use('/rapport', rapportRouter)
ExpressApp.use('/commission', commissionRouter)
ExpressApp.use('/pv', pvRouter)
ExpressApp.use('/auth', authRouter)
ExpressApp.use('/archive', archiveRouter)

module.exports = ExpressApp