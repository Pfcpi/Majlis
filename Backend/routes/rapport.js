/* eslint-disable prettier/prettier */
/* eslint-disable no-unused-vars */
const express = require('express')
const router = express.Router()
const { db } = require('../config/db')
const nodemailer = require('nodemailer')

function maj(chaine) {
  return chaine.charAt(0).toUpperCase().concat(chaine.slice(1))
}

// List of rapport that is short (Acceuil)
router.get('/get', (req, res) => {
  let sqlquery = `SELECT r.num_r, e.nom_e, e.prenom_e, i.date_i
  FROM Rapport r
  JOIN Etudiant e ON r.matricule_e = e.matricule_e
  JOIN Infraction i ON r.num_i = i.num_i
  WHERE r.est_traite = FALSE
  ORDER BY i.date_i DESC`
  db.query(sqlquery, (err, result) => {
    if (err) {
      res.status(400).send(err)
    } else {
      res.send(result)
    }
  })
})

// List of rapport that is detailled (click on a rapport)
/* Body being in the format of :
  {
	"numR": int value
  }
*/
router.post('/gets', (req, res) => {
  let numr = req.body.numR
  let sqlquery = `SELECT e.matricule_e, e.nom_e, e.prenom_e, e.niveau_e, e.section_e, e.groupe_e, e.email_e,
  p.nom_p, p.prenom_p,
  i.date_i, i.lieu_i, i.motif_i, i.description_i, i.degre_i,
  r.date_r
  FROM Rapport r
  INNER JOIN Etudiant e ON r.matricule_e = e.matricule_e
  INNER JOIN Plaignant p ON r.id_p = p.id_p
  INNER JOIN Infraction i ON r.num_i = i.num_i
  WHERE r.num_r = ?`

  db.query(sqlquery, numr, (err, result) => {
    if (err) {
      console.log(err)
      res.status(400).send(err)
    } else {
      res.send(result)
    }
  })
})

