const Equipment = require("../models/Equipment");

// ===============================
// Get All Equipment
// ===============================
const getEquipment = async (req, res) => {
  try {
    const equipment = await Equipment.find({
      farmer: req.user.id,
    }).populate("farm", "farmName");

    res.status(200).json({
      success: true,
      count: equipment.length,
      equipment,
    });
  } catch (error) {
    console.log(error);

    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// ===============================
// Add Equipment
// ===============================
const addEquipment = async (req, res) => {
  try {
    const {
      name,
      type,
      status,
      lastService,
      farm,
    } = req.body;

    const equipment = await Equipment.create({
      name,
      type,
      status,
      lastService,
      farm,
      farmer: req.user.id,
    });

    res.status(201).json({
      success: true,
      message: "Equipment Added Successfully",
      equipment,
    });
  } catch (error) {
    console.log(error);

    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// ===============================
// Update Equipment
// ===============================
const updateEquipment = async (req, res) => {
  try {
    const equipment = await Equipment.findById(req.params.id);

    if (!equipment) {
      return res.status(404).json({
        success: false,
        message: "Equipment Not Found",
      });
    }

    if (equipment.farmer.toString() !== req.user.id) {
      return res.status(401).json({
        success: false,
        message: "Unauthorized",
      });
    }

    const updated = await Equipment.findByIdAndUpdate(
      req.params.id,
      req.body,
      {
        new: true,
        runValidators: true,
      }
    );

    res.status(200).json({
      success: true,
      message: "Equipment Updated",
      equipment: updated,
    });
  } catch (error) {
    console.log(error);

    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// ===============================
// Delete Equipment
// ===============================
const deleteEquipment = async (req, res) => {
  try {
    const equipment = await Equipment.findById(req.params.id);

    if (!equipment) {
      return res.status(404).json({
        success: false,
        message: "Equipment Not Found",
      });
    }

    if (equipment.farmer.toString() !== req.user.id) {
      return res.status(401).json({
        success: false,
        message: "Unauthorized",
      });
    }

    await equipment.deleteOne();

    res.status(200).json({
      success: true,
      message: "Equipment Deleted Successfully",
    });
  } catch (error) {
    console.log(error);

    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// ===============================
// Change Status
// ===============================
const changeStatus = async (req, res) => {
  try {
    const equipment = await Equipment.findById(req.params.id);

    if (!equipment) {
      return res.status(404).json({
        success: false,
        message: "Equipment Not Found",
      });
    }

    equipment.status = req.body.status;

    await equipment.save();

    res.status(200).json({
      success: true,
      message: "Status Updated",
      equipment,
    });
  } catch (error) {
    console.log(error);

    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

module.exports = {
  getEquipment,
  addEquipment,
  updateEquipment,
  deleteEquipment,
  changeStatus,
};