const express = require("express");
const cors = require("cors");
const cookieParser = require("cookie-parser");

// ============================
// Routes
// ============================

const authRoutes = require("./routes/authRoutes");
const farmRoutes = require("./routes/farmRoutes");
const alertRoutes = require("./routes/alertRoutes");
const weatherRoutes = require("./routes/weatherRoutes");
const recommendationRoutes = require("./routes/recommendationRoutes");
const equipmentRoutes = require("./routes/equipmentRoutes");
const productRoutes = require("./routes/productRoutes");
const cartRoutes = require("./routes/cartRoutes");
const profileRoutes = require("./routes/profileRoutes");
const orderRoutes = require("./routes/orderRoutes");
const dashboardRoutes = require("./routes/dashboardRoutes"); // Farmer Dashboard
const adminDashboardRoutes = require("./routes/adminDashboardRoutes"); // ✅ NEW
const userRoutes = require("./routes/userRoutes");

const app = express();

// ============================
// Middleware
// ============================

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

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

// Weather
app.use("/api/weather", weatherRoutes);

// AI Recommendation
app.use("/api/recommendation", recommendationRoutes);

// Equipment
app.use("/api/equipment", equipmentRoutes);

// Farmer Dashboard
app.use("/api/dashboard", dashboardRoutes);

// ✅ Admin Dashboard
app.use("/api/admin/dashboard", adminDashboardRoutes);

// Marketplace Products
app.use("/api/products", productRoutes);

// Orders
app.use("/api/orders", orderRoutes);

// Users (Admin)
app.use("/api/users", userRoutes);

// User Profile
app.use("/api/profile", profileRoutes);

// Alerts
app.use("/api/alerts", alertRoutes);

// Cart
app.use("/api/cart", cartRoutes);

// ============================
// 404 Route
// ============================

app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: "Route Not Found",
  });
});

module.exports = app;