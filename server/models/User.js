const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
  {
    // ===========================
    // Basic Information
    // ===========================

    name: {
      type: String,
      required: true,
      trim: true,
    },

    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },

    password: {
      type: String,
      required: true,
    },

    role: {
      type: String,
      enum: ["farmer", "advisor", "admin"],
      default: "farmer",
    },

    // ===========================
    // Profile Information
    // ===========================

    phone: {
      type: String,
      default: "",
      trim: true,
    },

    address: {
      type: String,
      default: "",
      trim: true,
    },

    profileImage: {
      type: String,
      default:
        "https://ui-avatars.com/api/?background=16a34a&color=ffffff&name=Farmer",
    },

    gender: {
      type: String,
      enum: ["Male", "Female", "Other"],
      default: "Male",
    },

    dateOfBirth: {
      type: Date,
    },

    // ===========================
    // Admin
    // ===========================

    isActive: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("User", userSchema);