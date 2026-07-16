const express = require("express");

const router = express.Router();

const { protect } = require("../middleware/authMiddleware");

const {
  getDashboardStats,
} = require("../controllers/dashboardController");

// =============================
// Dashboard Statistics
// GET /api/dashboard
// =============================

router.get("/", protect, getDashboardStats);

module.exports = router;