
import SalesChart from "../components/SalesChart";
import { useMemo } from "react";
import {
  Wallet,
  ShoppingBag,
  Package,
  Users,
  AlertTriangle,
  ArrowUpRight,
} from "lucide-react";
import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { useApp } from "../context/AppContext";
import StatCard from "../components/StatCard";

const money = (value: number) =>
  new Intl.NumberFormat("en-PK", {
    style: "currency",
    currency: "PKR",
    maximumFractionDigits: 0,
  }).format(value);

export default function Dashboard() {
  const { user } = useAuth();
  const { products, customers, orders, expenses, payments } = useApp();

  const revenue = useMemo(
    () => payments.reduce((sum, payment) => sum + payment.amount, 0),
    [payments]
  );

  const expenseTotal = expenses.reduce(
    (sum, expense) => sum + expense.amount,
    0
  );

  const profit = revenue - expenseTotal;

  const pending = orders.filter(
    (order) => order.status === "Pending"
  ).length;

  const lowStock = products.filter(
    (product) => product.stock <= product.minStock
  );

  const recentOrders = [...orders]
    .sort((a, b) => b.createdAt.localeCompare(a.createdAt))
    .slice(0, 5);

  const customerName = (id: string) =>
    customers.find((customer) => customer.id === id)?.name ||
    "Unknown customer";

  const productName = (id: string) =>
    products.find((product) => product.id === id)?.name ||
    "Deleted product";

  return (
    <div className="page-stack">
      {/* Welcome Banner */}
      <section
        className={`welcome-banner ${
          user?.shopImage ? "has-shop-cover" : ""
        }`}
        style={
          user?.shopImage
            ? {
                backgroundImage: `linear-gradient(90deg, rgba(30,30,30,0.72), rgba(30,30,30,0.25)), url("${user.shopImage}")`,
                backgroundSize: "cover",
                backgroundPosition: "center",
              }
            : undefined
        }
      >
        <div>
          <span className="eyebrow">BUSINESS OVERVIEW</span>

          <h1>
            Welcome, {user?.name?.split(" ")[0] || "there"}.
          </h1>

          <p>
            Here is what is happening with{" "}
            {user?.businessName || "your business"} today.
          </p>
        </div>

        {user?.shopLogo && (
          <img
            src={user.shopLogo}
            alt="Shop logo"
            className="dashboard-shop-logo"
          />
        )}
      </section>

      <div className="section-heading">
        <div>
          <h2>At a glance</h2>
          <p>Your business performance summary</p>
        </div>
      </div>

      <div className="stats-grid">
        <StatCard
          label="Recorded payments"
          value={money(revenue)}
          detail="Cash received from orders"
          icon={<Wallet />}
          tone="olive"
        />

        <StatCard
          label="Total expenses"
          value={money(expenseTotal)}
          detail="Recorded business costs"
          icon={<ShoppingBag />}
          tone="rose"
        />

        <StatCard
          label="Pending orders"
          value={pending}
          detail={`${orders.length} total orders`}
          icon={<ShoppingBag />}
          tone="gold"
        />

        <StatCard
          label="Products"
          value={products.length}
          detail={`${lowStock.length} low-stock items`}
          icon={<Package />}
          tone="peach"
        />
      </div>

      <div className="stats-grid secondary-stats">
        <StatCard
          label="Estimated cash profit"
          value={money(profit)}
          detail="Payments received minus expenses"
          icon={<Wallet />}
        />

        <StatCard
          label="Customers"
          value={customers.length}
          detail="Saved customer records"
          icon={<Users />}
          tone="gold"
        />

        <StatCard
          label="Inventory units"
          value={products.reduce((sum, p) => sum + p.stock, 0)}
          detail="Current available stock"
          icon={<Package />}
          tone="rose"
        />
      </div>

      {/* Sales Chart */}
      <SalesChart orders={orders} />

      <div className="dashboard-grid">
        {/* Recent Orders */}
        <section className="panel">
          <div className="panel-heading">
            <div>
              <h2>Recent orders</h2>
              <p>Your latest customer orders</p>
            </div>

            <Link to="/orders" className="text-link">
              View all <ArrowUpRight size={15} />
            </Link>
          </div>

          {recentOrders.length === 0 ? (
            <div className="empty-state">
              No orders yet. Create your first order to see it here.
            </div>
          ) : (
            <div className="recent-list">
              {recentOrders.map((order) => (
                <div className="recent-row" key={order.id}>
                  <div className="recent-avatar">
                    {customerName(order.customerId).charAt(0)}
                  </div>

                  <div className="recent-info">
                    <strong>{customerName(order.customerId)}</strong>
                    <small>
                      {productName(order.productId)} · Qty{" "}
                      {order.quantity}
                    </small>
                  </div>

                  <div className="recent-amount">
                    <strong>{money(order.total)}</strong>

                    <span
                      className={`status status-${order.status.toLowerCase()}`}
                    >
                      {order.status}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </section>

        {/* Stock Alerts */}
        <section className="panel">
          <div className="panel-heading">
            <div>
              <h2>Stock alerts</h2>
              <p>Products at or below minimum stock</p>
            </div>

            <Link to="/inventory" className="text-link">
              Inventory <ArrowUpRight size={15} />
            </Link>
          </div>

          {lowStock.length === 0 ? (
            <div className="empty-state">
              All products are above their minimum stock levels.
            </div>
          ) : (
            lowStock.map((product) => (
              <div className="stock-alert" key={product.id}>
                <div className="stock-alert-icon">
                  <AlertTriangle size={17} />
                </div>

                <div className="stock-alert-info">
                  <strong>{product.name}</strong>
                  <small>Minimum: {product.minStock} units</small>
                </div>

                <span className="stock-count">
                  {product.stock} left
                </span>
              </div>
            ))
          )}
        </section>
      </div>
    </div>
  );
}
