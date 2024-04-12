/* eslint-disable prettier/prettier */
/* eslint-disable no-unused-vars */
const express = require('express')
const router = express.Router()
const { db } = require('../config/db')

// List of rapport that is short (Acceuil)
router.get('/get', (req, res) => {
  let sqlquery = 'SELECT r.num_r, e.nom_e, e.prenom_e, i.date_i FROM Rapport r JOIN Etudiant e ON r.matricule_e = e.matricule_e JOIN Infraction i ON r.num_i = i.num_i ORDER BY i.date_i DESC'
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
router.get('/gets', (req, res) => {
  let numr = req.body.numR
  let sqlquery = 'SELECT e.matricule_e, e.nom_e, e.prenom_e, e.niveau_e, e.section_e, e.groupe_e, p.matricule_p, p.nom_p, p.prenom_p, i.date_i, i.lieu_i, i.motif_i, i.degre_i, i.description_i FROM Rapport r INNER JOIN Etudiant e ON r.matricule_e = e.matricule_e INNER JOIN Plaignant p ON r.matricule_p = p.matricule_p INNER JOIN Infraction i ON r.num_i = i.num_i WHERE r.num_r = ?'
  db.query(sqlquery, numr,   (err, result) => {
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
  let sqlquery = `
    UPDATE Rapport r 
    INNER JOIN Etudiant e ON r.matricule_e = e.matricule_e 
    INNER JOIN Plaignant p ON r.matricule_p = p.matricule_p 
    INNER JOIN Infraction i ON r.num_i = i.num_i 
    SET 
      e.matricule_e = ?, e.nom_e = ?, e.prenom_e = ?, e.niveau_e = ?, 
      e.groupe_e = ?, e.section_e = ?, e.antecedant_e = true, 
      p.matricule_p = ?, p.nom_p = ?, p.prenom_p = ?, 
      i.date_i = ?, i.lieu_i = ?, i.motif_i = ?, i.description_i = ?, i.degre_i= ?, 
      r.matricule_e = ?, r.matricule_p = ?
    WHERE r.num_r = ?
  `
  let values = [
    object.matriculeE, object.nomE, object.prenomE, object.niveauE,
    object.groupeE, object.sectionE, object.matriculeP, object.nomP,
    object.prenomP, object.dateI, object.lieuI, object.motifI,
    object.descI, object.degreI, object.matriculeE, object.matriculeP, object.numR
  ]

  db.query(sqlquery, values, (err, result) => {
    if (err) {
      res.status(400).send(err.errno); //if error number is 1062 that means that there is duplicate of either a etudiant or plaignant
    } else {
      res.send(result);
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
  let sqlquery = 'DELETE r, i FROM Rapport r JOIN Infraction i ON r.num_i = i.num_i WHERE r.num_r = ?'
  
  db.query(sqlquery, numr,   (err, result) => {
    if (err) {
      res.status(400).send(err)
    } else {
      res.send(result)
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
   "matriculeP": big int value,
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
  let sqlqueryE = 'INSERT INTO Etudiant (matricule_e, nom_e, prenom_e, niveau_e, groupe_e, section_e, antecedant_e) VALUES (?, ?, ?, ?, ?, ?, true)'
  let sqlqueryP = 'INSERT INTO Plaignant (matricule_p, nom_p, prenom_p) VALUES (?, ?, ?)'
  let sqlqueryI = 'INSERT INTO Infraction (lieu_i, date_i, motif_i, description_i, degre_i) VALUES (?, ?, ?, ?, ?)'
  let sqlqueryR = 'INSERT INTO Rapport (date_r, matricule_e, matricule_p, num_i) VALUES (NOW(), ?, ?, LAST_INSERT_ID())'

  db.query(sqlqueryE, [object.matriculeE, object.nomE, object.prenomE, object.niveauE, object.groupeE, object.sectionE], (err, result) => {
    if (err && err.errno != 1062) { // Check for duplicate
      return res.status(400).send(err)
    } else {
      db.query(sqlqueryP, [object.matriculeP, object.nomP, object.prenomP], (err, result) => {
        if (err && err.errno != 1062) { // Check for duplicate
          return res.status(400).send(err)
        } else {
          db.query(sqlqueryI, [object.lieuI, object.dateI, object.motifI, object.descI, object.degreI], (err, result) => {
            if (err) {
              return res.status(400).send(err)
            } else {
              db.query(sqlqueryR, [object.matriculeE, object.matriculeP], (err, result) => {
                if (err) {
                  return res.status(400).send(err)
                } else {
                  res.send(result)
                }
              })
            }
          })
        }
      })
    }
  })
})

router.get('/print', (req, res) => {
  //placeholder
})

router.get('/save', (req, res) => {
  //placeholder
})

module.exports = router
