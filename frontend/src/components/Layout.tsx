import logo from "../assets/image.png";
import { NavLink, Outlet, useNavigate } from "react-router-dom";
import {
  LayoutDashboard, Package, Boxes, ShoppingBag, Users,
  Wallet, Calculator, UserRound, LogOut, Menu, X,
} from "lucide-react";
import { useState } from "react";
import { useAuth } from "../context/AuthContext";

const links = [
  { to: "/", label: "Dashboard", icon: LayoutDashboard },
  { to: "/products", label: "Products", icon: Package },
  { to: "/inventory", label: "Inventory", icon: Boxes },
  { to: "/orders", label: "Orders", icon: ShoppingBag },
  { to: "/customers", label: "Customers", icon: Users },
  { to: "/finance", label: "Expenses & Payments", icon: Wallet },
  { to: "/pricing", label: "Pricing Calculator", icon: Calculator },
  { to: "/profile", label: "Profile & Settings", icon: UserRound },
];

export default function Layout() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [mobileOpen, setMobileOpen] = useState(false);

  function handleLogout() {
    logout();
    navigate("/login");
  }

  return (
    <div className="app-shell">
      {mobileOpen && <button className="mobile-scrim" onClick={() => setMobileOpen(false)} />}
      <aside className={`sidebar ${mobileOpen ? "sidebar-open" : ""}`}>
        <div className="brand">
          <img src={logo} alt="Buzz Bizz" className="brand-logo" />
          <div><strong>Buzz Bizz</strong><small>Business management</small></div>
          <button className="mobile-close icon-button" onClick={() => setMobileOpen(false)}>
            <X size={19} />
          </button>
        </div>

        <div className="nav-caption">WORKSPACE</div>
        <nav className="side-nav">
          {links.map(({ to, label, icon: Icon }) => (
            <NavLink
              key={to}
              to={to}
              end={to === "/"}
              onClick={() => setMobileOpen(false)}
              className={({ isActive }) => isActive ? "nav-link active" : "nav-link"}
            >
              <Icon size={19} strokeWidth={1.8} />
              <span>{label}</span>
            </NavLink>
          ))}
        </nav>

        <div className="sidebar-bottom">
          <div className="user-mini">
            <div className="avatar">{user?.name?.charAt(0).toUpperCase() || "U"}</div>
            <div className="user-mini-info">
              <strong>{user?.name}</strong>
              <small>{user?.businessName}</small>
            </div>
          </div>
          <button className="logout-button" onClick={handleLogout}>
            <LogOut size={17} /> Sign out
          </button>
        </div>
      </aside>

      <main className="main-area">
        <header className="topbar">
          <button className="mobile-menu icon-button" onClick={() => setMobileOpen(true)}>
            <Menu size={21} />
          </button>
          <div>
            <span className="topbar-eyebrow">YOUR WORKSPACE</span>
            <strong>{user?.businessName || "My Business"}</strong>
          </div>
          <div className="topbar-user">
            <div className="avatar">{user?.name?.charAt(0).toUpperCase() || "U"}</div>
            <span>{user?.name}</span>
          </div>
        </header>
        <div className="page-content"><Outlet /></div>
      </main>
    </div>
  );
}