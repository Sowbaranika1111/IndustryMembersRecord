const { PLMCADintegrations } = require("../../models/dropdownValuesModel.js");


//! Get all PLM CAD integrations
const getAllPlmCadIntegrations = async (req, res) => {
  try {
    const items = await PLMCADintegrations.find({});
    res.status(200).json(items);
  } catch (error) {
    console.error("Error fetching PLM CAD integrations:", error);
    res.status(500).json({ message: "Server error while fetching PLM CAD integrations" });
  }
};

//! Add or update a PLM CAD integration
const updatePlmCadIntegration = async (req, res) => {
  try {
    const { value } = req.body;
    if (!value) {
      return res.status(400).json({
        error: "Value is required.",
        success: false,
      });
    }

    if (typeof value !== "string") {
      return res.status(400).json({
        error: `Invalid value type: ${typeof value}. Must be a string.`,
        success: false,
      });
    }

    const normalizedValue = value.trim();
    if (normalizedValue.length === 0) {
      return res.status(400).json({
        error: "Value cannot be empty or whitespace.",
        success: false,
      });
    }

    const existing = await PLMCADintegrations.findOne({
      value: { $regex: new RegExp(`^${normalizedValue}$`, "i") },
    });

    if (existing) {
      return res.status(409).json({
        error: `Value "${normalizedValue}" already exists.`,
        success: false,
        existing: {
          id: existing._id,
          value: existing.value,
          createdAt: existing.createdAt,
        },
      });
    }

    const newItem = new PLMCADintegrations({ value: normalizedValue });
    const saved = await newItem.save();

    res.status(201).json({
      message: `Successfully added "${normalizedValue}".`,
      success: true,
      item: {
        id: saved._id,
        value: saved.value,
        createdAt: saved.createdAt,
        updatedAt: saved.updatedAt,
      },
      operation: "ADD_PLMCAD_INTEGRATION",
      timestamp: new Date().toISOString(),
    });
  } catch (err) {
    console.error("Error in updatePlmCadIntegration:", err);
    if (err.code === 11000) {
      return res.status(409).json({
        error: "Duplicate key error.",
        success: false,
      });
    }
    if (err.name === "ValidationError") {
      return res.status(400).json({
        error: `Validation error: ${err.message}`,
        success: false,
      });
    }
    if (err.name === "CastError") {
      return res.status(400).json({
        error: `Invalid data format: ${err.message}`,
        success: false,
      });
    }

    res.status(500).json({
      error: "Internal server error.",
      success: false,
    });
  }
};

//! Delete all PLM CAD integrations
const deleteAllPlmCadIntegrations = async (req, res) => {
  try {
    const result = await PLMCADintegrations.deleteMany({});
    if (result.deletedCount === 0) {
      return res.status(200).json({
        success: true,
        message: "No PLM CAD integrations to delete.",
        deletedCount: 0,
      });
    }

    res.status(200).json({
      success: true,
      message: `Deleted ${result.deletedCount} PLM CAD integrations.`,
      deletedCount: result.deletedCount,
    });
  } catch (err) {
    console.error("Error in deleteAllPlmCadIntegrations:", err);
    res.status(500).json({
      success: false,
      error: "Internal server error.",
    });
  }
};

//! Insert multiple PLM CAD integrations
const insertAllPlmCadIntegrations = async (req, res) => {
  try {
    const { value } = req.body;

    if (!Array.isArray(value) || value.length === 0) {
      return res.status(400).json({
        success: false,
        error: "Request must contain a non-empty 'value' array.",
      });
    }

    const uniqueValues = [...new Set(value.map((v) => String(v).trim()).filter(Boolean))];
    if (uniqueValues.length === 0) {
      return res.status(400).json({
        success: false,
        error: "No valid values provided.",
      });
    }

    const existingDocs = await PLMCADintegrations.find({
      value: { $in: uniqueValues },
    });

    const existingValues = new Set(existingDocs.map((doc) => doc.value));
    const newValues = uniqueValues.filter((val) => !existingValues.has(val));
    const alreadyExistCount = uniqueValues.length - newValues.length;

    if (newValues.length === 0) {
      return res.status(200).json({
        success: true,
        message: "All provided values already exist.",
        totalProvided: uniqueValues.length,
        inserted: 0,
        alreadyExists: alreadyExistCount,
      });
    }

    const docsToInsert = newValues.map((value) => ({ value }));
    const inserted = await PLMCADintegrations.insertMany(docsToInsert);

    res.status(201).json({
      success: true,
      message: `Inserted ${inserted.length} new PLM CAD integrations.`,
      totalProvided: uniqueValues.length,
      inserted: inserted.length,
      alreadyExists: alreadyExistCount,
      insertedValues: inserted.map((doc) => doc.value),
    });
  } catch (err) {
    console.error("Error in insertAllPlmCadIntegrations:", err);
    res.status(500).json({
      success: false,
      error: "Internal server error.",
    });
  }
};

module.exports = {
  getAllPlmCadIntegrations,
  updatePlmCadIntegration,
  deleteAllPlmCadIntegrations,
  insertAllPlmCadIntegrations,
};
