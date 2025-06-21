const { PLMTestingExpertise } = require("../../models/dropdownValuesModel");

// GET all PLM testing expertise entries
const getAllPLMTestingExpertise = async (req, res) => {
  try {
    const values = await PLMTestingExpertise.find().sort({ value: 1 });
    res.status(200).json({
      success: true,
      count: values.length,
      data: values
    });
  } catch (err) {
    console.error("Error in getAllPLMTestingExpertise:", err);
    res.status(500).json({ success: false, error: "Internal Server Error" });
  }
};

// POST one PLM testing expertise (with case-insensitive check)
const addPLMTestingExpertise = async (req, res) => {
  try {
    const { value } = req.body;
    if (!value || typeof value !== "string" || value.trim() === "") {
      return res.status(400).json({ error: "PLM testing expertise value is required." });
    }

    const trimmed = value.trim();
    const exists = await PLMTestingExpertise.findOne({
      value: { $regex: new RegExp(`^${trimmed}$`, "i") }
    });

    if (exists) {
      return res.status(400).json({ 
        success: false,
        message: `PLM testing expertise "${exists.value}" already exists (case-insensitive match).`
      });
    }

    const newItem = new PLMTestingExpertise({ value: trimmed });
    const saved = await newItem.save();
    res.status(201).json({
      success: true,
      message: "PLM testing expertise added.",
      data: saved
    });
  } catch (err) {
    console.error("Error in addPLMTestingExpertise:", err);
    res.status(500).json({ success: false, error: "Internal Server Error" });
  }
};

// UPDATE existing PLM testing expertise (with case-insensitive check)
const updatePLMTestingExpertiseById = async (req, res) => {
  try {
    const { id } = req.params;
    const { value } = req.body;

    if (!value || typeof value !== "string" || value.trim() === "") {
      return res.status(400).json({ error: "PLM testing expertise value is required." });
    }

    const trimmed = value.trim();
    const existing = await PLMTestingExpertise.findOne({
      _id: { $ne: id },
      value: { $regex: new RegExp(`^${trimmed}$`, "i") }
    });

    if (existing) {
      return res.status(400).json({
        success: false,
        message: `PLM testing expertise "${existing.value}" already exists (case-insensitive match).`
      });
    }

    const updated = await PLMTestingExpertise.findByIdAndUpdate(
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
      message: "PLM testing expertise updated.",
      data: updated
    });
  } catch (err) {
    console.error("Error in updatePLMTestingExpertiseById:", err);
    res.status(500).json({ success: false, error: "Internal Server Error" });
  }
};

// DELETE by ID
const deletePLMTestingExpertiseById = async (req, res) => {
  try {
    const id = req.params.id;
    const deleted = await PLMTestingExpertise.findByIdAndDelete(id);

    if (!deleted) {
      return res.status(404).json({ success: false, message: "Entry not found." });
    }

    res.status(200).json({
      success: true,
      message: "PLM testing expertise deleted.",
      deleted
    });
  } catch (err) {
    console.error("Error in deletePLMTestingExpertiseById:", err);
    res.status(500).json({ success: false, error: "Internal Server Error" });
  }
};

// DELETE all
const deleteAllPLMTestingExpertise = async (req, res) => {
  try {
    const result = await PLMTestingExpertise.deleteMany({});
    res.status(200).json({
      success: true,
      message: `Deleted ${result.deletedCount} PLM testing expertise entries.`,
      deletedCount: result.deletedCount
    });
  } catch (err) {
    console.error("Error in deleteAllPLMTestingExpertise:", err);
    res.status(500).json({ success: false, error: "Internal Server Error" });
  }
};

// BULK INSERT (with case-insensitive checks)
const bulkInsertPLMTestingExpertise = async (req, res) => {
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

    const existingDocs = await PLMTestingExpertise.find({
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
    const inserted = await PLMTestingExpertise.insertMany(documents);

    res.status(201).json({
      success: true,
      message: `${inserted.length} new PLM testing expertise values added.`,
      insertedValues: inserted.map(doc => doc.value),
      alreadyExists: alreadyExistCount,
      skipped: [...existingSetLower],
    });

  } catch (error) {
    console.error("Error in bulkInsertPLMTestingExpertise:", error);
    res.status(500).json({
      success: false,
      error: "Internal Server Error while inserting.",
    });
  }
};

module.exports = {
  getAllPLMTestingExpertise,
  addPLMTestingExpertise,
  updatePLMTestingExpertiseById,
  deletePLMTestingExpertiseById,
  deleteAllPLMTestingExpertise,
  bulkInsertPLMTestingExpertise
};
