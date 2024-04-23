/* eslint-disable prettier/prettier */
/* eslint-disable no-unused-vars */
const express = require('express')
const router = express.Router()
const { db } = require('../config/db')
const nodemailer = require('nodemailer')

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
const mailOptions = {
  from: '"Logiciel Conseil de Discipline" <conseilpv@cd-usto.tech>',
  to: 'abdelmoumene2004@gmail.com',
  subject: 'Nouveau PV déposé.',
  html: ``
}

//VALID
// Add a pv
/* Body being in the format of :
  {
	 "dateCd": string value in the format of 'YYYY-MM-DD',
   "idM": [
    "1": int value,
    "2": int value or null,
    "3": int value or null,
    "4": int value or null,
    "5": int value or null
   ],
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
router.post('/add', (req, res) => {
  let {dateCd, idM, libeleS, temoin, numR} = req.body

  db.query(`SET FOREIGN_KEY_CHECKS = 0`)
  let sqlqueryCd = `INSERT INTO Conseil_Discipline (date_cd) VALUES (?)`
  db.query(sqlqueryCd, dateCd, (err, result) => {
    if (err) {
      console.log(err)
    }
  })

  // Add multiple members to comission
  let sqlqueryC = `INSERT INTO Commission_Presente (num_cd, id_m) VALUES (LAST_INSERT_ID(), ?)`
  var i=0
  do{
    if(idM[i]!=null)
    db.query(sqlqueryC, idM[i], (err, result) => {
      if(err)
      {
        console.log(err)
      }
    })
    i++
  }while(i<5)



  let sqlqueryS = `INSERT INTO Sanction (libele_s) VALUES (?)`
  db.query(sqlqueryS, libeleS, (err, result) => {
    if(err) {
      console.log(err)
    }
  })


  // Add a temoin to the database if it is in the body
  let sqlqueryT = `INSERT INTO Temoin (nom_t, prenom_t, role_t) VALUES (?, ?, ?)`
  let sqlquerytem = `INSERT INTO Temoigne (num_cd, num_t) VALUES ((SELECT num_cd FROM Conseil_Discipline ORDER BY num_cd DESC LIMIT 0,1), ?)`
  i=0
  do{
    if(temoin[i] != null)
    {
      db.query(sqlqueryT, [temoin[i].nomT,temoin[i].prenomT,temoin[i].roleT], (err, result) => {
        if(err && err.errno != 1062)
        {
          console.log(err)
        }
      })
      db.query('SELECT num_t FROM Temoin WHERE nom_t = ? AND prenom_t = ?', [temoin[i].nomT,temoin[i].prenomT], (err, result) => {
        if(err)
        {
          console.log(err)
        }
        let num = result[0].num_t
        console.log("num"+i+":"+num)
        db.query(sqlquerytem, num, (err, result) => {
          if(err && err.errno!=1062)
          {
            console.log(err)
          }
        })
      })
    }
    i++
  }while(i<3)

  
  
  // Add the pv

  let sqlqueryPv = `INSERT INTO PV (date_pv, num_cd, num_s, num_r) VALUES (NOW(), LAST_INSERT_ID(), LAST_INSERT_ID(), ?)`
  db.query(sqlqueryPv, numR, (err, result) => {
    if(err) {
      res.status(400).send(err)
    }
    transporter.sendMail(mailOptions)
  })
  db.query(`SET FOREIGN_KEY_CHECKS = 1`)
  res.sendStatus(204)
})

module.exports = router
