const express = require("express");
const router = express.Router();
const controller = require("../controllers/CustomerController");

router.get("/", (req, res) => controller.index(req, res));
router.post("/", (req, res) => controller.store(req, res));
router.delete("/:id", (req, res) => controller.destroy(req, res));

module.exports = router;