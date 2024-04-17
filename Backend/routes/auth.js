/* eslint-disable prettier/prettier */
/* eslint-disable no-unused-vars */
const express = require('express')
const router = express.Router()
const { db } = require('../config/db')
const crypto = require('crypto')
const { log } = require('console')

/*
    Sends a request to the database to check if it's the correct pass
    BODY REQUEST:
        {
            "pass": String
        }
*/
router.post('/chef' , (req, res) => {
    let pass = req.body.pass
    const hashedPassword = crypto.createHash('sha256').update(pass).digest('hex')
    let sqlquery = `SELECT * FROM Utilisateur WHERE id_u = 1 AND mot_de_passe = ?`
    db.query(sqlquery, hashedPassword,(err, result) => {
    if (err) {
      res.status(400).send(err)
    } else {
      if(result[0] != null) {
        res.status(200).send("Correct pass")
      } else {
        res.status(200).send("Wrong pass")
      }
    }
  })
})

/*
    Sends a request to the database to check if it's the correct pass
    BODY REQUEST:
        {
            pass: String
        }
*/
router.post('/pres' , (req, res) => {
    let pass = req.body.pass
    let sqlquery = `SELECT * FROM Utilisateur WHERE id_u = 2 AND mot_de_passe = ?`
    const hashedPassword = crypto.createHash('sha256').update(pass).digest('hex')
    db.query(sqlquery, hashedPassword, (err, result) => {
    if (err) {
      res.status(400).send(err)
    } else {
        if(result[0] != null) {
            res.status(200).send("Correct pass")
          } else {
            res.status(200).send("Wrong pass")
          }
    }
  })
})

/* Updates the password of the chef
    BODY REQUEST:
        {
            pass: String
        }
*/
router.patch('/pedit', (req, res) => {
    let pass = req.body.pass
    let sqlquery = `UPDATE Utilisateur SET mot_de_passe = ? WHERE id_u = 2`
    const hashedPassword = crypto.createHash('sha256').update(pass).digest('hex')
    db.query(sqlquery, hashedPassword, (err, result) => {
        if (err) {
          res.status(400).send(err)
        } else {
            res.status(200).send("Password changed")
        }
      })
})

/* Updates the password of the president
    BODY REQUEST:
        {
            pass: String
        }
*/
router.patch('/cedit', (req, res) => {
    let pass = req.body.pass
    let sqlquery = `UPDATE Utilisateur SET mot_de_passe = ? WHERE id_u = 1`
    const hashedPassword = crypto.createHash('sha256').update(pass).digest('hex')
    db.query(sqlquery, hashedPassword, (err, result) => {
        if (err) {
          res.status(400).send(err)
        } else {
            res.status(200).send("Password changed")
        }
      })
})


module.exports = router