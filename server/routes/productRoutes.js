const express = require("express");

const router = express.Router();

const {
  getProducts,
  addProduct,
} = require("../controllers/productController");

// Get All Products
router.get("/", getProducts);

// Add Product
router.post("/", addProduct);

module.exports = router;