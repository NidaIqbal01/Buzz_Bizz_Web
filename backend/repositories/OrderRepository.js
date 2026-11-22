const db = require("../config/db");

class OrderRepository {
  constructor() {
    this.pool = db.getPool();
  }

  async getAll(userId = 1) {
    const [rows] = await this.pool.query(
      "SELECT * FROM orders WHERE user_id = ? ORDER BY id DESC",
      [userId]
    );
    return rows.map((row) => ({
      ...row,
      total: Number(row.final_amount ?? row.total_amount ?? 0),
      status: row.status || "Pending",
      createdAt: row.created_at || new Date().toISOString(),
    }));
  }

  async create(order) {
    const totalAmount = Number(order.total) || 0;
    const discountAmount = 0;
    const finalAmount = totalAmount - discountAmount;
    const customerId = Number(order.customerId) || null;

    const [res] = await this.pool.query(
      `INSERT INTO orders (user_id, customer_id, total_amount, discount_amount, final_amount, status)
       VALUES (?, ?, ?, ?, ?, ?)`,
      [
        order.userId,
        customerId,
        totalAmount,
        discountAmount,
        finalAmount,
        order.status || "Pending",
      ]
    );

    return {
      id: res.insertId,
      userId: order.userId,
      customerId,
      productId: order.productId,
      quantity: order.quantity,
      total: finalAmount,
      status: order.status || "Pending",
      type: order.type,
      note: order.note,
    };
  }

  async remove(id) {
    const [res] = await this.pool.query("DELETE FROM orders WHERE id = ?", [
      id,
    ]);
    return res.affectedRows > 0;
  }
}

module.exports = new OrderRepository();