/* eslint-disable no-unused-vars */
/* eslint-disable prettier/prettier */
//* eslint-disable no-unused-vars */

const express = require('express')
const router = express.Router()
const { db } = require('../config/db')
const { generatePDFpv } = require('../services/pdf')
const { generatePDFrapport } = require('../services/pdf')
const { generatePDFpvForEmail } = require('../services/pdf')
const { generatePDFcd } = require('../services/pdf')
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

function maj(chaine) {
  return chaine.charAt(0).toUpperCase().concat(chaine.slice(1))
}

function transformDateString(dateString) {
  // Convert input to string if it's not already a string
  if (typeof dateString !== 'string') {
    dateString = String(dateString)
  }

  // Ensure dateString has the expected format "YYYY-MM-DDTHH:MM:SS.000Z"
  if (!/\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}.\d{3}Z/.test(dateString)) {
    return 'Invalid date format'
  }

  // Extract the year, month, and day from the ISO 8601 format
  const [year, month, day] = dateString.slice(0, 10).split('-')

  // Format the date in "DD/MM/YYYY"
  const formattedDate = `${day}/${month}/${year}`

  return formattedDate
}

function transformDateFormat(dateString) {
  // Create a Date object from the input string
  const date = new Date(dateString)

  // Extract the day, month, and year components
  const day = String(date.getDate()).padStart(2, '0')
  const month = String(date.getMonth() + 1).padStart(2, '0') // Months are zero-indexed, so we add 1
  const year = date.getFullYear()

  // Format the date as "DD/MM/YYYY"
  const formattedDate = `${day}/${month}/${year}`

  return formattedDate
}

function transformDateToFrench(dateString) {
  // Define the days and months in French with capitalized months
  const daysOfWeek = ['dimanche', 'lundi', 'mardi', 'mercredi', 'jeudi', 'vendredi', 'samedi']
  const monthsOfYear = [
    'Janvier',
    'Février',
    'Mars',
    'Avril',
    'Mai',
    'Juin',
    'Juillet',
    'Août',
    'Septembre',
    'Octobre',
    'Novembre',
    'Décembre'
  ]

  // Split the input string to extract day, month, and year
  const [day, month, year] = dateString.split('/')

  // Create a Date object from the input string
  const date = new Date(`${year}-${month}-${day}`)

  // Get the day of the week and month in French
  const dayOfWeek = daysOfWeek[date.getDay()]
  const monthOfYear = monthsOfYear[date.getMonth()]

  // Format the date as "day DD month YYYY"
  const formattedDate = `${dayOfWeek} ${day} ${monthOfYear} ${year}`

  return formattedDate
}

function numRapport(num_rapport) {
  return num_rapport.split(',').map(Number)
}
function dateSplit(dates) {
  return dates.split(',')
}
function createTemoins(noms_temoins, prenoms_temoins, roles_temoins) {
  // Ensure the strings are not null or undefined, and split them into arrays
  let nomsArray = noms_temoins ? noms_temoins.split(',') : []
  let prenomsArray = prenoms_temoins ? prenoms_temoins.split(',') : []
  let rolesArray = roles_temoins ? roles_temoins.split(',') : []

  // Initialize an empty array to hold the temoins objects
  let temoins = []

  // Determine the length of the arrays (they should all be the same length)
  let length = Math.max(nomsArray.length, prenomsArray.length, rolesArray.length)

  // Loop through the arrays and create objects
  for (let i = 0; i < length; i++) {
    let temoin = {
      nom: nomsArray[i].toUpperCase() || '', // Use empty string if value is undefined
      prenom: maj(prenomsArray[i]) || '', // Use empty string if value is undefined
      role: rolesArray[i] || '' // Use empty string if value is undefined
    }
    temoins.push(temoin)
  }

  // Return the result
  return temoins
}

function transformNomsMembers(noms_members) {
  // Split the input string by commas to get individual name pairs
  const pairs = noms_members.split(',')

  // Map over the pairs to apply the transformations
  return pairs.map((pair) => {
    // Trim any leading/trailing whitespace and split by space to separate name and firstname
    const [name, firstname] = pair.trim().split(' ')

    // Transform name to uppercase and apply maj to firstname
    return `${name.toUpperCase()} ${maj(firstname)}`
  })
}

