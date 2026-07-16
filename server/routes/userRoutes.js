const express = require("express");

const router = express.Router();

const {
  getUsers,
  deleteUser,
  updateUserRole,
} = require("../controllers/userController");

const { protect } = require("../middleware/authMiddleware");

// ================================
// User Routes
// ================================

// Get All Users
router.get("/", protect, getUsers);

// Delete User
router.delete("/:id", protect, deleteUser);

// Update User Role
router.put("/:id/role", protect, updateUserRole);

module.exports = router;