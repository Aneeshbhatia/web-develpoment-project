const mongoose = require("mongoose");

const sensorCatalogSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },

    brand: {
      type: String,
      required: true,
    },

    sensorType: {
      type: String,
      enum: [
        "Soil Moisture",
        "Temperature",
        "Humidity",
        "Rain",
        "Water Level",
        "Light",
        "pH",
        "Pressure",
      ],
      required: true,
    },

    description: {
      type: String,
      required: true,
    },

    price: {
      type: Number,
      required: true,
    },

    stock: {
      type: Number,
      default: 10,
    },

    batteryLife: {
      type: String,
      default: "2 Years",
    },

    connectivity: {
      type: String,
      default: "Wi-Fi",
    },

    warranty: {
      type: String,
      default: "1 Year",
    },

    rating: {
      type: Number,
      default: 4.8,
    },

    reviews: {
      type: Number,
      default: 0,
    },

    image: {
      type: String,
      default:
        "https://images.unsplash.com/photo-1500382017468-9049fed747ef?w=800",
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model(
  "SensorCatalog",
  sensorCatalogSchema
);