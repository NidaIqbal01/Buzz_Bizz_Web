const customerRepo = require("../repositories/CustomerRepository");

class CustomerController {
  async index(req, res) {
    try {
      const list = await customerRepo.getAll(1);
      res.json(list);
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  }

  async store(req, res) {
    try {
      const { name, phone, email } = req.body;
      if (!name || !name.trim()) {
        return res.status(400).json({ error: "Customer name zaroori hai" });
      }
      const saved = await customerRepo.create({ name: name.trim(), phone, email });
      res.status(201).json(saved);
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  }

  async destroy(req, res) {
    try {
      const ok = await customerRepo.remove(req.params.id);
      if (!ok) return res.status(404).json({ error: "Customer nahi mila" });
      res.json({ message: "Deleted" });
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  }
}

module.exports = new CustomerController();