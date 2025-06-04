// backend/controllers/batchmateController.js
const Batchmate = require("../models/Batchmate.js");

// Add new batchmate
const { appendToExcel } = require("../utils/excelHandler");

exports.addBatchmate = async (req, res) => {
  try {
    const { emailAddress } = req.body;

    // Check if email already exists
    const existing = await Batchmate.findOne({ emailAddress });

    if (existing) {
      return res
        .status(409)
        .json({ message: "Batchmate with this email already exists." });
    }

    // Create and save new batchmate
    const batchmate = new Batchmate(req.body);
    const saved = await batchmate.save();

    // Append to Excel
    appendToExcel(saved);

    res.status(201).json(saved);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

// !===============================================================

// Get all batchmates
exports.getAllBatchmates = async (req, res) => {
  try {
    const batchmates = await Batchmate.find();
    res.json(batchmates);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.searchBatchmateByName = async (req, res) => {
  try {
    const { name } = req.query;

    if (!name) {
      return res
        .status(400)
        .json({ error: "Name query parameter is required" });
    }

    // Create a case-insensitive regex to match the full name
    const regex = new RegExp(`^${name}$`, "i");

    const result = await Batchmate.findOne({ name: regex });

    if (!result) {
      return res
        .status(404)
        .json({ error: "No batchmate found with that name" });
    }

    res.status(200).json(result);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Edit batchmate
exports.updateBatchmate = async (req, res) => {
  try {
    const { name } = req.params;
    const updateData = req.body;

    // Validate request body
    if (!updateData || Object.keys(updateData).length === 0) {
      return res.status(400).json({
        success: false,
        message: "No update data provided",
      });
    }

    // Find batchmate by name (case-insensitive search)
    const existingBatchmate = await Batchmate.findOne({
      name: { $regex: new RegExp(`^${name}$`, "i") },
    });

    if (!existingBatchmate) {
      return res.status(404).json({
        success: false,
        message: `No user found with the name "${name}"`,
      });
    }

    // Check if any fields are actually being updated
    const fieldsToUpdate = Object.keys(updateData);
    const hasChanges = fieldsToUpdate.some(
      (field) => String(existingBatchmate[field]) !== String(updateData[field])
    );

    if (!hasChanges) {
      return res.status(200).json({
        success: true,
        message: "Nothing was updated",
        data: existingBatchmate,
      });
    }

    // Update batchmate by name
    const updatedBatchmate = await Batchmate.findOneAndUpdate(
      { name: { $regex: new RegExp(`^${name}$`, "i") } },
      updateData,
      {
        new: true,
        runValidators: true,
        select: "-__v",
      }
    );

    return res.status(200).json({
      success: true,
      message: "Batchmate updated successfully",
      data: updatedBatchmate,
      updatedFields: fieldsToUpdate,
    });
  } catch (error) {
    console.error("Error updating batchmate:", error);

    // Handle validation errors
    if (error.name === "ValidationError") {
      const validationErrors = Object.values(error.errors).map(
        (err) => err.message
      );
      return res.status(400).json({
        success: false,
        message: "Validation failed",
        errors: validationErrors,
      });
    }

    // Generic server error
    return res.status(500).json({
      success: false,
      message: "Internal server error occurred while updating batchmate",
    });
  }
};
