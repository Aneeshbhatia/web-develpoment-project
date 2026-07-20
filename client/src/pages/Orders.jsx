import { useEffect, useState } from "react";
import DashboardLayout from "../layouts/DashboardLayout";

import { getOrders, cancelOrder } from "../services/orderService";

import {
  Package,
  Calendar,
  IndianRupee,
  Truck,
  XCircle,
  Clock,
  CheckCircle2,
} from "lucide-react";

const STATUS_STYLES = {
  Pending: "bg-[#FFC163]/10 text-[#FFC163]",
  Delivered: "bg-[#6BFFB8]/10 text-[#6BFFB8]",
  Cancelled: "bg-[#FF6B6B]/10 text-[#FF6B6B]",
};
const DEFAULT_STATUS_STYLE = "bg-[#4FD1FF]/10 text-[#4FD1FF]";

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
      console.error("Failed to load orders:", error);
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
    const confirmCancel = window.confirm("Cancel this order?");
    if (!confirmCancel) return;

    try {
      const response = await cancelOrder(id);
      alert(response.message);
      loadOrders();
    } catch (error) {
      console.error("Failed to cancel order:", error);
      alert("Unable to cancel order");
    }
  };

  if (loading) {
    return (
      <DashboardLayout>
        <div className="min-h-screen bg-[#080C0A] flex justify-center items-center h-[80vh]">
          <div className="flex items-center gap-3 text-[#6E877B] hud-mono">
            <div className="w-4 h-4 rounded-full border-2 border-[#6BFFB8] border-t-transparent animate-spin" />
            Loading orders...
          </div>
        </div>
      </DashboardLayout>
    );
  }

  const pendingCount = orders.filter(
    (item) => item.orderStatus === "Pending"
  ).length;
  const deliveredCount = orders.filter(
    (item) => item.orderStatus === "Delivered"
  ).length;

  return (
    <DashboardLayout>
      <div className="min-h-screen bg-[#080C0A] text-[#EAF5EE] px-6 md:px-10 py-8 space-y-8">
        {/* Header */}
        <div className="flex justify-between items-center">
          <div>
            <h1 className="hud-display text-2xl md:text-3xl font-semibold flex items-center gap-3">
              <Package className="text-[#6BFFB8]" size={28} />
              My Orders
            </h1>
            <p className="text-[#6E877B] mt-2 text-sm">
              View all your marketplace orders.
            </p>
          </div>
        </div>

        {/* Statistics */}
        <div className="grid md:grid-cols-3 gap-5">
          <div className="hud-panel rounded-2xl p-6">
            <div className="flex justify-between items-start">
              <p className="text-[11px] uppercase tracking-[0.2em] hud-mono text-[#6E877B]">
                Total Orders
              </p>
              <div className="w-9 h-9 rounded-xl flex items-center justify-center bg-[#4FD1FF]/10">
                <Package size={16} className="text-[#4FD1FF]" />
              </div>
            </div>
            <h2 className="hud-mono text-4xl font-semibold mt-5 text-[#4FD1FF] tracking-tight">
              {orders.length}
            </h2>
          </div>

          <div className="hud-panel rounded-2xl p-6">
            <div className="flex justify-between items-start">
              <p className="text-[11px] uppercase tracking-[0.2em] hud-mono text-[#6E877B]">
                Pending Orders
              </p>
              <div className="w-9 h-9 rounded-xl flex items-center justify-center bg-[#FFC163]/10">
                <Clock size={16} className="text-[#FFC163]" />
              </div>
            </div>
            <h2 className="hud-mono text-4xl font-semibold mt-5 text-[#FFC163] tracking-tight">
              {pendingCount}
            </h2>
          </div>

          <div className="hud-panel rounded-2xl p-6">
            <div className="flex justify-between items-start">
              <p className="text-[11px] uppercase tracking-[0.2em] hud-mono text-[#6E877B]">
                Delivered
              </p>
              <div className="w-9 h-9 rounded-xl flex items-center justify-center bg-[#6BFFB8]/10">
                <CheckCircle2 size={16} className="text-[#6BFFB8]" />
              </div>
            </div>
            <h2 className="hud-mono text-4xl font-semibold mt-5 text-[#6BFFB8] tracking-tight">
              {deliveredCount}
            </h2>
          </div>
        </div>

        {/* Orders */}
        {orders.length === 0 ? (
          <div className="hud-panel rounded-2xl p-12 text-center">
            <div className="text-6xl mb-4 opacity-80">📦</div>
            <h2 className="hud-display text-2xl font-semibold text-[#EAF5EE]">
              No Orders Yet
            </h2>
            <p className="text-[#6E877B] mt-3 text-sm">
              Place your first order from the Marketplace.
            </p>
          </div>
        ) : (
          <div className="space-y-6">
            {orders.map((order) => (
              <div key={order._id} className="hud-panel rounded-2xl p-6 md:p-8">
                {/* Order Header */}
                <div className="flex flex-col lg:flex-row justify-between lg:items-center gap-4 pb-6 border-b border-[#1C2B24]">
                  <div>
                    <h2 className="hud-display text-xl font-semibold text-[#EAF5EE]">
                      Order #{order._id.slice(-6).toUpperCase()}
                    </h2>
                    <div className="flex items-center gap-2 mt-2 text-[#6E877B] text-sm">
                      <Calendar size={15} />
                      {new Date(order.createdAt).toLocaleDateString()}
                    </div>
                  </div>

                  <span
                    className={`px-4 py-1.5 rounded-full text-xs font-semibold hud-mono ${
                      STATUS_STYLES[order.orderStatus] ?? DEFAULT_STATUS_STYLE
                    }`}
                  >
                    {order.orderStatus}
                  </span>
                </div>

                {/* Products */}
                <div className="mt-6 space-y-3">
                  {order.items.map((item) => (
                    <div
                      key={item._id}
                      className="flex flex-col md:flex-row justify-between md:items-center border border-[#1C2B24] rounded-xl p-4 hover:border-[#2A3B32] transition-colors"
                    >
                      <div>
                        <h3 className="text-base font-medium text-[#EAF5EE]">
                          {item.product?.name}
                        </h3>
                        <p className="text-[#6E877B] mt-1 text-sm">
                          Quantity : {item.quantity}
                        </p>
                      </div>

                      <div className="flex items-center gap-1.5 mt-3 md:mt-0">
                        <IndianRupee size={16} className="text-[#6BFFB8]" />
                        <span className="text-xl font-semibold hud-mono text-[#6BFFB8]">
                          {item.price * item.quantity}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Footer */}
                <div className="flex flex-col lg:flex-row justify-between items-center mt-6 gap-4 pt-6 border-t border-[#1C2B24]">
                  <div className="flex items-center gap-2.5 text-[#B7C7BE]">
                    <Truck size={18} className="text-[#4FD1FF]" />
                    <span className="text-sm font-medium">
                      Payment : {order.paymentMethod}
                    </span>
                  </div>

                  <div className="text-right">
                    <h2 className="text-2xl font-bold hud-mono text-[#4FD1FF]">
                      ₹{order.totalAmount}
                    </h2>
                    <p className="text-[#6E877B] text-xs mt-0.5">
                      Total Amount
                    </p>
                  </div>
                </div>

                {/* Cancel Button */}
                {order.orderStatus === "Pending" && (
                  <button
                    onClick={() => handleCancel(order._id)}
                    className="mt-6 bg-[#FF6B6B]/10 hover:bg-[#FF6B6B]/20 text-[#FF6B6B] px-5 py-2.5 rounded-xl flex items-center gap-2 text-sm font-medium transition-colors"
                  >
                    <XCircle size={16} />
                    Cancel Order
                  </button>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </DashboardLayout>
  );
};

export default Orders;