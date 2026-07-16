const express = require("express");

const router = express.Router();

const {
  placeOrder,
  getOrders,
  getOrder,
  cancelOrder,
  getOrderCount,
  updateOrderStatus,
} = require("../controllers/orderController");

const { protect } = require("../middleware/authMiddleware");

// =====================================
// Place Order
// POST /api/orders/place
// =====================================
router.post("/place", protect, placeOrder);

// =====================================
// Get All Orders
// GET /api/orders
// =====================================
router.get("/", protect, getOrders);

// =====================================
// Get Order Count
// GET /api/orders/count
// =====================================
router.get("/count", protect, getOrderCount);

// =====================================
// Get Single Order
// GET /api/orders/:id
// =====================================
router.get("/:id", protect, getOrder);

// =====================================
// Update Order Status (Admin)
// PUT /api/orders/:id
// =====================================
router.put("/:id", protect, updateOrderStatus);

// =====================================
// Cancel Order
// PUT /api/orders/cancel/:id
// =====================================
router.put("/cancel/:id", protect, cancelOrder);

module.exports = router;