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
    user: 'conseil@cd-usto.tech',
    pass: 'yirq8@cJ'
  }
})

router.get('/get', (req, res) => {
  //placeholder
})

router.post('/add', (req, res) => {
  //placeholder
})

router.patch('/edit', (req, res) => {
  //placeholder
})

router.delete('/delete', (req, res) => {
  //placeholder
})

// Automatic email sent to selected commission member to notify about new conseil de discipline
/* Body being in the format:
  {
    email: string value
  }
*/
router.post('/mail', (req, res) => {
  let mail = req.body.email
  const mailOptions = {
    from: '"Logiciel Conseil de Discipline" <conseil@cd-usto.tech>',
    to: mail,
    subject: 'Nouveau conseil de discipline planifié.',
    html: ``
  }
  transporter.sendMail(mailOptions, function (err, info) {
    if (err) {
      res.status(400).send(err)
    } else {
      res.status(200).send(null)
    }
  })
})

module.exports = router
