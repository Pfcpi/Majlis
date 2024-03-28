/* eslint-disable no-unused-vars */
const Database = require('better-sqlite3')

const db = new Database('Backend/config/test.db')

db.pragma('journal_mode = WAL')

// Define the SQL statement to create the table
const createTableQuery = `
    CREATE TABLE IF NOT EXISTS my_table (
        id INTEGER PRIMARY KEY,
        name TEXT,
        age INTEGER
    )
`

// Execute the SQL statement to create the table
db.exec(createTableQuery)

// Function to add a user to the table "my_table"
function InsertUser(id, name, age) {
  id = Number(id)
  name = String(name)
  age = Number(age)
  const existingUser = db.prepare(`SELECT * FROM my_table WHERE id = ?`).get(id)
  if (existingUser) return true // User already exists
  db.prepare(`INSERT INTO my_table (id, name, age) VALUES (?, ?, ?)`).run(id, name, age)
  return false
}

module.exports = { db, InsertUser }
