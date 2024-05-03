/* eslint-disable prettier/prettier */
/* eslint-disable no-unused-vars */
const Database = require('mysql')

const db = Database.createConnection({
  host: 'eris-shared-g1.dzsecurity.net',
  port: '3306',
  user: 'madjri81_admin',
  password: 'pfcpiprojet',
  database: 'madjri81_projet'
})

db.connect((err) => {
  if (err) {
    console.error('Error connecting to MySQL RDS: ' + err.message)
    console.error(err.stack)
    return
  }
  console.log('Connected to MySQL RDS as ID ' + db.threadId)
})

// Export the database connection
module.exports = { db }
