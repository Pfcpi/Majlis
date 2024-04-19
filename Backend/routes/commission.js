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

// list of commission members (comission page)
router.get('/get', (req, res) => {
  let sqlquery = `SELECT nom_m, prenom_m, role_m, email_m, date_debut_m
  FROM Membre
  WHERE est_actif = TRUE`
  db.query(sqlquery, (err, result) => {
    if (err) {
      res.status(400).send(err)
    } else {
      res.send(result)
    }
  })
})

// add a member to the comission (active by default)
/* Body being in the format of :
  {
	 "nomM": string value,
   "prenomM": string value,
   "roleM": string value,
   "emailM": string value in the format of 'name@mail.x',
   "dateDebutM": string value in the format of 'YYYY-MM-DD'
  }
*/
router.post('/add', (req, res) => {
  let values = [req.body.nomM, req.body.prenomM, req.body.roleM, req.body.emailM, req.body.dateDebutM]
  let sqlquery = `INSERT INTO Membre (nom_m, prenom_m, role_m, email_m, date_debut_m) VALUES (?, ?, ?, ?, ?)`
  db.query(sqlquery, values, (err, result) => {
    if(err) {
      res.status(400).send(err)
    } else {
      res.status(201).send(result)
    }
  })
})

// edit a member information
/* Body being in the format of :
  {
	  "roleM": string value,
    "nomM": string value,
    "prenomM": string value,
    "dateDebutM": date value in the format of 'YYYY-MM-DD',
    "idM": int value
  }
*/
router.patch('/edit', (req, res) => {
  let values = [req.body.roleM, req.body.nomM, req.body.prenomM, req.body.dateDebutM, req.body.idM]
  let sqlquery = `UPDATE Membre SET role_m = ?, nom_m = ?, prenom_m = ?, date_debut_m = ? WHERE id_m = ?`
  db.query(sqlquery, values, (err, result) => {
    if(err) {
      res.status(400).send(err)
    } else {
      res.send(result)
    }
  })
})

// Remove member from active comission
/* Body being in the format of :
  {
    "idM": int value,
    "dateFin": date value format 'YYYY-MM-DD'
  }
*/
router.patch('/remove', (req, res) => {
  let values = [req.body.dateFin, req.body.idM]
  let sqlquery = `UPDATE Membre SET est_actif = FALSE, date_fin_m = ? WHERE id_m = ?`

  db.query(sqlquery, values, (err, result) => {
    if(err) {
      res.status(400).send(err)
    } else {
      res.sendStatus(204)
    }
  })
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
      console.log(err)
    } else {
      console.log("Email sent")
    }
  })
  res.sendStatus(204)
})

module.exports = router
