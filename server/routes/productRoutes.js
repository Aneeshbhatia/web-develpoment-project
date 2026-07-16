const express = require("express");

const router = express.Router();

const {
  getProducts,
  getProduct,
  addProduct,
  updateProduct,
  deleteProduct,
} = require("../controllers/productController");

// ==============================
// Product Routes
// ==============================

// Get All Products
router.get("/", getProducts);

// Get Single Product
router.get("/:id", getProduct);

// Add Product
router.post("/", addProduct);

// Update Product
router.put("/:id", updateProduct);

// Delete Product
router.delete("/:id", deleteProduct);

module.exports = router;