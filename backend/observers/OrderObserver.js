// Observer Pattern: Jab koi event emit hota hai, saare subscribed observers run hote hain

class OrderEventSubject {
  constructor() {
    this.observers = {};
  }

  subscribe(eventName, observerFn) {
    if (!this.observers[eventName]) {
      this.observers[eventName] = [];
    }
    this.observers[eventName].push(observerFn);
  }

  notify(eventName, data) {
    const listeners = this.observers[eventName] || [];
    for (const fn of listeners) {
      fn(data);
    }
  }
}

// Observer 1: Activity / Audit log
function activityLogObserver(payload) {
  console.log("[OBSERVER - LOG]:", JSON.stringify(payload));
}

// Observer 2: Low-stock warning check
function lowStockObserver(product) {
  if (product && typeof product.stock === "number" && product.stock <= (product.minStock ?? 5)) {
    console.log(
      `[OBSERVER - STOCK ALERT]: "${product.name}" low stock pe hai (${product.stock} left, min ${product.minStock ?? 5})`
    );
  }
}

const orderEventBus = new OrderEventSubject();
orderEventBus.subscribe("order.created", activityLogObserver);
orderEventBus.subscribe("stock.checked", lowStockObserver);

module.exports = {
  OrderEventSubject,
  orderEventBus,
};