const express = require("express");
const router = express.Router();

const {
  getAlerts,
  createAlert,
  markAsRead,
  deleteAlert,
  getUnreadCount,
} = require("../controllers/alertController");

const { protect } = require("../middleware/authMiddleware");

router.get("/", protect, getAlerts);

router.post("/", protect, createAlert);

router.put("/:id/read", protect, markAsRead);

router.delete("/:id", protect, deleteAlert);

router.get("/unread-count", protect, getUnreadCount);

module.exports = router;