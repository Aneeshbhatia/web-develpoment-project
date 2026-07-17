const express = require("express");

const router = express.Router();

const { protect } = require("../middleware/authMiddleware");

const {
  getAdminDashboard,
} = require("../controllers/adminDashboardController");

router.get("/", protect, getAdminDashboard);

module.exports = router;