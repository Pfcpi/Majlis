/* eslint-disable prettier/prettier */
/* eslint-disable no-unused-vars */

const express = require('express')
const router = express.Router()
const { db } = require('../config/db')

//VALID
// List of rapport that is short and that is treated (Archive > Rapport)
router.get('/getrapport', (req, res) => {
    let sqlquery = `SELECT r.num_r, e.nom_e, e.prenom_e, i.date_i
    FROM Rapport r
    JOIN Etudiant e ON r.matricule_e = e.matricule_e
    JOIN Infraction i ON r.num_i = i.num_i
    WHERE r.est_traite = TRUE
    ORDER BY i.date_i DESC`
    db.query(sqlquery, (err, result) => {
      if (err) {
        res.status(400).send(err)
      } else {
        res.send(result)
      }
    })
  })
  
  //VALID
  // List of rapport that is detailled and treated (click on a rapport) (ARCHIVE)
  /* Body being in the format of :
    {
      "numR": int value
    }
  */
  router.post('/getsrapport', (req, res) => {
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

//VALID
// Delete a rapport (archive)
/* Body being in the format of :
  {
	"numR": int value
  }
*/
router.delete('/deleterapport', (req, res) => {
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

//VALID
// Edit the values of a selected rapport (archive)
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
router.patch('/editrapport', (req, res) => {
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

  //VALID
  // Get inactive commission members
  router.get('/getcommission', (req, res) => {
    let sqlquery = `SELECT nom_m, prenom_m, role_m, email_m, date_debut_m, date_fin_m
    FROM Membre
    WHERE est_actif = false`
    db.query(sqlquery, (err, result) => {
      if (err) {
        res.status(400).send(err)
      } else {
        res.send(result)
      }
    })
  })
  

  //UNTESTED
  // Edit selected pv
  /* Body being in the format of :
     {
      "datePV": date format 'YYYY-MM-DD',
      "libeleS": String,
      "numPV": int,
      "newIdM": {
        "1" : {
          "nomM": String,
          "prenomM": String,
        },
        "2" : {
          "nomM": String,
          "prenomM": String,
        } or null,
        "3" : {
          "nomM": String,
          "prenomM": String,
        } or null,
        "4" : {
          "nomM": String,
          "prenomM": String,
        } or null,
        "5" : {
          "nomM": String,
          "prenomM": String,
        } or null,
      },
      "temoinNew": {
        "1": {
        "nomT": string value,
        "prenomT": string value,
        "roleT": string value
        } or null,
        "2": {
        "nomT": string value,
        "prenomT": string value,
        "roleT": string value
        } or null,
        "3": {
        "nomT": string value,
        "prenomT": string value,
        "roleT": string value
        } or null
      },
      "temoinOld": {
        "1": {
        "nomT": string value,
        "prenomT": string value,
        "roleT": string value
        } or null,
        "2": {
        "nomT": string value,
        "prenomT": string value,
        "roleT": string value
        } or null,
        "3": {
        "nomT": string value,
        "prenomT": string value,
        "roleT": string value
        } or null
      },
      "dateCD": Date value


    }
  */


//UNFIXED HELP PLEASE I'M DYING I CANT TAKE IT ANYMORE PLEASE HELP
    router.patch('/editpv', async (req, res) => {
      // to be continued...
      })
    
    
    
    

    

  // VALID
  // Display list of pvs (Archive --> Dossier)
  router.get('/getpv', (req, res) => {
    let sqlquery = `SELECT
    PV.num_pv,
    e.nom_e,
    e.prenom_e,
    i.date_i,
    PV.date_pv,
    s.libele_s
FROM
    PV
        LEFT JOIN
    Rapport r ON r.num_r = PV.num_r
    INNER JOIN
    Etudiant e ON r.matricule_e = e.matricule_e
        INNER JOIN
    Plaignant p ON r.id_p = p.id_p
        INNER JOIN
    Infraction i ON r.num_i = i.num_i
        LEFT JOIN
    Sanction s ON PV.num_s = s.num_s
        LEFT JOIN
    Commission_Presente cp ON PV.num_cd = cp.num_cd`

    db.query(sqlquery, (err, result) => {
      if (err) {
        res.status(400).send(err)
      } else {
        res.send(result)
      }
    })
  })

  //VALID
  // Display detailled informations of a selected pv
  /* Body being in the form of :
    {
      "numPV": int value
    }
  */
  router.post('/getspv', (req, res) => {
    let numpv = req.body.numPV
    let sqlquery = `SELECT
    r.num_r,
    e.matricule_e,
    e.nom_e,
    e.prenom_e,
    e.niveau_e,
    e.section_e,
    e.groupe_e,
    p.nom_p,
    p.prenom_p,
    i.date_i,
    i.lieu_i,
    i.motif_i,
    i.description_i,
    pv.num_pv,
    pv.date_pv,
    s.libele_s,

    temoins.nom_tt AS noms_temoins,
    temoins.prenom_tt AS prenoms_temoins,
    temoins.role_tt AS roles_temoins,

    GROUP_CONCAT(m.nom_m) AS noms_membres,
    GROUP_CONCAT(m.prenom_m) AS prenoms_membres,
    GROUP_CONCAT(m.role_m) AS roles_membres
FROM
    PV pv
INNER JOIN
    Rapport r ON r.num_r = pv.num_r
INNER JOIN
    Sanction s ON pv.num_s = s.num_s
INNER JOIN
    Conseil_Discipline cd ON pv.num_cd = cd.num_cd
LEFT JOIN
    Etudiant e ON r.matricule_e = e.matricule_e
LEFT JOIN
    Plaignant p ON r.id_p = p.id_p
LEFT JOIN
    Infraction i ON r.num_i = i.num_i
LEFT JOIN
    (SELECT
        te.num_cd,
        GROUP_CONCAT(t.nom_t) AS nom_tt,
        GROUP_CONCAT(t.prenom_t) AS prenom_tt,
        GROUP_CONCAT(t.role_t) AS role_tt
    FROM
        Temoigne te
    LEFT JOIN
        Temoin t ON te.num_t = t.num_t
    GROUP BY
        te.num_cd) AS temoins ON pv.num_cd = temoins.num_cd
LEFT JOIN
    Commission_Presente cp ON pv.num_cd = cp.num_cd
LEFT JOIN
    Membre m ON cp.id_m = m.id_m
WHERE
    pv.num_pv = ?
GROUP BY
    r.num_r,
    e.matricule_e,
    e.nom_e,
    e.prenom_e,
    e.niveau_e,
    e.section_e,
    e.groupe_e,
    p.nom_p,
    p.prenom_p,
    i.date_i,
    i.lieu_i,
    i.motif_i,
    i.description_i,
    pv.num_pv,
    pv.date_pv,
    s.libele_s
`
  
    db.query(sqlquery, numpv, (err, result) => {
      if(err) {
        res.status(400).send(err)
      } else {
        res.send(result)
      }
    })
  })

//VALID
/* Body being in the format of:
{
  "numPV": int value
}
*/
// Delete selected pv from archive
router.delete('/deletepv', (req, res) => {
  let numpv = req.body.numPV
  let sqlquery = `DELETE FROM PV WHERE num_pv = ?`
  db.query(sqlquery, numpv, (err, result) => {
    if(err) {
      res.status(400).send(err)
    } else {
      res.sendStatus(204)
    }
  })
})

module.exports = router