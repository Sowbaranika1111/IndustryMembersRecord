const { PLMUpgradeExpertise } = require("../../models/dropdownValuesModel");

// GET all PLM upgrade expertise entries
const getAllPLMUpgradeExpertise = async (req, res) => {
  try {
    const values = await PLMUpgradeExpertise.find().sort({ value: 1 });
    res.status(200).json({
      success: true,
      count: values.length,
      data: values
    });
  } catch (err) {
    console.error("Error in getAllPLMUpgradeExpertise:", err);
    res.status(500).json({ success: false, error: "Internal Server Error" });
  }
};

// POST one PLM upgrade expertise (with case-insensitive check)
const addPLMUpgradeExpertise = async (req, res) => {
  try {
    const { value } = req.body;
    if (!value || typeof value !== "string" || value.trim() === "") {
      return res.status(400).json({ error: "PLM upgrade expertise value is required." });
    }

    const trimmed = value.trim();
    const exists = await PLMUpgradeExpertise.findOne({
      value: { $regex: new RegExp(`^${trimmed}$`, "i") }
    });

    if (exists) {
      return res.status(400).json({ 
        success: false,
        message: `PLM upgrade expertise "${exists.value}" already exists (case-insensitive match).`
      });
    }

    const newItem = new PLMUpgradeExpertise({ value: trimmed });
    const saved = await newItem.save();
    res.status(201).json({
      success: true,
      message: "PLM upgrade expertise added.",
      data: saved
    });
  } catch (err) {
    console.error("Error in addPLMUpgradeExpertise:", err);
    res.status(500).json({ success: false, error: "Internal Server Error" });
  }
};

// UPDATE existing PLM upgrade expertise (with case-insensitive check)
const updatePLMUpgradeExpertiseById = async (req, res) => {
  try {
    const { id } = req.params;
    const { value } = req.body;

    if (!value || typeof value !== "string" || value.trim() === "") {
      return res.status(400).json({ error: "PLM upgrade expertise value is required." });
    }

    const trimmed = value.trim();
    const existing = await PLMUpgradeExpertise.findOne({
      _id: { $ne: id },
      value: { $regex: new RegExp(`^${trimmed}$`, "i") }
    });

    if (existing) {
      return res.status(400).json({
        success: false,
        message: `PLM upgrade expertise "${existing.value}" already exists (case-insensitive match).`
      });
    }

    const updated = await PLMUpgradeExpertise.findByIdAndUpdate(
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
      message: "PLM upgrade expertise updated.",
      data: updated
    });
  } catch (err) {
    console.error("Error in updatePLMUpgradeExpertiseById:", err);
    res.status(500).json({ success: false, error: "Internal Server Error" });
  }
};

// DELETE by ID
const deletePLMUpgradeExpertiseById = async (req, res) => {
  try {
    const id = req.params.id;
    const deleted = await PLMUpgradeExpertise.findByIdAndDelete(id);

    if (!deleted) {
      return res.status(404).json({ success: false, message: "Entry not found." });
    }

    res.status(200).json({
      success: true,
      message: "PLM upgrade expertise deleted.",
      deleted
    });
  } catch (err) {
    console.error("Error in deletePLMUpgradeExpertiseById:", err);
    res.status(500).json({ success: false, error: "Internal Server Error" });
  }
};

// DELETE all
const deleteAllPLMUpgradeExpertise = async (req, res) => {
  try {
    const result = await PLMUpgradeExpertise.deleteMany({});
    res.status(200).json({
      success: true,
      message: `Deleted ${result.deletedCount} PLM upgrade expertise entries.`,
      deletedCount: result.deletedCount
    });
  } catch (err) {
    console.error("Error in deleteAllPLMUpgradeExpertise:", err);
    res.status(500).json({ success: false, error: "Internal Server Error" });
  }
};

// BULK INSERT (with case-insensitive checks)
const bulkInsertPLMUpgradeExpertise = async (req, res) => {
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

    const existingDocs = await PLMUpgradeExpertise.find({
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
    const inserted = await PLMUpgradeExpertise.insertMany(documents);

    res.status(201).json({
      success: true,
      message: `${inserted.length} new PLM upgrade expertise values added.`,
      insertedValues: inserted.map(doc => doc.value),
      alreadyExists: alreadyExistCount,
      skipped: [...existingSetLower],
    });

  } catch (error) {
    console.error("Error in bulkInsertPLMUpgradeExpertise:", error);
    res.status(500).json({
      success: false,
      error: "Internal Server Error while inserting.",
    });
  }
};

module.exports = {
  getAllPLMUpgradeExpertise,
  addPLMUpgradeExpertise,
  updatePLMUpgradeExpertiseById,
  deletePLMUpgradeExpertiseById,
  deleteAllPLMUpgradeExpertise,
  bulkInsertPLMUpgradeExpertise
};
