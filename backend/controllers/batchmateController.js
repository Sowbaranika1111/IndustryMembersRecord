const Batchmate = require("../models/Batchmate.js");
//const { appendToExcel } = require("../utils/excelHandler.js");

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
      return res.status(400).json({
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

//! Get all
// http://localhost:5000/api/batchmates/
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

// get by mail
//! http://localhost:5000/api/batchmates/email?email=abc@accenture.com GET

exports.getBatchmateByEmail = async (req, res) => {
  try {
    const { email } = req.query;

    // Enhanced email validation
    if (!email || typeof email !== "string" || email.trim() === "") {
      return res.status(400).json({
        success: false,
        message: "A valid email query parameter is required.",
      });
    }

    const normalizedEmail = email.toLowerCase().trim();

    // Email format validation (basic regex)
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(normalizedEmail)) {
      return res.status(400).json({
        success: false,
        message: "Please provide a valid email format.",
      });
    }

    // Fetch all available fields and exclude only sensitive ones
    const batchmate = await Batchmate.findOne({
      email_address: normalizedEmail,
    })
      .select("-otp -otp_expiry -role")
      .lean();

    if (!batchmate) {
      return res.status(404).json({
        success: false,
        message: "Batchmate not found with the provided email address.",
      });
    }

    console.log(
      `GET_BATCHMATE_BY_EMAIL: Successfully retrieved data for '${normalizedEmail}'`
    );

    // Return consistent response structure
    res.status(200).json({
      success: true,
      data: batchmate,
      message: "Batchmate details retrieved successfully",
    });
  } catch (err) {
    console.error("Error in getBatchmateByEmail:", err);

    // Handle specific MongoDB errors
    if (err.name === "ValidationError") {
      return res.status(400).json({
        success: false,
        error: "Validation error",
        details: err.message,
      });
    }

    if (err.name === "CastError") {
      return res.status(400).json({
        success: false,
        error: "Invalid data format",
        details: err.message,
      });
    }

    // Generic server error
    res.status(500).json({
      success: false,
      error: "Internal server error",
      message:
        process.env.NODE_ENV === "development"
          ? err.message
          : "Something went wrong",
    });
  }
};

// exports.searchBatchmateByName = async (req, res) => {
//   try {
//     const { name } = req.query;
//     if (!name) {
//       return res.status(400).json({ error: "Name query parameter is required" });
//     }

//     const escapedName = name.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
//     const regex = new RegExp(`^${escapedName}\\s*(\\(.*\\))?$`, "i");

//     const result = await Batchmate.findOne({ name: regex }).lean();
//     if (!result) {
//       return res.status(404).json({ message: "No batchmate found with that name" });
//     }
//     res.status(200).json(result);
//   } catch (err) {
//     console.error("Error in searchBatchmateByName:", err);
//     res.status(500).json({ error: "Server error: " + err.message });
//   }
// };

exports.searchBatchmateByName = async (req, res) => {
  try {
    const { name } = req.query;

    if (!name || typeof name !== "string") {
      return res
        .status(400)
        .json({ error: "Name query parameter is required" });
    }

    const escapedInput = name.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
    const regex = new RegExp(escapedInput, "i"); // Partial match, case-insensitive

    const results = await Batchmate.find({ name: regex })
      .limit(12) // limit to 10 suggestions
      .sort({ name: 1 }) // sort alphabetically
      .lean();

    if (!results || results.length === 0) {
      return res
        .status(404)
        .json({ message: "No batchmates found with that name" });
    }

    res.status(200).json(results);
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
      return res.status(400).json({
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

//!Delete all
// /api/batchmates/delete-all
exports.deleteAllBatchmates = async (req, res) => {
  try {
    const result = await Batchmate.deleteMany({}); // empty filter deletes all documents

    res.status(200).json({
      success: true,
      message: `${result.deletedCount} batchmate record(s) deleted successfully.`,
      timestamp: new Date().toISOString(),
    });
  } catch (err) {
    console.error("Error in deleteAllBatchmates:", err);
    res.status(500).json({
      success: false,
      error: "Internal server error while deleting batchmate data.",
      details: process.env.NODE_ENV === "development" ? err.message : undefined,
    });
  }
};

// GET by enterprise ID
exports.getBatchmateByEnterpriseId = async (req, res) => {
  try {
    const { enterpriseId } = req.params;
    
    if (!enterpriseId || typeof enterpriseId !== "string" || enterpriseId.trim() === "") {
      return res.status(400).json({
        success: false,
        message: "A valid enterprise ID parameter is required.",
      });
    }

    const normalizedEnterpriseId = enterpriseId.trim().toLowerCase();

    const batchmate = await Batchmate.findOne({
      enterpriseid: normalizedEnterpriseId,
    })
      .select("-otp -otp_expiry")
      .lean();

    if (!batchmate) {
      return res.status(404).json({
        success: false,
        message: "Batchmate not found with the provided enterprise ID.",
      });
    }

    console.log(
      `GET_BATCHMATE_BY_ENTERPRISE_ID: Successfully retrieved data for '${normalizedEnterpriseId}'`
    );

    res.status(200).json({
      success: true,
      data: batchmate,
      message: "Batchmate details retrieved successfully",
    });
  } catch (err) {
    console.error("Error in getBatchmateByEnterpriseId:", err);

    if (err.name === "ValidationError") {
      return res.status(400).json({
        success: false,
        error: "Validation error",
        details: err.message,
      });
    }

    if (err.name === "CastError") {
      return res.status(400).json({
        success: false,
        error: "Invalid data format",
        details: err.message,
      });
    }

    res.status(500).json({
      success: false,
      error: "Internal server error",
      message:
        process.env.NODE_ENV === "development"
          ? err.message
          : "Something went wrong",
    });
  }
};
