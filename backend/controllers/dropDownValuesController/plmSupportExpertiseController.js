const { PLMSupportExpertise } = require("../../models/dropdownValuesModel");

// GET all PLM Support Expertise entries
const getAllPLMSupportExpertise = async (req, res) => {
  try {
    const entries = await PLMSupportExpertise.find().sort({ value: 1 });
    res.status(200).json({
      success: true,
      count: entries.length,
      data: entries
    });
  } catch (error) {
    console.error("Error fetching PLM Support Expertise:", error);
    res.status(500).json({
      success: false,
      error: "Failed to fetch PLM Support Expertise"
    });
  }
};

// ADD a single PLM Support Expertise entry
const addPLMSupportExpertise = async (req, res) => {
  try {
    const { value } = req.body;

    // Validate input
    if (!value || typeof value !== "string" || value.trim() === "") {
      return res.status(400).json({
        success: false,
        error: "Valid PLM Support Expertise value is required"
      });
    }

    const trimmedValue = value.trim();

    // Check for existing entry (case-insensitive)
    const existingEntry = await PLMSupportExpertise.findOne({
      value: { $regex: new RegExp(`^${trimmedValue}$`, "i") }
    });

    if (existingEntry) {
      return res.status(400).json({
        success: false,
        error: `PLM Support Expertise '${existingEntry.value}' already exists`
      });
    }

    // Create new entry
    const newEntry = await PLMSupportExpertise.create({ value: trimmedValue });

    res.status(201).json({
      success: true,
      message: "PLM Support Expertise added successfully",
      data: newEntry
    });
  } catch (error) {
    console.error("Error adding PLM Support Expertise:", error);
    res.status(500).json({
      success: false,
      error: "Failed to add PLM Support Expertise"
    });
  }
};

// UPDATE a PLM Support Expertise entry
const updatePLMSupportExpertise = async (req, res) => {
  try {
    const { id } = req.params;
    const { value } = req.body;

    // Validate input
    if (!value || typeof value !== "string" || value.trim() === "") {
      return res.status(400).json({
        success: false,
        error: "Valid PLM Support Expertise value is required"
      });
    }

    const trimmedValue = value.trim();

    // Check for duplicate entries (excluding current entry)
    const duplicateEntry = await PLMSupportExpertise.findOne({
      _id: { $ne: id },
      value: { $regex: new RegExp(`^${trimmedValue}$`, "i") }
    });

    if (duplicateEntry) {
      return res.status(400).json({
        success: false,
        error: `PLM Support Expertise '${duplicateEntry.value}' already exists`
      });
    }

    // Update the entry
    const updatedEntry = await PLMSupportExpertise.findByIdAndUpdate(
      id,
      { value: trimmedValue },
      { new: true, runValidators: true }
    );

    if (!updatedEntry) {
      return res.status(404).json({
        success: false,
        error: "PLM Support Expertise entry not found"
      });
    }

    res.status(200).json({
      success: true,
      message: "PLM Support Expertise updated successfully",
      data: updatedEntry
    });
  } catch (error) {
    console.error("Error updating PLM Support Expertise:", error);
    res.status(500).json({
      success: false,
      error: "Failed to update PLM Support Expertise"
    });
  }
};

// DELETE a single PLM Support Expertise entry
const deletePLMSupportExpertise = async (req, res) => {
  try {
    const { id } = req.params;

    const deletedEntry = await PLMSupportExpertise.findByIdAndDelete(id);

    if (!deletedEntry) {
      return res.status(404).json({
        success: false,
        error: "PLM Support Expertise entry not found"
      });
    }

    res.status(200).json({
      success: true,
      message: "PLM Support Expertise deleted successfully",
      data: deletedEntry
    });
  } catch (error) {
    console.error("Error deleting PLM Support Expertise:", error);
    res.status(500).json({
      success: false,
      error: "Failed to delete PLM Support Expertise"
    });
  }
};

// DELETE all PLM Support Expertise entries
const deleteAllPLMSupportExpertise = async (req, res) => {
  try {
    const result = await PLMSupportExpertise.deleteMany({});
    res.status(200).json({
      success: true,
      message: `Deleted ${result.deletedCount} PLM Support Expertise entries.`,
      deletedCount: result.deletedCount
    });
  } catch (error) {
    console.error("Error deleting all PLM Support Expertise:", error);
    res.status(500).json({
      success: false,
      error: "Failed to delete PLM Support Expertise entries"
    });
  }
};

// BULK INSERT PLM Support Expertise entries
const bulkInsertPLMSupportExpertise = async (req, res) => {
  try {
    const values = req.body;

    if (!Array.isArray(values) || values.length === 0) {
      return res.status(400).json({
        success: false,
        error: "Request body must be a non-empty array of values."
      });
    }

    const cleanedValues = values
      .filter(v => typeof v === "string" && v.trim() !== "")
      .map(v => v.trim());

    const uniqueInputValues = [];
    const seen = new Set();

    for (const val of cleanedValues) {
      const lowerVal = val.toLowerCase();
      if (!seen.has(lowerVal)) {
        seen.add(lowerVal);
        uniqueInputValues.push(val);
      }
    }

    if (uniqueInputValues.length === 0) {
      return res.status(400).json({
        success: false,
        error: "No valid values provided after filtering."
      });
    }

    const existingDocs = await PLMSupportExpertise.find({
      value: { $in: uniqueInputValues.map(v => new RegExp(`^${v}$`, 'i')) }
    });

    const existingSetLower = new Set(
      existingDocs.map(doc => doc.value.toLowerCase())
    );

    const newValues = uniqueInputValues.filter(
      val => !existingSetLower.has(val.toLowerCase())
    );

    const alreadyExistCount = uniqueInputValues.length - newValues.length;

    if (newValues.length === 0) {
      return res.status(200).json({
        success: true,
        message: "All provided values already exist (case-insensitive).",
        inserted: 0,
        alreadyExists: alreadyExistCount,
        skipped: [...existingSetLower]
      });
    }

    const documents = newValues.map(value => ({ value }));
    const inserted = await PLMSupportExpertise.insertMany(documents);

    res.status(201).json({
      success: true,
      message: `${inserted.length} new PLM Support Expertise values added.`,
      insertedValues: inserted.map(doc => doc.value),
      alreadyExists: alreadyExistCount,
      skipped: [...existingSetLower]
    });

  } catch (error) {
    console.error("Error in bulkInsertPLMSupportExpertise:", error);
    res.status(500).json({
      success: false,
      error: "Internal Server Error while inserting."
    });
  }
};

module.exports = {
  getAllPLMSupportExpertise,
  addPLMSupportExpertise,
  updatePLMSupportExpertise,
  deletePLMSupportExpertise,
  deleteAllPLMSupportExpertise,
  bulkInsertPLMSupportExpertise
};
