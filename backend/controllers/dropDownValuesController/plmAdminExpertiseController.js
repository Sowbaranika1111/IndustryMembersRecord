const { PLMAdminExpertise } = require("../../models/dropdownValuesModel.js");

// GET all expertise
const getAllExpertise = async (req, res) => {
  try {
    const expertises = await PLMAdminExpertise.find().sort({ value: 1 });

    if (!expertises || expertises.length === 0) {
      return res.status(404).json({
        success: false,
        message: "No expertise entries found",
      });
    }

    res.status(200).json({
      success: true,
      count: expertises.length,
      data: expertises,
    });

  } catch (error) {
    console.error("Error in getAllExpertise:", error);
    res.status(500).json({
      success: false,
      message: "Internal Server Error",
    });
  }
};

// ADD single expertise value
const addSingleExpertise = async (req, res) => {
  try {
    const { value } = req.body;
    if (!value || typeof value !== "string" || value.trim() === "") {
      return res.status(400).json({ error: "Expertise value is required." });
    }
    const trimmed = value.trim();
    const exists = await PLMAdminExpertise.findOne({ value: { $regex: new RegExp(`^${trimmed}$`, "i") } });
    if (exists) {
      return res.status(400).json({ success: false, message: `Expertise "${exists.value}" already exists (case-insensitive match).` });
    }
    const newItem = new PLMAdminExpertise({ value: trimmed });
    const saved = await newItem.save();
    res.status(201).json({ success: true, message: "Expertise added successfully.", data: saved });
  } catch (err) {
    console.error("Error in addSingleExpertise:", err);
    if (err.code === 11000) {
      return res.status(400).json({ success: false, message: "Expertise already exists." });
    }
    res.status(500).json({ success: false, error: "Internal Server Error" });
  }
};

// UPDATE expertise by ID
const updateExpertiseById = async (req, res) => {
  try {
    const { id } = req.params;
    const { value } = req.body;
    if (!value || typeof value !== "string" || value.trim() === "") {
      return res.status(400).json({ error: "Expertise value is required." });
    }
    const trimmed = value.trim();
    const existing = await PLMAdminExpertise.findOne({ _id: { $ne: id }, value: { $regex: new RegExp(`^${trimmed}$`, "i") } });
    if (existing) {
      return res.status(400).json({ success: false, message: `Expertise "${existing.value}" already exists (case-insensitive match).` });
    }
    const updated = await PLMAdminExpertise.findByIdAndUpdate(id, { value: trimmed }, { new: true, runValidators: true });
    if (!updated) {
      return res.status(404).json({ success: false, message: "Expertise not found." });
    }
    res.status(200).json({ success: true, message: "Expertise updated successfully.", data: updated });
  } catch (err) {
    console.error("Error in updateExpertiseById:", err);
    if (err.code === 11000) {
      return res.status(400).json({ success: false, message: "Expertise already exists." });
    }
    res.status(500).json({ success: false, error: "Internal Server Error" });
  }
};

// DELETE expertise by ID
const deleteExpertiseById = async (req, res) => {
  try {
    const id = req.params.id;
    const deleted = await PLMAdminExpertise.findByIdAndDelete(id);
    if (!deleted) {
      return res.status(404).json({ success: false, message: "Expertise not found." });
    }
    res.status(200).json({ success: true, message: "Expertise deleted.", deleted });
  } catch (err) {
    console.error("Error in deleteExpertiseById:", err);
    res.status(500).json({ success: false, error: "Internal Server Error" });
  }
};

// DELETE all expertise
const deleteAllExpertise = async (req, res) => {
  try {
    const deletionResult = await PLMAdminExpertise.deleteMany({});

    if (deletionResult.deletedCount === 0) {
      return res.status(200).json({
        success: true,
        message: "No expertise entries to delete.",
        deletedCount: 0,
      });
    }

    res.status(200).json({
      success: true,
      message: `Deleted all ${deletionResult.deletedCount} expertise entries.`,
      deletedCount: deletionResult.deletedCount,
    });

  } catch (error) {
    console.error("Error in deleteAllExpertise:", error);
    res.status(500).json({
      success: false,
      message: "Internal Server Error",
    });
  }
};

// BULK INSERT expertise
const insertAllExpertise = async (req, res) => {
  try {
    const values = req.body;

    // 1. Validate input
    if (!Array.isArray(values) || values.length === 0) {
      return res.status(400).json({
        success: false,
        error: "Request body must be a non-empty array of expertise names.",
      });
    }

    // 2. Normalize & deduplicate
    const uniqueInputValues = [...new Set(
      values.map(v => String(v).trim()).filter(Boolean)
    )];

    if (uniqueInputValues.length === 0) {
      return res.status(400).json({
        success: false,
        error: "No valid expertise names provided after filtering.",
      });
    }

    // 3. Check for existing entries (✔️ fixed from 'name' to 'value')
    const existingDocs = await PLMAdminExpertise.find({ value: { $in: uniqueInputValues } });
    const existingValues = new Set(existingDocs.map(doc => doc.value));

    // 4. Filter only new values
    const newValuesToInsert = uniqueInputValues.filter(val => !existingValues.has(val));
    const alreadyExistCount = uniqueInputValues.length - newValuesToInsert.length;

    // 5. If no new values, respond early
    if (newValuesToInsert.length === 0) {
      return res.status(200).json({
        success: true,
        message: "No new entries added, all provided expertise already exist.",
        totalProvided: uniqueInputValues.length,
        inserted: 0,
        alreadyExists: alreadyExistCount,
      });
    }

    // 6. Prepare and insert new documents
    const documentsToInsert = newValuesToInsert.map(value => ({ value }));
    const inserted = await PLMAdminExpertise.insertMany(documentsToInsert);

    // 7. Send final response
    res.status(201).json({
      success: true,
      message: `Added ${inserted.length} new expertise entries.`,
      totalProvided: uniqueInputValues.length,
      inserted: inserted.length,
      alreadyExists: alreadyExistCount,
      insertedValues: inserted.map(doc => doc.value),
    });

  } catch (err) {
    console.error("Error in insertAllExpertise:", err);
    res.status(500).json({
      success: false,
      error: "Internal Server Error while adding expertise entries.",
    });
  }
};

module.exports = {
  getAllExpertise,
  addSingleExpertise,
  updateExpertiseById,
  deleteExpertiseById,
  deleteAllExpertise,
  insertAllExpertise
};