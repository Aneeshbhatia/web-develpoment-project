const Farm = require("../models/Farm");

// =============================
// Add Farm
// =============================
const addFarm = async (req, res) => {
  try {
    const {
      farmName,
      location,
      cropType,
      area,
      soilType,
    } = req.body;

    if (
      !farmName ||
      !location ||
      !cropType ||
      !area ||
      !soilType
    ) {
      return res.status(400).json({
        success: false,
        message: "Please fill all fields",
      });
    }

    const farm = await Farm.create({
      farmer: req.user._id,
      farmName,
      location,
      cropType,
      area,
      soilType,
    });

    res.status(201).json({
      success: true,
      message: "Farm Added Successfully",
      farm,
    });
  } catch (error) {
    console.error(error);

    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// =============================
// Get Logged In User Farms
// =============================
const getFarms = async (req, res) => {
  try {
    const farms = await Farm.find({
      farmer: req.user._id,
    }).populate("farmer", "name email role");

    res.status(200).json({
      success: true,
      farms,
    });
  } catch (error) {
    console.error(error);

    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// =============================
// Get Single Farm
// =============================
const getFarm = async (req, res) => {
  try {
    const farm = await Farm.findById(req.params.id).populate(
      "farmer",
      "name email role"
    );

    if (!farm) {
      return res.status(404).json({
        success: false,
        message: "Farm not found",
      });
    }

    res.status(200).json({
      success: true,
      farm,
    });
  } catch (error) {
    console.error(error);

    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// =============================
// Update Farm
// =============================
const updateFarm = async (req, res) => {
  try {
    const farm = await Farm.findByIdAndUpdate(
      req.params.id,
      req.body,
      {
        new: true,
        runValidators: true,
      }
    );

    if (!farm) {
      return res.status(404).json({
        success: false,
        message: "Farm not found",
      });
    }

    res.status(200).json({
      success: true,
      message: "Farm Updated Successfully",
      farm,
    });
  } catch (error) {
    console.error(error);

    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// =============================
// Delete Farm
// =============================
const deleteFarm = async (req, res) => {
  try {
    const farm = await Farm.findByIdAndDelete(req.params.id);

    if (!farm) {
      return res.status(404).json({
        success: false,
        message: "Farm not found",
      });
    }

    res.status(200).json({
      success: true,
      message: "Farm Deleted Successfully",
    });
  } catch (error) {
    console.error(error);

    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

module.exports = {
  addFarm,
  getFarms,
  getFarm,
  updateFarm,
  deleteFarm,
};