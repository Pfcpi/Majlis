/* eslint-disable no-unused-vars */
const express = require('express')
const router = express.Router()
const { db } = require('../config/db')

router.get('/getRapport', (req, res) => {
  //placeholder
})

router.get('/getRapportDetail', (req, res) => {
  //placeholder
})

router.patch('/editRapport', (req, res) => {
  let matriculeE = req.body.matriculeE
  let nomE = req.body.nomE
  let filliereE = req.body.filliereE
  let groupeE = req.body.groupeE
  let matriculeP = req.body.matriculeP
  let nomP = req.body.nomP
  let dateI = req.body.dateI
  let lieuI = req.body.lieuI
  let motifI = req.body.motifI
  let descI = req.body.descI
  //placeholder
})

router.delete('/deleteRapport', (req, res) => {
  let numR = req.body.numR
  //placeholder
})

router.post('/addRapport', (req, res) => {
  let matriculeE = req.body.matriculeE
  let nomE = req.body.nomE
  let filliereE = req.body.filliereE
  let groupeE = req.body.groupeE
  let matriculeP = req.body.matriculeP
  let nomP = req.body.nomP
  let dateI = req.body.dateI
  let lieuI = req.body.lieuI
  let motifI = req.body.motifI
  let descI = req.body.descI
  //placeholder
})

module.exports = router
