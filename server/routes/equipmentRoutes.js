const express = require("express");

const router = express.Router();

const {
  getEquipment,
  addEquipment,
  updateEquipment,
  deleteEquipment,
  changeStatus,
} = require("../controllers/equipmentController");

const { protect } = require("../middleware/authMiddleware");

// =======================
// Routes
// =======================

// Get All Equipment
router.get("/", protect, getEquipment);

// Add Equipment
router.post("/", protect, addEquipment);

// Update Equipment
router.put("/:id", protect, updateEquipment);

// Delete Equipment
router.delete("/:id", protect, deleteEquipment);

// Change Equipment Status
router.patch("/status/:id", protect, changeStatus);

module.exports = router;