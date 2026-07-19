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

// Mark alert as read
const markAsRead = async (req, res) => {
  try {
    const alert = await Alert.findOne({
      _id: req.params.id,
      farmer: req.user.id,
    });

    if (!alert) {
      return res.status(404).json({
        success: false,
        message: "Alert not found",
      });
    }

    alert.status = "Read";
    await alert.save();

    res.status(200).json({
      success: true,
      message: "Alert marked as read",
      alert,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// Delete alert
const deleteAlert = async (req, res) => {
  try {
    const alert = await Alert.findOne({
      _id: req.params.id,
      farmer: req.user.id,
    });

    if (!alert) {
      return res.status(404).json({
        success: false,
        message: "Alert not found",
      });
    }

    await Alert.findByIdAndDelete(req.params.id);

    res.status(200).json({
      success: true,
      message: "Alert deleted successfully",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// Get unread count
const getUnreadCount = async (req, res) => {
  try {
    const count = await Alert.countDocuments({
      farmer: req.user.id,
      status: "Unread",
    });

    res.status(200).json({
      success: true,
      unreadCount: count,
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
  markAsRead,
  deleteAlert,
  getUnreadCount,
};