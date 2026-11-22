const OrderFactory = require("../factories/OrderFactory");
const orderRepo = require("../repositories/OrderRepository");
const { orderEventBus } = require("../observers/OrderObserver");

class OrderController {
  async index(req, res) {
    try {
      const orders = await orderRepo.getAll(1);
      res.json(orders);
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  }

  async store(req, res) {
    try {
      const { type, customerId, productId, quantity, unitPrice } = req.body;

      if (!customerId || !productId || !quantity) {
        return res.status(400).json({
          error: "customerId, productId, aur quantity zaroori hain",
        });
      }

      // Factory Pattern: type ("standard" ya "express") ke mutabik order banata hai
      const orderData = OrderFactory.createOrder({
        type,
        userId: 1,
        customerId,
        productId,
        quantity,
        unitPrice: unitPrice || 500,
      });

      const saved = await orderRepo.create(orderData);

      // Observer Pattern: order banne ke baad listeners ko notify karta hai
      orderEventBus.notify("order.created", {
        orderId: saved.id,
        type: saved.type,
        total: saved.total,
      });

      res.status(201).json(saved);
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  }

  async destroy(req, res) {
    try {
      const ok = await orderRepo.remove(req.params.id);
      if (!ok) return res.status(404).json({ error: "Order nahi mila" });
      res.json({ message: "Order deleted" });
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  }
}

module.exports = new OrderController();