import {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import { useAuth } from "./AuthContext";
import { api } from "../services/api";

export type Product = {
  id: string;
  name: string;
  category: string;
  cost: number;
  price: number;
  stock: number;
  minStock: number;
  image?: string;
};

export type Customer = {
  id: string;
  name: string;
  phone: string;
  email: string;
};

export type OrderStatus =
  | "Pending"
  | "Confirmed"
  | "Processing"
  | "Delivered"
  | "Cancelled";

export type Order = {
  id: string;
  customerId: string;
  productId: string;
  quantity: number;
  total: number;
  status: OrderStatus;
  createdAt: string;
};

export type Expense = {
  id: string;
  title: string;
  category: string;
  amount: number;
  date: string;
  notes: string;
};

export type Payment = {
  id: string;
  orderId: string;
  amount: number;
  method: string;
  date: string;
  notes: string;
};

type BusinessData = {
  products: Product[];
  customers: Customer[];
  orders: Order[];
  expenses: Expense[];
  payments: Payment[];
};

type AppContextType = BusinessData & {
  addProduct: (data: Omit<Product, "id">) => void;
  updateProduct: (id: string, data: Omit<Product, "id">) => void;
  deleteProduct: (id: string) => string | null;
  addCustomer: (data: Omit<Customer, "id">) => void;
  updateCustomer: (id: string, data: Omit<Customer, "id">) => void;
  deleteCustomer: (id: string) => string | null;
  addOrder: (data: Omit<Order, "id" | "createdAt" | "status">) => string | null;
  updateOrder: (
    id: string,
    data: Pick<Order, "customerId" | "productId" | "quantity">
  ) => string | null;
  updateOrderStatus: (id: string, status: OrderStatus) => string | null;
  deleteOrder: (id: string) => string | null;
  addExpense: (data: Omit<Expense, "id">) => void;
  updateExpense: (id: string, data: Omit<Expense, "id">) => void;
  deleteExpense: (id: string) => void;
  addPayment: (data: Omit<Payment, "id">) => string | null;
  updatePayment: (id: string, data: Omit<Payment, "id">) => string | null;
  deletePayment: (id: string) => void;
  adjustStock: (id: string, amount: number) => string | null;
  getOrderPaid: (orderId: string) => number;
  getOrderBalance: (orderId: string) => number;
};

const Context = createContext<AppContextType | undefined>(undefined);

const emptyData: BusinessData = {
  products: [],
  customers: [],
  orders: [],
  expenses: [],
  payments: [],
};

function makeId() {
  return crypto.randomUUID();
}

export function AppProvider({ children }: { children: ReactNode }) {
  const { user } = useAuth();
  const [data, setData] = useState<BusinessData>(emptyData);
  const [loadedKey, setLoadedKey] = useState<string | null>(null);

  const storageKey = user ? `buzz-bizz-data-${user.id}` : null;

  useEffect(() => {
    if (!storageKey) {
      setData(emptyData);
      setLoadedKey(null);
      return;
    }

    try {
      const saved = localStorage.getItem(storageKey);
      setData(saved ? { ...emptyData, ...JSON.parse(saved) } : emptyData);
    } catch {
      setData(emptyData);
    } finally {
      setLoadedKey(storageKey);
    }
  }, [storageKey]);

  useEffect(() => {
    if (!user || !storageKey || loadedKey !== storageKey) return;

    let active = true;

    async function loadFromBackend() {
      try {
        const [dbProducts, dbCustomers, dbOrders] = await Promise.all([
          api.getProducts(),
          api.getCustomers(),
          api.getOrders(),
        ]);

        if (!active) return;

        setData((current) => ({
          ...current,
          products: Array.isArray(dbProducts)
            ? dbProducts.map((p) => ({
                id: String(p.id),
                name: p.name ?? "",
                category: p.category ?? "",
                cost: Number(p.cost ?? 0),
                price: Number(p.price ?? 0),
                stock: Number(p.stock ?? 0),
                minStock: Number(p.min_stock ?? p.minStock ?? 5),
                image: p.image ?? "",
              }))
            : current.products,
          customers: Array.isArray(dbCustomers)
            ? dbCustomers.map((c) => ({
                id: String(c.id),
                name: c.name ?? "",
                phone: c.phone ?? "",
                email: c.email ?? "",
              }))
            : current.customers,
          orders: Array.isArray(dbOrders)
            ? dbOrders.map((o) => ({
                id: String(o.id),
                customerId: String(o.customer_id ?? o.customerId ?? ""),
                productId: String(o.product_id ?? o.productId ?? ""),
                quantity: Number(o.quantity ?? 1),
                total: Number(o.total ?? 0),
                status: (o.status as OrderStatus) || "Pending",
                createdAt:
                  o.created_at || o.createdAt || new Date().toISOString(),
              }))
            : current.orders,
        }));
      } catch {
        // Backend band ho ya network error aaye toh local data hi chalega
      }
    }

    loadFromBackend();

    return () => {
      active = false;
    };
  }, [user, storageKey, loadedKey]);

  useEffect(() => {
    if (!storageKey || loadedKey !== storageKey) return;

    try {
      localStorage.setItem(storageKey, JSON.stringify(data));
    } catch {
      console.error("Buzz Bizz data could not be saved.");
    }
  }, [data, storageKey, loadedKey]);

  const commit = (changes: Partial<BusinessData>) => {
    setData((current) => ({ ...current, ...changes }));
  };

  const addProduct: AppContextType["addProduct"] = (item) => {
    const tempId = makeId();
    commit({ products: [...data.products, { ...item, id: tempId }] });

    api
      .addProduct(item)
      .then((saved) => {
        if (saved && saved.id !== undefined) {
          setData((current) => ({
            ...current,
            products: current.products.map((p) =>
              p.id === tempId ? { ...p, id: String(saved.id) } : p
            ),
          }));
        }
      })
      .catch(() => {});
  };

  const updateProduct: AppContextType["updateProduct"] = (id, item) =>
    commit({
      products: data.products.map((p) => (p.id === id ? { ...item, id } : p)),
    });

  const deleteProduct: AppContextType["deleteProduct"] = (id) => {
    if (
      data.orders.some((o) => o.productId === id && o.status !== "Cancelled")
    ) {
      return "This product is linked to an active order and cannot be deleted.";
    }
    commit({ products: data.products.filter((p) => p.id !== id) });
    return null;
  };

  const addCustomer: AppContextType["addCustomer"] = (item) => {
    const tempId = makeId();
    commit({ customers: [...data.customers, { ...item, id: tempId }] });

    api
      .addCustomer(item)
      .then((saved) => {
        if (saved && saved.id !== undefined) {
          setData((current) => ({
            ...current,
            customers: current.customers.map((c) =>
              c.id === tempId ? { ...c, id: String(saved.id) } : c
            ),
          }));
        }
      })
      .catch(() => {});
  };

  const updateCustomer: AppContextType["updateCustomer"] = (id, item) =>
    commit({
      customers: data.customers.map((c) =>
        c.id === id ? { ...item, id } : c
      ),
    });

  const deleteCustomer: AppContextType["deleteCustomer"] = (id) => {
    if (data.orders.some((o) => o.customerId === id)) {
      return "This customer has order records and cannot be deleted.";
    }
    commit({ customers: data.customers.filter((c) => c.id !== id) });
    return null;
  };

  const addOrder: AppContextType["addOrder"] = (item) => {
    const product = data.products.find((p) => p.id === item.productId);
    const customer = data.customers.find((c) => c.id === item.customerId);

    if (!product || !customer) return "Select a valid customer and product.";
    if (!Number.isInteger(item.quantity) || item.quantity < 1) {
      return "Quantity must be a positive whole number.";
    }

    const tempId = makeId();
    const order: Order = {
      ...item,
      id: tempId,
      createdAt: new Date().toISOString(),
      status: "Pending",
      total: product.price * item.quantity,
    };

    commit({ orders: [...data.orders, order] });

    api
      .addOrder({
        type: "standard",
        customerId: Number(item.customerId) || item.customerId,
        productId: Number(item.productId) || item.productId,
        quantity: item.quantity,
        unitPrice: product.price,
      })
      .then((saved) => {
        if (saved && saved.id !== undefined) {
          setData((current) => ({
            ...current,
            orders: current.orders.map((o) =>
              o.id === tempId
                ? {
                    ...o,
                    id: String(saved.id),
                    total: Number(saved.total ?? o.total),
                    status: (saved.status as OrderStatus) || o.status,
                  }
                : o
            ),
          }));
        }
      })
      .catch(() => {});

    return null;
  };

  const updateOrder: AppContextType["updateOrder"] = (id, changes) => {
    const oldOrder = data.orders.find((o) => o.id === id);
    const newProduct = data.products.find((p) => p.id === changes.productId);
    const newCustomer = data.customers.find(
      (c) => c.id === changes.customerId
    );

    if (!oldOrder || !newProduct || !newCustomer)
      return "Select a valid customer and product.";
    if (!Number.isInteger(changes.quantity) || changes.quantity < 1) {
      return "Quantity must be a positive whole number.";
    }
    if (oldOrder.status !== "Pending") {
      return "Only pending orders can be edited. Cancel the order first if changes are required.";
    }

    commit({
      orders: data.orders.map((o) =>
        o.id === id
          ? { ...o, ...changes, total: newProduct.price * changes.quantity }
          : o
      ),
    });
    return null;
  };

  const updateOrderStatus: AppContextType["updateOrderStatus"] = (
    id,
    status
  ) => {
    const order = data.orders.find((o) => o.id === id);
    if (!order) return "Order not found.";

    const allowed: Record<OrderStatus, OrderStatus[]> = {
      Pending: ["Confirmed", "Cancelled"],
      Confirmed: ["Processing", "Cancelled"],
      Processing: ["Delivered", "Cancelled"],
      Delivered: [],
      Cancelled: [],
    };

    if (!allowed[order.status].includes(status)) {
      return `Cannot change an order from ${order.status} to ${status}.`;
    }

    const product = data.products.find((p) => p.id === order.productId);
    if (!product) return "The product for this order no longer exists.";

    let nextStock = product.stock;

    if (status === "Confirmed") {
      if (product.stock < order.quantity) {
        return "Insufficient stock to confirm this order.";
      }
      nextStock -= order.quantity;
    }

    if (status === "Cancelled" && order.status !== "Pending") {
      nextStock += order.quantity;
    }

    commit({
      products: data.products.map((p) =>
        p.id === product.id ? { ...p, stock: nextStock } : p
      ),
      orders: data.orders.map((o) => (o.id === id ? { ...o, status } : o)),
    });

    return null;
  };

  const deleteOrder: AppContextType["deleteOrder"] = (id) => {
    const order = data.orders.find((o) => o.id === id);
    if (!order) return "Order not found.";
    if (order.status !== "Pending" && order.status !== "Cancelled") {
      return "Cancel this order before deleting it.";
    }

    commit({
      orders: data.orders.filter((o) => o.id !== id),
      payments: data.payments.filter((p) => p.orderId !== id),
    });
    return null;
  };

  const addExpense: AppContextType["addExpense"] = (item) =>
    commit({ expenses: [...data.expenses, { ...item, id: makeId() }] });

  const updateExpense: AppContextType["updateExpense"] = (id, item) =>
    commit({
      expenses: data.expenses.map((e) => (e.id === id ? { ...item, id } : e)),
    });

  const deleteExpense: AppContextType["deleteExpense"] = (id) =>
    commit({ expenses: data.expenses.filter((e) => e.id !== id) });

  const getOrderPaid = (orderId: string) =>
    data.payments
      .filter((p) => p.orderId === orderId)
      .reduce((sum, p) => sum + p.amount, 0);

  const getOrderBalance = (orderId: string) => {
    const order = data.orders.find((o) => o.id === orderId);
    return order ? Math.max(0, order.total - getOrderPaid(orderId)) : 0;
  };

  const addPayment: AppContextType["addPayment"] = (item) => {
    const order = data.orders.find((o) => o.id === item.orderId);
    if (!order) return "Select a valid order.";
    if (!Number.isFinite(item.amount) || item.amount <= 0)
      return "Payment must be greater than zero.";
    if (item.amount > getOrderBalance(item.orderId))
      return "Payment exceeds the outstanding order balance.";

    commit({ payments: [...data.payments, { ...item, id: makeId() }] });
    return null;
  };

  const updatePayment: AppContextType["updatePayment"] = (id, item) => {
    const old = data.payments.find((p) => p.id === id);
    const order = data.orders.find((o) => o.id === item.orderId);
    if (!old || !order) return "Payment or order not found.";
    if (item.amount <= 0 || !Number.isFinite(item.amount))
      return "Enter a valid payment amount.";

    const otherPayments = data.payments
      .filter((p) => p.orderId === item.orderId && p.id !== id)
      .reduce((sum, p) => sum + p.amount, 0);

    if (otherPayments + item.amount > order.total)
      return "Payment exceeds the outstanding order balance.";

    commit({
      payments: data.payments.map((p) => (p.id === id ? { ...item, id } : p)),
    });
    return null;
  };

  const deletePayment: AppContextType["deletePayment"] = (id) =>
    commit({ payments: data.payments.filter((p) => p.id !== id) });

  const adjustStock: AppContextType["adjustStock"] = (id, amount) => {
    const product = data.products.find((p) => p.id === id);
    if (!product) return "Product not found.";
    if (!Number.isInteger(amount) || product.stock + amount < 0) {
      return "Stock adjustment would result in an invalid quantity.";
    }
    commit({
      products: data.products.map((p) =>
        p.id === id ? { ...p, stock: p.stock + amount } : p
      ),
    });
    return null;
  };

  const value = useMemo<AppContextType>(
    () => ({
      ...data,
      addProduct,
      updateProduct,
      deleteProduct,
      addCustomer,
      updateCustomer,
      deleteCustomer,
      addOrder,
      updateOrder,
      updateOrderStatus,
      deleteOrder,
      addExpense,
      updateExpense,
      deleteExpense,
      addPayment,
      updatePayment,
      deletePayment,
      adjustStock,
      getOrderPaid,
      getOrderBalance,
    }),
    [data]
  );

  return <Context.Provider value={value}>{children}</Context.Provider>;
}

export function useApp() {
  const context = useContext(Context);
  if (!context) throw new Error("useApp must be used inside AppProvider");
  return context;
}