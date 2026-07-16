const express = require("express");
const cors = require("cors");
const cookieParser = require("cookie-parser");

// Routes
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
app.use("/api/auth", authRoutes);

app.use("/api/farms", farmRoutes);

app.use("/api/weather", weatherRoutes);

app.use("/api/recommendation", recommendationRoutes);

app.use("/api/equipment", equipmentRoutes); 

app.use("/api/products", productRoutes);

app.use("/api/orders", orderRoutes);

app.use("/api/profile", profileRoutes);

app.use("/api/alerts", alertRoutes); 

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