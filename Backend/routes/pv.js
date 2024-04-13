/* eslint-disable prettier/prettier */
/* eslint-disable no-unused-vars */
const express = require('express')
const router = express.Router()
const { db } = require('../config/db')
const nodemailer = require('nodemailer')

// Automatic mailling setup
const transporter = nodemailer.createTransport({
  host: 'smtp.zoho.com',
  port: 465,
  secure: true,
  auth: {
    user: 'conseilpv@cd-usto.tech',
    pass: 'sjt$yT1e'
  }
})
const mailOptions = {
  from: '"Logiciel Conseil de Discipline" <conseilpv@cd-usto.tech>',
  to: 'dyedjour@yahoo.fr',
  subject: 'Nouveau PV déposé.',
  html: ``
}

router.get('/get', (req, res) => {
  //placeholder
})

router.patch('/edit', (req, res) => {
  //placeholder
})

router.delete('/delete', (req, res) => {
  //placeholder
})

router.post('/add', (req, res) => {
  //placeholder
})

// Automatic mail sending to chef departement to notify about the appearance
router.post('/mail', (req, res) => {
  transporter.sendMail(mailOptions, function (err, info) {
    if (err) {
      res.status(400).send(err)
    } else {
      res.status(200)
    }
  })
})

module.exports = router