function formatNames(etudiants) {
  // Split the string by commas to get individual names
  return etudiants.split(',').map((fullName) => {
    // Trim any leading/trailing whitespace
    fullName = fullName.trim()

    // Find the index of the first space
    let firstSpaceIndex = fullName.indexOf(' ')

    // Separate the family name and the rest of the name(s)
    let familyName = fullName.substring(0, firstSpaceIndex).toUpperCase()
    let firstNames = fullName.substring(firstSpaceIndex + 1)

    // Capitalize the first letter of each first name
    firstNames = firstNames
      .split(' ')
      .map((name) => {
        return name.charAt(0).toUpperCase() + name.slice(1).toLowerCase()
      })
      .join(' ')

    // Combine the formatted family name and first names
    return `${familyName} ${firstNames}`
  })
}

function createMembers(noms_members, prenoms_members, roles_members) {
  // Ensure the strings are not null or undefined, and split them into arrays
  let nomsArray = noms_members ? noms_members.split(',') : []
  let prenomsArray = prenoms_members ? prenoms_members.split(',') : []
  let rolesArray = roles_members ? roles_members.split(',') : []

  // Initialize an empty array to hold the members objects
  let members = []

  // Determine the length of the arrays (they should all be the same length)
  let length = Math.max(nomsArray.length, prenomsArray.length, rolesArray.length)

  // Loop through the arrays and create objects
  for (let i = 0; i < length; i++) {
    let member = {
      nom: nomsArray[i].toUpperCase() || '', // Use empty string if value is undefined
      prenom: maj(prenomsArray[i]) || '', // Use empty string if value is undefined
      role: rolesArray[i] || '' // Use empty string if value is undefined
    }
    members.push(member)
  }

  // Return the result
  return members
}

function formatDate(inputDate) {
  const months = [
    'Jan',
    'Feb',
    'Mar',
    'Apr',
    'May',
    'Jun',
    'Jul',
    'Aug',
    'Sep',
    'Oct',
    'Nov',
    'Dec'
  ]

  const date = new Date(inputDate)
  const day = date.getDate().toString().padStart(2, '0')
  const month = (date.getMonth() + 1).toString().padStart(2, '0')
  const year = date.getFullYear()

  return `${day}/${month}/${year}`
}

function formatTuples(nomE, prenomE, niveauE, sectionE, groupeE, nomP, prenomP, motifI, libeleS) {
  // Split each input string into an array of values
  const nomEArray = nomE.split(',')
  const prenomEArray = prenomE.split(',')
  const niveauEArray = niveauE.split(',')
  const sectionEArray = sectionE.split(',')
  const groupeEArray = groupeE.split(',')
  const nomPArray = nomP.split(',')
  const prenomPArray = prenomP.split(',')
  const motifIArray = motifI.split(',')
  const libeleSArray = libeleS.split(',')

  // Map over the arrays to create the tuples
  return nomEArray.map((_, index) => {
    // Check for null or undefined values and handle them
    const nomEValue = nomEArray[index] ? nomEArray[index].toUpperCase() : null
    const prenomEValue = prenomEArray[index] ? maj(prenomEArray[index]) : null
    const nomPValue = nomPArray[index] ? nomPArray[index].toUpperCase() : null
    const prenomPValue = prenomPArray[index] ? maj(prenomPArray[index]) : null

    return {
      nomE: nomEValue,
      prenomE: prenomEValue,
      niveauE: niveauEArray[index],
      sectionE: sectionEArray[index],
      groupeE: groupeEArray[index],
      nomP: nomPValue,
      prenomP: prenomPValue,
      motifI: motifIArray[index],
      libeleS: libeleSArray[index]
    }
  })
}

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
    i.date_i, i.lieu_i, i.motif_i, i.description_i, i.degre_i,
    r.date_r
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
// Get inactive commissions and it's members
router.get('/getcommission', (req, res) => {
  let sqlquery = `SELECT
  c.num_c, c.date_debut_c, c.date_fin_c,
  GROUP_CONCAT(DISTINCT m.nom_m) AS nomM,
  GROUP_CONCAT(DISTINCT m.prenom_m) AS roleM,
  GROUP_CONCAT(DISTINCT m.role_m) AS roleM
FROM
Commission c

INNER JOIN Membre m ON m.num_c = c.num_c

WHERE c.actif_c = FALSE

GROUP BY c.num_c, c.date_debut_c, c.date_fin_c

`
  db.query(sqlquery, (err, result) => {
    if (err) {
      res.status(400).send(err)
    } else {
      res.send(result)
    }
  })
})

