import { NavLink, useNavigate } from "react-router-dom";
import {
  LayoutDashboard,
  Sprout,
  Tractor,
  ShoppingCart,
  Bell,
  User,
  Shield,
  LogOut,
} from "lucide-react";

const Sidebar = () => {
  const navigate = useNavigate();

  const user = JSON.parse(localStorage.getItem("user") || "{}");

  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    navigate("/login");
  };

  const linkClass = ({ isActive }) =>
    `flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 ${
      isActive
        ? "bg-[#6BFFB8]/15 text-[#6BFFB8] border border-[#6BFFB8]/30"
        : "text-[#B7C7BE] hover:bg-[#111A16] hover:text-white"
    }`;

  return (
    <aside className="fixed left-0 top-16 w-72 h-[calc(100vh-64px)] bg-[#0C1713] border-r border-[#1C2B24] overflow-y-auto z-40">
      <div className="p-6">

        {/* User */}
        <div className="mb-8">
          <h2 className="text-2xl font-bold text-white">
            {user?.name || "User"}
          </h2>

          <p className="text-sm text-[#7A8A82] break-all">
            {user?.email || ""}
          </p>
        </div>

        <nav className="space-y-2">

          <NavLink to="/dashboard" className={linkClass}>
            <LayoutDashboard size={20} />
            Dashboard
          </NavLink>

          <NavLink to="/farms" className={linkClass}>
            <Sprout size={20} />
            Farms
          </NavLink>

          <NavLink to="/equipment" className={linkClass}>
            <Tractor size={20} />
            Equipment
          </NavLink>

          <NavLink to="/marketplace" className={linkClass}>
            <ShoppingCart size={20} />
            Marketplace
          </NavLink>

          <NavLink to="/orders" className={linkClass}>
            <ShoppingCart size={20} />
            Orders
          </NavLink>

          <NavLink to="/alerts" className={linkClass}>
            <Bell size={20} />
            Alerts
          </NavLink>

          <NavLink to="/profile" className={linkClass}>
            <User size={20} />
            Profile
          </NavLink>

          {/* Only for Admin */}
          {user?.role === "admin" && (
            <>
              <hr className="border-[#1C2B24] my-4" />

              <NavLink to="/admin" className={linkClass}>
                <Shield size={20} />
                Admin Panel
              </NavLink>
            </>
          )}

          <hr className="border-[#1C2B24] my-4" />

          <button
            onClick={logout}
            className="flex items-center gap-3 w-full px-4 py-3 rounded-xl text-red-400 hover:bg-red-500/10 transition"
          >
            <LogOut size={20} />
            Logout
          </button>

        </nav>

      </div>
    </aside>
  );
};

export default Sidebar;