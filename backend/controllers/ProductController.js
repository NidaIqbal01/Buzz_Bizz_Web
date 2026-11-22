const ProductModel = require("../models/ProductModel");
const productRepo = require("../repositories/ProductRepository");
const { orderEventBus } = require("../observers/OrderObserver");

class ProductController {
  // Saare products lane ke liye
  async index(req, res) {
    try {
      const list = await productRepo.getAll(1);
      res.json(list);
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  }

  // Naya product add karne ke liye
  async store(req, res) {
    try {
      const product = new ProductModel(req.body);
      const errMsg = product.validate();
      if (errMsg) return res.status(400).json({ error: errMsg });

      const saved = await productRepo.create(product);

      // Observer ko batana ke naya product save ho gaya hai
      orderEventBus.notify("stock.checked", saved);
      orderEventBus.notify("order.created", {
        action: "product_created",
        id: saved.id,
      });

      res.status(201).json(saved);
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  }

  // Product delete karne ke liye
  async destroy(req, res) {
    try {
      const ok = await productRepo.remove(req.params.id);
      if (!ok) return res.status(404).json({ error: "Product nahi mila" });
      res.json({ message: "Deleted" });
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  }
}

module.exports = new ProductController();