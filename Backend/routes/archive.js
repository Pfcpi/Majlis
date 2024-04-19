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

  // Edit selected pv
  /* Body being in the format of :
     {
      "datePV": date format 'YYYY-MM-DD',
      "nomT"
     }
  */
    router.patch('/editpv', (req, res) => {
    let {datePv, libeleS, numPv, oldIdM, newIdM, oldNumT, newNumT, numCd} = req.body
    let sqlqueryP =
    `UPDATE PV
    LEFT JOIN Temoin t ON PV.matricule_t = t.matricule_t
    LEFT JOIN Sanction s ON PV.num_s = s.num_s
    SET
        PV.date_pv = ?,
        s.libele_s = ?
    WHERE PV.num_pv = ?`
    
    let sqlqueryC =
    `UPDATE Commission_Presente cp
    LEFT JOIN PV ON cp.num_cd = PV.num_cd
    SET
        cp.id_m =
        CASE
            WHEN cp.num_cd = (SELECT num_cd FROM PV WHERE num_pv = ?) AND cp.id_m = ? THEN ?
            ELSE cp.id_m
        END
    WHERE PV.num_pv = ?`
    
    let sqlqueryT =
    `UPDATE Temoigne t
    LEFT JOIN PV ON t.num_t = PV.num_t
    SET
        t.num_t =
        CASE
            WHEN t.num_cd = (SELECT num_cd FROM PV WHERE num_pv = ?) AND t.num_t = ? THEN ?
            ELSE t.num_t
        END
    WHERE
        PV.num_pv = ?`

    let sqlqueryCdel = `DELETE FROM Commission_Presente cp WHERE num_cd = (SELECT num_cd FROM PV WHERE num_pv = ?)` // mazal ma tekmel hh

    db.query(sqlquery, values, (err, result) => {
      if(err) {
        res.status(500).send(err)
      } else if(result.affectedRows === 0) {
          res.status(404).send(result);
      } else {
        res.send(result)
      }
    })
  })

  // Display list of pvs (Archive --> Dossier)
  router.get('/getpv', (req, res) => {
    let sqlquery = `SELECT
    pv.num_pv,
    e.nom_e,
    e.prenom_e,
    p.nom_p,
    p.prenom_p,
    i.date_i,
    pv.date_pv,
    s.libele_s,
FROM
    Rapport r
        INNER JOIN
    Etudiant e ON r.matricule_e = e.matricule_e
        INNER JOIN
    Plaignant p ON r.id_p = p.id_p
        INNER JOIN
    Infraction i ON r.num_i = i.num_i
        LEFT JOIN
    PV pv ON pv.num_r = r.num_r
        LEFT JOIN
    Temoin t ON pv.num_t = t.num_t
        LEFT JOIN
    Sanction s ON pv.num_s = s.num_s
        LEFT JOIN
    Commission_Presente cp ON pv.num_cd = cp.num_cd`

    db.query(sqlquery, (err, result) => {
      if (err) {
        res.status(400).send(err)
      } else {
        res.send(result)
      }
    })
  })

  // Display detailled informations of a selected pv
  router.post('/getspv', (req, res) => {
    let numpv = req.body.numPV
    let sqlquery =
    `SELECT r.num_r, e.matricule_e, e.nom_e, e.prenom_e, e.niveau_e, e.section_e, e.groupe_e,
    p.nom_p, p.prenom_p,
    i.date_i, i.lieu_i, i.motif_i, i.description_i,
    pv.num_pv, pv.date_pv,
    t.nom_t, t.prenom_t, t.role_t,
    s.libele_s,
    GROUP_CONCAT(m.nom_m) AS noms_membres,
    GROUP_CONCAT(m.prenom_m) AS prenoms_membres,
    GROUP_CONCAT(m.role_m) AS roles_membres
    FROM Rapport r
    INNER JOIN Etudiant e ON r.matricule_e = e.matricule_e
    INNER JOIN Plaignant p ON r.id_p = p.id_p
    INNER JOIN Infraction i ON r.num_i = i.num_i
    LEFT JOIN PV pv ON pv.num_r = r.num_r
    LEFT JOIN Temoin t ON pv.num_t = t.num_t
    LEFT JOIN Sanction s ON pv.num_s = s.num_s
    LEFT JOIN Commission_Presente cp ON pv.num_cd = cp.num_cd
    LEFT JOIN Membre m ON cp.id_m = m.id_m
    WHERE pv.num_pv = ?
    GROUP BY r.num_r, e.matricule_e, e.nom_e, e.prenom_e, e.niveau_e, e.section_e, e.groupe_e,
    p.nom_p, p.prenom_p, i.date_i, i.lieu_i, i.motif_i, i.description_i,
    pv.num_pv, pv.date_pv, t.nom_t, t.prenom_t, t.role_t, s.libele_s`
  
    db.query(sqlquery, numpv, (err, result) => {
      if(err) {
        res.status(400).send(err)
      } else {
        res.send(result)
      }
    })
  })

//placeholder (more to come for PV and commission)


module.exports = router