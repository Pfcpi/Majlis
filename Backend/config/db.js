/* eslint-disable prettier/prettier */
/* eslint-disable no-unused-vars */
const Database = require('mysql2')

// Aws rds database login
const dbConfig = {
  host: 'eris-shared-g1.dzsecurity.net',
  user: 'madjri81_admin',
  password: 'pfcpiprojet',
  database: 'madjri81_projet'
}

// Function to connect to the database with retry mechanism
function connectToDB() {
  const db = Database.createConnection(dbConfig)

  db.connect((err) => {
    if (err) {
      console.error('Error connecting to MySQL RDS: ' + err.message)
      console.error(err.stack)
      // Retry connecting after a delay (e.g., 5 seconds)
      setTimeout(connectToDB, 5000)
      return
    }
    console.log('Connected to MySQL RDS as ID ' + db.threadId)
  })

  // Handle unexpected disconnections
  db.on('error', (err) => {
    console.error('Database connection error:', err)
    db.destroy()
    // Retry connecting after a delay (e.g., 5 seconds)
    setTimeout(connectToDB, 5000)
  })

  // Export the database connection
  module.exports = { db }
}

// Initial connection attempt
connectToDB()