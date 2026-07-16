import { useEffect, useState } from "react";
import AdminLayout from "../../components/admin/AdminLayout";
import {
  getOrders,
  updateOrderStatus,
} from "../../services/marketplaceService";

const AdminOrders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadOrders();
  }, []);

  const loadOrders = async () => {
    try {
      const response = await getOrders();

      if (response.success) {
        setOrders(response.orders);
      }
    } catch (error) {
      console.error(error);
      alert("Failed to load orders");
    } finally {
      setLoading(false);
    }
  };

  const handleStatusChange = async (id, status) => {
    try {
      const response = await updateOrderStatus(id, status);

      if (response.success) {
        setOrders((prev) =>
          prev.map((order) =>
            order._id === id
              ? { ...order, orderStatus: status }
              : order
          )
        );

        alert("Order status updated successfully");
      }
    } catch (error) {
      console.error(error);
      alert("Failed to update order status");
    }
  };

  if (loading) {
    return (
      <AdminLayout>
        <div className="flex justify-center items-center h-[70vh]">
          <h2 className="text-2xl font-semibold">
            Loading Orders...
          </h2>
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout>
      <div className="bg-white rounded-xl shadow-lg p-6">

        <div className="mb-6">

          <h1 className="text-3xl font-bold">
            Order Management
          </h1>

          <p className="text-gray-500 mt-2">
            View and manage customer orders
          </p>

        </div>

        <div className="overflow-x-auto">

          <table className="min-w-full border">

            <thead className="bg-green-600 text-white">

              <tr>

                <th className="px-4 py-3">Order ID</th>

                <th className="px-4 py-3">Customer</th>

                <th className="px-4 py-3">Items</th>

                <th className="px-4 py-3">Amount</th>

                <th className="px-4 py-3">Payment</th>

                <th className="px-4 py-3">Status</th>

                <th className="px-4 py-3">Action</th>

              </tr>

            </thead>

            <tbody>

              {orders.length === 0 ? (

                <tr>

                  <td
                    colSpan="7"
                    className="text-center py-8"
                  >
                    No Orders Found
                  </td>

                </tr>

              ) : (

                orders.map((order) => (

                  <tr
                    key={order._id}
                    className="border-b hover:bg-gray-50"
                  >

                    <td className="px-4 py-4">
                      {order._id.slice(-6)}
                    </td>

                    <td className="px-4 py-4">
                      {order.user?.name || "Unknown"}
                    </td>

                    <td className="px-4 py-4">
                      {order.items.length}
                    </td>

                    <td className="px-4 py-4 font-semibold text-green-700">
                      ₹{order.totalAmount}
                    </td>

                    <td className="px-4 py-4">
                      {order.paymentStatus}
                    </td>

                    <td className="px-4 py-4">

                      <span
                        className={`px-3 py-1 rounded-full text-white text-sm ${
                          order.orderStatus === "Pending"
                            ? "bg-yellow-500"
                            : order.orderStatus === "Confirmed"
                            ? "bg-blue-500"
                            : order.orderStatus === "Processing"
                            ? "bg-indigo-500"
                            : order.orderStatus === "Shipped"
                            ? "bg-purple-500"
                            : order.orderStatus === "Delivered"
                            ? "bg-green-600"
                            : "bg-red-600"
                        }`}
                      >
                        {order.orderStatus}
                      </span>

                    </td>

                    <td className="px-4 py-4">

                      <select
                        value={order.orderStatus}
                        onChange={(e) =>
                          handleStatusChange(
                            order._id,
                            e.target.value
                          )
                        }
                        className="border rounded-lg p-2"
                      >
                        <option value="Pending">
                          Pending
                        </option>

                        <option value="Confirmed">
                          Confirmed
                        </option>

                        <option value="Processing">
                          Processing
                        </option>

                        <option value="Shipped">
                          Shipped
                        </option>

                        <option value="Delivered">
                          Delivered
                        </option>

                        <option value="Cancelled">
                          Cancelled
                        </option>

                      </select>

                    </td>

                  </tr>

                ))

              )}

            </tbody>

          </table>

        </div>

      </div>
    </AdminLayout>
  );
};

export default AdminOrders;