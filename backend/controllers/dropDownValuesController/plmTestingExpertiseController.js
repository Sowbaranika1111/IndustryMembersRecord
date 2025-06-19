const { PLMTestingExpertise } = require("../../models/dropdownValuesModel");

// GET all
const getAllTestingExpertise = async (req, res) => {
  try {
    const values = await PLMTestingExpertise.find().sort({ _id: 1 });
    res.status(200).json(values);
  } catch (err) {
    res.status(500).json({ message: "Failed to fetch testing expertise", error: err.message });
  }
};

// ADD one
const addTestingExpertise = async (req, res) => {
  try {
    const { value } = req.body;

    if (!value || typeof value !== "string" || value.trim() === "") {
      return res.status(400).json({ message: "Expertise value is required." });
    }

    const cleanedValue = value.trim();
    const exists = await PLMTestingExpertise.findOne({ value: cleanedValue });

    if (exists) {
      return res.status(400).json({ message: `Value "${cleanedValue}" already exists.` });
    }

    const newDoc = await PLMTestingExpertise.create({ value: cleanedValue });

    res.status(201).json({
      success: true,
      message: `"${cleanedValue}" added successfully.`,
      data: newDoc
    });
  } catch (err) {
    res.status(500).json({ message: "Internal server error", error: err.message });
  }
};

// DELETE by ID
const deleteTestingExpertiseById = async (req, res) => {
  try {
    const id = req.params.id;
    const deleted = await PLMTestingExpertise.findByIdAndDelete(id);

    if (!deleted) {
      return res.status(404).json({ error: "Value not found." });
    }

    res.status(200).json({ message: `Deleted successfully.`, deleted });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// DELETE all
const deleteAllTestingExpertise = async (req, res) => {
  try {
    const count = await PLMTestingExpertise.countDocuments();

    if (count === 0) {
      return res.status(200).json({
        message: "No records found to delete.",
        success: true,
        deletedCount: 0
      });
    }

    const result = await PLMTestingExpertise.deleteMany();

    res.status(200).json({
      message: "All testing expertise values deleted.",
      success: true,
      deletedCount: result.deletedCount
    });
  } catch (err) {
    res.status(500).json({ error: err.message, success: false });
  }
};

// BULK INSERT
const bulkInsertTestingExpertise = async (req, res) => {
  try {
    const { values } = req.body;

    if (!Array.isArray(values) || values.length === 0) {
      return res.status(400).json({ message: "Values must be a non-empty array." });
    }

    const cleaned = [...new Set(values.map(v => v.trim()).filter(Boolean))];

    const existingDocs = await PLMTestingExpertise.find({ value: { $in: cleaned } });
    const existingValues = existingDocs.map(doc => doc.value);
    const newValues = cleaned.filter(v => !existingValues.includes(v));

    const docs = newValues.map(val => ({ value: val }));
    const inserted = await PLMTestingExpertise.insertMany(docs);

    res.status(201).json({
      message: `Inserted ${inserted.length} new values.`,
      insertedValues: inserted.map(i => i.value),
      alreadyExists: existingValues
    });
  } catch (err) {
    res.status(500).json({ error: "Bulk insert failed", success: false });
  }
};

module.exports = {
  getAllTestingExpertise,
  addTestingExpertise,
  deleteTestingExpertiseById,
  deleteAllTestingExpertise,
  bulkInsertTestingExpertise
};
