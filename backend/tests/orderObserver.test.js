const test = require("node:test");
const assert = require("node:assert/strict");
const { OrderEventSubject } = require("../observers/OrderObserver");

test("notifies subscribed observer with event payload", () => {
  const subject = new OrderEventSubject();
  let received = null;

  subject.subscribe("order.created", (data) => {
    received = data;
  });

  subject.notify("order.created", { orderId: 101, total: 900 });

  assert.deepEqual(received, { orderId: 101, total: 900 });
});

test("notifies multiple subscribers for the same event", () => {
  const subject = new OrderEventSubject();
  const calls = [];

  subject.subscribe("stock.checked", (item) => calls.push(`first:${item.name}`));
  subject.subscribe("stock.checked", (item) => calls.push(`second:${item.stock}`));

  subject.notify("stock.checked", { name: "Candle", stock: 3 });

  assert.deepEqual(calls, ["first:Candle", "second:3"]);
});

test("does not throw when notifying an event with no subscribers", () => {
  const subject = new OrderEventSubject();

  assert.doesNotThrow(() => {
    subject.notify("unsubscribed.event", { test: true });
  });
});