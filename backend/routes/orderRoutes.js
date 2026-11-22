const express = require("express");
const router = express.Router();
const orderController = require("../controllers/OrderController");

router.get("/", (req, res) => orderController.index(req, res));
router.post("/", (req, res) => orderController.store(req, res));
router.delete("/:id", (req, res) => orderController.destroy(req, res));

module.exports = router;