const { PLMIntegrationExpertise } = require("../../models/dropdownValuesModel");

// GET all PLM integration expertise entries
const getAllPLMIntegrationExpertise = async (req, res) => {
  try {
    const values = await PLMIntegrationExpertise.find().sort({ value: 1 });
    res.status(200).json({
      success: true,
      count: values.length,
      data: values
    });
  } catch (err) {
    console.error("Error in getAllPLMIntegrationExpertise:", err);
    res.status(500).json({ success: false, error: "Internal Server Error" });
  }
};

// ADD single PLM integration expertise
const addSinglePLMIntegrationExpertise = async (req, res) => {
  try {
    const { value } = req.body;
    if (!value || typeof value !== "string" || value.trim() === "") {
      return res.status(400).json({ error: "PLM integration expertise value is required." });
    }
    const trimmed = value.trim();
    const exists = await PLMIntegrationExpertise.findOne({ value: { $regex: new RegExp(`^${trimmed}$`, "i") } });
    if (exists) {
      return res.status(400).json({ success: false, message: `PLM integration expertise "${exists.value}" already exists (case-insensitive match).` });
    }
    const newItem = new PLMIntegrationExpertise({ value: trimmed });
    const saved = await newItem.save();
    res.status(201).json({ success: true, message: "PLM integration expertise added successfully.", data: saved });
  } catch (err) {
    console.error("Error in addSinglePLMIntegrationExpertise:", err);
    if (err.code === 11000) {
      return res.status(400).json({ success: false, message: "PLM integration expertise already exists." });
    }
    res.status(500).json({ success: false, error: "Internal Server Error" });
  }
};

// POST one PLM integration expertise (with case-insensitive check)
const addPLMIntegrationExpertise = async (req, res) => {
  try {
    const { value } = req.body;
    if (!value || typeof value !== "string" || value.trim() === "") {
      return res.status(400).json({ error: "PLM integration expertise value is required." });
    }

    const trimmed = value.trim();
    const exists = await PLMIntegrationExpertise.findOne({
      value: { $regex: new RegExp(`^${trimmed}$`, "i") }
    });

    if (exists) {
      return res.status(400).json({ 
        success: false,
        message: `PLM integration expertise "${exists.value}" already exists (case-insensitive match).`
      });
    }

    const newItem = new PLMIntegrationExpertise({ value: trimmed });
    const saved = await newItem.save();
    res.status(201).json({
      success: true,
      message: "PLM integration expertise added.",
      data: saved
    });
  } catch (err) {
    console.error("Error in addPLMIntegrationExpertise:", err);
    res.status(500).json({ success: false, error: "Internal Server Error" });
  }
};

// UPDATE existing PLM integration expertise (with case-insensitive check)
const updatePLMIntegrationExpertiseById = async (req, res) => {
  try {
    const { id } = req.params;
    const { value } = req.body;

    if (!value || typeof value !== "string" || value.trim() === "") {
      return res.status(400).json({ error: "PLM integration expertise value is required." });
    }

    const trimmed = value.trim();
    const existing = await PLMIntegrationExpertise.findOne({
      _id: { $ne: id },
      value: { $regex: new RegExp(`^${trimmed}$`, "i") }
    });

    if (existing) {
      return res.status(400).json({
        success: false,
        message: `PLM integration expertise "${existing.value}" already exists (case-insensitive match).`
      });
    }

    const updated = await PLMIntegrationExpertise.findByIdAndUpdate(
      id,
      { value: trimmed },
      { new: true, runValidators: true }
    );

    if (!updated) {
      return res.status(404).json({ 
        success: false,
        message: "Entry not found." 
      });
    }

    res.status(200).json({
      success: true,
      message: "PLM integration expertise updated.",
      data: updated
    });
  } catch (err) {
    console.error("Error in updatePLMIntegrationExpertiseById:", err);
    res.status(500).json({ success: false, error: "Internal Server Error" });
  }
};

// DELETE by ID
const deletePLMIntegrationExpertiseById = async (req, res) => {
  try {
    const id = req.params.id;
    const deleted = await PLMIntegrationExpertise.findByIdAndDelete(id);

    if (!deleted) {
      return res.status(404).json({ success: false, message: "Entry not found." });
    }

    res.status(200).json({
      success: true,
      message: "PLM integration expertise deleted.",
      deleted
    });
  } catch (err) {
    console.error("Error in deletePLMIntegrationExpertiseById:", err);
    res.status(500).json({ success: false, error: "Internal Server Error" });
  }
};

// DELETE all
const deleteAllPLMIntegrationExpertise = async (req, res) => {
  try {
    const result = await PLMIntegrationExpertise.deleteMany({});
    res.status(200).json({
      success: true,
      message: `Deleted ${result.deletedCount} PLM integration expertise entries.`,
      deletedCount: result.deletedCount
    });
  } catch (err) {
    console.error("Error in deleteAllPLMIntegrationExpertise:", err);
    res.status(500).json({ success: false, error: "Internal Server Error" });
  }
};

// BULK INSERT (with case-insensitive checks)
const bulkInsertPLMIntegrationExpertise = async (req, res) => {
  try {
    const values = req.body;

    if (!Array.isArray(values) || values.length === 0) {
      return res.status(400).json({
        success: false,
        error: "Request body must be a non-empty array of values.",
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
        error: "No valid values provided after filtering.",
      });
    }

    const existingDocs = await PLMIntegrationExpertise.find({
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
        skipped: [...existingSetLower],
      });
    }

    const documents = newValues.map(value => ({ value }));
    const inserted = await PLMIntegrationExpertise.insertMany(documents);

    res.status(201).json({
      success: true,
      message: `${inserted.length} new PLM integration expertise values added.`,
      insertedValues: inserted.map(doc => doc.value),
      alreadyExists: alreadyExistCount,
      skipped: [...existingSetLower],
    });

  } catch (error) {
    console.error("Error in bulkInsertPLMIntegrationExpertise:", error);
    res.status(500).json({
      success: false,
      error: "Internal Server Error while inserting.",
    });
  }
};

module.exports = {
  getAllPLMIntegrationExpertise,
  addSinglePLMIntegrationExpertise,
  addPLMIntegrationExpertise,
  updatePLMIntegrationExpertiseById,
  deletePLMIntegrationExpertiseById,
  deleteAllPLMIntegrationExpertise,
  bulkInsertPLMIntegrationExpertise
};
