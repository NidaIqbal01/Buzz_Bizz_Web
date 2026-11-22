// Strategy Pattern: Har pricing formula apni alag strategy class mein hai

class FixedProfitStrategy {
  calculate({ cost = 0, fixedProfit = 0 }) {
    const c = Math.max(0, Number(cost) || 0);
    const profitInput = Math.max(0, Number(fixedProfit) || 0);
    const price = c + profitInput;
    const profit = price - c;
    const margin = price > 0 ? (profit / price) * 100 : 0;

    return { strategy: "fixed", cost: c, price, profit, margin };
  }
}

class PercentageMarkupStrategy {
  calculate({ cost = 0, percentage = 0 }) {
    const c = Math.max(0, Number(cost) || 0);
    const pct = Math.max(0, Number(percentage) || 0);
    const price = c * (1 + pct / 100);
    const profit = price - c;
    const margin = price > 0 ? (profit / price) * 100 : 0;

    return { strategy: "percentage", cost: c, price, profit, margin };
  }
}

class CostPlusOverheadStrategy {
  calculate({ cost = 0, overhead = 0, percentage = 0 }) {
    const c = Math.max(0, Number(cost) || 0);
    const oh = Math.max(0, Number(overhead) || 0);
    const pct = Math.max(0, Number(percentage) || 0);
    const price = (c + oh) * (1 + pct / 100);
    const profit = price - c;
    const margin = price > 0 ? (profit / price) * 100 : 0;

    return { strategy: "cost-plus", cost: c, overhead: oh, price, profit, margin };
  }
}

// Context class jo selected strategy ko run karti hai
class PricingContext {
  constructor(strategyType = "fixed") {
    this.setStrategy(strategyType);
  }

  setStrategy(strategyType) {
    if (strategyType === "percentage") {
      this.strategy = new PercentageMarkupStrategy();
    } else if (strategyType === "cost-plus") {
      this.strategy = new CostPlusOverheadStrategy();
    } else {
      this.strategy = new FixedProfitStrategy();
    }
  }

  calculatePrice(payload) {
    return this.strategy.calculate(payload);
  }
}

module.exports = {
  FixedProfitStrategy,
  PercentageMarkupStrategy,
  CostPlusOverheadStrategy,
  PricingContext,
};