const db = require("../config/db");

class UserRepository {
  constructor() {
    this.pool = db.getPool();
  }

  async findByEmail(email) {
    const [rows] = await this.pool.query(
      "SELECT * FROM users WHERE email = ? LIMIT 1",
      [email.trim().toLowerCase()]
    );
    return rows[0] || null;
  }

  async findById(id) {
    const [rows] = await this.pool.query(
      "SELECT id, full_name, email, business_name, phone, role, created_at FROM users WHERE id = ? LIMIT 1",
      [id]
    );
    return rows[0] || null;
  }

  async create({
    name,
    fullName,
    email,
    password,
    businessName = "",
    phone = null,
    role = "owner",
  }) {
    const displayName = (fullName || name || "").trim();
    const normalizedEmail = email.trim().toLowerCase();

    const [res] = await this.pool.query(
      `INSERT INTO users (full_name, email, password_hash, business_name, phone, role)
       VALUES (?, ?, ?, ?, ?, ?)`,
      [displayName, normalizedEmail, password, businessName.trim(), phone, role]
    );

    return {
      id: res.insertId,
      name: displayName,
      fullName: displayName,
      email: normalizedEmail,
      businessName: businessName.trim(),
      phone,
      role,
    };
  }
}

module.exports = new UserRepository();