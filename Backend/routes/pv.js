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

  let sqlqueryCd = `INSERT INTO Conseil_Discipline (date_cd) VALUES (?)`
  db.query(sqlqueryCd, dateCd, (err, result) => {
    if (err) {
      res.status(400).send(err)
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
        res.status(400).send(err)
      }
    })
    i++
  }while(i<5)

  let sqlqueryS = `INSERT INTO Sanction (libele_s) VALUES (?)`
  db.query(sqlqueryS, libeleS, (err, result) => {
    if(err) {
      res.status(400).send(err)
    }
  })

  // Add a temoin to the database if it is in the body
  let sqlqueryT = `INSERT INTO Temoin (nom_t, prenom_t, role_t) VALUES (?, ?, ?)`
  var num = [null, null, null]
  i=0
  do{
    
    if(temoin[i] != null)
    {
      db.query(sqlqueryT, [temoin[i].nomT,temoin[i].prenomT,temoin[i].roleT], (err, result) => {
        if(err && err.errno != 1062)
        {
          res.status(400).send(err)
        }
      })
      db.query('SELECT num_t FROM Temoin WHERE nom_t = ? AND prenom_t = ?', [temoin[i].nomT,temoin[i].prenomT], (err, result) => {
        if(err)
        {
          res.status(400).send(err)
        }
        num[i]=result[0].num_t
      })
    }
    i++
  }while(i<3)
  
  // Counter to track number of temoin
  i=0
  while(num[i]!=null&&i<3)
  {
    i++
  }

  // Connect temoins to cd
  let sqlquerytem = 'INSERT INTO Temoigne (num_cd, num_t) VALUES (LAST_INSERT_ID(), ?)'
  var k=0
  while(k<i)
  {
    db.query(sqlquerytem, num[k], (err, result) => {
      if(err)
      {
        res.status(400).send(err)
      }
    })
  }

  // Add the pv
  let sqlqueryPv = `INSERT INTO PV (date_pv, num_cd, num_s, num_r) VALUES (NOW(), LAST_INSERT_ID(), LAST_INSERT_ID(), ?)`
  db.query(sqlqueryPv, numR, (err, result) => {
    if(err) {
      res.status(400).send(err)
    }

    db.query('SELECT email_u FROM Utilisateur WHERE id_u = 1', (err, result) => {
    if(err){
      res.status(400).send(err)
    } else {
      const mail = result[0].email_u
      const mailOptions = {
        from: '"Logiciel Conseil de Discipline" <conseilpv@cd-usto.tech>',
        to: mail,
        subject: 'Nouveau PV déposé.',
        html: `<body><div style="text-align: center;"><img src="https://i.goopics.net/8uots5.png" style="width: 100%; max-width: 650px; height: auto;"></div></body>`
      }
      transporter.sendMail(mailOptions, function (err, info) {
        if (err) {
          res.status(400).send(err)
        } else {
          console.log('Email sent!')
          res.status(204)
        }
      })
    }
  })
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
  let {dateCd, idM} = req.body
  let sqlqueryCd = `INSERT INTO Conseil_Discipline (date_cd) VALUES (?)`
  db.query(sqlqueryCd, dateCd, (err, result) => {
    if (err) {
      res.status(400).send(err)
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
        res.status(400).send(err)
      }
    })
    i++
  }while(i<5)
  db.query(`SELECT num_cd FROM Conseil_Discipline WHERE num_cd = LAST_INSERT_ID()`, (err, result) => {
    if(err){
      res.status(400).send(err)
    }
    db.query('SELECT email_u FROM Utilisateur WHERE id_u = 1', (err, result) => {
      if(err){
        res.status(400).send(err)
      } else {
        const mail = result[0].email_u
        const mailOptions = {
          from: '"Logiciel Conseil de Discipline" <conseilpv@cd-usto.tech>',
          to: mail,
          subject: 'Nouveau PV déposé.',
          html: `<body><div style="text-align: center;"><img src="https://i.goopics.net/8uots5.png" style="width: 100%; max-width: 650px; height: auto;"></div></body>`
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
    res.status(200).send(result[0].num_cd)
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
  let { numCD, libeleS, temoin, numR } = req.body
  let sqlqueryS = `INSERT INTO Sanction (libele_s) VALUES (?)`
  db.query(sqlqueryS, libeleS, (err, result) => {
    if(err) {
      res.status(400).send(err)
    }
  })

  // Add a temoin to the database if it is in the body
  let sqlqueryT = `INSERT INTO Temoin (nom_t, prenom_t, role_t) VALUES (?, ?, ?)`
  var i
  var num = [null, null, null]
  i=0
  do{
    
    if(temoin[i] != null)
    {
      console.log(temoin[i])
      db.query(sqlqueryT, [temoin[i].nomT,temoin[i].prenomT,temoin[i].roleT], (err, result) => {
        if(err && err.errno != 1062)
        {
          res.status(400).send(err)
        }
      })
      db.query('SELECT num_t FROM Temoin WHERE nom_t = ? AND prenom_t = ?', [temoin[i].nomT,temoin[i].prenomT], (err, result) => {
        if(err)
        {
          res.status(400).send(err)
        }
        num[i]=result[0].num_t
        console.log(num[i])
      })
    }
    i++
  }while(i<3)
  console.log(num[i])
  // Counter to track number of temoin
  i=0
  while(num[i]!=null&&i<3)
  {
    i++
  }

  // Connect temoins to cd
  let sqlquerytem = 'INSERT INTO Temoigne (num_cd, num_t) VALUES (?, ?)'
  var k=0
  while(k<i)
  {
    db.query(sqlquerytem, [numCD, num[k]], (err, result) => {
      if(err)
      {
        res.status(400).send(err)
      }
    })
  }

  // Add the pv
  let sqlqueryPv = `INSERT INTO PV (date_pv, num_cd, num_s, num_r) VALUES (NOW(), ?, LAST_INSERT_ID(), ?)`
  db.query(sqlqueryPv, [numCD, numR], (err, result) => {
    if(err) {
      res.status(400).send(err)
    }
    res.sendStatus(204)
  })
})




module.exports = router