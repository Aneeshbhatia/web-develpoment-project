import { useEffect, useState } from "react";
import Sidebar from "../../components/Sidebar";
import { getAdminDashboard } from "../../services/adminDashboardService";

import {
  Users,
  Sprout,
  Tractor,
  Package,
  ShoppingCart,
  Clock,
  CheckCircle2,
  IndianRupee,
  AlertTriangle,
} from "lucide-react";

const AdminDashboard = () => {
  const [stats, setStats] = useState(null);
  const [recentOrders, setRecentOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState("");

  useEffect(() => {
    fetchDashboard();
  }, []);

  const fetchDashboard = async () => {
    try {
      const data = await getAdminDashboard();
      setStats(data.stats ?? null);
      setRecentOrders(data.recentOrders || []);

      if (!data.stats) {
        setErrorMessage("Dashboard data is incomplete. Please try again.");
      }
    } catch (error) {
      console.error("Admin dashboard fetch failed:", error);
      setErrorMessage(
        error.response?.data?.message || "Failed to load dashboard."
      );
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex bg-[#080C0A] min-h-screen">
        <Sidebar />
        <div className="flex-1 flex justify-center items-center">
          <div className="flex items-center gap-3 text-[#6E877B] hud-mono">
            <div className="w-4 h-4 rounded-full border-2 border-[#6BFFB8] border-t-transparent animate-spin" />
            Loading dashboard...
          </div>
        </div>
      </div>
    );
  }

  if (errorMessage || !stats) {
    return (
      <div className="flex bg-[#080C0A] min-h-screen">
        <Sidebar />
        <div className="flex-1 flex justify-center items-center px-6">
          <div className="hud-panel rounded-2xl p-8 max-w-md text-center border-[#3A1F1F]">
            <div className="w-12 h-12 rounded-xl bg-[#FF6B6B]/10 flex items-center justify-center mx-auto mb-4">
              <AlertTriangle size={22} className="text-[#FF6B6B]" />
            </div>
            <h2 className="hud-display text-lg font-semibold text-[#EAF5EE] mb-2">
              Dashboard Error
            </h2>
            <p className="text-[#6E877B] text-sm">
              {errorMessage || "Something went wrong loading the dashboard."}
            </p>
            <button
              onClick={() => {
                setLoading(true);
                setErrorMessage("");
                fetchDashboard();
              }}
              className="mt-6 bg-[#6BFFB8]/10 hover:bg-[#6BFFB8]/20 text-[#6BFFB8] px-5 py-2.5 rounded-xl text-sm font-medium transition-colors"
            >
              Retry
            </button>
          </div>
        </div>
      </div>
    );
  }

  const kpis = [
    { label: "Total Users", value: stats.totalUsers, icon: Users, accent: "#6BFFB8" },
    { label: "Total Farms", value: stats.totalFarms, icon: Sprout, accent: "#6BFFB8" },
    { label: "Equipment", value: stats.totalEquipment, icon: Tractor, accent: "#4FD1FF" },
    { label: "Products", value: stats.totalProducts, icon: Package, accent: "#4FD1FF" },
    { label: "Orders", value: stats.totalOrders, icon: ShoppingCart, accent: "#FFC163" },
    { label: "Pending Orders", value: stats.pendingOrders, icon: Clock, accent: "#FFC163" },
    { label: "Delivered Orders", value: stats.deliveredOrders, icon: CheckCircle2, accent: "#6BFFB8" },
    { label: "Revenue", value: `₹${stats.revenue}`, icon: IndianRupee, accent: "#4FD1FF" },
  ];

  return (
    <div className="flex bg-[#080C0A] min-h-screen text-[#EAF5EE]">
      <Sidebar />

      <div className="flex-1 p-6 md:p-10 space-y-8">
        <div>
          <h1 className="hud-display text-2xl md:text-3xl font-semibold">
            Admin Dashboard
          </h1>
          <p className="text-[#6E877B] text-sm mt-1">
            Platform-wide stats across all farms and users.
          </p>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-5">
          {kpis.map(({ label, value, icon: Icon, accent }) => (
            <div key={label} className="hud-panel rounded-2xl p-6">
              <div className="flex justify-between items-start">
                <h2 className="text-[11px] uppercase tracking-[0.2em] hud-mono text-[#6E877B]">
                  {label}
                </h2>
                <div
                  className="w-9 h-9 rounded-xl flex items-center justify-center"
                  style={{ backgroundColor: `${accent}1A` }}
                >
                  <Icon size={16} style={{ color: accent }} />
                </div>
              </div>
              <p
                className="hud-mono text-3xl font-semibold mt-5 tracking-tight"
                style={{ color: accent }}
              >
                {value}
              </p>
            </div>
          ))}
        </div>

        <div className="hud-panel rounded-2xl p-6">
          <h2 className="hud-display text-lg font-semibold mb-5">
            Recent Orders
          </h2>

          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-[#1C2B24]">
                  <th className="text-left py-3 px-3 text-[11px] uppercase tracking-[0.15em] hud-mono text-[#6E877B]">
                    Customer
                  </th>
                  <th className="text-left py-3 px-3 text-[11px] uppercase tracking-[0.15em] hud-mono text-[#6E877B]">
                    Email
                  </th>
                  <th className="text-left py-3 px-3 text-[11px] uppercase tracking-[0.15em] hud-mono text-[#6E877B]">
                    Amount
                  </th>
                  <th className="text-left py-3 px-3 text-[11px] uppercase tracking-[0.15em] hud-mono text-[#6E877B]">
                    Status
                  </th>
                </tr>
              </thead>

              <tbody>
                {recentOrders.length > 0 ? (
                  recentOrders.map((order) => (
                    <tr
                      key={order._id}
                      className="border-b border-[#1C2B24] hover:bg-[#0E1512] transition-colors"
                    >
                      <td className="py-3 px-3 text-[#EAF5EE]">
                        {order.user?.name || "N/A"}
                      </td>
                      <td className="py-3 px-3 text-[#6E877B]">
                        {order.user?.email || "N/A"}
                      </td>
                      <td className="py-3 px-3 hud-mono text-[#4FD1FF] font-medium">
                        ₹{order.totalAmount}
                      </td>
                      <td className="py-3 px-3">
                        <span
                          className={`text-[11px] px-2.5 py-1 rounded-full font-medium ${
                            order.orderStatus === "Pending"
                              ? "bg-[#FFC163]/10 text-[#FFC163]"
                              : order.orderStatus === "Delivered"
                              ? "bg-[#6BFFB8]/10 text-[#6BFFB8]"
                              : order.orderStatus === "Cancelled"
                              ? "bg-[#FF6B6B]/10 text-[#FF6B6B]"
                              : "bg-[#4FD1FF]/10 text-[#4FD1FF]"
                          }`}
                        >
                          {order.orderStatus}
                        </span>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="4" className="text-center py-8 text-[#6E877B]">
                      No recent orders
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;