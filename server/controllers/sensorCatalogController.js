const SensorCatalog = require("../models/SensorCatalog");

// ==============================
// Get All Sensors
// ==============================

const getSensors = async (req, res) => {
  try {
    const sensors = await SensorCatalog.find().sort({
      createdAt: -1,
    });

    res.status(200).json({
      success: true,
      count: sensors.length,
      sensors,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// ==============================
// Get Single Sensor
// ==============================

const getSensor = async (req, res) => {
  try {
    const sensor = await SensorCatalog.findById(req.params.id);

    if (!sensor) {
      return res.status(404).json({
        success: false,
        message: "Sensor not found",
      });
    }

    res.status(200).json({
      success: true,
      sensor,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// ==============================
// Add Sensor
// ==============================

const addSensor = async (req, res) => {
  try {
    const sensor = await SensorCatalog.create(req.body);

    res.status(201).json({
      success: true,
      message: "Sensor Added Successfully",
      sensor,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// ==============================
// Update Sensor
// ==============================

const updateSensor = async (req, res) => {
  try {
    const sensor = await SensorCatalog.findByIdAndUpdate(
      req.params.id,
      req.body,
      {
        new: true,
        runValidators: true,
      }
    );

    if (!sensor) {
      return res.status(404).json({
        success: false,
        message: "Sensor not found",
      });
    }

    res.status(200).json({
      success: true,
      message: "Sensor Updated Successfully",
      sensor,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// ==============================
// Delete Sensor
// ==============================

const deleteSensor = async (req, res) => {
  try {
    const sensor = await SensorCatalog.findByIdAndDelete(
      req.params.id
    );

    if (!sensor) {
      return res.status(404).json({
        success: false,
        message: "Sensor not found",
      });
    }

    res.status(200).json({
      success: true,
      message: "Sensor Deleted Successfully",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

module.exports = {
  getSensors,
  getSensor,
  addSensor,
  updateSensor,
  deleteSensor,
};