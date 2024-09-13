/* eslint-disable prettier/prettier */
/* eslint-disable no-unused-vars */
const Database = require('mysql2')
require('dotenv').config()

// Database login
const dbConfig = {
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_DATABASE
}

// Function to connect to the database with retry mechanism
function connectToDB() {
  const db = Database.createPool(dbConfig)

  db.getConnection((err, connection) => {
    if (err) {
      console.error('Error connecting to MySQL RDS: ' + err.message)
      console.error(err.stack)
      // Retry connecting after a delay (e.g., 5 seconds)
      setTimeout(connectToDB, 5000)
      return
    }
    console.log('Connected to MySQL RDS as ID ' + connection.threadId)
    connection.release()
  })

  // Handle unexpected disconnections
  /*db.on('error', (err) => {
    console.error('Database connection error:', err)
    db.destroy()
    // Retry connecting after a delay (e.g., 5 seconds)
    setTimeout(connectToDB, 5000)
  })*/

  // Export the database connection
  module.exports = { db }
}

// Initial connection attempt
connectToDB()
