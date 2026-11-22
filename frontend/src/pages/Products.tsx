import { useMemo, useState, type FormEvent } from "react";
import {
  Plus,
  Search,
  Pencil,
  Trash2,
  ImagePlus,
} from "lucide-react";
import { useApp, type Product } from "../context/AppContext";
import Modal from "../components/Modal";
import ImageUpload from "../components/ImageUpload";

const blank = {
  name: "",
  category: "",
  cost: 0,
  price: 0,
  stock: 0,
  minStock: 5,
  image: "",
};

export default function Products() {
  const { products, addProduct, updateProduct, deleteProduct } = useApp();

  const [query, setQuery] = useState("");
  const [modal, setModal] = useState(false);
  const [editing, setEditing] = useState<string | null>(null);
  const [form, setForm] = useState(blank);
  const [error, setError] = useState("");

  const filtered = useMemo(
    () =>
      products.filter((product) =>
        `${product.name} ${product.category}`
          .toLowerCase()
          .includes(query.toLowerCase())
      ),
    [products, query]
  );

  function openAdd() {
    setEditing(null);
    setForm({ ...blank });
    setError("");
    setModal(true);
  }

  function openEdit(product: Product) {
    setEditing(product.id);

    setForm({
      name: product.name,
      category: product.category,
      cost: product.cost,
      price: product.price,
      stock: product.stock,
      minStock: product.minStock,
      image: product.image || "",
    });

    setError("");
    setModal(true);
  }

  function submit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError("");

    if (!form.name.trim()) {
      setError("Please enter a product name.");
      return;
    }

    if (!form.category.trim()) {
      setError("Please enter a product category.");
      return;
    }

    if (!form.image.trim()) {
      setError("Please upload a product photograph.");
      return;
    }

    const numericValues = [
      form.cost,
      form.price,
      form.stock,
      form.minStock,
    ];

    if (
      numericValues.some(
        (value) => !Number.isFinite(value) || value < 0
      )
    ) {
      setError("All numeric fields must contain valid non-negative values.");
      return;
    }

    if (!Number.isInteger(form.stock) || !Number.isInteger(form.minStock)) {
      setError("Stock quantities must be whole numbers.");
      return;
    }

    if (form.stock < form.minStock) {
      setError(
        "Stock quantity cannot be lower than the minimum stock level."
      );
      return;
    }

    if (form.cost <= 0) {
      setError("Cost price must be greater than zero.");
      return;
    }

    if (form.price <= 0) {
      setError("Selling price must be greater than zero.");
      return;
    }

    if (form.price < form.cost) {
      setError("Selling price cannot be lower than product cost.");
      return;
    }

    const productData = {
      ...form,
      name: form.name.trim(),
      category: form.category.trim(),
    };

    if (editing) {
      updateProduct(editing, productData);
    } else {
      addProduct(productData);
    }

    setModal(false);
    setForm({ ...blank });
    setEditing(null);
  }

  function remove(id: string) {
    if (!window.confirm("Are you sure you want to delete this product?")) {
      return;
    }

    const result = deleteProduct(id);

    if (result) {
      window.alert(result);
    }
  }

  return (
    <div className="page-stack">
      {/* Page heading */}
      <div className="page-title-row">
        <div>
          <span className="eyebrow">CATALOGUE</span>
          <h1>Products</h1>
          <p>Manage your products, categories, and selling prices.</p>
        </div>

        <button className="primary-button" onClick={openAdd}>
          <Plus size={17} />
          Add product
        </button>
      </div>

      {/* Products section */}
      <section className="panel">
        <div className="toolbar">
          <div className="search-box">
            <Search size={17} />

            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search products or categories..."
            />
          </div>

          <span className="record-count">
            {filtered.length} products
          </span>
        </div>

        {/* Product cards */}
        <div className="product-grid">
          {filtered.map((product) => (
            <article className="product-card" key={product.id}>
              {/* Product image */}
              <div className="product-image">
                {product.image ? (
                  <img
                    src={product.image}
                    alt={product.name}
                  />
                ) : (
                  <ImagePlus size={35} />
                )}
              </div>

              {/* Product information */}
              <div className="product-card-body">
                <span className="product-category">
                  {product.category}
                </span>

                <h3>{product.name}</h3>

                <div className="product-price">
                  Rs. {product.price.toLocaleString("en-PK")}
                </div>

                <div className="product-meta">
                  <span>
                    Cost: Rs. {product.cost.toLocaleString("en-PK")}
                  </span>

                  <span>
                    {product.stock} in stock
                  </span>
                </div>

                <div className="product-meta">
                  <span>
                    Minimum stock: {product.minStock}
                  </span>

                  <span>
                    Profit/unit: Rs.{" "}
                    {(product.price - product.cost).toLocaleString("en-PK")}
                  </span>
                </div>

                {/* Actions */}
                <div className="product-actions">
                  <button
                    className="secondary-button"
                    onClick={() => openEdit(product)}
                  >
                    <Pencil size={15} />
                    Edit
                  </button>

                  <button
                    className="danger-icon"
                    onClick={() => remove(product.id)}
                    aria-label={`Delete ${product.name}`}
                    title="Delete product"
                  >
                    <Trash2 size={17} />
                  </button>
                </div>
              </div>
            </article>
          ))}

          {filtered.length === 0 && (
            <div className="empty-state full-span">
              {query
                ? "No matching products. Try another search."
                : "No products added yet. Click Add product to get started."}
            </div>
          )}
        </div>
      </section>

      {/* Add / Edit product modal */}
      {modal && (
        <Modal
          title={editing ? "Edit product" : "Add product"}
          onClose={() => setModal(false)}
        >
          <form className="form-stack" onSubmit={submit}>
            <label>
              Product name

              <input
                type="text"
                value={form.name}
                onChange={(e) =>
                  setForm({ ...form, name: e.target.value })
                }
                placeholder="Enter product name"
                required
              />
            </label>

            <label>
              Category

              <input
                type="text"
                value={form.category}
                onChange={(e) =>
                  setForm({ ...form, category: e.target.value })
                }
                placeholder="e.g. Clothing"
                required
              />
            </label>

            <div className="form-grid">
              <label>
                Cost price (Rs.)

                <input
                  type="number"
                  min="0.01"
                  step="0.01"
                  value={form.cost}
                  onChange={(e) =>
                    setForm({ ...form, cost: Number(e.target.value) })
                  }
                  required
                />
              </label>

              <label>
                Selling price (Rs.)

                <input
                  type="number"
                  min="0.01"
                  step="0.01"
                  value={form.price}
                  onChange={(e) =>
                    setForm({ ...form, price: Number(e.target.value) })
                  }
                  required
                />
              </label>

              <label>
                Stock quantity

                <input
                  type="number"
                  min="0"
                  step="1"
                  value={form.stock}
                  onChange={(e) =>
                    setForm({ ...form, stock: Number(e.target.value) })
                  }
                  required
                />
              </label>

              <label>
                Minimum stock

                <input
                  type="number"
                  min="0"
                  step="1"
                  value={form.minStock}
                  onChange={(e) =>
                    setForm({ ...form, minStock: Number(e.target.value) })
                  }
                  required
                />
              </label>
            </div>

            {/* Product image upload */}
            <ImageUpload
              label="Product photograph (required)"
              value={form.image}
              onChange={(image) =>
                setForm({ ...form, image })
              }
            />

            {error && (
              <div className="form-error">
                {error}
              </div>
            )}

            <button className="primary-button" type="submit">
              {editing ? "Save changes" : "Add product"}
            </button>
          </form>
        </Modal>
      )}
    </div>
  );
}