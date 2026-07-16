require("dotenv").config();

const mongoose = require("mongoose");

const connectDB = require("./config/db");

const Product = require("./models/Product");

const products = require("./data/products");

// ============================
// Import Products
// ============================

const importData = async () => {
  try {

    await connectDB();

    // Delete old products
    await Product.deleteMany();

    console.log("Old Products Deleted");

    // Insert new products
    await Product.insertMany(products);

    console.log("Products Imported Successfully");

    process.exit();

  } catch (error) {

    console.error(error);

    process.exit(1);

  }
};

// ============================
// Delete Products
// ============================

const destroyData = async () => {
  try {

    await connectDB();

    await Product.deleteMany();

    console.log("All Products Deleted");

    process.exit();

  } catch (error) {

    console.error(error);

    process.exit(1);

  }
};

// ============================
// Command
// ============================

if (process.argv[2] === "-d") {

  destroyData();

} else {

  importData();

}