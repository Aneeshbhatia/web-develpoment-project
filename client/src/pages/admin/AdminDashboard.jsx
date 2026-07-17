import { useEffect, useState } from "react";
import Sidebar from "../../components/Sidebar";
import { getAdminDashboard } from "../../services/adminDashboardService";

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
      console.log("🚀 Fetching Admin Dashboard...");

      const data = await getAdminDashboard();

      console.log("✅ API Response:", data);

      setStats(data.stats);
      setRecentOrders(data.recentOrders || []);
    } catch (error) {
      console.error("❌ Dashboard Error:", error);

      console.log("Status:", error.response?.status);
      console.log("Response:", error.response?.data);

      setErrorMessage(
        error.response?.data?.message || "Failed to load dashboard."
      );
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen text-2xl font-semibold">
        Loading Dashboard...
      </div>
    );
  }

  if (errorMessage) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="bg-red-100 border border-red-400 text-red-700 px-6 py-4 rounded-lg">
          <h2 className="text-xl font-bold mb-2">Dashboard Error</h2>
          <p>{errorMessage}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex bg-gray-100 min-h-screen">
      <Sidebar />

      <div className="flex-1 p-8">
        <h1 className="text-4xl font-bold mb-8">Admin Dashboard</h1>

        <div className="grid grid-cols-4 gap-6 mb-10">
          <div className="bg-white rounded-xl shadow p-6">
            <h2 className="text-gray-500">Total Users</h2>
            <p className="text-4xl font-bold">{stats.totalUsers}</p>
          </div>

          <div className="bg-white rounded-xl shadow p-6">
            <h2 className="text-gray-500">Total Farms</h2>
            <p className="text-4xl font-bold">{stats.totalFarms}</p>
          </div>

          <div className="bg-white rounded-xl shadow p-6">
            <h2 className="text-gray-500">Equipment</h2>
            <p className="text-4xl font-bold">{stats.totalEquipment}</p>
          </div>

          <div className="bg-white rounded-xl shadow p-6">
            <h2 className="text-gray-500">Products</h2>
            <p className="text-4xl font-bold">{stats.totalProducts}</p>
          </div>

          <div className="bg-white rounded-xl shadow p-6">
            <h2 className="text-gray-500">Orders</h2>
            <p className="text-4xl font-bold">{stats.totalOrders}</p>
          </div>

          <div className="bg-white rounded-xl shadow p-6">
            <h2 className="text-gray-500">Pending Orders</h2>
            <p className="text-4xl font-bold text-yellow-600">
              {stats.pendingOrders}
            </p>
          </div>

          <div className="bg-white rounded-xl shadow p-6">
            <h2 className="text-gray-500">Delivered Orders</h2>
            <p className="text-4xl font-bold text-green-600">
              {stats.deliveredOrders}
            </p>
          </div>

          <div className="bg-white rounded-xl shadow p-6">
            <h2 className="text-gray-500">Revenue</h2>
            <p className="text-4xl font-bold text-green-700">
              ₹{stats.revenue}
            </p>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow p-6">
          <h2 className="text-2xl font-bold mb-5">Recent Orders</h2>

          <table className="w-full">
            <thead>
              <tr className="border-b bg-gray-100">
                <th className="text-left p-3">Customer</th>
                <th className="text-left p-3">Email</th>
                <th className="text-left p-3">Amount</th>
                <th className="text-left p-3">Status</th>
              </tr>
            </thead>

            <tbody>
              {recentOrders.length > 0 ? (
                recentOrders.map((order) => (
                  <tr key={order._id} className="border-b">
                    <td className="p-3">{order.user?.name || "N/A"}</td>
                    <td className="p-3">{order.user?.email || "N/A"}</td>
                    <td className="p-3">₹{order.totalAmount}</td>
                    <td className="p-3">{order.orderStatus}</td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="4" className="text-center py-6">
                    No Recent Orders
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;