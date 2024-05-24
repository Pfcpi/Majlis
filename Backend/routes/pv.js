/* eslint-disable prettier/prettier */
/* eslint-disable no-unused-vars */
const express = require('express')
const router = express.Router()
const { db } = require('../config/db')
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
    user: 'conseilpv@cd-usto.tech',
    pass: 'sjt$yT1e'
  }
})

router.post('/getActiveCommissionAndMembersByData', (req, res) => {
  let { date } = req.body
  let sqlquery = `SELECT c.num_c FROM Commission c WHERE c.date_debut_c <= ? AND c.date_fin_c >= ?;`
  db.query(sqlquery, [date, date], (err, result) => {
    if (err) {
      res.status(400).send(err)
    } else {
      let members = `SELECT * FROM Membre m WHERE m.num_c = ?;`
      db.query(members, result[0].num_c, (err, result) => {
        if (err) {
          res.status(400).send(err)
        } else {
          res.send(result)
        }
      })
    }
  })
})

//Create conseil discipline with commission présente and returns the id of the conseil discipline
/*
{
  "dateCD": date value,
  "idM": [
    int value,
    int value or null,
    int value or null,
    int value or null,
    int value or null
   ]
}
*/
router.post('/addCD', (req, res) => {
  let { dateCd, idM } = req.body
  let errBuffer = []
  let sqlqueryCd = `INSERT INTO Conseil_Discipline (date_cd) VALUES (?)`
  db.query(sqlqueryCd, dateCd, (err, result) => {
    if (err) {
      res.status(400).send(err)
      return
    } else {
      // Add multiple members to comission
      let sqlqueryC = `INSERT INTO Commission_Presente (num_cd, id_m) VALUES (?, ?)`
      idM.forEach((m) => {
        db.query(sqlqueryC, [result.insertId, m], (err, result) => {
          if (err) {
            errBuffer.push(err)
          }
        })
      })
      db.query('SELECT email_u FROM Utilisateur WHERE id_u = 1', (err, result) => {
        if (err) {
          errBuffer.push(err)
          console.log('errBuffer: ', errBuffer)
          res.status(400).send(errBuffer)
          return
        } else {
          const mail = result[0].email_u
          const mailOptions = {
            from: '"Logiciel Conseil de Discipline" <conseilpv@cd-usto.tech>',
            to: mail,
            subject: 'Nouveau PV déposé.',
            html: `<!DOCTYPE html>
            <html lang="fr-FR">
            <head>
                <meta charset="UTF-8">
                <title>new pv</title>
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
                            Nouveau Procès-Verbal
                        </h1>
                    </div>
                    <div class="box2">
                        <p id="parg1">Le président de la commission a rédigé un nouveau procès-verbal.</p>
                        <p id="parg2">Vous pouvez le consulter dans l'archive du logiciel.</p>
                    </div>
                </div>
            </body>
            </html>`
          }
          transporter.sendMail(mailOptions, function (err, info) {
            if (err) {
              console.log(err)
            } else {
              console.log('Email sent!')
            }
          })
        }
      })
      res.send({ id: result.insertId })
    }
  })
})

// Add pv with given num_cd
/* Body being in the format of :
  {
	 "numCD": int value,
   "libeleS": string value,
   "temoin": {
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
   "numR": int value
  }
*/
router.post('/addPV', (req, res) => {
  let { numCD, libeleS, temoin, numR, numC } = req.body
  console.log(req.body)
  let pvId,
    sent = false
  let temoinErrBuffer = []
  let sqlqueryS = `INSERT INTO Sanction (libele_s) VALUES (?)`
  db.query(sqlqueryS, libeleS.replace(/,/g, ''), (err, result) => {
    if (err) {
      res.status(400).send(err)
    } else {
      let sqlqueryPv = `INSERT INTO PV (date_pv, num_cd, num_s, num_r, num_c) VALUES (NOW(), ?, ?, ?, ?)`
      db.query(sqlqueryPv, [numCD, result.insertId, numR, numC], (err, result) => {
        if (err) {
          res.status(400).send(err)
        } else {
          pvId = result.insertId
          console.log('pvId:', pvId)
          let setReportTraited = `UPDATE Rapport r SET r.est_traite = TRUE WHERE r.num_r = ?`
          db.query(setReportTraited, numR, (err, result) => {
            if (err) {
              res.status(400).send(err)
            } else {
              console.log('marked rapport as traited: ', numR)
              let sqlqueryT = `INSERT INTO Temoin (nom_t, prenom_t, role_t) VALUES (?, ?, ?)`
              console.log(sent, 'temoins', temoin, ', if is an array : ', Array.isArray(temoin))
              temoin.map((t) => {
                console.log(t)
                db.query(sqlqueryT, [t.nomT.replace(/ /g, '\u00A0').toUpperCase(), maj(t.prenomT.replace(/ /g, '\u00A0')), t.roleT], (err, result) => {
                  if (err) {
                    if (err.errno == 1062) {
                      console.log('tuple duplicated')
                      let getIndex =
                        'SELECT num_t FROM Temoin WHERE nom_t = ? AND prenom_t = ? AND role_t = ?'
                      db.query(getIndex, [t.nomT.replace(/ /g, '\u00A0').toUpperCase(), maj(t.prenomT.replace(/ /g, '\u00A0')), t.roleT], (err, result) => {
                        if (err) {
                          console.log(err)
                          temoinErrBuffer.push(err)
                          return
                        } else {
                          console.log('result[0].num_t', result[0].num_t)
                          // Connect un temoin to cd and pv
                          let sqlquerytem =
                            'INSERT INTO Temoigne (num_cd, num_t, num_pv) VALUES (?, ?, ?)'
                          db.query(sqlquerytem, [numCD, result[0].num_t, pvId], (err, result) => {
                            if (err) {
                              console.log('Error inside else', err)
                              temoinErrBuffer.push(err)
                            }
                          })
                        }
                      })
                    } else {
                      temoinErrBuffer.push(err)
                    }
                  } else {
                    // Connect un temoin to cd and pv
                    let sqlquerytem =
                      'INSERT INTO Temoigne (num_cd, num_t, num_pv) VALUES (?, ?, ?)'
                    console.log('pvId:', pvId)
                    db.query(sqlquerytem, [numCD, result.insertId, pvId], (err, result) => {
                      if (err) {
                        console.log('Error inside else else:', err)
                        temoinErrBuffer.push(res)
                      }
                    })
                  }
                })
              })
              if (temoinErrBuffer.length != 0) {
                res.status(400).send(temoinErrBuffer)
              } else {
                console.log('arrivedHere')
                res.send({ numpv: pvId.toString() })
              }
            }
          })
        }
      })
    }
  })
})

module.exports = router
