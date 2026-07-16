const express = require("express");

const router = express.Router();

const {
  addFarm,
  getFarms,
  getFarm,
  updateFarm,
  deleteFarm,
} = require("../controllers/farmController");

const { protect } = require("../middleware/authMiddleware");

// ==========================
// Protected Farm Routes
// ==========================

// Add Farm
router.post("/", protect, addFarm);

// Get All Farms
router.get("/", protect, getFarms);

// Get Single Farm
router.get("/:id", protect, getFarm);

// Update Farm
router.put("/:id", protect, updateFarm);

// Delete Farm
router.delete("/:id", protect, deleteFarm);

module.exports = router;