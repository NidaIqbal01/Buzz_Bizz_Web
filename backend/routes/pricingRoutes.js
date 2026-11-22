const express = require("express");
const router = express.Router();
const pricingController = require("../controllers/PricingController");

router.post("/calculate", (req, res) => pricingController.calculate(req, res));

module.exports = router;