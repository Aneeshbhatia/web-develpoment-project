const mongoose = require("mongoose");

const sensorSchema = new mongoose.Schema(
  {
    // Selected sensor from Sensor Catalog
    sensorCatalog: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "SensorCatalog",
      default: null,
    },

    name: {
      type: String,
      required: true,
      trim: true,
    },

    brand: {
      type: String,
      default: "",
    },

    type: {
      type: String,
      required: true,
      enum: [
        "Soil Moisture",
        "Temperature",
        "Humidity",
        "Rain",
        "Water Level",
        "pH",
        "Light",
        "Pressure",
      ],
    },

    image: {
      type: String,
      default: "",
    },

    farm: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Farm",
      required: true,
    },

    equipment: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Equipment",
      default: null,
    },

    location: {
      type: String,
      default: "",
    },

    batteryLevel: {
      type: Number,
      default: 100,
      min: 0,
      max: 100,
    },

    status: {
      type: String,
      enum: [
        "Active",
        "Inactive",
        "Calibrating",
        "Maintenance",
      ],
      default: "Active",
    },

    value: {
      type: Number,
      default: 0,
    },

    unit: {
      type: String,
      default: "%",
    },

    owner: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Sensor", sensorSchema);