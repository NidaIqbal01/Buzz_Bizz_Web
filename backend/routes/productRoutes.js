const express = require("express");
const router = express.Router();
const productController = require("../controllers/ProductController");

router.get("/", (req, res) => productController.index(req, res));
router.post("/", (req, res) => productController.store(req, res));
router.delete("/:id", (req, res) => productController.destroy(req, res));

module.exports = router;