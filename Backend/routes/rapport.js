/* eslint-disable prettier/prettier */
/* eslint-disable no-unused-vars */
const express = require('express')
const router = express.Router()
const { db } = require('../config/db')
const nodemailer = require('nodemailer')

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
  let sqlquery = `SELECT e.matricule_e, e.nom_e, e.prenom_e, e.niveau_e, e.section_e, e.groupe_e,
  p.nom_p, p.prenom_p,
  i.date_i, i.lieu_i, i.motif_i, i.description_i, i.degre_i
  FROM Rapport r
  INNER JOIN Etudiant e ON r.matricule_e = e.matricule_e
  INNER JOIN Plaignant p ON r.id_p = p.id_p
  INNER JOIN Infraction i ON r.num_i = i.num_i
  WHERE r.num_r = ?`

  db.query(sqlquery, numr, (err, result) => {
    if (err) {
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
	 "numR": int value
  }
*/
router.patch('/edit', (req, res) => {
  let object = req.body
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
    object.nomE,
    object.prenomE,
    object.niveauE,
    object.groupeE,
    object.sectionE,
    object.nomP,
    object.prenomP,
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
      res.sendStatus(err.errno) //if error number is 1062 that means that there is duplicate of either a etudiant or plaignant
    } else {
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
   "degreI": int value (1 or 2)
  }
*/
router.post('/add', (req, res) => {
  let object = req.body
  // SQL queries
  let sqlqueryE =
    'INSERT INTO Etudiant (matricule_e, nom_e, prenom_e, niveau_e, groupe_e, section_e, antecedant_e) VALUES (?, ?, ?, ?, ?, ?, true)'
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
      object.nomE,
      object.prenomE,
      object.niveauE,
      object.groupeE,
      object.sectionE
    ],
    (err, result) => {
      if (err && err.errno != 1062) {
        // Check for duplicate
        return res.status(400).send(err)
      } else {
        db.query(sqlqueryP, [object.nomP, object.prenomP], (err, result) => {
          if (err) {
            // Check for duplicate
            return res.status(400).send(err)
          } else {
            if (result[0] == null) {
              db.query(sqlqueryP2, [object.nomP, object.prenomP])
              db.query(sqlqueryP, [object.nomP, object.prenomP], (err, result) => {
                if (err) {
                  console.log(err)
                } else {
                  let x = result[0].id_p
                  db.query(
                    sqlqueryI,
                    [object.lieuI, object.dateI, object.motifI, object.descI, object.degreI],
                    (err, result) => {
                      if (err) {
                        return res.status(400).send(err)
                      } else {
                        db.query(sqlqueryR, [object.matriculeE, x], (err, result) => {
                          if (err) {
                            return res.status(400).send(err)
                          } else {
                            // Sending automatically a mail to notify the president about a new rapport
                            db.query('SELECT email_m FROM Membre WHERE role_m = "President"', (err, result) => {
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
                                    html: '<body><div style="text-align: center;"><img src="https://i.goopics.net/hmgccm.png" style="width: 100%; max-width: 650px; height: auto;"></div></body>'
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
                            res.statusStatus(204)
                          }
                        })
                      }
                    }
                  )
                }
              })
            } else {
              db.query(sqlqueryP, [object.nomP, object.prenomP], (err, result) => {
                if (err) {
                  console.log(err)
                } else {
                  let x = result[0].id_p
                  db.query(
                    sqlqueryI,
                    [object.lieuI, object.dateI, object.motifI, object.descI, object.degreI],
                    (err, result) => {
                      if (err) {
                        return res.status(400).send(err)
                      } else {
                        db.query(sqlqueryR, [object.matriculeE, x], (err, result) => {
                          if (err) {
                            return res.status(400).send(err)
                          } else {
                            // Sending automatically a mail to notify the president about a new rapport
                            db.query('SELECT email_m FROM Membre WHERE role_m = "President"', (err, result) => {
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
                                    html: '<body><div style="text-align: center;"><img src="https://i.goopics.net/hmgccm.png" style="width: 100%; max-width: 650px; height: auto;"></div></body>'
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
              })
            }
          }
        })
      }
    }
  )
})

module.exports = router