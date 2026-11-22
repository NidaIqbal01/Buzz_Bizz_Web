const { PricingContext } = require("../strategies/PricingStrategy");

class PricingController {
  calculate(req, res) {
    const { strategy = "fixed", ...data } = req.body;
    const context = new PricingContext(strategy);
    const result = context.calculatePrice(data);
    res.json(result);
  }
}

module.exports = new PricingController();