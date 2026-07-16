const Farm = require("../models/Farm");
const Equipment = require("../models/Equipment");
const Alert = require("../models/Alert");
const Order = require("../models/Order");

// =======================================
// Dashboard Statistics
// =======================================

const getDashboardStats = async (req, res) => {

  try {

    const farmerId = req.user.id;

    const totalFarms = await Farm.countDocuments({
      farmer: farmerId,
    });

    const totalEquipment = await Equipment.countDocuments({
      farmer: farmerId,
    });

    const totalAlerts = await Alert.countDocuments({
      farmer: farmerId,
      status: "Unread",
    });

    const totalOrders = await Order.countDocuments({
      user: farmerId,
    });

    const recentOrders = await Order.find({
      user: farmerId,
    })
      .sort({ createdAt: -1 })
      .limit(5);

    const recentAlerts = await Alert.find({
      farmer: farmerId,
    })
      .sort({ createdAt: -1 })
      .limit(5);

    res.status(200).json({
      success: true,

      stats: {
        totalFarms,
        totalEquipment,
        totalAlerts,
        totalOrders,
      },

      recentOrders,

      recentAlerts,

    });

  } catch (error) {

    res.status(500).json({
      success: false,
      message: error.message,
    });

  }

};

module.exports = {
  getDashboardStats,
};