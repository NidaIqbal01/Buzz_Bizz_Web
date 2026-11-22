const mysql = require("mysql2/promise");
require("dotenv").config();

// Singleton Pattern: Pure app mein MySQL pool ka sirf 1 instance banega
class DatabaseConnection {
  constructor() {
    if (DatabaseConnection.instance) {
      return DatabaseConnection.instance;
    }

    this.pool = mysql.createPool({
      host: process.env.DB_HOST,
      user: process.env.DB_USER,
      password: process.env.DB_PASSWORD,
      database: process.env.DB_NAME,
      waitForConnections: true,
      connectionLimit: 10,
      queueLimit: 0,
    });

    DatabaseConnection.instance = this;
  }

  getPool() {
    return this.pool;
  }
}

const db = new DatabaseConnection();
Object.freeze(db);

module.exports = db;