// Get all pvs of a selected commission
/*
  {
    "numC": int value
  }
*/
router.post('/getscommission', (req, res) => {
  let numC = req.body.numC
  let sqlquery = `SELECT DISTINCT
  CD.num_cd,
  CD.date_cd
FROM Conseil_Discipline CD
INNER JOIN
  PV pv ON pv.num_cd = CD.num_cd
LEFT JOIN
  Commission c ON pv.num_c = c.num_c
WHERE
  c.num_c = ?`
  db.query(sqlquery, numC, (err, result) => {
    if (err) {
      res.status(400).send(err)
    } else {
      res.send(result)
    }
  })
})

/* Delete selected commission
   {
    "numC" : int value
   }
*/
router.delete('/deletecommission', (req, res) => {
  db.query(`SET FOREIGN_KEY_CHECKS = 0`)
  let value = req.body.numC
  let sqlquery = `DELETE FROM Membre WHERE num_c = ?`
  db.query(sqlquery, value, (err, result) => {
    if (err) {
      res.status(400).send(err)
    } else {
      db.query(`DELETE FROM Commission WHERE num_c = ?`, value, (err, result) => {
        if (err) {
          res.status(400).send(err)
        } else {
          db.query(`SET FOREIGN_KEY_CHECKS = 1`)
          res.sendStatus(204)
        }
      })
    }
  })
})

//VALID
// Edit selected pv
/* Body being in the format of :
     {
      "datePV": date format 'YYYY-MM-DD',
      "libeleS": String,
      "numPV": int,
      "temoin": [
        {
        "nom": string value,
        "prenom": string value,
        "role": string value
        } or null,
        {
        "nom": string value,
        "prenom": string value,
        "role": string value
        } or null,
        {
        "nom": string value,
        "prenom": string value,
        "role": string value
        } or null
      ]
    }
  */
router.patch('/editpv', (req, res) => {
  let { libeleS, numPV, temoin } = req.body
  let errBuffer = []
  console.log('/editpv: ', req.body)
  let temoinArray = Object.values(temoin).filter((temoin) => temoin !== null)
  let sqlquerydelT = `DELETE te FROM Temoigne te
  LEFT JOIN PV ON PV.num_pv = te.num_pv
  WHERE PV.num_pv = ?`
  db.query(sqlquerydelT, numPV, (err, result) => {
    if (err) {
      //res.status(400).send(err)
      errBuffer.push(err)
    }
  })
  let sqlquerylinkT = null
  let sqlqueryaddT = `INSERT INTO Temoin (nom_t, prenom_t, role_t) VALUES (?, ?, ?)`
  for (let temoin of temoinArray) {
    db.query(
      sqlqueryaddT,
      [temoin.nom.replace(/ /g, '\u00A0'), temoin.prenom.replace(/ /g, '\u00A0'), temoin.role],
      (err, result) => {
        if (err && err.errno != 1062) {
          //res.status(400).send(err)
          errBuffer.push(err)
        } else if (err && err.errno == 1062) {
          let numT = null
          let sqlquerygetT = `SELECT num_t FROM Temoin WHERE nom_t = ? and prenom_t = ?`
          db.query(
            sqlquerygetT,
            [temoin.nom.replace(/ /g, '\u00A0'), temoin.prenom.replace(/ /g, '\u00A0')],
            (err, result) => {
              if (err) {
                //res.status(400).send(err)
                errBuffer.push(err)
              }
              numT = result[0].num_t
              sqlquerylinkT = `INSERT INTO Temoigne (num_t, num_pv, num_cd) VALUES (${numT}, ?,(SELECT PV.num_cd FROM PV
                    INNER JOIN Conseil_Discipline cd ON cd.num_cd = PV.num_cd WHERE PV.num_pv = ?))`
              db.query(sqlquerylinkT, [numPV, numPV], (err, result) => {
                if (err && err.errno != 1062) {
                  console.log(err)
                  //res.status(400).send(err)
                  errBuffer.push(err)
                }
              })
            }
          )
        } else {
          sqlquerylinkT = `INSERT INTO Temoigne (num_t, num_pv, num_cd) VALUES (LAST_INSERT_ID(), ?, (SELECT PV.num_cd FROM PV
                INNER JOIN Conseil_Discipline cd ON cd.num_cd = PV.num_cd WHERE PV.num_pv = ?))`
          db.query(sqlquerylinkT, [numPV, numPV], (err, result) => {
            if (err) {
              //res.status(400).send(err)
              errBuffer.push(err)
            }
          })
        }
      }
    )
  }
  let sqlqueryS =
    'UPDATE Sanction s INNER JOIN PV ON PV.num_s = s.num_s SET s.libele_s = ? WHERE PV.num_pv = ?'
  db.query(sqlqueryS, [libeleS, numPV], (err, result) => {
    if (err) {
      //res.status(400).send(err)
      errBuffer.push(err)
    }
  })
  if (errBuffer.length == 0) {
    res.sendStatus(204)
  } else {
    res.status(400).send(err)
  }
})

