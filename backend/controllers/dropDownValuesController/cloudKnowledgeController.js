const { CloudKnowledge } = require("../../models/dropdownValuesModel");

// GET all
const getAllCloudKnowledge = async (req, res) => {
  try {
    const values = await CloudKnowledge.find().sort({ value: 1 });
    res.status(200).json(values);
  } catch (err) {
    res.status(500).json({
      message: "Failed to fetch cloud knowledge list",
      error: err.message
    });
  }
};

// ADD single
const addCloudKnowledge = async (req, res) => {
  try {
    const { value } = req.body;
    if (!value || typeof value !== "string" || value.trim() === "") {
      return res.status(400).json({ message: "Cloud name is required." });
    }

    const cleanedValue = value.trim();
    const exists = await CloudKnowledge.findOne({ value: new RegExp(`^${cleanedValue}$`, 'i') });

    if (exists) {
      return res.status(400).json({ message: `Cloud knowledge "${cleanedValue}" already exists.` });
    }

    const newCloud = await CloudKnowledge.create({ value: cleanedValue });

    res.status(201).json({
      success: true,
      message: `Cloud knowledge "${cleanedValue}" added successfully.`,
      data: newCloud
    });
  } catch (err) {
    res.status(500).json({ message: "Internal server error", error: err.message });
  }
};

// DELETE by MongoDB _id
const deleteCloudKnowledgeById = async (req, res) => {
  try {
    const _id = req.params.id;
    const deleted = await CloudKnowledge.findByIdAndDelete(_id);

    if (!deleted) {
      return res.status(404).json({ error: "Cloud knowledge not found." });
    }

    res.status(200).json({
      message: `Cloud knowledge "${deleted.value}" deleted.`,
      deleted
    });
  } catch (err) {
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
        deletedCount: 0
      });
    }

    const result = await CloudKnowledge.deleteMany();
    res.status(200).json({
      message: "All cloud knowledge records removed successfully.",
      success: true,
      deletedCount: result.deletedCount
    });
  } catch (err) {
    res.status(500).json({ error: err.message, success: false });
  }
};

// BULK INSERT
const bulkInsertCloudKnowledge = async (req, res) => {
  try {
    const { values } = req.body;

    if (!Array.isArray(values) || values.length === 0) {
      return res.status(400).json({ message: "Values must be a non-empty array." });
    }

    const cleanedValues = [...new Set(values.map(v => v.trim()).filter(Boolean))];

    const existingDocs = await CloudKnowledge.find({
      value: { $in: cleanedValues }
    });

    const existingValues = existingDocs.map(doc => doc.value.toLowerCase());
    const newValues = cleanedValues.filter(v => !existingValues.includes(v.toLowerCase()));

    if (newValues.length === 0) {
      return res.status(200).json({
        message: "All values already exist.",
        inserted: 0,
        alreadyExists: existingValues.length
      });
    }

    const docs = newValues.map(val => ({ value: val }));
    const inserted = await CloudKnowledge.insertMany(docs);

    res.status(201).json({
      message: `Inserted ${inserted.length} new cloud knowledge values.`,
      insertedValues: inserted.map(i => i.value),
      inserted: inserted.length,
      alreadyExists: existingValues.length
    });
  } catch (err) {
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
