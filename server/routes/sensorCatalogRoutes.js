const express = require("express");

const router = express.Router();

const {
  getSensors,
  getSensor,
  addSensor,
  updateSensor,
  deleteSensor,
} = require("../controllers/sensorCatalogController");

const { protect } = require("../middleware/authMiddleware");
const admin = require("../middleware/adminMiddleware");

// ===============================
// Public Routes
// ===============================

// Get all sensors
router.get("/", getSensors);

// Get single sensor
router.get("/:id", getSensor);

// ===============================
// Admin Routes
// ===============================

// Add sensor
router.post("/", protect, admin, addSensor);

// Update sensor
router.put("/:id", protect, admin, updateSensor);

// Delete sensor
router.delete("/:id", protect, admin, deleteSensor);

module.exports = router;