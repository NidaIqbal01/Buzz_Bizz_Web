const db = require("../config/db");

class ProductRepository {
  constructor() {
    this.pool = db.getPool();
  }

  async getAll(userId = 1) {
    const [rows] = await this.pool.query(
      "SELECT * FROM products WHERE user_id = ? ORDER BY id DESC",
      [userId]
    );
    return rows.map((row) => ({
      id: row.id,
      userId: row.user_id,
      name: row.name,
      category: row.category || "",
      sku: row.sku || "",
      cost: Number(row.cost_price ?? 0),
      price: Number(row.price ?? 0),
      status: row.status || "active",
      stock: 10,
      minStock: 5,
      image: "",
    }));
  }

  async create(p) {
    const sku = `SKU-${Date.now()}`;
    const [res] = await this.pool.query(
      `INSERT INTO products (user_id, name, category, sku, price, cost_price, status)
       VALUES (?, ?, ?, ?, ?, ?, ?)`,
      [
        p.userId,
        p.name,
        p.category || "General",
        sku,
        p.price,
        p.cost,
        "active",
      ]
    );
    return {
      id: res.insertId,
      userId: p.userId,
      name: p.name,
      category: p.category || "General",
      sku,
      cost: Number(p.cost),
      price: Number(p.price),
      status: "active",
      stock: Number(p.stock ?? 10),
      minStock: Number(p.minStock ?? 5),
      image: p.image || "",
    };
  }

  async remove(id) {
    const [res] = await this.pool.query("DELETE FROM products WHERE id = ?", [
      id,
    ]);
    return res.affectedRows > 0;
  }
}

module.exports = new ProductRepository();