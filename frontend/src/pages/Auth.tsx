import logo from "../assets/image.png";
import { useState, type FormEvent } from "react";
import { useNavigate, Navigate } from "react-router-dom";
import { Eye, EyeOff, ArrowRight } from "lucide-react";
import { useAuth } from "../context/AuthContext";

export default function Auth() {
  const { user, login, register } = useAuth();
  const navigate = useNavigate();
  const [mode, setMode] = useState<"login" | "register">("login");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);
  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    businessName: "",
  });

  if (user) return <Navigate to="/" replace />;

  function change(field: keyof typeof form, value: string) {
    setForm((current) => ({ ...current, [field]: value }));
    setError("");
  }

  async function submit(event: FormEvent) {
    event.preventDefault();
    setBusy(true);
    setError("");

    const result: string | null =
      mode === "login"
        ? await login(form.email, form.password)
        : await register(form);

    setBusy(false);
    if (result) {
      setError(result);
    } else {
      navigate("/", { replace: true });
    }
  }

  return (
    <div className="auth-page">
      <div className="auth-decoration auth-decoration-one" />
      <div className="auth-decoration auth-decoration-two" />
      <div className="auth-card">
        <div className="auth-brand">
          <img src={logo} alt="Buzz Bizz" className="auth-logo" />
          <div>
            <h1>Buzz Bizz</h1>
            <p>Your Business, Simplified.</p>
          </div>
        </div>

        <div className="auth-intro">
          <span className="eyebrow">BUSINESS WORKSPACE</span>
          <h2>{mode === "login" ? "Welcome back." : "Build your workspace."}</h2>
          <p>
            {mode === "login"
              ? "Sign in to manage your business in one place."
              : "Create your account to get started with Buzz Bizz."}
          </p>
        </div>

        <div className="auth-tabs">
          <button
            type="button"
            className={mode === "login" ? "selected" : ""}
            onClick={() => {
              setMode("login");
              setError("");
            }}
          >
            Sign in
          </button>
          <button
            type="button"
            className={mode === "register" ? "selected" : ""}
            onClick={() => {
              setMode("register");
              setError("");
            }}
          >
            Create account
          </button>
        </div>

        <form onSubmit={submit} className="form-stack">
          {mode === "register" && (
            <>
              <label>
                Full name
                <input
                  value={form.name}
                  onChange={(e) => change("name", e.target.value)}
                  placeholder="Your name"
                  required
                />
              </label>
              <label>
                Business name
                <input
                  value={form.businessName}
                  onChange={(e) => change("businessName", e.target.value)}
                  placeholder="Your business name"
                  required
                />
              </label>
            </>
          )}
          <label>
            Email address
            <input
              type="email"
              autoComplete="email"
              value={form.email}
              onChange={(e) => change("email", e.target.value)}
              placeholder="you@example.com"
              required
            />
          </label>
          <label>
            Password
            <div className="password-field">
              <input
                type={showPassword ? "text" : "password"}
                autoComplete={mode === "login" ? "current-password" : "new-password"}
                value={form.password}
                onChange={(e) => change("password", e.target.value)}
                placeholder="At least 8 characters"
                minLength={8}
                required
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                aria-label="Toggle password visibility"
              >
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
          </label>

          {error && (
            <div className="form-error" role="alert">
              {error}
            </div>
          )}

          <button className="primary-button auth-submit" disabled={busy}>
            {busy ? "Please wait..." : mode === "login" ? "Sign in" : "Create account"}
            <ArrowRight size={17} />
          </button>
        </form>
        <p className="auth-footnote">Your business data is saved in MySQL for your account.</p>
      </div>
    </div>
  );
}