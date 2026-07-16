import { useEffect, useState } from "react";
import DashboardLayout from "../layouts/DashboardLayout";

import {
  getOrders,
  cancelOrder,
} from "../services/orderService";

import {
  Package,
  Calendar,
  IndianRupee,
  Truck,
  XCircle,
} from "lucide-react";

const Orders = () => {

  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  // =============================
  // Load Orders
  // =============================

  const loadOrders = async () => {

    try {

      const response = await getOrders();

      if (response.success) {
        setOrders(response.orders);
      }

    } catch (error) {

      console.log(error);

      alert("Failed to load orders");

    } finally {

      setLoading(false);

    }

  };

  useEffect(() => {

    loadOrders();

  }, []);

  // =============================
  // Cancel Order
  // =============================

  const handleCancel = async (id) => {

    const confirmCancel = window.confirm(
      "Cancel this order?"
    );

    if (!confirmCancel) return;

    try {

      const response = await cancelOrder(id);

      alert(response.message);

      loadOrders();

    } catch (error) {

      console.log(error);

      alert("Unable to cancel order");

    }

  };

  if (loading) {

    return (

      <DashboardLayout>

        <div className="flex justify-center items-center h-[80vh]">

          <h2 className="text-3xl font-bold text-green-700">

            Loading Orders...

          </h2>

        </div>

      </DashboardLayout>

    );

  }

  return (

    <DashboardLayout>

      {/* Header */}

      <div className="flex justify-between items-center mb-8">

        <div>

          <h1 className="text-4xl font-bold text-green-700 flex items-center gap-3">

            <Package />

            My Orders

          </h1>

          <p className="text-gray-500 mt-2">

            View all your marketplace orders.

          </p>

        </div>

      </div>

      {/* Statistics */}

      <div className="grid md:grid-cols-3 gap-6 mb-8">

        <div className="bg-white rounded-2xl shadow-lg p-6">

          <p className="text-gray-500">

            Total Orders

          </p>

          <h2 className="text-4xl font-bold text-green-700 mt-2">

            {orders.length}

          </h2>

        </div>

        <div className="bg-white rounded-2xl shadow-lg p-6">

          <p className="text-gray-500">

            Pending Orders

          </p>

          <h2 className="text-4xl font-bold text-yellow-600 mt-2">

            {
              orders.filter(
                (item) => item.orderStatus === "Pending"
              ).length
            }

          </h2>

        </div>

        <div className="bg-white rounded-2xl shadow-lg p-6">

          <p className="text-gray-500">

            Delivered

          </p>

          <h2 className="text-4xl font-bold text-green-600 mt-2">

            {
              orders.filter(
                (item) => item.orderStatus === "Delivered"
              ).length
            }

          </h2>

        </div>

      </div>
            {/* Orders */}

      {orders.length === 0 ? (

        <div className="bg-white rounded-3xl shadow-lg p-12 text-center">

          <div className="text-7xl mb-4">
            📦
          </div>

          <h2 className="text-3xl font-bold">

            No Orders Yet

          </h2>

          <p className="text-gray-500 mt-3">

            Place your first order from the Marketplace.

          </p>

        </div>

      ) : (

        <div className="space-y-8">

          {orders.map((order) => (

            <div
              key={order._id}
              className="bg-white rounded-3xl shadow-lg p-8"
            >

              {/* Order Header */}

              <div className="flex flex-col lg:flex-row justify-between lg:items-center gap-6">

                <div>

                  <h2 className="text-2xl font-bold text-green-700">

                    Order #{order._id.slice(-6).toUpperCase()}

                  </h2>

                  <div className="flex items-center gap-2 mt-2 text-gray-500">

                    <Calendar size={18} />

                    {new Date(order.createdAt).toLocaleDateString()}

                  </div>

                </div>

                <div>

                  <span
                    className={`px-4 py-2 rounded-full text-sm font-semibold ${
                      order.orderStatus === "Pending"
                        ? "bg-yellow-100 text-yellow-700"
                        : order.orderStatus === "Delivered"
                        ? "bg-green-100 text-green-700"
                        : order.orderStatus === "Cancelled"
                        ? "bg-red-100 text-red-700"
                        : "bg-blue-100 text-blue-700"
                    }`}
                  >
                    {order.orderStatus}
                  </span>

                </div>

              </div>

              {/* Products */}

              <div className="mt-8 space-y-4">

                {order.items.map((item) => (

                  <div
                    key={item._id}
                    className="flex flex-col md:flex-row justify-between md:items-center border rounded-xl p-4"
                  >

                    <div>

                      <h3 className="text-xl font-semibold">

                        {item.product?.name}

                      </h3>

                      <p className="text-gray-500 mt-1">

                        Quantity : {item.quantity}

                      </p>

                    </div>

                    <div className="flex items-center gap-2 mt-4 md:mt-0">

                      <IndianRupee
                        size={18}
                        className="text-green-600"
                      />

                      <span className="text-2xl font-bold text-green-700">

                        {item.price * item.quantity}

                      </span>

                    </div>

                  </div>

                ))}

              </div>

              {/* Footer */}

              <div className="flex flex-col lg:flex-row justify-between items-center mt-8 gap-6">

                <div className="flex items-center gap-3">

                  <Truck className="text-blue-600" />

                  <span className="font-medium">

                    Payment :
                    {" "}
                    {order.paymentMethod}

                  </span>

                </div>

                <div className="text-right">

                  <h2 className="text-3xl font-bold text-blue-600">

                    ₹{order.totalAmount}

                  </h2>

                  <p className="text-gray-500">

                    Total Amount

                  </p>

                </div>

              </div>

              {/* Cancel Button */}

              {order.orderStatus === "Pending" && (

                <button
                  onClick={() =>
                    handleCancel(order._id)
                  }
                  className="mt-8 bg-red-500 hover:bg-red-600 text-white px-6 py-3 rounded-xl flex items-center gap-2"
                >

                  <XCircle size={18} />

                  Cancel Order

                </button>

              )}

            </div>

          ))}

        </div>

      )}

    </DashboardLayout>

  );

};

export default Orders;