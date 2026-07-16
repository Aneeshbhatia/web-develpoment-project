const Alert = require("../models/Alert");

// Get all alerts
const getAlerts = async (req, res) => {
  try {
    const alerts = await Alert.find({
      farmer: req.user.id,
    }).sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: alerts.length,
      alerts,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// Create alert
const createAlert = async (req, res) => {
  try {
    const { title, message, type } = req.body;

    const alert = await Alert.create({
      title,
      message,
      type,
      farmer: req.user.id,
    });

    res.status(201).json({
      success: true,
      message: "Alert Created",
      alert,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

module.exports = {
  getAlerts,
  createAlert,
};