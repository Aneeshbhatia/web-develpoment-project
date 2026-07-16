const mongoose = require("mongoose");

const farmSchema = new mongoose.Schema(
  {
    farmer: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    farmName: {
      type: String,
      required: [true, "Farm name is required"],
      trim: true,
    },

    location: {
      type: String,
      required: [true, "Location is required"],
      trim: true,
    },

    cropType: {
      type: String,
      required: [true, "Crop type is required"],
      trim: true,
    },

    area: {
      type: Number,
      required: [true, "Area is required"],
      min: 0,
    },

    soilType: {
      type: String,
      required: [true, "Soil type is required"],
      trim: true,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Farm", farmSchema);