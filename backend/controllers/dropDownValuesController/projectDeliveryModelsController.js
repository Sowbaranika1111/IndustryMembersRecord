const { ProjectDeliveryModels } = require("../../models/dropdownValuesModel");

//! get all
const getAllProjectDeliveryModels = async (req, res) => {
  try {
    const models = await ProjectDeliveryModels.find({}).sort({ value: 1 });
    res.status(200).json({ success: true, count: models.length, data: models });
  } catch (err) {
    console.error("Error fetching project delivery models:", err);
    res.status(500).json({
      success: false,
      error: "Internal server error.",
    });
  }
};

//!insert all/one
const insertAllProjectDeliveryModels = async (req, res) => {
  try {
    const inputArray = req.body; // expects ["Onsite", "Offshore", "Hybrid"]

    if (!Array.isArray(inputArray) || inputArray.length === 0) {
      return res.status(400).json({
        success: false,
        error: "Request body must be a non-empty array of strings.",
      });
    }

    const uniqueValues = [
      ...new Set(inputArray.map((v) => String(v).trim()).filter(Boolean)),
    ];

    if (uniqueValues.length === 0) {
      return res.status(400).json({
        success: false,
        error: "No valid values provided after filtering.",
      });
    }

    const existingDocs = await ProjectDeliveryModels.find({
      value: { $in: uniqueValues },
    });

    const existingValues = new Set(existingDocs.map((doc) => doc.value));

    const newValuesToInsert = uniqueValues.filter(
      (val) => !existingValues.has(val)
    );

    if (newValuesToInsert.length === 0) {
      return res.status(200).json({
        success: true,
        message: "All provided values already exist.",
        inserted: 0,
        alreadyExists: uniqueValues.length,
      });
    }

    const documents = newValuesToInsert.map((value) => ({ value }));
    const inserted = await ProjectDeliveryModels.insertMany(documents);

    res.status(201).json({
      success: true,
      message: `Inserted ${inserted.length} new value(s).`,
      inserted: inserted.length,
      alreadyExists: uniqueValues.length - inserted.length,
      insertedValues: inserted.map((doc) => doc.value),
    });
  } catch (err) {
    console.error("Error in insertAllProjectDeliveryModels:", err);
    res.status(500).json({
      success: false,
      error: "Internal server error.",
    });
  }
};

//! updat

const updateProjectDeliveryModels = async (req, res) => {
  try {
    const { id } = req.params;
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

    const existing = await ProjectDeliveryModels.findOne({
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

    const updated = await ProjectDeliveryModels.findByIdAndUpdate(
      id,
      { value: normalizedValue },
      { new: true, runValidators: true }
    );

    if (!updated) {
      return res.status(404).json({
        error: "Document not found.",
        success: false,
      });
    }

    res.status(200).json({
      message: `Successfully updated value to "${normalizedValue}".`,
      success: true,
      item: {
        id: updated._id,
        value: updated.value,
        updatedAt: updated.updatedAt,
      },
    });
  } catch (err) {
    console.error("Error in updateProjectDeliveryModels:", err);

    if (err.name === "CastError") {
      return res.status(400).json({
        error: `Invalid ID format: ${err.message}`,
        success: false,
      });
    }

    if (err.name === "ValidationError") {
      return res.status(400).json({
        error: `Validation error: ${err.message}`,
        success: false,
      });
    }

    res.status(500).json({
      error: "Internal server error.",
      success: false,
    });
  }
};

//! delete all
const deleteAllProjectDeliveryModels = async (req, res) => {
  try {
    const result = await ProjectDeliveryModels.deleteMany({});
    res.status(200).json({
      success: true,
      message:
        result.deletedCount === 0
          ? "No models to delete."
          : `Deleted ${result.deletedCount} models.`,
      deletedCount: result.deletedCount,
    });
  } catch (err) {
    console.error("Error in deleteAllProjectDeliveryModels:", err);
    res.status(500).json({
      success: false,
      error: "Internal server error.",
    });
  }
};

// ADD single
const addSingleProjectDeliveryModel = async (req, res) => {
  try {
    const { value } = req.body;
    if (!value || typeof value !== "string" || value.trim() === "") {
      return res.status(400).json({ error: "Project delivery model value is required." });
    }
    const trimmed = value.trim();
    const exists = await ProjectDeliveryModels.findOne({ value: { $regex: new RegExp(`^${trimmed}$`, "i") } });
    if (exists) {
      return res.status(400).json({ success: false, message: `Project delivery model \"${exists.value}\" already exists (case-insensitive match).` });
    }
    const newItem = new ProjectDeliveryModels({ value: trimmed });
    const saved = await newItem.save();
    res.status(201).json({ success: true, message: "Project delivery model added successfully.", data: saved });
  } catch (err) {
    console.error("Error in addSingleProjectDeliveryModel:", err);
    if (err.code === 11000) {
      return res.status(400).json({ success: false, message: "Project delivery model already exists." });
    }
    res.status(500).json({ success: false, error: "Internal Server Error" });
  }
};

// UPDATE by ID
const updateProjectDeliveryModelById = async (req, res) => {
  try {
    const { id } = req.params;
    const { value } = req.body;
    if (!value || typeof value !== "string" || value.trim() === "") {
      return res.status(400).json({ error: "Project delivery model value is required." });
    }
    const trimmed = value.trim();
    const existing = await ProjectDeliveryModels.findOne({ _id: { $ne: id }, value: { $regex: new RegExp(`^${trimmed}$`, "i") } });
    if (existing) {
      return res.status(400).json({ success: false, message: `Project delivery model \"${existing.value}\" already exists (case-insensitive match).` });
    }
    const updated = await ProjectDeliveryModels.findByIdAndUpdate(id, { value: trimmed }, { new: true, runValidators: true });
    if (!updated) {
      return res.status(404).json({ success: false, message: "Project delivery model not found." });
    }
    res.status(200).json({ success: true, message: "Project delivery model updated successfully.", data: updated });
  } catch (err) {
    console.error("Error in updateProjectDeliveryModelById:", err);
    if (err.code === 11000) {
      return res.status(400).json({ success: false, message: "Project delivery model already exists." });
    }
    res.status(500).json({ success: false, error: "Internal Server Error" });
  }
};

// DELETE by ID
const deleteProjectDeliveryModelById = async (req, res) => {
  try {
    const id = req.params.id;
    const deleted = await ProjectDeliveryModels.findByIdAndDelete(id);
    if (!deleted) {
      return res.status(404).json({ success: false, message: "Project delivery model not found." });
    }
    res.status(200).json({ success: true, message: "Project delivery model deleted.", deleted });
  } catch (err) {
    console.error("Error in deleteProjectDeliveryModelById:", err);
    res.status(500).json({ success: false, error: "Internal Server Error" });
  }
};

module.exports = {
  getAllProjectDeliveryModels,
  addSingleProjectDeliveryModel,
  updateProjectDeliveryModelById,
  deleteProjectDeliveryModelById,
  updateProjectDeliveryModels,
  insertAllProjectDeliveryModels,
  deleteAllProjectDeliveryModels,
};
