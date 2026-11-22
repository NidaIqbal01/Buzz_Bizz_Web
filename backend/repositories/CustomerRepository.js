const db = require("../config/db");

class CustomerRepository {
  constructor() {
    this.pool = db.getPool();
  }

  async getAll(userId = 1) {
    const [rows] = await this.pool.query(
      "SELECT * FROM customers WHERE user_id = ? ORDER BY id DESC",
      [userId]
    );
    return rows;
  }

  async create({ userId = 1, name, phone = "", email = "" }) {
    const [res] = await this.pool.query(
      "INSERT INTO customers (user_id, name, phone, email) VALUES (?, ?, ?, ?)",
      [userId, name, phone, email]
    );
    return { id: res.insertId, userId, name, phone, email };
  }

  async remove(id) {
    const [res] = await this.pool.query("DELETE FROM customers WHERE id = ?", [id]);
    return res.affectedRows > 0;
  }
}

module.exports = new CustomerRepository();