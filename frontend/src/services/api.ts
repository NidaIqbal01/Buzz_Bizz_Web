const BASE_URL = "http://localhost:5000/api";

export const api = {
  getProducts: async () => {
    const res = await fetch(`${BASE_URL}/products`);
    return res.json();
  },
  addProduct: async (data: unknown) => {
    const res = await fetch(`${BASE_URL}/products`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });
    return res.json();
  },
  getCustomers: async () => {
    const res = await fetch(`${BASE_URL}/customers`);
    return res.json();
  },
  addCustomer: async (data: unknown) => {
    const res = await fetch(`${BASE_URL}/customers`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });
    return res.json();
  },
  getOrders: async () => {
    const res = await fetch(`${BASE_URL}/orders`);
    return res.json();
  },
  addOrder: async (data: unknown) => {
    const res = await fetch(`${BASE_URL}/orders`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });
    return res.json();
  },
};