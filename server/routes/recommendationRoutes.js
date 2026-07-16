const express = require("express");

const router = express.Router();

const { protect } = require("../middleware/authMiddleware");
const {
  getRecommendation,
} = require("../controllers/recommendationController");

// Get irrigation recommendation for a farm
router.get("/:id", protect, getRecommendation);

module.exports = router;