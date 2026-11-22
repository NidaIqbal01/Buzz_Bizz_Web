
import { useMemo, useState, type FormEvent } from "react";
import { Plus, Search, Pencil, Trash2 } from "lucide-react";
import {
  useApp,
  type Order,
  type OrderStatus,
} from "../context/AppContext";
import Modal from "../components/Modal";

const empty = {
  customerId: "",
  productId: "",
  quantity: 1,
};

const allowedTransitions: Record<OrderStatus, OrderStatus[]> = {
  Pending: ["Confirmed", "Cancelled"],
  Confirmed: ["Processing", "Cancelled"],
  Processing: ["Delivered", "Cancelled"],
  Delivered: [],
  Cancelled: [],
};

export default function Orders() {
  const {
    orders,
    customers,
    products,
    addOrder,
    updateOrder,
    updateOrderStatus,
    deleteOrder,
  } = useApp();

  const [query, setQuery] = useState("");
  const [modal, setModal] = useState(false);
  const [editing, setEditing] = useState<string | null>(null);
  const [form, setForm] = useState(empty);
  const [error, setError] = useState("");
  const [statusErrors, setStatusErrors] = useState<Record<string, string>>({});

  const filtered = useMemo(
    () =>
      orders.filter((o) => {
        const customer =
          customers.find((c) => c.id === o.customerId)?.name || "";
        const product =
          products.find((p) => p.id === o.productId)?.name || "";

        return `${customer} ${product} ${o.status}`
          .toLowerCase()
          .includes(query.toLowerCase());
      }),
    [orders, customers, products, query]
  );

  function openAdd() {
    setEditing(null);
    setForm(empty);
    setError("");
    setModal(true);
  }

  function openEdit(order: Order) {
    setEditing(order.id);
    setForm({
      customerId: order.customerId,
      productId: order.productId,
      quantity: order.quantity,
    });
    setError("");
    setModal(true);
  }

  function submit(e: FormEvent) {
    e.preventDefault();

    const result = editing
      ? updateOrder(editing, form)
      : addOrder({ ...form, total: 0 });

    if (result) {
      setError(result);
      return;
    }

    setModal(false);
  }

  function changeStatus(id: string, status: OrderStatus) {
    const result = updateOrderStatus(id, status);

    if (result) {
      setStatusErrors((current) => ({
        ...current,
        [id]: result,
      }));
      return;
    }

    setStatusErrors((current) => {
      const updated = { ...current };
      delete updated[id];
      return updated;
    });
  }

  function remove(id: string) {
    if (!window.confirm("Delete this order?")) return;

    const result = deleteOrder(id);

    if (result) {
      window.alert(result);
    }
  }

  return (
    <div className="page-stack">
      <div className="page-title-row">
        <div>
          <span className="eyebrow">SALES MANAGEMENT</span>
          <h1>Orders</h1>
          <p>Create orders and monitor their fulfilment status.</p>
        </div>

        <button className="primary-button" onClick={openAdd}>
          <Plus size={17} /> Create order
        </button>
      </div>

      <section className="panel">
        <div className="toolbar">
          <div className="search-box">
            <Search size={17} />
            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search customer, product, or status..."
            />
          </div>

          <span className="record-count">
            {filtered.length} orders
          </span>
        </div>

        <div className="table-wrap">
          <table className="data-table">
            <thead>
              <tr>
                <th>Order</th>
                <th>Customer</th>
                <th>Product</th>
                <th>Qty</th>
                <th>Total</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>

            <tbody>
              {filtered.map((o) => {
                const customer = customers.find(
                  (c) => c.id === o.customerId
                );

                const product = products.find(
                  (p) => p.id === o.productId
                );

                const nextStatuses = allowedTransitions[o.status];

                return (
                  <tr key={o.id}>
                    <td>
                      <strong>#{o.id.slice(0, 8)}</strong>
                      <small className="cell-sub">
                        {new Date(o.createdAt).toLocaleDateString()}
                      </small>
                    </td>

                    <td>{customer?.name || "Unknown"}</td>

                    <td>{product?.name || "Deleted product"}</td>

                    <td>{o.quantity}</td>

                    <td>
                      Rs. {o.total.toLocaleString("en-PK")}
                    </td>

                    <td>
                      <select
                        className="status-select"
                        value={o.status}
                        disabled={nextStatuses.length === 0}
                        onChange={(e) =>
                          changeStatus(
                            o.id,
                            e.target.value as OrderStatus
                          )
                        }
                      >
                        <option value={o.status}>
                          {o.status}
                        </option>

                        {nextStatuses.map((status) => (
                          <option key={status} value={status}>
                            {status}
                          </option>
                        ))}
                      </select>

                      {statusErrors[o.id] && (
                        <small className="form-error">
                          {statusErrors[o.id]}
                        </small>
                      )}
                    </td>

                    <td className="actions-cell">
                      {o.status === "Pending" && (
                        <button
                          className="icon-button"
                          title="Edit order"
                          onClick={() => openEdit(o)}
                        >
                          <Pencil size={16} />
                        </button>
                      )}

                      <button
                        className="danger-icon"
                        title="Delete order"
                        onClick={() => remove(o.id)}
                      >
                        <Trash2 size={16} />
                      </button>
                    </td>
                  </tr>
                );
              })}

              {filtered.length === 0 && (
                <tr>
                  <td colSpan={7} className="empty-cell">
                    No orders found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </section>

      {modal && (
        <Modal
          title={editing ? "Edit pending order" : "Create order"}
          onClose={() => setModal(false)}
        >
          <form className="form-stack" onSubmit={submit}>
            <label>
              Customer
              <select
                value={form.customerId}
                onChange={(e) =>
                  setForm({
                    ...form,
                    customerId: e.target.value,
                  })
                }
                required
              >
                <option value="">Select customer</option>

                {customers.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.name}
                  </option>
                ))}
              </select>
            </label>

            <label>
              Product
              <select
                value={form.productId}
                onChange={(e) =>
                  setForm({
                    ...form,
                    productId: e.target.value,
                  })
                }
                required
              >
                <option value="">Select product</option>

                {products.map((p) => (
                  <option key={p.id} value={p.id}>
                    {p.name} — Rs. {p.price}
                  </option>
                ))}
              </select>
            </label>

            <label>
              Quantity
              <input
                type="number"
                min="1"
                step="1"
                value={form.quantity}
                onChange={(e) =>
                  setForm({
                    ...form,
                    quantity: Number(e.target.value),
                  })
                }
                required
              />
            </label>

            {form.productId && (
              <div className="calculated-total">
                Estimated total: Rs.{" "}
                {(
                  (products.find(
                    (p) => p.id === form.productId
                  )?.price || 0) * form.quantity
                ).toLocaleString("en-PK")}
              </div>
            )}

            {error && (
              <div className="form-error">{error}</div>
            )}

            <button className="primary-button" type="submit">
              {editing ? "Save order" : "Create order"}
            </button>
          </form>
        </Modal>
      )}
    </div>
  );
}
