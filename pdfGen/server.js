const express = require('express')
const app = express()
const cors = require('cors')
const port = 3000
const { db } = require('./config/db')
const { generatePDFpv } = require('./pdf')
const { generatePDFrapport } = require('./pdf')
const { generatePDFcd } = require('./pdf')
const nodemailer = require('nodemailer')

app.use(cors())
app.use(express.json())
app.use(express.static('public'))

const reqPath = './public/'

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
app.post('/generateRA', async (req, res) => {
  console.log(req.body)
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
        prenomC: maj(result[0].prenom_chef),
        numr: req.body.numR
      }
      try {
        console.log('entered try')
        const buffer = await generatePDFrapport(data, reqPath)
        res.send('worked')
      } catch (err) {
        console.log('entered catch: ', err)
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
app.post('/generatePV', async (req, res) => {
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
      const pdfBuffer = await generatePDFpv(data, reqPath)
      res.send('worked')
    } catch (err) {
      console.error(err)
      res.status(400).send('An error occurred while generating the PDF')
    }
  })
})

//Print all informations of a cd
/*
{
  "numCD": int value
}
*/
app.post('/generateCD', (req, res) => {
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
      const pdfBuffer = await generatePDFcd(data, reqPath)
      res.send('worked')
    } catch (err) {
      console.error(err)
      res.status(400).send('An error occurred while generating the PDF')
    }
  })
})

app.post('/mail', (req, res) => {
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
        const pdfBuffer = await generatePDFpv(data, reqPath)
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
// Start the server
app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`)
})
