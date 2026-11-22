
import { useMemo, useState } from "react";
import { Search, Boxes, AlertTriangle, Plus, Minus } from "lucide-react";
import { useApp } from "../context/AppContext";

export default function Inventory() {
  const { products, adjustStock } = useApp();
  const [query, setQuery] = useState("");
  const [adjustments, setAdjustments] = useState<Record<string, string>>({});
  const [error, setError] = useState("");

  const filtered = useMemo(() => products.filter((p) =>
    `${p.name} ${p.category}`.toLowerCase().includes(query.toLowerCase())
  ), [products, query]);

  function adjust(id: string, direction: 1 | -1) {
    const amount = Number(adjustments[id]);
    if (!Number.isInteger(amount) || amount <= 0) {
      setError("Enter a positive whole number for the adjustment.");
      return;
    }
    const result = adjustStock(id, amount * direction);
    setError(result || "");
    if (!result) setAdjustments((current) => ({ ...current, [id]: "" }));
  }

  return (
    <div className="page-stack">
      <div className="page-title-row">
        <div><span className="eyebrow">STOCK CONTROL</span><h1>Inventory</h1><p>Monitor available stock and low-stock products.</p></div>
        <div className="mini-total"><Boxes size={18} /> {products.reduce((sum, p) => sum + p.stock, 0)} units available</div>
      </div>

      <div className="inventory-summary">
        <div className="summary-tile"><span>Total products</span><strong>{products.length}</strong></div>
        <div className="summary-tile"><span>Low stock</span><strong>{products.filter((p) => p.stock <= p.minStock).length}</strong></div>
        <div className="summary-tile"><span>Out of stock</span><strong>{products.filter((p) => p.stock === 0).length}</strong></div>
      </div>

      <section className="panel">
        <div className="toolbar">
          <div className="search-box"><Search size={17} /><input value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Search inventory..." /></div>
        </div>
        {error && <div className="form-error inventory-error">{error}</div>}
        <div className="inventory-list">
          {filtered.map((p) => {
            const low = p.stock <= p.minStock;
            return (
              <div className="inventory-row" key={p.id}>
                <div className="inventory-product-icon"><Boxes size={20} /></div>
                <div className="inventory-product">
                  <strong>{p.name}</strong><small>{p.category} · Minimum: {p.minStock}</small>
                </div>
                <div className="inventory-level">
                  <strong>{p.stock}</strong><small>available</small>
                </div>
                <span className={low ? "stock-warning" : "stock-healthy"}>
                  {low ? <><AlertTriangle size={14} /> Low stock</> : "In stock"}
                </span>
                <div className="stock-adjust">
                  <input aria-label={`Adjustment for ${p.name}`} type="number" min="1" step="1" placeholder="Qty" value={adjustments[p.id] || ""} onChange={(e) => setAdjustments({ ...adjustments, [p.id]: e.target.value })} />
                  <button title="Add stock" onClick={() => adjust(p.id, 1)}><Plus size={15} /></button>
                  <button title="Remove stock" onClick={() => adjust(p.id, -1)}><Minus size={15} /></button>
                </div>
              </div>
            );
          })}
          {filtered.length === 0 && <div className="empty-state">No inventory records found.</div>}
        </div>
      </section>
    </div>
  );
}
