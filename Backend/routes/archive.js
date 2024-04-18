const express = require('express')
const router = express.Router()
const { db } = require('../config/db')

// List of rapport that is short and that is treated (Archive > Rapport)
router.get('/get', (req, res) => {
    let sqlquery = `SELECT r.num_r, e.nom_e, e.prenom_e, i.date_i
    FROM Rapport r
    JOIN Etudiant e ON r.matricule_e = e.matricule_e
    JOIN Infraction i ON r.num_i = i.num_i
    ORDER BY i.date_i DESC
    WHERE r.est_traite = TRUE`
    db.query(sqlquery, (err, result) => {
      if (err) {
        res.status(400).send(err)
      } else {
        res.send(result)
      }
    })
  })
  
  // List of rapport that is detailled and treated (click on a rapport) (ARCHIVE)
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

//placeholder (more to come for PV and commission)


module.exports = router