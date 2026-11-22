const test = require("node:test");
const assert = require("node:assert/strict");
const OrderFactory = require("../factories/OrderFactory");

test("creates a standard order with default status and calculated total", () => {
  const order = OrderFactory.createOrder({
    customerId: 2,
    productId: 5,
    quantity: 3,
    unitPrice: 250,
  });

  assert.equal(order.type, "standard");
  assert.equal(order.status, "Pending");
  assert.equal(order.note, "Standard order");
  assert.equal(order.quantity, 3);
  assert.equal(order.total, 750);
});

test("creates an express order with Confirmed status and priority note", () => {
  const order = OrderFactory.createOrder({
    type: "express",
    userId: 4,
    customerId: 1,
    productId: 9,
    quantity: 2,
    unitPrice: 500,
  });

  assert.equal(order.type, "express");
  assert.equal(order.status, "Confirmed");
  assert.equal(order.note, "Priority express order");
  assert.equal(order.userId, 4);
  assert.equal(order.total, 1000);
});

test("defaults missing quantity to 1 and missing unitPrice to 0", () => {
  const order = OrderFactory.createOrder({
    customerId: 3,
    productId: 7,
  });

  assert.equal(order.quantity, 1);
  assert.equal(order.total, 0);
  assert.equal(order.userId, 1);
});