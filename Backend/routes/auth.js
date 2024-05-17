/* eslint-disable prettier/prettier */
/* eslint-disable no-unused-vars */
const express = require('express')
const router = express.Router()
const { db } = require('../config/db')
const crypto = require('crypto')
const nodemailer = require('nodemailer')

// Automatic mailling setup
const transporter = nodemailer.createTransport({
  host: 'smtp.zoho.com',
  port: 465,
  secure: true,
  auth: {
    user: 'conseil-discipline@cd-usto.tech',
    pass: '2dleH#hz'
  }
})

// Function that generates a password
function generatePassword() {
  var length = 8,
      charset = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789",
      retVal = "";
  for (var i = 0, n = charset.length; i < length; ++i) {
      retVal += charset.charAt(Math.floor(Math.random() * n));
  }
  return retVal;
}

/*
    Sends a request to the database to check if it's the correct pass
    BODY REQUEST:
        {
            "pass": String
        }
*/
router.post('/chef', (req, res) => {
  let pass = req.body.pass
  const hashedPassword = crypto.createHash('sha256').update(pass).digest('hex')
  let sqlquery = `SELECT * FROM Utilisateur WHERE id_u = 1 AND mot_de_passe = ?`
  db.query(sqlquery, hashedPassword, (err, result) => {
    if (err) {
      res.status(400).send(err)
    } else {
      if (result[0] != null) {
        res.send('Correct pass')
      } else {
        res.send('Wrong pass')
      }
    }
  })
})

/*
    Sends a request to the database to check if it's the correct pass
    BODY REQUEST:
        {
            pass: String
        }
*/
router.post('/pres', (req, res) => {
  let pass = req.body.pass
  let sqlquery = `SELECT * FROM Utilisateur WHERE id_u = 2 AND mot_de_passe = ?`
  const hashedPassword = crypto.createHash('sha256').update(pass).digest('hex')
  db.query(sqlquery, hashedPassword, (err, result) => {
    if (err) {
      res.status(400).send(err)
    } else {
      if (result[0] != null) {
        res.send('Correct pass')
      } else {
        res.send('Wrong pass')
      }
    }
  })
})

/* Updates the password of the president
    BODY REQUEST:
        {
            oldPass: String,
            newPass: String
        }
*/
router.patch('/pedit', (req, res) => {
  let oldPass = req.body.oldPass
  let newPass = req.body.newPass
  let sqlquery = `SELECT * FROM Utilisateur WHERE id_u = 2 AND mot_de_passe = ?`
  let sqlquery2 = `UPDATE Utilisateur SET mot_de_passe = ? WHERE id_u = 2`
  const hashedOldPassword = crypto.createHash('sha256').update(oldPass).digest('hex')
  const hashedNewPassword = crypto.createHash('sha256').update(newPass).digest('hex')
  db.query(sqlquery, hashedOldPassword, (err, result) => {
    if (err) {
      res.status(400).send(err)
    } else {
      if (result[0] != null) {
        db.query(sqlquery2, hashedNewPassword, (err, result) => {
          if (err) {
            res.status(400).send(err)
          } else {
            res.status(200).send('Password changed')
          }
        })
      } else {
        res.send('Wrong old pass')
      }
    }
  })
  
})

/* Updates the password of the chef
    BODY REQUEST:
        {
            oldPass: String,
            newPass: String
        }
*/
router.patch('/cedit', (req, res) => {
  let oldPass = req.body.oldPass
  let newPass = req.body.newPass
  let sqlquery = `SELECT * FROM Utilisateur WHERE id_u = 1 AND mot_de_passe = ?`
  let sqlquery2 = `UPDATE Utilisateur SET mot_de_passe = ? WHERE id_u = 1`
  const hashedOldPassword = crypto.createHash('sha256').update(oldPass).digest('hex')
  const hashedNewPassword = crypto.createHash('sha256').update(newPass).digest('hex')
  db.query(sqlquery, hashedOldPassword, (err, result) => {
    if (err) {
      res.status(400).send(err)
    } else {
      if (result[0] != null) {
        db.query(sqlquery2, hashedNewPassword, (err, result) => {
          if (err) {
            res.status(400).send(err)
          } else {
            res.status(200).send('Password changed')
          }
        })
      } else {
        res.send('Wrong old pass')
      }
    }
  })
})

// Sends a mail to chef departement containing the password
router.post('/cmail', (req, res) => {
  let sqlquery = `SELECT * FROM Utilisateur WHERE id_u = 1`
  db.query(sqlquery, (err, result) => {
    if (err) {
      res.send(err)
    } else {
      const newPass = generatePassword()
      console.log(newPass)
      const hashedNewPassword = crypto.createHash('sha256').update(newPass).digest('hex')
      let sqlquery2 = `UPDATE Utilisateur SET mot_de_passe = ? WHERE id_u = 1`
      db.query(sqlquery2, hashedNewPassword, (err, result) => {
        if (err) {
          res.status(400).send(err)
        } else {
          const mailOptions = {
            from: '"Logiciel Conseil de Discipline" <conseil-discipline@cd-usto.tech>',
            to: result[0].email_u,
            subject: 'Votre mot de passe oublie.',
            html : ``
          }
          transporter.sendMail(mailOptions, function (err, info) {
            if (err) {
              console.log(err)
            } else {
              console.log('Email sent')
              res.sendStatus(204)
            }
          })
        }
      })
    }
})
})

// Sends a mail to president containing the password
router.post('/pmail', (req, res) => {
  let sqlquery = `SELECT m.email_m FROM Membre m
  INNER JOIN Commission c ON c.num_c = m.num_c
  WHERE c.actif_c = TRUE AND m.role_m = "Président"`
  db.query(sqlquery, (err, result) => {
    if (err) {
      res.send(err)
    } else {
      const newPass = generatePassword()
      console.log(newPass)
      const hashedNewPassword = crypto.createHash('sha256').update(newPass).digest('hex')
      let sqlquery2 = `UPDATE Utilisateur SET mot_de_passe = ? WHERE id_u = 1`
      db.query(sqlquery2, hashedNewPassword, (err, result) => {
        if (err) {
          res.status(400).send(err)
        } else {
          const mailOptions = {
            from: '"Logiciel Conseil de Discipline" <conseil-discipline@cd-usto.tech>',
            to: result[0].email_u,
            subject: 'Votre mot de passe oublie.',
            html : ``
          }
          transporter.sendMail(mailOptions, function (err, info) {
            if (err) {
              console.log(err)
            } else {
              console.log('Email sent')
              res.sendStatus(204)
            }
          })
        }
      })
    }
})
})

/* Change nom, prenom and email of chef departement (in case it happens which is very unlikely)
{
  "nom": String value,
  "prenom": String value,
  "email": String value
}
*/
router.patch('/chefupdate', (req, res) => {
  let values = [
    req.body.email,
    req.body.nom,
    req.body.prenom
  ]
  let sqlquery = `UPDATE Utilisateur SET email_u = ? , nomU = ? , prenomU = ? WHERE id_u = 1`
  db.query(sqlquery, values , (err, result) => {
    if (err) {
      res.send(err)
    } else {
      res.sendStatus(204)
    }
  })
})

module.exports = router