const express = require("express");
const router = express.Router();

const {
  getSensors,
  getSensorById,
  addSensor,
  updateSensor,
  deleteSensor,
  changeSensorStatus,
} = require("../controllers/sensorController");

const { protect } = require("../middleware/authMiddleware");

// Get all installed sensors
router.get("/", protect, getSensors);

// Get one sensor
router.get("/:id", protect, getSensorById);

// Install sensor
router.post("/", protect, addSensor);

// Update sensor
router.put("/:id", protect, updateSensor);

// Delete sensor
router.delete("/:id", protect, deleteSensor);

// Update sensor status
router.patch("/:id/status", protect, changeSensorStatus);

module.exports = router;