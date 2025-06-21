const { CloudKnowledge } = require("../../models/dropdownValuesModel");

// GET all cloud knowledge values
const getAllCloudKnowledge = async (req, res) => {
  try {
    const values = await CloudKnowledge.find().sort({ value: 1 });

    res.status(200).json({
      success: true,
      count: values.length,
      data: values
    });
  } catch (err) {
    console.error("Error in getAllCloudKnowledge:", err);
    res.status(500).json({ success: false, error: "Internal Server Error" });
  }
};

// POST one value - FIXED CASE SENSITIVITY ISSUE
const addCloudKnowledge = async (req, res) => {
  try {
    const { value } = req.body;
    if (!value || typeof value !== "string" || value.trim() === "") {
      return res.status(400).json({ error: "Cloud value is required." });
    }

    const trimmed = value.trim();
    const lowerCaseValue = trimmed.toLowerCase();

    // Check if any case variation exists
    const exists = await CloudKnowledge.findOne({
      value: { $regex: new RegExp(`^${trimmed}$`, "i") }
    });

    if (exists) {
      return res.status(400).json({ 
        success: false,
        message: `Cloud knowledge "${exists.value}" already exists (case-insensitive match).`
      });
    }

    const newItem = new CloudKnowledge({ value: trimmed });
    const saved = await newItem.save();

    res.status(201).json({
      success: true,
      message: "Cloud knowledge added.",
      data: saved
    });
  } catch (err) {
    console.error("Error in addCloudKnowledge:", err);
    res.status(500).json({ success: false, error: "Internal Server Error" });
  }
};

// DELETE by ID
const deleteCloudKnowledgeById = async (req, res) => {
  try {
    const id = req.params.id;
    const deleted = await CloudKnowledge.findByIdAndDelete(id);

    if (!deleted) {
      return res.status(404).json({ success: false, message: "Entry not found." });
    }

    res.status(200).json({
      success: true,
      message: "Cloud knowledge deleted.",
      deleted
    });
  } catch (err) {
    console.error("Error in deleteCloudKnowledgeById:", err);
    res.status(500).json({ success: false, error: "Internal Server Error" });
  }
};

// DELETE all
const deleteAllCloudKnowledge = async (req, res) => {
  try {
    const result = await CloudKnowledge.deleteMany({});
    res.status(200).json({
      success: true,
      message: `Deleted ${result.deletedCount} cloud knowledge entries.`,
      deletedCount: result.deletedCount
    });
  } catch (err) {
    console.error("Error in deleteAllCloudKnowledge:", err);
    res.status(500).json({ success: false, error: "Internal Server Error" });
  }
};

// BULK INSERT - FIXED CASE SENSITIVITY ISSUE
const bulkInsertCloudKnowledge = async (req, res) => {
  try {
    const values = req.body;

    // 1. Validate input
    if (!Array.isArray(values) || values.length === 0) {
      return res.status(400).json({
        success: false,
        error: "Request body must be a non-empty array of values.",
      });
    }

    // 2. Clean and deduplicate input (case-insensitive)
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

    // 3. Fetch existing documents (case-insensitive)
    const existingDocs = await CloudKnowledge.find({
      value: { $in: uniqueInputValues.map(v => new RegExp(`^${v}$`, 'i')) }
    });

    const existingSetLower = new Set(
      existingDocs.map(doc => doc.value.toLowerCase())
    );

    // 4. Filter new values (case-insensitive)
    const newValues = uniqueInputValues.filter(
      val => !existingSetLower.has(val.toLowerCase())
    );

    const alreadyExistCount = uniqueInputValues.length - newValues.length;

    // 5. Early return if nothing new
    if (newValues.length === 0) {
      return res.status(200).json({
        success: true,
        message: "All provided values already exist (case-insensitive).",
        inserted: 0,
        alreadyExists: alreadyExistCount,
        skipped: [...existingSetLower],
      });
    }

    // 6. Insert new values
    const documents = newValues.map(value => ({ value }));
    const inserted = await CloudKnowledge.insertMany(documents);

    res.status(201).json({
      success: true,
      message: `${inserted.length} new cloud knowledge values added.`,
      insertedValues: inserted.map(doc => doc.value),
      alreadyExists: alreadyExistCount,
      skipped: [...existingSetLower],
    });

  } catch (error) {
    console.error("Error in bulkInsertCloudKnowledge:", error);
    res.status(500).json({
      success: false,
      error: "Internal Server Error while inserting.",
    });
  }
};

// UPDATE existing value (with case-insensitive duplicate check)
const updateCloudKnowledgeById = async (req, res) => {
  try {
    const { id } = req.params;
    const { value } = req.body;

    // Validate input
    if (!value || typeof value !== "string" || value.trim() === "") {
      return res.status(400).json({ error: "Cloud value is required." });
    }

    const trimmed = value.trim();

    // Check if the new value (case-insensitive) exists for another document
    const existing = await CloudKnowledge.findOne({
      _id: { $ne: id }, // Exclude current document
      value: { $regex: new RegExp(`^${trimmed}$`, "i") }
    });

    if (existing) {
      return res.status(400).json({
        success: false,
        message: `Cloud knowledge "${existing.value}" already exists (case-insensitive match).`
      });
    }

    // Update the document
    const updated = await CloudKnowledge.findByIdAndUpdate(
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
      message: "Cloud knowledge updated.",
      data: updated
    });
  } catch (err) {
    console.error("Error in updateCloudKnowledgeById:", err);
    res.status(500).json({ 
      success: false, 
      error: "Internal Server Error" 
    });
  }
};

// Add this to your exports
module.exports = {
  getAllCloudKnowledge,
  addCloudKnowledge,
  updateCloudKnowledgeById,  // <-- Add this new function
  deleteCloudKnowledgeById,
  deleteAllCloudKnowledge,
  bulkInsertCloudKnowledge
};
