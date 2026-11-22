
import { useMemo, useState, type FormEvent } from "react";
import { Plus, Pencil, Trash2, Search, Wallet } from "lucide-react";
import { useApp, type Expense, type Payment } from "../context/AppContext";
import Modal from "../components/Modal";

const expenseBlank = {
  title: "", category: "Raw materials", amount: 0,
  date: new Date().toISOString().slice(0, 10), notes: "",
};
const paymentBlank = {
  orderId: "", amount: 0, method: "Cash",
  date: new Date().toISOString().slice(0, 10), notes: "",
};

export default function Finance() {
  const {
    expenses, orders, customers, products, payments,
    addExpense, updateExpense, deleteExpense,
    addPayment, updatePayment, deletePayment,
    getOrderPaid, getOrderBalance,
  } = useApp();

  const [tab, setTab] = useState<"expenses" | "payments">("expenses");
  const [search, setSearch] = useState("");
  const [modal, setModal] = useState<"expense" | "payment" | null>(null);
  const [editing, setEditing] = useState<string | null>(null);
  const [expenseForm, setExpenseForm] = useState(expenseBlank);
  const [paymentForm, setPaymentForm] = useState(paymentBlank);
  const [error, setError] = useState("");

  const expenseTotal = expenses.reduce((sum, e) => sum + e.amount, 0);
  const paymentTotal = payments.reduce((sum, p) => sum + p.amount, 0);
  const filteredExpenses = useMemo(() => expenses.filter((e) =>
    `${e.title} ${e.category}`.toLowerCase().includes(search.toLowerCase())
  ), [expenses, search]);
  const filteredPayments = useMemo(() => payments.filter((p) => {
    const order = orders.find((o) => o.id === p.orderId);
    const customer = customers.find((c) => c.id === order?.customerId)?.name || "";
    return `${customer} ${p.method} ${p.notes}`.toLowerCase().includes(search.toLowerCase());
  }), [payments, orders, customers, search]);

  function openExpense(item?: Expense) {
    setEditing(item?.id || null);
    setExpenseForm(item ? {
      title: item.title, category: item.category, amount: item.amount,
      date: item.date, notes: item.notes,
    } : expenseBlank);
    setError(""); setModal("expense");
  }

  function openPayment(item?: Payment) {
    setEditing(item?.id || null);
    setPaymentForm(item ? {
      orderId: item.orderId, amount: item.amount, method: item.method,
      date: item.date, notes: item.notes,
    } : paymentBlank);
    setError(""); setModal("payment");
  }

  function submitExpense(e: FormEvent) {
    e.preventDefault();
    if (!expenseForm.title.trim() || expenseForm.amount <= 0) {
      setError("Enter an expense title and an amount greater than zero.");
      return;
    }
    if (editing) updateExpense(editing, expenseForm);
    else addExpense(expenseForm);
    setModal(null);
  }

  function submitPayment(e: FormEvent) {
    e.preventDefault();
    const result = editing
      ? updatePayment(editing, paymentForm)
      : addPayment(paymentForm);
    if (result) { setError(result); return; }
    setModal(null);
  }

  function removeExpense(id: string) {
    if (window.confirm("Delete this expense?")) deleteExpense(id);
  }
  function removePayment(id: string) {
    if (window.confirm("Delete this payment?")) deletePayment(id);
  }

  return (
    <div className="page-stack">
      <div className="page-title-row">
        <div><span className="eyebrow">BUSINESS FINANCES</span><h1>Expenses & Payments</h1><p>Track outgoing costs, customer payments, and outstanding balances.</p></div>
      </div>

      <div className="stats-grid">
        <div className="stat-card stat-rose"><div className="stat-top">Total expenses <Wallet size={18} /></div><strong>Rs. {expenseTotal.toLocaleString("en-PK")}</strong><small>Recorded business costs</small></div>
        <div className="stat-card stat-olive"><div className="stat-top">Payments received <Wallet size={18} /></div><strong>Rs. {paymentTotal.toLocaleString("en-PK")}</strong><small>Cash received from customers</small></div>
        <div className="stat-card stat-gold"><div className="stat-top">Outstanding balances <Wallet size={18} /></div><strong>Rs. {orders.reduce((sum, o) => sum + getOrderBalance(o.id), 0).toLocaleString("en-PK")}</strong><small>Unpaid order amounts</small></div>
      </div>

      <section className="panel">
        <div className="finance-tabs">
          <button className={tab === "expenses" ? "selected" : ""} onClick={() => setTab("expenses")}>Expenses</button>
          <button className={tab === "payments" ? "selected" : ""} onClick={() => setTab("payments")}>Customer payments</button>
        </div>
        <div className="toolbar">
          <div className="search-box"><Search size={17} /><input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search records..." /></div>
          <button className="primary-button" onClick={() => tab === "expenses" ? openExpense() : openPayment()}><Plus size={16} /> {tab === "expenses" ? "Add expense" : "Record payment"}</button>
        </div>

        {tab === "expenses" ? (
          <div className="table-wrap"><table className="data-table">
            <thead><tr><th>Expense</th><th>Category</th><th>Date</th><th>Amount</th><th>Actions</th></tr></thead>
            <tbody>
              {filteredExpenses.map((e) => <tr key={e.id}>
                <td><strong>{e.title}</strong><small className="cell-sub">{e.notes}</small></td><td>{e.category}</td><td>{e.date}</td><td>Rs. {e.amount.toLocaleString("en-PK")}</td>
                <td className="actions-cell"><button className="icon-button" onClick={() => openExpense(e)}><Pencil size={16} /></button><button className="danger-icon" onClick={() => removeExpense(e.id)}><Trash2 size={16} /></button></td>
              </tr>)}
              {filteredExpenses.length === 0 && <tr><td colSpan={5} className="empty-cell">No expenses recorded.</td></tr>}
            </tbody>
          </table></div>
        ) : (
          <>
            <div className="table-wrap"><table className="data-table">
              <thead><tr><th>Order / Customer</th><th>Method</th><th>Date</th><th>Paid</th><th>Actions</th></tr></thead>
              <tbody>
                {filteredPayments.map((p) => {
                  const order = orders.find((o) => o.id === p.orderId);
                  const customer = customers.find((c) => c.id === order?.customerId);
                  return <tr key={p.id}>
                    <td><strong>{customer?.name || "Unknown customer"}</strong><small className="cell-sub">Order #{p.orderId.slice(0, 8)}</small></td><td>{p.method}</td><td>{p.date}</td><td>Rs. {p.amount.toLocaleString("en-PK")}</td>
                    <td className="actions-cell"><button className="icon-button" onClick={() => openPayment(p)}><Pencil size={16} /></button><button className="danger-icon" onClick={() => removePayment(p.id)}><Trash2 size={16} /></button></td>
                  </tr>;
                })}
                {filteredPayments.length === 0 && <tr><td colSpan={5} className="empty-cell">No payments recorded.</td></tr>}
              </tbody>
            </table></div>
            <h3 className="subsection-title">Order balances</h3>
            <div className="table-wrap"><table className="data-table">
              <thead><tr><th>Order</th><th>Customer</th><th>Order total</th><th>Paid</th><th>Balance</th></tr></thead>
              <tbody>{orders.map((o) => <tr key={o.id}>
                <td>#{o.id.slice(0, 8)}</td><td>{customers.find((c) => c.id === o.customerId)?.name || "Unknown"}</td>
                <td>Rs. {o.total.toLocaleString("en-PK")}</td><td>Rs. {getOrderPaid(o.id).toLocaleString("en-PK")}</td>
                <td><strong>Rs. {getOrderBalance(o.id).toLocaleString("en-PK")}</strong></td>
              </tr>)}
              {orders.length === 0 && <tr><td colSpan={5} className="empty-cell">Create an order to see its balance.</td></tr>}</tbody>
            </table></div>
          </>
        )}
      </section>

      {modal === "expense" && <Modal title={editing ? "Edit expense" : "Add expense"} onClose={() => setModal(null)}>
        <form className="form-stack" onSubmit={submitExpense}>
          <label>Expense title<input value={expenseForm.title} onChange={(e) => setExpenseForm({ ...expenseForm, title: e.target.value })} required /></label>
          <label>Category<select value={expenseForm.category} onChange={(e) => setExpenseForm({ ...expenseForm, category: e.target.value })}>
            {["Raw materials", "Packaging", "Labour", "Delivery", "Rent", "Utilities", "Other"].map((c) => <option key={c}>{c}</option>)}
          </select></label>
          <label>Amount (Rs.)<input type="number" min="0.01" step="0.01" value={expenseForm.amount} onChange={(e) => setExpenseForm({ ...expenseForm, amount: Number(e.target.value) })} required /></label>
          <label>Date<input type="date" value={expenseForm.date} onChange={(e) => setExpenseForm({ ...expenseForm, date: e.target.value })} required /></label>
          <label>Notes<input value={expenseForm.notes} onChange={(e) => setExpenseForm({ ...expenseForm, notes: e.target.value })} /></label>
          {error && <div className="form-error">{error}</div>}
          <button className="primary-button">Save expense</button>
        </form>
      </Modal>}

      {modal === "payment" && <Modal title={editing ? "Edit payment" : "Record customer payment"} onClose={() => setModal(null)}>
        <form className="form-stack" onSubmit={submitPayment}>
          <label>Order<select value={paymentForm.orderId} onChange={(e) => setPaymentForm({ ...paymentForm, orderId: e.target.value })} required>
            <option value="">Select order</option>
            {orders.map((o) => <option key={o.id} value={o.id}>#{o.id.slice(0, 8)} — {customers.find((c) => c.id === o.customerId)?.name || "Customer"} — Balance Rs. {(getOrderBalance(o.id) + (editing && payments.find((p) => p.id === editing)?.orderId === o.id ? payments.find((p) => p.id === editing)!.amount : 0)).toLocaleString("en-PK")}</option>)}
          </select></label>
          <label>Amount (Rs.)<input type="number" min="0.01" step="0.01" value={paymentForm.amount} onChange={(e) => setPaymentForm({ ...paymentForm, amount: Number(e.target.value) })} required /></label>
          <label>Payment method<select value={paymentForm.method} onChange={(e) => setPaymentForm({ ...paymentForm, method: e.target.value })}>
            {["Cash", "Bank transfer", "Card", "Mobile wallet", "Other"].map((m) => <option key={m}>{m}</option>)}
          </select></label>
          <label>Date<input type="date" value={paymentForm.date} onChange={(e) => setPaymentForm({ ...paymentForm, date: e.target.value })} required /></label>
          <label>Notes<input value={paymentForm.notes} onChange={(e) => setPaymentForm({ ...paymentForm, notes: e.target.value })} /></label>
          {error && <div className="form-error">{error}</div>}
          <button className="primary-button">Save payment</button>
        </form>
      </Modal>}
    </div>
  );
}
