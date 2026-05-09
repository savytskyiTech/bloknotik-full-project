import { NavLink, Outlet, useLocation } from "react-router";
import {
  LayoutDashboard,
  Calendar,
  Users,
  Settings,
  Bell,
  Search,
  ChevronDown,
  Car,
  LogOut,
  Menu,
  X,
} from "lucide-react";
import { useState } from "react";

const navItems = [
  { to: "/", label: "Дашборд", icon: LayoutDashboard },
  { to: "/schedule", label: "Розклад", icon: Calendar },
  { to: "/users", label: "Користувачі", icon: Users },
  { to: "/settings", label: "Налаштування", icon: Settings },
];

export function Layout() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const location = useLocation();

  return (
    <div
      className="min-h-screen flex"
      style={{ background: "#F5F3FF", fontFamily: "'Inter', sans-serif" }}
    >
      {/* Mobile overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 z-40 lg:hidden"
          style={{ background: "rgba(124,58,237,0.15)" }}
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`fixed top-0 left-0 h-full z-50 flex flex-col transition-transform duration-300 lg:static lg:translate-x-0 lg:z-auto ${
          sidebarOpen ? "translate-x-0" : "-translate-x-full"
        }`}
        style={{
          width: 260,
          background: "#ffffff",
          borderRight: "1px solid #EDE9FE",
          boxShadow: "4px 0 24px rgba(124,58,237,0.06)",
        }}
      >
        {/* Logo */}
        <div className="flex items-center gap-3 px-6 py-6">
          <div
            className="flex items-center justify-center rounded-2xl"
            style={{
              width: 44,
              height: 44,
              background: "linear-gradient(135deg, #7C3AED 0%, #A855F7 100%)",
              boxShadow: "0 4px 16px rgba(124,58,237,0.35)",
            }}
          >
            <Car size={22} color="#fff" />
          </div>
          <div>
            <div style={{ fontSize: 20, fontWeight: 700, color: "#1E1B4B", letterSpacing: "-0.3px" }}>
              GoDrive
            </div>
            <div style={{ fontSize: 11, color: "#A78BFA", fontWeight: 500, marginTop: -2 }}>
              Менеджер
            </div>
          </div>
        </div>

        {/* Nav */}
        <nav className="flex-1 px-4 pb-4 flex flex-col gap-1">
          <div style={{ fontSize: 11, fontWeight: 600, color: "#C4B5FD", letterSpacing: "0.08em", paddingLeft: 8, paddingBottom: 8, paddingTop: 4 }}>
            НАВІГАЦІЯ
          </div>
          {navItems.map(({ to, label, icon: Icon }) => {
            const isActive =
              to === "/"
                ? location.pathname === "/"
                : location.pathname.startsWith(to);
            return (
              <NavLink
                key={to}
                to={to}
                onClick={() => setSidebarOpen(false)}
                className="flex items-center gap-3 rounded-2xl px-4 py-3 transition-all duration-200 group"
                style={{
                  background: isActive
                    ? "linear-gradient(135deg, #7C3AED 0%, #A855F7 100%)"
                    : "transparent",
                  boxShadow: isActive ? "0 4px 16px rgba(124,58,237,0.25)" : "none",
                  color: isActive ? "#fff" : "#6B7280",
                  fontWeight: isActive ? 600 : 500,
                  fontSize: 14,
                }}
              >
                <Icon
                  size={18}
                  style={{ color: isActive ? "#fff" : "#A78BFA", flexShrink: 0 }}
                />
                {label}
              </NavLink>
            );
          })}
        </nav>

        {/* Bottom profile */}
        <div
          className="mx-4 mb-5 p-4 rounded-2xl flex items-center gap-3"
          style={{ background: "#F5F3FF", border: "1px solid #EDE9FE" }}
        >
          <div
            className="rounded-xl flex items-center justify-center flex-shrink-0"
            style={{
              width: 38,
              height: 38,
              background: "linear-gradient(135deg, #7C3AED, #A855F7)",
              color: "#fff",
              fontWeight: 700,
              fontSize: 14,
            }}
          >
            АД
          </div>
          <div className="flex-1 min-w-0">
            <div style={{ fontSize: 13, fontWeight: 600, color: "#1E1B4B" }}>Адмін</div>
            <div style={{ fontSize: 11, color: "#A78BFA", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
              admin@godrive.ua
            </div>
          </div>
          <LogOut size={15} style={{ color: "#C4B5FD", cursor: "pointer", flexShrink: 0 }} />
        </div>
      </aside>

      {/* Main area */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Top Header */}
        <header
          className="sticky top-0 z-30 flex items-center gap-4 px-6 py-4"
          style={{
            background: "rgba(255,255,255,0.85)",
            backdropFilter: "blur(16px)",
            borderBottom: "1px solid #EDE9FE",
          }}
        >
          <button
            className="lg:hidden p-2 rounded-xl"
            style={{ background: "#F5F3FF" }}
            onClick={() => setSidebarOpen(!sidebarOpen)}
          >
            {sidebarOpen ? <X size={18} color="#7C3AED" /> : <Menu size={18} color="#7C3AED" />}
          </button>

          {/* Search */}
          <div className="flex-1 max-w-sm relative">
            <Search
              size={16}
              className="absolute left-3 top-1/2 -translate-y-1/2"
              style={{ color: "#C4B5FD" }}
            />
            <input
              placeholder="Пошук студентів, інструкторів..."
              className="w-full pl-9 pr-4 py-2.5 rounded-2xl outline-none transition-all"
              style={{
                background: "#F5F3FF",
                border: "1.5px solid #EDE9FE",
                fontSize: 13,
                color: "#1E1B4B",
              }}
            />
          </div>

          <div className="flex items-center gap-3 ml-auto">
            {/* Notifications */}
            <button
              className="relative p-2.5 rounded-2xl transition-all"
              style={{ background: "#F5F3FF", border: "1.5px solid #EDE9FE" }}
            >
              <Bell size={17} style={{ color: "#7C3AED" }} />
              <span
                className="absolute top-1.5 right-1.5 rounded-full"
                style={{ width: 7, height: 7, background: "#EF4444" }}
              />
            </button>

            {/* Profile */}
            <div
              className="flex items-center gap-2.5 px-3 py-2 rounded-2xl cursor-pointer transition-all"
              style={{ background: "#F5F3FF", border: "1.5px solid #EDE9FE" }}
            >
              <div
                className="rounded-xl flex items-center justify-center"
                style={{
                  width: 30,
                  height: 30,
                  background: "linear-gradient(135deg, #7C3AED, #A855F7)",
                  color: "#fff",
                  fontWeight: 700,
                  fontSize: 12,
                }}
              >
                АД
              </div>
              <span style={{ fontSize: 13, fontWeight: 600, color: "#1E1B4B" }}>Адмін</span>
              <ChevronDown size={14} style={{ color: "#A78BFA" }} />
            </div>
          </div>
        </header>

        {/* Page content */}
        <main className="flex-1 p-6 overflow-auto">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
