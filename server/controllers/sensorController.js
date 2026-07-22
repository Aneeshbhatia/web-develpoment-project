const Sensor = require("../models/Sensor");
const { searchImage } = require("../Service/pixabayService");

// ==========================================
// Get All Installed Sensors
// ==========================================
exports.getSensors = async (req, res) => {
  try {
    const sensors = await Sensor.find({
      owner: req.user._id,
    })
      .populate("farm")
      .populate("equipment")
      .populate("sensorCatalog")
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      sensors,
    });
  } catch (err) {
    console.error(err);

    res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};

// ==========================================
// Get Single Installed Sensor
// ==========================================
exports.getSensorById = async (req, res) => {
  try {
    const sensor = await Sensor.findOne({
      _id: req.params.id,
      owner: req.user._id,
    })
      .populate("farm")
      .populate("equipment")
      .populate("sensorCatalog");

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
  } catch (err) {
    console.error(err);

    res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};

// ==========================================
// Install Sensor
// ==========================================
exports.addSensor = async (req, res) => {
  try {
    const {
      sensorCatalog,
      name,
      brand,
      type,
      sensorType,
      farm,
      equipment,
      location,
      batteryLevel,
      status,
      value,
      unit,
      image,
    } = req.body;

    const finalType = type || sensorType;

    let sensorImage = image || "";

    if (!sensorImage) {
      try {
        sensorImage = await searchImage(`${finalType} sensor`);
      } catch (e) {
        console.log("Pixabay Error:", e.message);
      }
    }

    const sensor = await Sensor.create({
      owner: req.user._id,

      sensorCatalog: sensorCatalog || null,

      name,
      brand: brand || "",

      type: finalType,

      farm,

      equipment: equipment || null,

      location: location || "",

      batteryLevel:
        batteryLevel !== undefined
          ? batteryLevel
          : 100,

      status: status || "Active",

      value: value || 0,

      unit: unit || "%",

      image: sensorImage,
    });

    res.status(201).json({
      success: true,
      message: "Sensor installed successfully",
      sensor,
    });
  } catch (err) {
    console.error(err);

    res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};

// ==========================================
// Update Installed Sensor
// ==========================================
exports.updateSensor = async (req, res) => {
  try {
    const sensor = await Sensor.findOneAndUpdate(
      {
        _id: req.params.id,
        owner: req.user._id,
      },
      req.body,
      {
        new: true,
        runValidators: true,
      }
    )
      .populate("farm")
      .populate("equipment")
      .populate("sensorCatalog");

    if (!sensor) {
      return res.status(404).json({
        success: false,
        message: "Sensor not found",
      });
    }

    res.status(200).json({
      success: true,
      message: "Sensor updated successfully",
      sensor,
    });
  } catch (err) {
    console.error(err);

    res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};

// ==========================================
// Delete Installed Sensor
// ==========================================
exports.deleteSensor = async (req, res) => {
  try {
    const sensor = await Sensor.findOne({
      _id: req.params.id,
      owner: req.user._id,
    });

    if (!sensor) {
      return res.status(404).json({
        success: false,
        message: "Sensor not found",
      });
    }

    await sensor.deleteOne();

    res.status(200).json({
      success: true,
      message: "Sensor deleted successfully",
    });
  } catch (err) {
    console.error(err);

    res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};

// ==========================================
// Change Sensor Status
// ==========================================
exports.changeSensorStatus = async (req, res) => {
  try {
    const sensor = await Sensor.findOne({
      _id: req.params.id,
      owner: req.user._id,
    });

    if (!sensor) {
      return res.status(404).json({
        success: false,
        message: "Sensor not found",
      });
    }

    sensor.status = req.body.status;

    await sensor.save();

    res.status(200).json({
      success: true,
      message: "Status updated successfully",
      sensor,
    });
  } catch (err) {
    console.error(err);

    res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};