const express = require("express");
const cors = require("cors");
const cookieParser = require("cookie-parser");

const app = express();

// ============================
// Middleware
// ============================
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

// ============================
// Routes
// ============================
const authRoutes = require("./routes/authRoutes");
const farmRoutes = require("./routes/farmRoutes");
const sensorRoutes = require("./routes/sensorRoutes");
const sensorCatalogRoutes = require("./routes/sensorCatalogRoutes");
const equipmentRoutes = require("./routes/equipmentRoutes");
const weatherRoutes = require("./routes/weatherRoutes");
const recommendationRoutes = require("./routes/recommendationRoutes");
const alertRoutes = require("./routes/alertRoutes");
const dashboardRoutes = require("./routes/dashboardRoutes");
const adminDashboardRoutes = require("./routes/adminDashboardRoutes");
const productRoutes = require("./routes/productRoutes");
const cartRoutes = require("./routes/cartRoutes");
const orderRoutes = require("./routes/orderRoutes");
const profileRoutes = require("./routes/profileRoutes");
const userRoutes = require("./routes/userRoutes");

// ============================
// Home Route
// ============================
app.get("/", (req, res) => {
  res.send("🌱 Smart Irrigation API Running...");
});

// ============================
// API Routes
// ============================

// Authentication
app.use("/api/auth", authRoutes);

// Farms
app.use("/api/farms", farmRoutes);

// Installed Sensors
app.use("/api/sensors", sensorRoutes);

// Sensor Catalog
app.use("/api/sensor-catalog", sensorCatalogRoutes);

// Equipment
app.use("/api/equipment", equipmentRoutes);

// Weather
app.use("/api/weather", weatherRoutes);

// AI Recommendation
app.use("/api/recommendation", recommendationRoutes);

// Farmer Dashboard
app.use("/api/dashboard", dashboardRoutes);

// Admin Dashboard
app.use("/api/admin/dashboard", adminDashboardRoutes);

// Marketplace
app.use("/api/products", productRoutes);

// Cart
app.use("/api/cart", cartRoutes);

// Orders
app.use("/api/orders", orderRoutes);

// Profile
app.use("/api/profile", profileRoutes);

// Users
app.use("/api/users", userRoutes);

// Alerts
app.use("/api/alerts", alertRoutes);

// ============================
// 404 Handler
// ============================
app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: "Route Not Found",
  });
});

module.exports = app;