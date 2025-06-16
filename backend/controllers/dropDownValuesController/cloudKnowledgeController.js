const { CloudKnowledge } = require("../../models/dropdownValuesModel");

// GET all cloud knowledge values
const getAllCloudKnowledge = async (req, res) => {
  try {
    const values = await CloudKnowledge.find().sort({ id: 1 });
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

    const cleanedValue = value.trim().toLowerCase();
    const exists = await CloudKnowledge.findOne({ value: cleanedValue });

    if (exists) {
      return res.status(400).json({ message: `Cloud knowledge \"${cleanedValue}\" already exists.` });
    }

    const last = await CloudKnowledge.findOne().sort({ id: -1 });
    const nextId = last ? last.id + 1 : 1;

    const newCloud = await CloudKnowledge.create({
      id: nextId,
      value: cleanedValue,
    });

    res.status(201).json({
      success: true,
      message: `Cloud knowledge \"${cleanedValue}\" added successfully.`,
      data: newCloud
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
    const deleted = await CloudKnowledge.findOneAndDelete({ id });

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
    const count = await CloudKnowledge.countDocuments();

    if (count === 0) {
      return res.status(200).json({
        message: "No cloud knowledge records found to delete.",
        success: true,
        deletedCount: 0,
      });
    }

    const result = await CloudKnowledge.deleteMany();

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

// BULK INSERT
const bulkInsertCloudKnowledge = async (req, res) => {
  try {
    const { values } = req.body;

    if (!Array.isArray(values) || values.length === 0) {
      return res.status(400).json({
        message: "Values must be a non-empty array.",
        success: false,
      });
    }

    const cleanedValues = [...new Set(
      values.map(v => v.trim().toLowerCase()).filter(Boolean)
    )];

    const existingDocs = await CloudKnowledge.find({
      value: { $in: cleanedValues }
    });

    const existingValues = existingDocs.map(doc => doc.value);
    const newValues = cleanedValues.filter(v => !existingValues.includes(v));

    if (newValues.length === 0) {
      return res.status(200).json({
        message: "All values already exist.",
        inserted: 0,
        alreadyExists: existingValues.length
      });
    }

    const last = await CloudKnowledge.findOne().sort({ id: -1 });
    let nextId = last ? last.id + 1 : 1;

    const docs = newValues.map(val => ({
      id: nextId++,
      value: val
    }));

    const inserted = await CloudKnowledge.insertMany(docs);

    res.status(201).json({
      message: `Inserted ${inserted.length} new cloud knowledge values.`,
      insertedValues: inserted.map(i => i.value),
      inserted: inserted.length,
      alreadyExists: existingValues.length
    });
  } catch (err) {
    console.error("Error in bulk insert:", err);
    res.status(500).json({ error: "Bulk insert failed", success: false });
  }
};

module.exports = {
  getAllCloudKnowledge,
  addCloudKnowledge,
  deleteCloudKnowledgeById,
  deleteAllCloudKnowledge,
  bulkInsertCloudKnowledge
};