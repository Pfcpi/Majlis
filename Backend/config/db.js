/* eslint-disable prettier/prettier */
/* eslint-disable no-unused-vars */
const Database = require('mysql')

// Aws rds database login
const db = Database.createConnection({
  host: 'projet.c9ewe6uqqsev.eu-west-3.rds.amazonaws.com',
  port: '3306',
  user: 'admin',
  password: 'pfcpiprojet',
  database: 'projet'
})

// Connect to the aws rds database
db.connect((err) => {
  if (err) {
    console.error('Error connecting to MySQL RDS: ' + err.message)
    console.error(err.stack)
    return
  }
  console.log('Connected to MySQL RDS as ID ' + db.threadId)
})

module.exports = { db }
