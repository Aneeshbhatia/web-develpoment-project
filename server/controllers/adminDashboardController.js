const User = require("../models/User");
const Farm = require("../models/Farm");
const Equipment = require("../models/Equipment");
const Product = require("../models/Product");
const Order = require("../models/Order");

const getAdminDashboard = async (req, res) => {
  try {
    console.log("✅ Admin Dashboard API Hit");

    const totalUsers = await User.countDocuments();
    const totalFarms = await Farm.countDocuments();
    const totalEquipment = await Equipment.countDocuments();
    const totalProducts = await Product.countDocuments();
    const totalOrders = await Order.countDocuments();

    const pendingOrders = await Order.countDocuments({
      orderStatus: "Pending",
    });

    const deliveredOrders = await Order.countDocuments({
      orderStatus: "Delivered",
    });

    const revenueResult = await Order.aggregate([
      {
        $group: {
          _id: null,
          totalRevenue: {
            $sum: "$totalAmount",
          },
        },
      },
    ]);

    const recentOrders = await Order.find()
      .populate("user", "name email")
      .sort({ createdAt: -1 })
      .limit(5);

    res.status(200).json({
      success: true,
      stats: {
        totalUsers,
        totalFarms,
        totalEquipment,
        totalProducts,
        totalOrders,
        pendingOrders,
        deliveredOrders,
        revenue: revenueResult.length
          ? revenueResult[0].totalRevenue
          : 0,
      },
      recentOrders,
    });
  } catch (error) {
    console.error("❌ Admin Dashboard Error:", error);

    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

module.exports = {
  getAdminDashboard,
};