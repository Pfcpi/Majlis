/* eslint-disable no-unused-vars */
const Database = require('mysql')

// Aws rds database login
const db = Database.createConnection({
  host: 'projet.c9ewe6uqqsev.eu-west-3.rds.amazonaws.com',
  port: '3306',
  user: 'admin',
  password: '%pfcpiprojet%',
  database: 'db'
})

// Connect to the aws rds database
db.connect((err) => {
  if (err) {
    console.log(err.message)
    return
  }
  console.log('database connected')
})

module.exports = { db }
