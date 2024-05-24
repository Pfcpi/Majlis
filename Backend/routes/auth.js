/* eslint-disable prettier/prettier */
/* eslint-disable no-unused-vars */
const express = require('express')
const router = express.Router()
const { db } = require('../config/db')
const crypto = require('crypto')
const nodemailer = require('nodemailer')

function maj(chaine) {
  return chaine.charAt(0).toUpperCase().concat(chaine.slice(1))
}

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
    charset = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789',
    retVal = ''
  for (var i = 0, n = charset.length; i < length; ++i) {
    retVal += charset.charAt(Math.floor(Math.random() * n))
  }
  return retVal
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
  console.log('oldPass:', oldPass, ', newPass: ', newPass)
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
  console.log('oldPass:', oldPass, ', newPass: ', newPass)
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
router.get('/cmail', (req, res) => {
  let sqlquery = `SELECT * FROM Utilisateur WHERE id_u = 1`
  db.query(sqlquery, (err, result) => {
    if (err) {
      res.status(400).send(err)
    } else {
      const newPass = generatePassword()
      console.log('newPass:', newPass, ', result:', result)
      let mail = result[0].email_u
      const hashedNewPassword = crypto.createHash('sha256').update(newPass).digest('hex')
      let sqlquery2 = `UPDATE Utilisateur SET mot_de_passe = ? WHERE id_u = 1`
      db.query(sqlquery2, hashedNewPassword, (err, result) => {
        if (err) {
          res.status(400).send(err)
        } else {
          res.send('Changed using email')
          const mailOptions = {
            from: '"Logiciel Conseil de Discipline" <conseil-discipline@cd-usto.tech>',
            to: mail || '',
            subject: 'Votre mot de passe oublie.',
            html: `<!DOCTYPE html>
        <html lang="fr-FR">
        <head>
            <meta charset="UTF-8">
            <title>new password</title>
            <link rel="preconnect" href="https://fonts.googleapis.com">
            <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
            <link href="https://fonts.googleapis.com/css2?family=PT+Serif:ital,wght@0,400;0,700;1,400;1,700&display=swap" rel="stylesheet">
            <style>
                body {
                    font-family: "PT Serif", serif;
                    margin: 0;
                    min-height: 100vh;
                    text-align: center;
                    background-color: white;
                }
        
                .container {
                    text-align: center;
                    padding: 20px;
                    background-color: #18253b;
                    gap: 0;
                    margin: auto;
                }
        
                .box1 {
                    margin: 30px auto;
                    padding: 0;
                    text-align: center;
                }
        
                .box2 {
                    background-color: #212f4b;
                    margin: 30px 5%;
                    padding: 35px;
                    text-align: center;
                }
        
                #logo {
                    width: 10em;
                    height: 10em;
                    margin: 0;
                }
        
                #title {
                    font-size: 2.3em;
                    font-weight: 500;
                    color: white;
                    margin: 15px auto 0;
                }
        
                #parg {
                    font-size: 1.25em;
                    font-weight: 400;
                    color: white;
                    margin: 0 auto 15px;
                }
        
                #mdp {
                    font-size: 1.9em;
                    font-weight: 700;
                    color: white;
                    margin: 15px auto 0;
                }
        
                #msg {
                    font-size: 1em;
                    font-weight: 500;
                    color: white;
                }
            </style>
        </head>
        <body>
            <div class="container">
                <div class="box1">
                    <img src="https://i.goopics.net/drpcqh.png" id="logo">
                    <h1 id="title">
                        Mot de passe<br>
                        réinitialiser
                    </h1>
                    <div class="box2">
                        <p id="parg">Votre nouveau mot de passe de connexion:</p>
                        <p id="mdp">${newPass}</p>
                    </div>
                    <p id="msg">Veuillez changer votre mot de passe a l'aide de ce code de connexion.</p>
                </div>
            </div>
        </body>
        </html>`
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
router.get('/pmail', (req, res) => {
  let sqlquery = `SELECT m.email_m FROM Membre m
  INNER JOIN Commission c ON c.num_c = m.num_c
  WHERE c.actif_c = TRUE AND m.role_m = "Président"`
  db.query(sqlquery, (err, result) => {
    if (err) {
      res.status.send(err)
    } else {
      const newPass = generatePassword()
      console.log('newPass:', newPass, ', result:', result)
      let mail = result[0].email_m
      const hashedNewPassword = crypto.createHash('sha256').update(newPass).digest('hex')
      let sqlquery2 = `UPDATE Utilisateur SET mot_de_passe = ? WHERE id_u = 2`
      db.query(sqlquery2, hashedNewPassword, (err, result) => {
        if (err) {
          res.status(400).send(err)
        } else {
          res.send('Changed using email')
          const mailOptions = {
            from: '"Logiciel Conseil de Discipline" <conseil-discipline@cd-usto.tech>',
            to: mail || '',
            subject: 'Votre mot de passe oublie.',
            html: `<!DOCTYPE html>
          <html lang="fr-FR">
          <head>
              <meta charset="UTF-8">
              <title>new password</title>
              <link rel="preconnect" href="https://fonts.googleapis.com">
              <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
              <link href="https://fonts.googleapis.com/css2?family=PT+Serif:ital,wght@0,400;0,700;1,400;1,700&display=swap" rel="stylesheet">
              <style>
                  body {
                      font-family: "PT Serif", serif;
                      margin: 0;
                      min-height: 100vh;
                      text-align: center;
                      background-color: white;
                  }
          
                  .container {
                      text-align: center;
                      padding: 20px;
                      background-color: #18253b;
                      gap: 0;
                      margin: auto;
                  }
          
                  .box1 {
                      margin: 30px auto;
                      padding: 0;
                      text-align: center;
                  }
          
                  .box2 {
                      background-color: #212f4b;
                      margin: 30px 5%;
                      padding: 35px;
                      text-align: center;
                  }
          
                  #logo {
                      width: 10em;
                      height: 10em;
                      margin: 0;
                  }
          
                  #title {
                      font-size: 2.3em;
                      font-weight: 500;
                      color: white;
                      margin: 15px auto 0;
                  }
          
                  #parg {
                      font-size: 1.25em;
                      font-weight: 400;
                      color: white;
                      margin: 0 auto 15px;
                  }
          
                  #mdp {
                      font-size: 1.9em;
                      font-weight: 700;
                      color: white;
                      margin: 15px auto 0;
                  }
          
                  #msg {
                      font-size: 1em;
                      font-weight: 500;
                      color: white;
                  }
              </style>
          </head>
          <body>
              <div class="container">
                  <div class="box1">
                      <img src="https://i.goopics.net/drpcqh.png" id="logo">
                      <h1 id="title">
                          Mot de passe<br>
                          réinitialiser
                      </h1>
                      <div class="box2">
                          <p id="parg">Votre nouveau mot de passe de connexion:</p>
                          <p id="mdp">${newPass}</p>
                      </div>
                      <p id="msg">Veuillez changer votre mot de passe a l'aide de ce code de connexion.</p>
                  </div>
              </div>
          </body>
          </html>`
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
  let values = [req.body.email, req.body.nom.replace(/ /g, '\u00A0').toUppercase(), maj(req.body.prenom.replace(/ /g, '\u00A0'))]
  console.log('values:', values)
  let sqlquery = `UPDATE Utilisateur SET email_u = ? , nomU = ? , prenomU = ? WHERE id_u = 1`
  db.query(sqlquery, values, (err, result) => {
    if (err) {
      res.status.send(err)
    } else {
      res.sendStatus(204)
    }
  })
})

module.exports = router
