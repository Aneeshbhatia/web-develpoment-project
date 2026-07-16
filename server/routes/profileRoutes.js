const express = require("express");

const router = express.Router();

const {
  getProfile,
  updateProfile,
  changePassword,
} = require("../controllers/profileController");

const { protect } = require("../middleware/authMiddleware");

// Get Profile
router.get("/", protect, getProfile);

// Update Profile
router.put("/update", protect, updateProfile);

// Change Password
router.put("/password", protect, changePassword);

module.exports = router;