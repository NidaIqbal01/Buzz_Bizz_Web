class OrderFactory {
  static createOrder({ type = "standard", userId = 1, customerId, productId, quantity, unitPrice }) {
    const qty = Number(quantity) || 1;
    const price = Number(unitPrice) || 0;
    const total = qty * price;

    if (type === "express") {
      return {
        userId: Number(userId) || 1,
        customerId: Number(customerId),
        productId: Number(productId),
        quantity: qty,
        total,
        status: "Confirmed",
        type: "express",
        note: "Priority express order",
      };
    }

    return {
      userId: Number(userId) || 1,
      customerId: Number(customerId),
      productId: Number(productId),
      quantity: qty,
      total,
      status: "Pending",
      type: "standard",
      note: "Standard order",
    };
  }
}

module.exports = OrderFactory;