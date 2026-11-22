export type Product = { id: number; name: string; category: string; price: number; stock: number; status: string };
export type Order = { id: string; customer: string; date: string; total: number; status: string; items: number };

export const initialProducts: Product[] = [
  { id: 1, name: "Matcha ceramic mug", category: "Homeware", price: 1850, stock: 24, status: "In stock" },
  { id: 2, name: "Linen tote bag", category: "Accessories", price: 1250, stock: 8, status: "Low stock" },
  { id: 3, name: "Botanical journal", category: "Stationery", price: 950, stock: 42, status: "In stock" },
  { id: 4, name: "Citrus candle", category: "Homeware", price: 1450, stock: 3, status: "Low stock" },
  { id: 5, name: "Everyday pouch", category: "Accessories", price: 780, stock: 18, status: "In stock" }
];

export const initialOrders: Order[] = [
  { id: "BB-1048", customer: "Ayesha Khan", date: "Today, 10:42 AM", total: 3100, status: "Processing", items: 2 },
  { id: "BB-1047", customer: "Sara Ahmed", date: "Today, 9:18 AM", total: 1850, status: "Confirmed", items: 1 },
  { id: "BB-1046", customer: "Hira Malik", date: "Yesterday", total: 2230, status: "Pending", items: 3 },
  { id: "BB-1045", customer: "Maham Ali", date: "Yesterday", total: 1450, status: "Delivered", items: 1 },
  { id: "BB-1044", customer: "Zoya Noor", date: "Nov 18, 2026", total: 2500, status: "Delivered", items: 2 }
];

export const money = (amount: number) =>
  new Intl.NumberFormat("en-PK", { style: "currency", currency: "PKR", maximumFractionDigits: 0 }).format(amount);