// Edit the values of a selected rapport
/* Body being in the format of :
  {
	 "matriculeE": big int value,
   "nomE": string value,
   "prenomE": string value,
   "niveauE": string value,
   "groupeE": int value,
   "sectionE": int value or null,
   "matriculeP": big int value,
   "nomP": string value,
   "prenomP": string value,
   "dateI": string value in the format of 'YYYY-MM-DD',
   "lieuI": string value,
   "motifI": string value,
   "descI": string value,
   "degreI": int value (1 or 2),
   "email": string value
	 "numR": int value
  }
*/
router.patch('/edit', (req, res) => {
  let object = req.body
  if (object.isEmailing) {
    object = object.rapport
  }
  let sqlquery = `UPDATE Rapport r
  INNER JOIN Etudiant e ON r.matricule_e = e.matricule_e
  INNER JOIN Plaignant p ON r.id_p = p.id_p
  INNER JOIN Infraction i ON r.num_i = i.num_i
  SET
      e.matricule_e = ?,
      e.nom_e = ?,
      e.prenom_e = ?,
      e.niveau_e = ?,
      e.groupe_e = ?,
      e.section_e = ?,
      e.email_e = ?,
      p.nom_p = ?,
      p.prenom_p = ?,
      i.date_i = ?,
      i.lieu_i = ?,
      i.motif_i = ?,
      i.description_i = ?,
      i.degre_i = ?,
      r.matricule_e = ?
  WHERE r.num_r = ?`
  let values = [
    object.matriculeE,
    object.nomE.replace(/ /g, '\u00A0').toUppercase(),
    maj(object.prenomE.replace(/ /g, '\u00A0')),
    object.niveauE,
    object.groupeE,
    object.sectionE,
    object.email,
    object.nomP.replace(/ /g, '\u00A0').toUppercase(),
    maj(object.prenomP.replace(/ /g, '\u00A0')),
    object.dateI,
    object.lieuI,
    object.motifI,
    object.descI,
    object.degreI,
    object.matriculeE,
    object.numR
  ]

  db.query(sqlquery, values, (err, result) => {
    if (err) {
      res.status(400).send(err) //if error number is 1062 that means that there is duplicate of either a etudiant or plaignant
    } else {
      if (req.body.isEmailing) {
        // Sending automatically a mail to notify the president about a new rapport
        console.log('trying to send mail .....')
        db.query('SELECT email_u FROM Utilisateur WHERE id_u = 1', (err, result) => {
          if (err) {
            console.log(err)
          } else {
            // Automatic mailling setup
            console.log('got the email!!')
            const transporter = nodemailer.createTransport({
              host: 'smtp.zoho.com',
              port: 465,
              secure: true,
              auth: {
                user: 'rapport@cd-usto.tech',
                pass: 'uc3Snp?o'
              }
            })
            const mailOptions = {
              from: '"Logiciel Conseil de Discipline" <rapport@cd-usto.tech>',
              to: result[0].email_u,
              subject: "Modification d'un rapport.",
              html: `<!DOCTYPE html>
                                    <html lang="fr-FR">
                                    <head>
                                        <meta charset="UTF-8">
                                        <title>new rapport</title>
                                        <link rel="preconnect" href="https://fonts.googleapis.com">
                                        <link rel="preconnect" href="https://fonts.gstatic.com/" crossorigin>
                                        <link href="https://fonts.googleapis.com/css2?family=PT+Serif:ital,wght@0,400;0,700;1,400;1,700&display=swap" rel="stylesheet">
                                        <style>
                                            body {
                                                font-family: "PT Serif", serif;
                                                margin: 0;
                                                min-height: 100vh;
                                                text-align: center;
                                            }
                                    
                                            .container {
                                                text-align: center;
                                                padding: 20px;
                                                margin: auto;
                                            }
                                    
                                            .box1 {
                                                margin: 30px auto 60px;
                                                padding: 0;
                                                text-align: center;
                                            }
                                    
                                            .box2 {
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
                                                margin: 15px auto 0;
                                            }
                                    
                                            #parg1 {
                                                font-size: 1.4em;
                                                font-weight: 400;
                                                margin: 0 auto 15px;
                                            }
                                    
                                            #parg2 {
                                                font-size: 1.2em;
                                                font-weight: 500;
                                                margin: 15px auto 0;
                                            }
                                        </style>
                                    </head>
                                    <body>
                                        <div class="container">
                                            <div class="box1">
                                                <img src="https://i.goopics.net/drpcqh.png" id="logo">
                                                <h1 id="title">
                                                    Modification d'un Rapport
                                                </h1>
                                            </div>
                                            <div class="box2">
                                                <p id="parg1">Le Président de commission a modifier un rapport.</p>
                                                <p id="parg2">Qui concerne l'étudiant ${object.nomE + ' ' + object.prenomE}.</p>
                                                <p id="parg2">Vous pouvez le consulter à l'archive du logiciel.</p>
                                            </div>
                                        </div>
                                    </body>
                                    </html> `
            }
            transporter.sendMail(mailOptions, function (err, info) {
              if (err) {
                console.log('Error while sending email' + err)
              } else {
                console.log('Email sent')
              }
            })
          }
        })
      }
      res.send(result)
    }
  })
})

// Delete a rapport
/* Body being in the format of :
  {
	"numR": int value
  }
*/
router.delete('/delete', (req, res) => {
  let numr = req.body.numR
  let sqlquery = `DELETE r, i
  FROM Rapport r
  JOIN Infraction i ON r.num_i = i.num_i
  WHERE r.num_r = ?`

  db.query(sqlquery, numr, (err, result) => {
    if (err) {
      res.status(400).send(err)
    } else {
      res.sendStatus(204)
    }
  })
})

