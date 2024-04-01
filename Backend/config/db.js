/* eslint-disable no-unused-vars */
const Database = require('mysql')

// Aws rds database login
const db = Database.createConnection({
  host: 'projet.c9ewe6uqqsev.eu-west-3.rds.amazonaws.com',
  port: '3306',
  user: 'admin',
  password: '%pfcpiprojet%',
  database: 'projet'
})

// Connect to the aws rds database
db.connect((err) => {
  if (err) {
    console.log(err.message)
    return
  }
  console.log('database connected')
})

// Define the SQL statement to create the table
const createTableQuery = `
    CREATE TABLE IF NOT EXISTS my_table (
        id INTEGER PRIMARY KEY,
        name TEXT,
        age INTEGER
    )
`

// Execute the SQL statement to create the table
db.query(createTableQuery)

// Function to add a user to the table "my_table"
function InsertUser(id, name, age) {
  id = Number(id)
  name = String(name)
  age = Number(age)
  const existingUser = db.query(`SELECT * FROM my_table WHERE id = ?`).get(id)
  if (existingUser) return true // User already exists
  db.query(`INSERT INTO my_table (id, name, age) VALUES (?, ?, ?)`).run(id, name, age)
  return false
}

module.exports = { db, InsertUser }
