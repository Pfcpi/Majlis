/* eslint-disable no-unused-vars */
const express = require('express')
const router = express.Router()
const { db } = require('../config/db')

router.get('/get', (req, res) => {
  //placeholder
})

router.get('/gets', (req, res) => {
  //placeholder
})

router.patch('/edit', (req, res) => {
  let object = req.body
  //placeholder
})

router.delete('/delete', (req, res) => {
  let numR = req.body.numR
  //placeholder
})

router.post('/add', (req, res) => {
  let object = req.body
  //placeholder
})

router.get('/print', (req, res) => {
  //placeholder
})

router.get('/save', (req, res) => {
  //placeholder
})

module.exports = router