// VALID
// Display list of pvs (Archive --> Dossier)
router.get('/getpv', (req, res) => {
  let sqlquery = `SELECT DISTINCT
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
    Commission_Presente cp ON PV.num_cd = cp.num_cd
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
// Display detailled informations of a selected pv
/* Body being in the form of :
    {
      "numPV": int value
    }
  */
router.post('/getspv', (req, res) => {
  let numpv = req.body.numPV
  console.log(numpv)
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
  cd.date_cd,
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
      te.num_pv,
      GROUP_CONCAT(distinct t.nom_t) AS nom_tt,
      GROUP_CONCAT(distinct t.prenom_t) AS prenom_tt,
      GROUP_CONCAT(distinct t.role_t) AS role_tt
  FROM
      Temoigne te
  inner JOIN
      Temoin t ON te.num_t = t.num_t
  GROUP BY
      te.num_pv) AS temoins ON pv.num_pv = temoins.num_pv
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
  cd.date_cd,
  i.date_i,
  i.lieu_i,
  i.motif_i,
  i.description_i,
  pv.num_pv,
  pv.date_pv,
  s.libele_s
`

  db.query(sqlquery, numpv, (err, result) => {
    if (err) {
      console.log('err executing /archive/getspv:', err)
      res.status(400).send(err)
    } else {
      const data = {
        numR: result[0].num_r,
        matriculeE: result[0].matricule_e,
        nomE: result[0].nom_e,
        prenomE: result[0].prenom_e,
        niveauE: result[0].niveau_e,
        sectionE: result[0].section_e,
        groupeE: result[0].groupe_e,
        nomP: result[0].nom_p,
        prenomP: result[0].prenom_p,
        dateCd: result[0].date_cd,
        dateI: result[0].date_i,
        lieuI: result[0].lieu_i,
        motifI: result[0].motif_i,
        descriptionI: result[0].description_i,
        numPV: result[0].num_pv,
        datePV: result[0].date_pv,
        libeleS: result[0].libele_s,
        temoins: createTemoins(
          result[0].noms_temoins,
          result[0].prenoms_temoins,
          result[0].roles_temoins
        ),
        membres: createMembers(
          result[0].noms_membres,
          result[0].prenoms_membres,
          result[0].roles_membres
        )
      }
      res.send(data)
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
    if (err) {
      res.status(400).send(err)
    } else {
      res.sendStatus(204)
    }
  })
})

// Send mail to Etudiant containing PV
/*
{
  "numPV": int value,
  "email" : email of etudiant string value
}
*/
router.post('/mail', (req, res) => {
  let values = [req.body.numPV, req.body.email]
  console.log('values: ', values)
  let sqlquery = `SELECT
  e.matricule_e,
  e.nom_e,
  e.prenom_e,
  e.niveau_e,
  e.section_e,
  e.groupe_e,
  p.nom_p,
  p.prenom_p,
  cd.date_cd,
  i.motif_i,
  pv.date_pv,
  s.libele_s,
  (SELECT m.nom_m FROM Membre m INNER JOIN Commission c ON m.num_c = c.num_c WHERE m.role_m = "Président" AND c.actif_c = TRUE) AS nom_pres,
  (SELECT m.prenom_m FROM Membre m INNER JOIN Commission c ON m.num_c = c.num_c WHERE m.role_m = "Président" AND c.actif_c = TRUE) AS prenom_pres,
  temoins.nom_tt AS noms_temoins,
  temoins.prenom_tt AS prenoms_temoins,

  GROUP_CONCAT(m.nom_m) AS noms_membres,
  GROUP_CONCAT(m.prenom_m) AS prenoms_membres
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
  pv.num_pv = ?`

  db.query(sqlquery, req.body.numPV, async (err, result) => {
    if (err && err.errno != 1065) {
      res.status(400).send(err)
    } else {
      console.log(result[0])
      const data = {
        matriculeE: result[0].matricule_e,
        nomE: result[0].nom_e.toUpperCase(),
        prenomE: maj(result[0].prenom_e),
        niveauE: result[0].niveau_e,
        groupeE: result[0].groupe_e,
        sectionE: result[0].section_e,
        nomP: result[0].nom_p.toUpperCase(),
        prenomP: maj(result[0].prenom_p),
        dateCD: formatDate(result[0].date_cd),
        motifI: result[0].motif_i,
        datePV: formatDate(result[0].date_pv),
        libeleS: result[0].libele_s,
        nomPR: result[0].nom_pres.toUpperCase(),
        prenomPR: maj(result[0].prenom_pres),
        nomT: result[0].noms_temoins,
        prenomT: result[0].prenoms_temoins,
        nomM: result[0].noms_membres,
        prenomM: result[0].prenoms_membres
      }

      try {
        const pdfBuffer = await generatePDFpvForEmail(data)
        const mailOptions = {
          from: '"Conseil de Discipline" <conseil-discipline@cd-usto.tech>',
          to: values[1],
          subject: `Procès-Verbal du conseil de discipline du ${data.dateCD}.`,
          html: '<body><div style="text-align: center;"><img src="https://i.goopics.net/hmgccm.png" style="width: 100%; max-width: 650px; height: auto;"></div></body>',
          attachments: [
            {
              filename: 'PV.pdf',
              content: pdfBuffer,
              contentType: 'application/pdf'
            }
          ]
        }
        console.log('AAAAAAAA')
        transporter.sendMail(mailOptions, function (err, info) {
          if (err) {
            console.log('Error while sending email' + err)
          } else {
            console.log('Email sent')
            res.sendStatus(204)
          }
        })
      } catch (err) {
        console.error(err)
        res.status(400).send('An error occurred while generating the PDF')
      }
    }
  })
})

//Print rapport
/*
  {
    "numR": int value
  }
*/
router.post('/printrapport', async (req, res) => {
  let sqlquery = `SELECT e.matricule_e, e.nom_e, e.prenom_e, e.niveau_e, e.section_e, e.groupe_e,
  p.nom_p, p.prenom_p,
  DATE(i.date_i) AS date_i, i.lieu_i, i.motif_i,
  DATE(r.date_r) AS date_r,
(SELECT nomU FROM Utilisateur u WHERE id_u = 1) AS nom_chef,
  (SELECT prenomU FROM Utilisateur u WHERE id_u = 1) AS prenom_chef
FROM Rapport r
INNER JOIN Etudiant e ON r.matricule_e = e.matricule_e
INNER JOIN Plaignant p ON r.id_p = p.id_p
INNER JOIN Infraction i ON r.num_i = i.num_i
WHERE r.num_r = ?`
  db.query(sqlquery, req.body.numR, async (err, result) => {
    if (err && err.errno != 1065) {
      res.status(400).send(err)
    }
    if (result) {
      const data = {
        matriculeE: result[0].matricule_e,
        nomE: result[0].nom_e.toUpperCase(),
        prenomE: maj(result[0].prenom_e),
        niveauE: result[0].niveau_e,
        groupeE: result[0].groupe_e,
        sectionE: result[0].section_e,
        nomP: result[0].nom_p.toUpperCase(),
        prenomP: maj(result[0].prenom_p),
        dateI: transformDateToFrench(formatDate(result[0].date_i)),
        lieuI: result[0].lieu_i,
        motifI: result[0].motif_i,
        dateR: formatDate(result[0].date_r),
        nomC: result[0].nom_chef.toUpperCase(),
        prenomC: maj(result[0].prenom_chef)
      }
      try {
        const pdfBuffer = await generatePDFrapport(data, req.body.path)
        res.send(pdfBuffer)
      } catch (err) {
        res.status(400).send(err)
      }
    }
  })
})

//Print pv
/*
  {
    "numPV": int value
  }
*/
router.post('/printpv', async (req, res) => {
  let sqlquery = `SELECT
  e.matricule_e,
  e.nom_e,
  e.prenom_e,
  e.niveau_e,
  e.section_e,
  e.groupe_e,
  p.nom_p,
  p.prenom_p,
  cd.date_cd,
  i.motif_i,
  pv.date_pv,
  s.libele_s,
  (SELECT m.nom_m FROM Membre m INNER JOIN Commission c ON m.num_c = c.num_c WHERE m.role_m = "Président" AND c.actif_c = TRUE) AS nom_pres,
  (SELECT m.prenom_m FROM Membre m INNER JOIN Commission c ON m.num_c = c.num_c WHERE m.role_m = "Président" AND c.actif_c = TRUE) AS prenom_pres,
  temoins.nom_tt AS noms_temoins,
  temoins.prenom_tt AS prenoms_temoins,

  GROUP_CONCAT(m.nom_m) AS noms_membres,
  GROUP_CONCAT(m.prenom_m) AS prenoms_membres
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
      te.num_pv,
      GROUP_CONCAT(DISTINCT t.nom_t) AS nom_tt,
      GROUP_CONCAT(DISTINCT t.prenom_t) AS prenom_tt,
      GROUP_CONCAT(DISTINCT t.role_t) AS role_tt
  FROM
      Temoigne te
  LEFT JOIN
      Temoin t ON te.num_t = t.num_t
      WHERE num_pv = ?)
 AS temoins ON pv.num_pv = temoins.num_pv
LEFT JOIN
  Commission_Presente cp ON pv.num_cd = cp.num_cd
LEFT JOIN
  Membre m ON cp.id_m = m.id_m
WHERE
  pv.num_pv = ?`

  db.query(sqlquery, [req.body.numPV, req.body.numPV], async (err, result) => {
    if (err && err.errno != 1065) {
      res.status(400).send(err)
    }

    const data = {
      matriculeE: result[0].matricule_e,
      nomE: result[0].nom_e.toUpperCase(),
      prenomE: maj(result[0].prenom_e),
      niveauE: result[0].niveau_e,
      groupeE: result[0].groupe_e,
      sectionE: result[0].section_e,
      nomP: result[0].nom_p.toUpperCase(),
      prenomP: maj(result[0].prenom_p),
      dateCD: transformDateToFrench(formatDate(result[0].date_cd)),
      motifI: result[0].motif_i,
      datePV: formatDate(result[0].date_pv),
      libeleS: result[0].libele_s,
      nomPR: result[0].nom_pres,
      prenomPR: result[0].prenom_pres,
      nomT: result[0].noms_temoins,
      prenomT: result[0].prenoms_temoins,
      nomM: result[0].noms_membres,
      prenomM: result[0].prenoms_membres
    }
    console.log(data)
    try {
      const pdfBuffer = await generatePDFpv(data, req.body.path)
      res.send(pdfBuffer)
    } catch (err) {
      console.error(err)
      res.status(400).send('An error occurred while generating the PDF')
    }
  })
})

//Get all conseils
router.get('/getcd', (req, res) => {
  const deleteUnrefrenced = `DELETE FROM Commission_Presente
WHERE num_cd NOT IN(SELECT num_cd FROM PV)

`
  db.query(deleteUnrefrenced, (err, result) => {
    if (err) {
      res.status(400).send(err)
    } else {
      const deleteUnrefrenced2 = `
            DELETE FROM Conseil_Discipline
            WHERE num_cd NOT IN(SELECT num_cd FROM PV)`
      db.query(deleteUnrefrenced2, (err, result) => {
        if (err) {
          res.status(400).send(err)
        } else {
          console.log(result)
          const sqlquery = `SELECT * FROM Conseil_Discipline ORDER BY date_cd DESC`
          db.query(sqlquery, (err, result) => {
            if (err) {
              res.status(400).send(err)
            } else {
              res.send(result)
            }
          })
        }
      })
    }
  })
})

//get detail for selected cd
/*
{
  "numCD": int value,
}
*/
router.post('/getscd', (req, res) => {
  let numcd = req.body.numCD
  const sqlquery = `SELECT
    cd.num_cd, cd.date_cd,

    GROUP_CONCAT(DISTINCT r.num_r) AS num_rapport,
    GROUP_CONCAT(DISTINCT r.date_r) AS date_rapport,

    GROUP_CONCAT(DISTINCT CONCAT_WS(' ', e.nom_e, e.prenom_e) SEPARATOR ', ') AS etudiants,
    GROUP_CONCAT(DISTINCT CONCAT_WS(' ', m.nom_m, m.prenom_m) SEPARATOR ', ') AS membres
    FROM Conseil_Discipline cd

    INNER JOIN PV pv ON pv.num_cd = cd.num_cd
    LEFT JOIN Rapport r ON r.num_r = pv.num_r
    INNER JOIN Commission_Presente cp ON cp.num_cd = cd.num_cd
    LEFT JOIN Membre m ON cp.id_m = m.id_m
    LEFT JOIN Etudiant e ON e.matricule_e = r.matricule_e

    WHERE cd.num_cd = ?

    GROUP BY
        cd.num_cd
    
    `
  db.query(sqlquery, numcd, (err, result) => {
    if (err) {
      res.status(400).send(err)
    } else {
      const data = {
        numCD: result[0].num_cd,
        dateCD: result[0].date_cd,
        numRapport: numRapport(result[0].num_rapport),
        dateRapport: result[0].date_rapport,
        etudiants: formatNames(result[0].etudiants),
        membres: formatNames(result[0].membres)
      }
      res.send(data)
    }
  })
})

//Print all informations of a cd
/*
{
  "numCD": int value
}
*/
router.post('/printcd', (req, res) => {
  let numCD = req.body.numCD
  console.log('numCD:', numCD)
  const sqlquery = `SELECT
  cd.date_cd,
  (SELECT GROUP_CONCAT(pv.num_pv ORDER BY pv.num_pv)
   FROM PV pv WHERE pv.num_cd = cd.num_cd) AS numPV,
  NOW() AS datePV,
  (SELECT GROUP_CONCAT(e.nom_e ORDER BY e.nom_e)
   FROM Etudiant e
   LEFT JOIN Rapport r ON r.matricule_e = e.matricule_e
   LEFT JOIN PV pv ON pv.num_r = r.num_r
   WHERE pv.num_cd = cd.num_cd) AS nomE,
  (SELECT GROUP_CONCAT(e.prenom_e ORDER BY e.prenom_e)
   FROM Etudiant e
   LEFT JOIN Rapport r ON r.matricule_e = e.matricule_e
   LEFT JOIN PV pv ON pv.num_r = r.num_r
   WHERE pv.num_cd = cd.num_cd) AS prenomE,
  (SELECT GROUP_CONCAT(e.niveau_e ORDER BY e.niveau_e)
   FROM Etudiant e
   LEFT JOIN Rapport r ON r.matricule_e = e.matricule_e
   LEFT JOIN PV pv ON pv.num_r = r.num_r
   WHERE pv.num_cd = cd.num_cd) AS niveauE,
  (SELECT GROUP_CONCAT(e.section_e ORDER BY e.section_e)
   FROM Etudiant e
   LEFT JOIN Rapport r ON r.matricule_e = e.matricule_e
   LEFT JOIN PV pv ON pv.num_r = r.num_r
   WHERE pv.num_cd = cd.num_cd) AS sectionE,
  (SELECT GROUP_CONCAT(e.groupe_e ORDER BY e.groupe_e)
   FROM Etudiant e
   LEFT JOIN Rapport r ON r.matricule_e = e.matricule_e
   LEFT JOIN PV pv ON pv.num_r = r.num_r
   WHERE pv.num_cd = cd.num_cd) AS groupeE,
  (SELECT GROUP_CONCAT(p.nom_p ORDER BY p.nom_p)
   FROM Plaignant p
   LEFT JOIN Rapport r ON r.id_p = p.id_p
   LEFT JOIN PV pv ON pv.num_r = r.num_r
   WHERE pv.num_cd = cd.num_cd) AS nomP,
  (SELECT GROUP_CONCAT(p.prenom_p ORDER BY p.prenom_p)
   FROM Plaignant p
   LEFT JOIN Rapport r ON r.id_p = p.id_p
   LEFT JOIN PV pv ON pv.num_r = r.num_r
   WHERE pv.num_cd = cd.num_cd) AS prenomP,
  (SELECT GROUP_CONCAT(i.motif_i ORDER BY i.motif_i)
   FROM Infraction i
   LEFT JOIN Rapport r ON i.num_i = r.num_i
   LEFT JOIN PV pv ON pv.num_r = r.num_r
   WHERE pv.num_cd = cd.num_cd) AS motifI,
  (SELECT GROUP_CONCAT(s.libele_s ORDER BY s.libele_s)
   FROM Sanction s
   LEFT JOIN PV pv ON pv.num_s = s.num_s
   WHERE pv.num_cd = cd.num_cd) AS libeleS,
  (SELECT GROUP_CONCAT(CONCAT(m.nom_m, ' ', m.prenom_m))
   FROM Membre m
   LEFT JOIN Commission_Presente cp ON cp.id_m = m.id_m
   LEFT JOIN Commission c ON c.num_c = m.num_c
   WHERE c.actif_c = 1 AND m.role_m = 'Président') AS nom_president,
  (SELECT GROUP_CONCAT(CONCAT(m.nom_m))
   FROM Membre m
   LEFT JOIN Commission_Presente cp ON cp.id_m = m.id_m
   WHERE cp.num_cd = cd.num_cd) AS noms_membres,
  (SELECT GROUP_CONCAT(CONCAT(m.prenom_m))
   FROM Membre m
   LEFT JOIN Commission_Presente cp ON cp.id_m = m.id_m
   WHERE cp.num_cd = cd.num_cd) AS prenoms_membres
FROM
  Conseil_Discipline cd
WHERE
  cd.num_cd = ?
LIMIT 1;
  `
  db.query(sqlquery, numCD, async (err, result) => {
    if (err) {
      res.status(400).send(err)
    }
    const data = {
      dateCD: transformDateToFrench(formatDate(result[0].date_cd)),
      numPV: numRapport(result[0].numPV),
      datePV: transformDateFormat(result[0].datePV),
      nomPR: result[0].nom_president.split(' ')[0].toUpperCase(),
      prenomPR: maj(result[0].nom_president.split(',')[0].split(' ')[1]),
      nomM: result[0].noms_membres,
      prenomM: result[0].prenoms_membres,
      nomE: result[0].nomE,
      prenomE: result[0].prenomE,
      niveauE: result[0].niveauE,
      sectionE: result[0].sectionE,
      groupeE: result[0].groupeE,
      nomP: result[0].nomP,
      prenomP: result[0].prenomP,
      motifI: result[0].motifI,
      libeleS: result[0].libeleS
    }
    try {
      const pdfBuffer = await generatePDFcd(data, req.body.path)
      res.send(pdfBuffer)
    } catch (err) {
      console.error(err)
      res.status(400).send('An error occurred while generating the PDF')
    }
  })
})

router.post('/getStudentMail', (req, res) => {
  let numPV = req.body.numPV
  sqlquery = `SELECT e.email_e

FROM Etudiant e

INNER JOIN Rapport r ON r.matricule_e= e.matricule_e
LEFT JOIN PV pv ON pv.num_r = r.num_r

WHERE pv.num_pv = ?;`
  db.query(sqlquery, numPV, (err, result) => {
    if (err) {
      res.status(400).send(err)
    } else {
      res.send(result)
    }
  })
})

module.exports = router
