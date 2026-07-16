const express = require("express");

const router = express.Router();

const {
  getAlerts,
  createAlert,
} = require("../controllers/alertController");

const { protect } = require("../middleware/authMiddleware");

// Get all alerts
router.get("/", protect, getAlerts);

// Create alert
router.post("/", protect, createAlert);

module.exports = router;