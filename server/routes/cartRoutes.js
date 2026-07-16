const express = require("express");

const router = express.Router();

const {
  addToCart,
  getCart,
  updateCart,
  removeCartItem,
  clearCart,
  getCartTotal,
} = require("../controllers/cartController");

const { protect } = require("../middleware/authMiddleware");

// Add Product
router.post("/add", protect, addToCart);

// Get Cart
router.get("/", protect, getCart);

// Update Quantity
router.put("/update/:id", protect, updateCart);

// Remove Item
router.delete("/remove/:id", protect, removeCartItem);

// Clear Cart
router.delete("/clear", protect, clearCart);

// Cart Total
router.get("/total", protect, getCartTotal);

module.exports = router;