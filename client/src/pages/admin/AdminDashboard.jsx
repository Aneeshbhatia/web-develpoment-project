import AdminLayout from "../../components/admin/AdminLayout";

import {
  Package,
  Users,
  ShoppingCart,
  IndianRupee,
  TrendingUp,
  Tractor,
} from "lucide-react";

const stats = [
  {
    title: "Total Products",
    value: 67,
    icon: Package,
    color: "bg-green-500",
  },
  {
    title: "Total Users",
    value: 128,
    icon: Users,
    color: "bg-blue-500",
  },
  {
    title: "Total Orders",
    value: 52,
    icon: ShoppingCart,
    color: "bg-orange-500",
  },
  {
    title: "Revenue",
    value: "₹1,25,000",
    icon: IndianRupee,
    color: "bg-purple-500",
  },
];

const recentOrders = [
  {
    id: "#ORD001",
    customer: "Amit Sharma",
    amount: "₹2,350",
    status: "Delivered",
  },
  {
    id: "#ORD002",
    customer: "Rahul Singh",
    amount: "₹5,200",
    status: "Pending",
  },
  {
    id: "#ORD003",
    customer: "Priya Devi",
    amount: "₹980",
    status: "Delivered",
  },
  {
    id: "#ORD004",
    customer: "Mohit Kumar",
    amount: "₹4,750",
    status: "Processing",
  },
];

const AdminDashboard = () => {
  return (
    <AdminLayout>
      <div>

        {/* Heading */}

        <div className="mb-8">

          <h1 className="text-3xl font-bold text-slate-800">
            Admin Dashboard
          </h1>

          <p className="text-slate-500 mt-2">
            Welcome to Smart Irrigation Admin Panel
          </p>

        </div>

        {/* Statistics */}

        <div className="grid md:grid-cols-2 xl:grid-cols-4 gap-6">

          {stats.map((item) => {

            const Icon = item.icon;

            return (
              <div
                key={item.title}
                className="bg-white rounded-xl shadow p-6 flex justify-between items-center"
              >
                <div>

                  <p className="text-gray-500 text-sm">
                    {item.title}
                  </p>

                  <h2 className="text-3xl font-bold mt-2">
                    {item.value}
                  </h2>

                </div>

                <div
                  className={`${item.color} p-4 rounded-xl text-white`}
                >
                  <Icon size={30} />
                </div>

              </div>
            );

          })}

        </div>

        {/* Dashboard Cards */}

        <div className="grid lg:grid-cols-2 gap-6 mt-8">

          {/* Revenue */}

          <div className="bg-white rounded-xl shadow p-6">

            <div className="flex items-center gap-3 mb-4">

              <TrendingUp className="text-green-600" />

              <h2 className="font-bold text-xl">
                Sales Overview
              </h2>

            </div>

            <div className="h-64 flex justify-center items-center">

              <p className="text-gray-400">
                Chart Coming Soon...
              </p>

            </div>

          </div>

          {/* Farm Summary */}

          <div className="bg-white rounded-xl shadow p-6">

            <div className="flex items-center gap-3 mb-4">

              <Tractor className="text-green-600" />

              <h2 className="font-bold text-xl">
                Farm Summary
              </h2>

            </div>

            <div className="space-y-5 mt-6">

              <div className="flex justify-between">

                <span>Total Farms</span>

                <span className="font-bold text-green-600">
                  25
                </span>

              </div>

              <div className="flex justify-between">

                <span>Equipment</span>

                <span className="font-bold text-blue-600">
                  41
                </span>

              </div>

              <div className="flex justify-between">

                <span>Weather Alerts</span>

                <span className="font-bold text-red-500">
                  6
                </span>

              </div>

              <div className="flex justify-between">

                <span>Active Irrigation</span>

                <span className="font-bold text-purple-600">
                  18
                </span>

              </div>

            </div>

          </div>

        </div>

        {/* Recent Orders */}

        <div className="bg-white rounded-xl shadow mt-8 p-6">

          <h2 className="text-xl font-bold mb-6">
            Recent Orders
          </h2>

          <table className="w-full">

            <thead>

              <tr className="border-b">

                <th className="text-left py-3">Order ID</th>

                <th className="text-left">Customer</th>

                <th className="text-left">Amount</th>

                <th className="text-left">Status</th>

              </tr>

            </thead>

            <tbody>

              {recentOrders.map((order) => (

                <tr
                  key={order.id}
                  className="border-b hover:bg-gray-50"
                >

                  <td className="py-4">
                    {order.id}
                  </td>

                  <td>{order.customer}</td>

                  <td>{order.amount}</td>

                  <td>

                    <span className="px-3 py-1 rounded-full bg-green-100 text-green-700 text-sm">

                      {order.status}

                    </span>

                  </td>

                </tr>

              ))}

            </tbody>

          </table>

        </div>

      </div>
    </AdminLayout>
  );
};

export default AdminDashboard;