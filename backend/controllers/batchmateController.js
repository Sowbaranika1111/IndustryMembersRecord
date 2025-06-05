const Batchmate = require("../models/Batchmate.js");
const { appendToExcel } = require("../utils/excelHandler.js");

exports.addBatchmate = async (req, res) => {
  try {
    const { email_address } = req.body;
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (
      !email_address ||
      typeof email_address !== "string" ||
      email_address.trim() === "" ||
      !emailRegex.test(email_address.trim())
    ) {
      return res
        .status(400)
        .json({
          message: "A valid email address (email_address) is required.",
        });
    }
    const normalizedEmail = email_address.toLowerCase().trim();
    const existingBatchmate = await Batchmate.findOne({
      email_address: normalizedEmail,
    });
    if (existingBatchmate) {
      return res
        .status(409)
        .json({ message: "Batchmate with this email already exists." });
    }

    const newBatchmateData = {
      ...req.body,
      email_address: normalizedEmail,
    };

    const batchmate = new Batchmate(newBatchmateData);
    const savedBatchmate = await batchmate.save();

    if (typeof appendToExcel === "function") {
      appendToExcel(savedBatchmate.toObject());
    } else {
      console.warn(
        "appendToExcel utility is not available or not imported correctly."
      );
    }

    res.status(201).json(savedBatchmate.toObject());
  } catch (err) {
    if (err.code === 11000) {
      return res.status(409).json({
        message: "Database constraint violation: This email already exists.",
      });
    }
    if (err.name === "ValidationError") {
      const messages = Object.values(err.errors).map((val) => val.message);
      return res
        .status(400)
        .json({ message: "Validation Error", errors: messages });
    }
    console.error("Server error in addBatchmate:", err);
    res.status(500).json({ error: "An internal server error occurred." });
  }
};

exports.getAllBatchmates = async (req, res) => {
  try {
    const batchmates = await Batchmate.find().lean();
    res.json(batchmates);
  } catch (err) {
    console.error("Error in getAllBatchmates:", err);
    res.status(500).json({ error: "Server error: " + err.message });
  }
};

exports.getBatchmateById = async (req, res) => {
  try {
    const batchmateId = req.params.id;
    const batchmate = await Batchmate.findById(batchmateId).lean();

    if (!batchmate) {
      return res.status(404).json({ message: "Batchmate not found" });
    }
    console.log(`GET_BATCHMATE_BY_ID: Sending data for ID '${batchmateId}'`);
    res.json(batchmate);
  } catch (err) {
    console.error("Error in getBatchmateById:", err);
    if (err.kind === "ObjectId") {
      return res.status(400).json({ message: "Invalid Batchmate ID format." });
    }
    res.status(500).json({ error: "Server error: " + err.message });
  }
};

exports.searchBatchmateByName = async (req, res) => {
  try {
    const { name } = req.query;
    if (!name) {
      return res.status(400).json({ error: "Name query parameter is required" });
    }
    const regex = new RegExp(`^${name}$`, "i");
    const result = await Batchmate.findOne({ name: regex }).lean();
    if (!result) {
      return res.status(404).json({ message: "No batchmate found with that name" });
    }
    res.status(200).json(result);
  } catch (err) {
    console.error("Error in searchBatchmateByName:", err);
    res.status(500).json({ error: "Server error: " + err.message });
  }
};

exports.updateBatchmate = async (req, res) => {
  try {
    const { name: searchNameParam } = req.params;
    const updateDataFromRequest = req.body;

    if (
      !updateDataFromRequest ||
      Object.keys(updateDataFromRequest).length === 0
    ) {
      return res
        .status(400)
        .json({ success: false, message: "No update data provided" });
    }

    const existingBatchmate = await Batchmate.findOne({
      name: { $regex: new RegExp(`^${searchNameParam}$`, "i") },
    });

    if (!existingBatchmate) {
      return res.status(404).json({
        success: false,
        message: `No user found with the name "${searchNameParam}"`,
      });
    }

    let dataToUpdate = { ...updateDataFromRequest };
    if (
      dataToUpdate.email_address &&
      typeof dataToUpdate.email_address === "string"
    ) {
      const normalizedEmail = dataToUpdate.email_address.toLowerCase().trim();
      if (normalizedEmail !== existingBatchmate.email_address) {
        const conflictingBatchmate = await Batchmate.findOne({
          email_address: normalizedEmail,
          _id: { $ne: existingBatchmate._id },
        });
        if (conflictingBatchmate) {
          return res.status(409).json({
            success: false,
            message: `The email "${normalizedEmail}" is already in use by another batchmate.`,
          });
        }
      }
      dataToUpdate.email_address = normalizedEmail;
    }

    const updatedBatchmate = await Batchmate.findOneAndUpdate(
      { name: { $regex: new RegExp(`^${searchNameParam}$`, "i") } },
      { $set: dataToUpdate },
      { new: true, runValidators: true, lean: true }
    );

    if (!updatedBatchmate) {
      return res.status(404).json({
        success: false,
        message: "Batchmate found but failed to update.",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Batchmate updated successfully",
      data: updatedBatchmate,
    });
  } catch (error) {
    console.error("Error updating batchmate:", error);
    if (error.name === "ValidationError") {
      const validationErrors = Object.values(error.errors).map(
        (err) => err.message
      );
      return res
        .status(400)
        .json({
          success: false,
          message: "Validation failed",
          errors: validationErrors,
        });
    }
    if (error.code === 11000) {
      return res.status(409).json({
        success: false,
        message: "Update failed due to a duplicate key (likely email).",
        errorDetail: error.keyValue,
      });
    }
    return res.status(500).json({
      success: false,
      message: "Internal server error occurred while updating batchmate.",
    });
  }
};
