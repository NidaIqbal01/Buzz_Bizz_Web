const test = require("node:test");
const assert = require("node:assert/strict");
const {
  FixedProfitStrategy,
  PercentageMarkupStrategy,
  CostPlusOverheadStrategy,
  PricingContext,
} = require("../strategies/PricingStrategy");

test("fixed strategy adds fixedProfit to cost", () => {
  const strategy = new FixedProfitStrategy();
  const result = strategy.calculate({ cost: 100, fixedProfit: 40 });

  assert.equal(result.strategy, "fixed");
  assert.equal(result.price, 140);
  assert.equal(result.profit, 40);
  assert.ok(Math.abs(result.margin - (40 / 140) * 100) < 1e-9);
});

test("PricingContext switches to percentage strategy", () => {
  const ctx = new PricingContext("percentage");
  const result = ctx.calculatePrice({ cost: 100, percentage: 30 });

  assert.equal(result.strategy, "percentage");
  assert.equal(result.price, 130);
  assert.equal(result.profit, 30);
});

test("cost-plus strategy includes overhead before percentage markup", () => {
  const strategy = new CostPlusOverheadStrategy();
  const result = strategy.calculate({
    cost: 100,
    overhead: 20,
    percentage: 25,
  });

  // (100 + 20) * 1.25 = 150, profit = 150 - 100 = 50
  assert.equal(result.strategy, "cost-plus");
  assert.equal(result.overhead, 20);
  assert.equal(result.price, 150);
  assert.equal(result.profit, 50);
  assert.ok(Math.abs(result.margin - (50 / 150) * 100) < 1e-9);
});

test("negative inputs clamp to zero safely", () => {
  const strategy = new PercentageMarkupStrategy();
  const result = strategy.calculate({ cost: -50, percentage: -20 });

  assert.equal(result.cost, 0);
  assert.equal(result.price, 0);
  assert.equal(result.profit, 0);
  assert.equal(result.margin, 0);
});