// Add a rapport
/* Body being in the format of :
  {
	 "matriculeE": big int value,
   "nomE": string value,
   "prenomE": string value,
   "niveauE": string value,
   "groupeE": int value,
   "sectionE": int value or null,
   "nomP": string value,
   "prenomP": string value,
   "dateI": string value in the format of 'YYYY-MM-DD',
   "lieuI": string value,
   "motifI": string value,
   "descI": string value,
   "degreI": int value (1 or 2),
   "email": string value
  }
*/
router.post('/add', (req, res) => {
  let object = req.body
  // SQL queries
  let sqlqueryE =
    'INSERT INTO Etudiant (matricule_e, nom_e, prenom_e, niveau_e, groupe_e, section_e, antecedant_e, email_e) VALUES (?, ?, ?, ?, ?, ?, true, ?)'
  let sqlqueryP = 'SELECT * FROM Plaignant WHERE nom_p = ? AND prenom_p = ?'
  let sqlqueryP2 = 'INSERT INTO Plaignant (nom_p, prenom_p) VALUES (?, ?)'
  let sqlqueryI =
    'INSERT INTO Infraction (lieu_i, date_i, motif_i, description_i, degre_i) VALUES (?, ?, ?, ?, ?)'
  let sqlqueryR =
    'INSERT INTO Rapport (date_r, matricule_e, id_p, num_i) VALUES (NOW(), ?, ?, LAST_INSERT_ID())'

  db.query(
    sqlqueryE,
    [
      object.matriculeE,
      object.nomE.replace(/ /g, '\u00A0').toUpperCase(),
      maj(object.prenomE.replace(/ /g, '\u00A0')),
      object.niveauE,
      object.groupeE,
      object.sectionE,
      object.email
    ],
    (err, result) => {
      if (err && err.errno != 1062) {
        // Check for duplicate
        res.status(400).send(err)
      } else {
        db.query(
          sqlqueryP,
          [object.nomP.replace(/ /g, '\u00A0').toUpperCase(), maj(object.prenomP.replace(/ /g, '\u00A0'))],
          (err, result) => {
            if (err) {
              // Check for duplicate
              res.status(400).send(err)
            } else {
              if (result[0] == null) {
                db.query(
                  sqlqueryP2,
                  [object.nomP.replace(/ /g, '\u00A0').toUpperCase(), maj(object.prenomP.replace(/ /g, '\u00A0'))],
                  (err, result) => {
                    if (err) {
                      console.log(err)
                      res.status(400).send(err)
                    } else {
                      let x = result.insertId
                      if (!object.descI) {
                        object.desc = ''
                      }
                      db.query(
                        sqlqueryI,
                        [
                          object.lieuI,
                          object.dateI,
                          object.motifI.replace(/,/g, ''),
                          object.descI.replace(/,/g, ''),
                          object.degreI
                        ],
                        (err, result) => {
                          if (err) {
                            res.status(400).send(err)
                          } else {
                            db.query(sqlqueryR, [object.matriculeE, x], (err, result) => {
                              if (err) {
                                console.log(err)
                              } else {
                                // Sending automatically a mail to notify the president about a new rapport
                                db.query(
                                  'SELECT email_m FROM Membre WHERE role_m = "President" AND est_actif = TRUE',
                                  (err, result) => {
                                    if (err) {
                                      console.log(err)
                                    } else {
                                      // Automatic mailling setup
                                      const transporter = nodemailer.createTransport({
                                        host: 'smtp.zoho.com',
                                        port: 465,
                                        secure: true,
                                        auth: {
                                          user: 'rapport@cd-usto.tech',
                                          pass: 'uc3Snp?o'
                                        }
                                      })
                                      const mailOptions = {
                                        from: '"Logiciel Conseil de Discipline" <rapport@cd-usto.tech>',
                                        to: result[0].email_m,
                                        subject: 'Nouveau rapport déposé.',
                                        html: `<!DOCTYPE html>
                                    <html lang="fr-FR">
                                    <head>
                                        <meta charset="UTF-8">
                                        <title>new rapport</title>
                                        <link rel="preconnect" href="https://fonts.googleapis.com">
                                        <link rel="preconnect" href="https://fonts.gstatic.com/" crossorigin>
                                        <link href="https://fonts.googleapis.com/css2?family=PT+Serif:ital,wght@0,400;0,700;1,400;1,700&display=swap" rel="stylesheet">
                                        <style>
                                            body {
                                                font-family: "PT Serif", serif;
                                                margin: 0;
                                                min-height: 100vh;
                                                text-align: center;
                                            }
                                    
                                            .container {
                                                text-align: center;
                                                padding: 20px;
                                                margin: auto;
                                            }
                                    
                                            .box1 {
                                                margin: 30px auto 60px;
                                                padding: 0;
                                                text-align: center;
                                            }
                                    
                                            .box2 {
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
                                                margin: 15px auto 0;
                                            }
                                    
                                            #parg1 {
                                                font-size: 1.4em;
                                                font-weight: 400;
                                                margin: 0 auto 15px;
                                            }
                                    
                                            #parg2 {
                                                font-size: 1.2em;
                                                font-weight: 500;
                                                margin: 15px auto 0;
                                            }
                                        </style>
                                    </head>
                                    <body>
                                        <div class="container">
                                            <div class="box1">
                                                <img src="https://i.goopics.net/drpcqh.png" id="logo">
                                                <h1 id="title">
                                                    Nouveau Rapport
                                                </h1>
                                            </div>
                                            <div class="box2">
                                                <p id="parg1">Le chef de département a rédigé un nouveau rapport.</p>
                                                <p id="parg2">Vous pouvez le consulter à l'accueil du logiciel.</p>
                                            </div>
                                        </div>
                                    </body>
                                    </html> `
                                      }
                                      transporter.sendMail(mailOptions, function (err, info) {
                                        if (err) {
                                          console.log('Error while sending email' + err)
                                        } else {
                                          console.log('Email sent')
                                        }
                                      })
                                    }
                                  }
                                )
                                res.sendStatus(204)
                              }
                            })
                          }
                        }
                      )
                    }
                  }
                )
              } else {
                db.query(
                  sqlqueryP,
                  [object.nomP.replace(/ /g, '\u00A0').toUpperCase(), maj(object.prenomP.replace(/ /g, '\u00A0'))],
                  (err, result) => {
                    if (err) {
                      console.log(err)
                      res.status(400).send(err)
                    } else {
                      let x = result[0].id_p
                      db.query(
                        sqlqueryI,
                        [object.lieuI, object.dateI, object.motifI, object.descI, object.degreI],
                        (err, result) => {
                          if (err) {
                            res.status(400).send(err)
                          } else {
                            db.query(sqlqueryR, [object.matriculeE, x], (err, result) => {
                              if (err) {
                                res.status(400).send(err)
                              } else {
                                // Sending automatically a mail to notify the president about a new rapport
                                db.query(
                                  'SELECT email_m FROM Membre WHERE role_m = "President" AND est_actif = TRUE',
                                  (err, result) => {
                                    if (err) {
                                      console.log(err)
                                    } else {
                                      // Automatic mailling setup
                                      const transporter = nodemailer.createTransport({
                                        host: 'smtp.zoho.com',
                                        port: 465,
                                        secure: true,
                                        auth: {
                                          user: 'rapport@cd-usto.tech',
                                          pass: 'uc3Snp?o'
                                        }
                                      })
                                      const mailOptions = {
                                        from: '"Logiciel Conseil de Discipline" <rapport@cd-usto.tech>',
                                        to: result[0].email_m,
                                        subject: 'Nouveau rapport déposé.',
                                        html: `<!DOCTYPE html>
                                    <html lang="fr-FR">
                                    <head>
                                        <meta charset="UTF-8">
                                        <title>new rapport</title>
                                        <link rel="preconnect" href="https://fonts.googleapis.com">
                                        <link rel="preconnect" href="https://fonts.gstatic.com/" crossorigin>
                                        <link href="https://fonts.googleapis.com/css2?family=PT+Serif:ital,wght@0,400;0,700;1,400;1,700&display=swap" rel="stylesheet">
                                        <style>
                                            body {
                                                font-family: "PT Serif", serif;
                                                margin: 0;
                                                min-height: 100vh;
                                                text-align: center;
                                            }
                                    
                                            .container {
                                                text-align: center;
                                                padding: 20px;
                                                margin: auto;
                                            }
                                    
                                            .box1 {
                                                margin: 30px auto 60px;
                                                padding: 0;
                                                text-align: center;
                                            }
                                    
                                            .box2 {
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
                                                margin: 15px auto 0;
                                            }
                                    
                                            #parg1 {
                                                font-size: 1.4em;
                                                font-weight: 400;
                                                margin: 0 auto 15px;
                                            }
                                    
                                            #parg2 {
                                                font-size: 1.2em;
                                                font-weight: 500;
                                                margin: 15px auto 0;
                                            }
                                        </style>
                                    </head>
                                    <body>
                                        <div class="container">
                                            <div class="box1">
                                                <img src="https://i.goopics.net/drpcqh.png" id="logo">
                                                <h1 id="title">
                                                    Nouveau Rapport
                                                </h1>
                                            </div>
                                            <div class="box2">
                                                <p id="parg1">Le chef de département a rédigé un nouveau rapport.</p>
                                                <p id="parg2">Vous pouvez le consulter à l'accueil du logiciel.</p>
                                            </div>
                                        </div>
                                    </body>
                                    </html> `
                                      }
                                      transporter.sendMail(mailOptions, function (err, info) {
                                        if (err) {
                                          console.log('Error while sending email' + err)
                                        } else {
                                          console.log('Email sent')
                                        }
                                      })
                                    }
                                  }
                                )
                                res.sendStatus(204)
                              }
                            })
                          }
                        }
                      )
                    }
                  }
                )
              }
            }
          }
        )
      }
    }
  )
})

module.exports = router
