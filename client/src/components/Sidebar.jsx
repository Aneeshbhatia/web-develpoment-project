import { NavLink, useNavigate } from "react-router-dom";
import {
  LayoutDashboard,
  Sprout,
  Tractor,
  ShoppingCart,
  ShoppingBag,
  Bell,
  User,
  LogOut,
  Satellite,
  Radio,
  ShieldCheck,
} from "lucide-react";

const NAV_ITEMS = [
  { to: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { to: "/farms", label: "My Farms", icon: Sprout },
  { to: "/equipment", label: "Equipment", icon: Tractor },
  { to: "/marketplace", label: "Marketplace", icon: ShoppingCart },
  { to: "/cart", label: "My Cart", icon: ShoppingBag },
  { to: "/alerts", label: "Alerts", icon: Bell },
  { to: "/profile", label: "Profile", icon: User },
];

const Sidebar = () => {
  const navigate = useNavigate();

  const user = (() => {
    try {
      return JSON.parse(localStorage.getItem("user"));
    } catch {
      return null;
    }
  })();

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    navigate("/login");
  };

  return (
    <aside
      className="hud-root w-72 min-h-screen flex flex-col justify-between border-r border-[#1C2B24]"
      style={{
        background:
          "linear-gradient(180deg, #071C15 0%, #0C1713 55%, #05100C 100%)",
      }}
    >
      {/* Logo */}
      <div>
        <div className="flex items-center gap-3 p-6 border-b border-[#1C2B24]">
          <div className="relative bg-[#6BFFB8]/10 text-[#6BFFB8] p-3 rounded-xl ring-1 ring-[#6BFFB8]/30">
            <Satellite size={22} />
          </div>

          <div>
            <h1 className="hud-display text-xl font-semibold text-[#EAF5EE]">
              Smart Irrigation
            </h1>

            <p className="text-[11px] uppercase tracking-[0.2em] hud-mono text-[#6E877B] mt-0.5">
              Farmer Console
            </p>
          </div>
        </div>

        {/* Navigation */}
        <nav className="mt-6 flex flex-col gap-1.5 px-4">
          {NAV_ITEMS.map(({ to, label, icon: Icon }) => (
            <NavLink
              key={to}
              to={to}
              className={({ isActive }) =>
                `nav-link flex items-center gap-3 p-3 rounded-xl text-sm font-medium transition ${
                  isActive ? "active" : ""
                }`
              }
            >
              <Icon size={19} />
              {label}
            </NavLink>
          ))}

          {user?.role === "admin" && (
            <NavLink
              to="/admin"
              className={({ isActive }) =>
                `nav-link flex items-center gap-3 p-3 rounded-xl text-sm font-medium transition ${
                  isActive ? "active" : ""
                }`
              }
            >
              <ShieldCheck size={19} />
              Admin Panel
            </NavLink>
          )}
        </nav>
      </div>

      {/* Bottom Section */}
      <div className="p-5 border-t border-[#1C2B24]">
        <div className="mb-4 flex items-center gap-2">
          <span
            className="w-1.5 h-1.5 rounded-full bg-[#6BFFB8] hud-blink"
            style={{ boxShadow: "0 0 6px #6BFFB8" }}
          ></span>

          <span className="text-[10px] uppercase tracking-[0.2em] hud-mono text-[#6E877B] flex items-center gap-1">
            <Radio size={11} />
            Session Active
          </span>
        </div>

        <div className="mb-4">
          <h3 className="hud-display font-semibold text-base text-[#EAF5EE] truncate">
            {user?.name}
          </h3>

          <p className="text-[#6E877B] text-xs hud-mono truncate">
            {user?.email}
          </p>

          <p className="text-[#6BFFB8] text-xs hud-mono mt-1 uppercase">
            {user?.role}
          </p>
        </div>

        <button
          onClick={handleLogout}
          className="w-full flex items-center justify-center gap-2 bg-[#FF6B6B]/10 text-[#FF6B6B] ring-1 ring-[#FF6B6B]/30 py-3 rounded-xl hover:bg-[#FF6B6B]/20 transition font-medium hud-mono text-sm"
        >
          <LogOut size={17} />
          LOGOUT
        </button>
      </div>
    </aside>
  );
};

export default Sidebar;