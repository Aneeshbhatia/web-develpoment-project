import { NavLink } from "react-router-dom";

import {
  LayoutDashboard,
  Package,
  ShoppingCart,
  Users,
  PlusCircle,
  LogOut,
} from "lucide-react";

const menu = [
  {
    title: "Dashboard",
    icon: LayoutDashboard,
    path: "/admin",
  },

  {
    title: "Products",
    icon: Package,
    path: "/admin/products",
  },

  {
    title: "Add Product",
    icon: PlusCircle,
    path: "/admin/add-product",
  },

  {
    title: "Orders",
    icon: ShoppingCart,
    path: "/admin/orders",
  },

  {
    title: "Users",
    icon: Users,
    path: "/admin/users",
  },
];

const AdminSidebar = () => {
  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");

    window.location.href = "/login";
  };

  return (
    <aside className="w-72 bg-slate-900 text-white min-h-screen">

      <div className="p-6 border-b border-slate-700">

        <h1 className="text-2xl font-bold text-green-400">
          Smart Irrigation
        </h1>

        <p className="text-slate-400 text-sm mt-1">
          Admin Panel
        </p>

      </div>

      <nav className="mt-6">

        {menu.map((item) => {

          const Icon = item.icon;

          return (
            <NavLink
              key={item.title}
              to={item.path}
              className={({ isActive }) =>
                `flex items-center gap-4 px-6 py-4 transition ${
                  isActive
                    ? "bg-green-600 text-white"
                    : "hover:bg-slate-800"
                }`
              }
            >
              <Icon size={20} />

              {item.title}
            </NavLink>
          );
        })}

      </nav>

      <button
        onClick={logout}
        className="flex items-center gap-3 w-full mt-10 px-6 py-4 text-red-400 hover:bg-slate-800"
      >
        <LogOut size={20} />

        Logout
      </button>

    </aside>
  );
};

export default AdminSidebar;