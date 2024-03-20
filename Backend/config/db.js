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

// Close the database connection
db.close()

module.exports = db
