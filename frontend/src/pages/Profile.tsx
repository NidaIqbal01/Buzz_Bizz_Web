
import { useEffect, useState, type FormEvent } from "react";
import { Save, Trash2, UserRound } from "lucide-react";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";
import ImageUpload from "../components/ImageUpload";

export default function Profile() {
  const { user, updateProfile, deleteAccount } = useAuth();
  const navigate = useNavigate();

  const [form, setForm] = useState({
    name: "",
    email: "",
    businessName: "",
    phone: "",
  });

  const [shopImage, setShopImage] = useState(user?.shopImage ?? "");
  const [shopLogo, setShopLogo] = useState(user?.shopLogo ?? "");

  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    if (user) {
      setForm({
        name: user.name,
        email: user.email,
        businessName: user.businessName,
        phone: user.phone || "",
      });

      setShopImage(user.shopImage ?? "");
      setShopLogo(user.shopLogo ?? "");
    }
  }, [user]);

  function submit(e: FormEvent) {
    e.preventDefault();

    const result = updateProfile({
      ...form,
      shopImage,
      shopLogo,
    });

    setError(result || "");
    setMessage(result ? "" : "Your profile has been updated.");
  }

  function removeAccount() {
    const confirmed = window.confirm(
      "This will permanently delete your demo account and its Buzz Bizz data from this browser. Continue?"
    );

    if (!confirmed) return;

    deleteAccount();
    navigate("/login", { replace: true });
  }

  return (
    <div className="page-stack">
      <div className="page-title-row">
        <div>
          <span className="eyebrow">ACCOUNT SETTINGS</span>
          <h1>Profile & Settings</h1>
          <p>Manage your personal and business information.</p>
        </div>
      </div>

      <section className="panel profile-panel">
        <div className="profile-intro">
          <div className="profile-avatar">
            <UserRound size={28} />
          </div>

          <div>
            <h2>{user?.name}</h2>
            <p>{user?.email}</p>
          </div>
        </div>

        <form className="form-stack" onSubmit={submit}>
          <div className="form-grid">
            <label>
              Full name
              <input
                value={form.name}
                onChange={(e) =>
                  setForm({ ...form, name: e.target.value })
                }
                required
              />
            </label>

            <label>
              Email address
              <input
                type="email"
                value={form.email}
                onChange={(e) =>
                  setForm({ ...form, email: e.target.value })
                }
                required
              />
            </label>

            <label>
              Business name
              <input
                value={form.businessName}
                onChange={(e) =>
                  setForm({ ...form, businessName: e.target.value })
                }
                required
              />
            </label>

            <label>
              Phone number
              <input
                value={form.phone}
                onChange={(e) =>
                  setForm({ ...form, phone: e.target.value })
                }
              />
            </label>
          </div>

          {/* Shop Images */}
          <div className="section-heading">
            <div>
              <h2>Business branding</h2>
              <p>Personalize your business with a cover image and logo.</p>
            </div>
          </div>

          <div className="form-grid">
            <ImageUpload
              label="Shop cover image"
              value={shopImage}
              onChange={setShopImage}
            />

            <ImageUpload
              label="Shop logo"
              value={shopLogo}
              onChange={setShopLogo}
            />
          </div>

          {error && <div className="form-error">{error}</div>}
          {message && <div className="form-success">{message}</div>}

          <div>
            <button className="primary-button" type="submit">
              <Save size={16} /> Save profile
            </button>
          </div>
        </form>
      </section>

      <section className="panel danger-zone">
        <div>
          <h2>Delete account</h2>
          <p>
            Delete your demo account and its locally stored business data.
          </p>
        </div>

        <button className="danger-button" onClick={removeAccount}>
          <Trash2 size={16} /> Delete account
        </button>
      </section>
    </div>
  );
}
