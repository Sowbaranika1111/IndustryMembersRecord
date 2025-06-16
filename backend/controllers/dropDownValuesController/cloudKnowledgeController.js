const { CloudKnowledge } = require("../../models/dropdownValuesModel");

// GET all cloud knowledge values
const getAllCloudKnowledge = async (req, res) => {
  try {
    const values = await CloudKnowledge.find({
      category: "cloud_knowledge",
    }).sort({ id: 1 });
    res.status(200).json(values);
  } catch (err) {
    console.error("Error fetching cloud knowledge:", err);
    res
      .status(500)
      .json({
        message: "Failed to fetch cloud knowledge list",
        error: err.message,
      });
  }
};

// ADD new cloud knowledge value
const addCloudKnowledge = async (req, res) => {
  try {
    const { value } = req.body;

    if (!value || typeof value !== "string" || value.trim() === "") {
      return res.status(400).json({ message: "Cloud name is required." });
    }

    const cleanedValue = value.trim().toLowerCase(); // lowercased and trimmed

    // Case-insensitive check because of lowercase storage
    const exists = await CloudKnowledge.findOne({ value: cleanedValue });

    if (exists) {
      return res
        .status(400)
        .json({ message: `Cloud knowledge "${cleanedValue}" already exists.` });
    }

    const last = await CloudKnowledge.findOne().sort({ id: -1 });
    const nextId = last ? last.id + 1 : 1;

    const newCloud = await CloudKnowledge.create({
      id: nextId,
      value: cleanedValue,
    });

    res.status(201).json({
      success: true,
      message: `Cloud knowledge "${cleanedValue}" added successfully.`,
      data: newCloud,
    });
  } catch (err) {
    console.error("Error adding cloud knowledge:", err);
    res
      .status(500)
      .json({ message: "Internal server error", error: err.message });
  }
};
// DELETE by ID
const deleteCloudKnowledgeById = async (req, res) => {
  try {
    const id = parseInt(req.params.id);
    const deleted = await CloudKnowledge.findOneAndDelete({
      id,
      category: "cloud_knowledge",
    });

    if (!deleted) {
      return res.status(404).json({ error: "Cloud knowledge not found." });
    }

    res
      .status(200)
      .json({ message: `Cloud knowledge with ID ${id} deleted.`, deleted });
  } catch (err) {
    console.error("Error deleting cloud knowledge by ID:", err);
    res.status(500).json({ error: err.message });
  }
};
// DELETE all
const deleteAllCloudKnowledge = async (req, res) => {
  try {
    const count = await CloudKnowledge.countDocuments({
      category: "cloud_knowledge",
    });

    if (count === 0) {
      return res.status(200).json({
        message: "No cloud knowledge records found to delete.",
        success: true,
        deletedCount: 0,
      });
    }

    const result = await CloudKnowledge.deleteMany({
      category: "cloud_knowledge",
    });

    res.status(200).json({
      message: "All cloud knowledge records removed successfully.",
      success: true,
      deletedCount: result.deletedCount,
    });
  } catch (err) {
    console.error("Error deleting all cloud knowledge:", err);
    res.status(500).json({ error: err.message, success: false });
  }
};

//! Bulk insert
// http://localhost:5000/api/cloud-knowledge/insertAllCloudKnowledge

const insertAllCloudKnowledge = async (req, res) => {
  try {
    const { values } = req.body;

    // Input validation
    if (!Array.isArray(values) || values.length === 0) {
      return res.status(400).json({
        success: false,
        error: "Values must be a non-empty array.",
      });
    }

    // Normalize: trim, lowercase, remove empty
    const inputValues = values
      .map((v) => {
        if (typeof v !== "string") {
          throw new Error(
            `Invalid value type: ${typeof v}. All values must be strings.`
          );
        }
        return v.trim().toLowerCase();
      })
      .filter((v) => v.length > 0);

    if (inputValues.length === 0) {
      return res.status(400).json({
        success: false,
        error: "No valid values provided after filtering.",
      });
    }

    // Remove duplicates from input
    const uniqueInputValues = [...new Set(inputValues)];

    // Check which values already exist
    const existingDocs = await CloudKnowledge.find({
      value: { $in: uniqueInputValues },
    });

    const existingValues = existingDocs.map((doc) => doc.value);
    const newValues = uniqueInputValues.filter(
      (val) => !existingValues.includes(val)
    );

    const existingMessages = existingValues.map(
      (val) => `Value "${val}" already exists.`
    );

    if (newValues.length === 0) {
      return res.status(200).json({
        success: true,
        message: "All values already exist. No new entries added.",
        existingValues: existingMessages,
        totalProvided: uniqueInputValues.length,
        inserted: 0,
      });
    }

    // Get highest existing ID for auto-increment
    const lastEntry = await CloudKnowledge.findOne().sort({ id: -1 });
    let nextId = lastEntry ? lastEntry.id + 1 : 1;

    // Prepare bulk insert docs
    const documents = newValues.map((value) => ({
      id: nextId++,
      value,
      createdAt: new Date(),
      updatedAt: new Date(),
    }));

    const inserted = await CloudKnowledge.insertMany(documents);

    // Prepare final response
    const response = {
      success: true,
      message: `Inserted ${inserted.length} new cloud knowledge value(s).`,
      inserted: inserted.length,
      insertedValues: inserted.map((doc) => doc.value),
      alreadyExists: existingValues.length,
      totalProvided: uniqueInputValues.length,
    };

    if (existingValues.length > 0) {
      response.existingValues = existingMessages;
      response.message += ` ${existingValues.length} values were already in the database.`;
    }

    res.status(201).json(response);
  } catch (err) {
    console.error("Error in insertAllCloudKnowledge:", err);

    if (err.code === 11000) {
      return res.status(409).json({
        success: false,
        error: "Duplicate key error: Some values already exist.",
      });
    }

    if (err.name === "ValidationError") {
      return res.status(400).json({
        success: false,
        error: `Validation error: ${err.message}`,
      });
    }

    res.status(500).json({
      success: false,
      error: "Internal server error while inserting cloud knowledge values.",
      details: process.env.NODE_ENV === "development" ? err.message : undefined,
    });
  }
};


module.exports = {
  getAllCloudKnowledge,
  addCloudKnowledge,
  deleteCloudKnowledgeById,
  deleteAllCloudKnowledge,
  insertAllCloudKnowledge
};