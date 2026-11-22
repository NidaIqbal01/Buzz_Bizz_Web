
import { useMemo, useState, type FormEvent } from "react";
import { Plus, Search, Pencil, Trash2, UserRound, History } from "lucide-react";
import { useApp, type Customer } from "../context/AppContext";
import Modal from "../components/Modal";

const blank = { name: "", phone: "", email: "" };

export default function Customers() {
  const { customers, orders, products, addCustomer, updateCustomer, deleteCustomer } = useApp();
  const [query, setQuery] = useState("");
  const [modal, setModal] = useState(false);
  const [editing, setEditing] = useState<string | null>(null);
  const [historyCustomer, setHistoryCustomer] = useState<Customer | null>(null);
  const [form, setForm] = useState(blank);
  const [error, setError] = useState("");

  const filtered = useMemo(() => customers.filter((c) =>
    `${c.name} ${c.phone} ${c.email}`.toLowerCase().includes(query.toLowerCase())
  ), [customers, query]);

  function openAdd() {
    setEditing(null); setForm(blank); setError(""); setModal(true);
  }

  function openEdit(c: Customer) {
    setEditing(c.id);
    setForm({ name: c.name, phone: c.phone, email: c.email });
    setError(""); setModal(true);
  }

  function submit(e: FormEvent) {
    e.preventDefault();
    if (!form.name.trim()) {
      setError("Customer name is required.");
      return;
    }
    if (form.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) {
      setError("Enter a valid email address.");
      return;
    }
    if (editing) updateCustomer(editing, form);
    else addCustomer(form);
    setModal(false);
  }

  function remove(id: string) {
    if (!window.confirm("Delete this customer?")) return;
    const result = deleteCustomer(id);
    if (result) window.alert(result);
  }

  return (
    <div className="page-stack">
      <div className="page-title-row">
        <div><span className="eyebrow">RELATIONSHIPS</span><h1>Customers</h1><p>Maintain customer contact details and order history.</p></div>
        <button className="primary-button" onClick={openAdd}><Plus size={17} /> Add customer</button>
      </div>

      <section className="panel">
        <div className="toolbar">
          <div className="search-box"><Search size={17} /><input value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Search customers..." /></div>
          <span className="record-count">{filtered.length} customers</span>
        </div>
        <div className="customer-grid">
          {filtered.map((c) => {
            const customerOrders = orders.filter((o) => o.customerId === c.id);
            return (
              <article className="customer-card" key={c.id}>
                <div className="customer-card-top">
                  <div className="customer-avatar"><UserRound size={21} /></div>
                  <div><h3>{c.name}</h3><span>{customerOrders.length} orders</span></div>
                </div>
                <div className="customer-contact"><span>{c.phone || "No phone added"}</span><span>{c.email || "No email added"}</span></div>
                <div className="customer-card-actions">
                  <button className="secondary-button" onClick={() => setHistoryCustomer(c)}><History size={15} /> Order history</button>
                  <button className="icon-button" onClick={() => openEdit(c)} title="Edit customer"><Pencil size={16} /></button>
                  <button className="danger-icon" onClick={() => remove(c.id)} title="Delete customer"><Trash2 size={16} /></button>
                </div>
              </article>
            );
          })}
          {filtered.length === 0 && <div className="empty-state full-span">No customers found.</div>}
        </div>
      </section>

      {modal && <Modal title={editing ? "Edit customer" : "Add customer"} onClose={() => setModal(false)}>
        <form className="form-stack" onSubmit={submit}>
          <label>Full name<input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} required /></label>
          <label>Phone number<input value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} placeholder="+92..." /></label>
          <label>Email address<input type="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} /></label>
          {error && <div className="form-error">{error}</div>}
          <button className="primary-button" type="submit">{editing ? "Save changes" : "Add customer"}</button>
        </form>
      </Modal>}

      {historyCustomer && <Modal title={`${historyCustomer.name}'s order history`} onClose={() => setHistoryCustomer(null)}>
        {orders.filter((o) => o.customerId === historyCustomer.id).length === 0 ? (
          <div className="empty-state">This customer has no orders yet.</div>
        ) : (
          <div className="history-list">
            {orders.filter((o) => o.customerId === historyCustomer.id).map((o) => (
              <div className="history-row" key={o.id}>
                <div><strong>{products.find((p) => p.id === o.productId)?.name || "Product unavailable"}</strong><small>{new Date(o.createdAt).toLocaleDateString()} · Quantity {o.quantity}</small></div>
                <div><strong>Rs. {o.total.toLocaleString("en-PK")}</strong><small>{o.status}</small></div>
              </div>
            ))}
          </div>
        )}
      </Modal>}
    </div>
  );
}
