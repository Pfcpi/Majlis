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

// list of commission members (commission page)
router.get('/get', (req, res) => {
  let sqlquery = `SELECT nom_m, prenom_m, role_m, email_m, date_debut_m, id_m
  FROM Membre m
  INNER JOIN Commission c ON c.num_c = m.num_c
  WHERE m.est_actif = TRUE AND c.actif_c = TRUE`
  db.query(sqlquery, (err, result) => {
    if (err) {
      res.send(err)
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
  let values = [
    req.body.nomM,
    req.body.prenomM,
    req.body.roleM,
    req.body.emailM,
    req.body.dateDebutM
  ]
  if (values[2]=="Président") {
    db.query("UPDATE Utilisateur SET email_u = ?, nomU = ?, prenomU = ? WHERE id_u = 2",  [values[3], values[0], values[1]], (err, result) => {
    if(err) {
      res.send("Error while changing président")
    }
  })
  }
  let sqlquery = `INSERT INTO Membre (nom_m, prenom_m, role_m, email_m, date_debut_m, num_c, est_actif) VALUES (?, ?,   ?, ?, ?, (SELECT num_c FROM Commission WHERE actif_c = TRUE), TRUE)`
  db.query(sqlquery, values, (err, result) => {
    if (err) {
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
  let values = [
    req.body.roleM,
    req.body.nomM,
    req.body.prenomM,
    req.body.emailM,
    req.body.dateDebutM,
    req.body.idM
  ]
  if (values[0]=="Président") {
    db.query("UPDATE Utilisateur SET email_u = ?, nomU = ?, prenomU = ? WHERE id_u = 2",  [values[3], values[1], values[2]], (err, result) => {
    if(err) {
      res.send("Error while changing président")
    }
  })
  }
  let sqlquery = `UPDATE Membre SET role_m = ?, nom_m = ?, prenom_m = ?, email_m = ?, date_debut_m = ? WHERE id_m = ?`
  db.query(sqlquery, values, (err, result) => {
    if (err) {
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
    if (err) {
      res.status(400).send(err)
    } else {
      res.sendStatus(204)
    }
  })
})

/* edit active commission
  {
    "date_debut_c": date value format 'YYYY-MM-DD',
    "date_fin_c": date value format 'YYYY-MM-DD'
  }
*/
router.patch('/editcom', (req, res) => {
  let values = [req.body.date_debut_c, req.body.date_fin_c]
  let sqlquery = `UPDATE Commission SET date_debut_c = ?, date_fin_c = ? WHERE actif_c = TRUE`
  db.query(sqlquery, values, (err, result) => {
    if (err) {
      res.status(400).send(err)
    } else {
      res.sendStatus(204)
    }
  })
})

// Archiver commission active
router.patch('/archivecom', (req, res) => {
  let sqlquery = `UPDATE Commission SET actif_c = FALSE, date_fin_c = NOW() WHERE actif_c = TRUE`
  db.query(sqlquery, (err, result) => {
    if (err) {
      res.status(200).send(err)
    } else {
      let setAllmemberstoInactive = `UPDATE Membre SET est_actif = FALSE WHERE est_actif = TRUE`
      db.query(setAllmemberstoInactive, (err, result) => {
        if (err) {
          res.status(200).send(err)
        } else {
          let sqlquery = `INSERT INTO Commission (date_debut_c, actif_c) VALUES (NOW(), TRUE)`
          db.query(sqlquery, (err, result) => {
            if (err) {
              res.status(200).send(err)
            } else {
              res.sendStatus(204)
            }
          })
        }
      })
    }
  })
})

/*
  Get active commission
*/
router.get('/getcom', (req, res) => {
  let sqlquery = `SELECT c.*, m.* FROM Commission c INNER JOIN Membre m ON m.num_c = c.num_c WHERE m.est_actif = TRUE AND c.actif_c = TRUE`
  db.query(sqlquery, (err, result) => {
    if (err) {
      console.log(err)
    } else {
      res.send(result)
    }
  })
})

// Automatic email sent to selected commission member to notify about new conseil de discipline
/* Body being in the format:
  {
    email: string value,
    html: string value (html code)
  }
*/
router.post('/mail', (req, res) => {
  let mail = req.body.email
  let html = req.body.html
  const mailOptions = {
    from: '"Logiciel Conseil de Discipline" <conseil@cd-usto.tech>',
    to: mail,
    subject: 'Nouveau conseil de discipline planifié.',
    html: html
  }
  transporter.sendMail(mailOptions, function (err, info) {
    if (err) {
      console.log(err)
    } else {
      console.log('Email sent')
    }
  })
  res.sendStatus(204)
})

module.exports = router
