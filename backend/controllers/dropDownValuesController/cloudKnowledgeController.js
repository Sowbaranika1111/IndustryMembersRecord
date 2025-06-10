const { CloudKnowledge } = require("../../models/dropdownValuesModel");

// GET all cloud knowledge values
exports.getCloudKnowledgeValues = async (req, res) => {
  try {
    const values = await CloudKnowledge.find({
      category: "cloud_knowledge",
    }).sort({ id: 1 });
    res.json(values);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// POST single cloud knowledge value
exports.addNewCloudKnowledge = async (req, res) => {
  try {
    const { value } = req.body;

    if (!value) {
      return res.status(400).json({ error: "Cloud value is required." });
    }

    const exists = await CloudKnowledge.findOne({
      category: "cloud_knowledge",
      value: value,
    });
    if (exists) {
      return res.status(400).json({ message: "Cloud knowledge already exists." });
    }

    const lastEntry = await CloudKnowledge.findOne({
      category: "cloud_knowledge",
    }).sort({ id: -1 });

    const nextId = lastEntry ? lastEntry.id + 1 : 1;

    const newCloud = new CloudKnowledge({
      id: nextId,
      category: "cloud_knowledge",
      value,
    });

    const saved = await newCloud.save();
    res.status(201).json(saved);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// DELETE by ID
exports.deleteCloudKnowledgeById = async (req, res) => {
  try {
    const id = parseInt(req.params.id);
    const deleted = await CloudKnowledge.findOneAndDelete({
      id,
      category: "cloud_knowledge",
    });

    if (!deleted) {
      return res.status(404).json({ error: "Cloud knowledge not found." });
    }

    res.json({ message: "Cloud knowledge deleted successfully.", deleted });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// DELETE all
exports.deleteAllCloudKnowledge = async (req, res) => {
  try {
    const existingCount = await CloudKnowledge.countDocuments({
      category: "cloud_knowledge",
    });

    if (existingCount === 0) {
      return res.status(200).json({
        message: "No cloud knowledge values found to delete.",
        success: true,
        deletedCount: 0,
      });
    }

    const deleteResult = await CloudKnowledge.deleteMany({
      category: "cloud_knowledge",
    });

    res.status(200).json({
      message: "All cloud knowledge values deleted.",
      success: true,
      deletedCount: deleteResult.deletedCount,
    });
  } catch (err) {
    res.status(500).json({
      error: "Error deleting cloud knowledge values.",
      success: false,
    });
  }
};

// BULK INSERT
exports.insertAllCloudKnowledge = async (req, res) => {
  try {
    const { values } = req.body;

    if (!Array.isArray(values) || values.length === 0) {
      return res.status(400).json({
        error: "Values must be a non-empty array.",
        success: false,
      });
    }

    const inputValues = values
      .map((v) => {
        if (typeof v !== "string") {
          throw new Error(`Invalid value: ${v}`);
        }
        return v.trim();
      })
      .filter((v) => v.length > 0);

    const uniqueInputValues = [...new Set(inputValues)];

    const existingDocs = await CloudKnowledge.find({
      category: "cloud_knowledge",
      value: { $in: uniqueInputValues },
    });

    const existingValues = existingDocs.map((doc) => doc.value);
    const newValues = uniqueInputValues.filter(
      (val) => !existingValues.includes(val)
    );

    const lastEntry = await CloudKnowledge.findOne({
      category: "cloud_knowledge",
    }).sort({ id: -1 });

    let nextId = lastEntry ? lastEntry.id + 1 : 1;

    const documents = newValues.map((value) => ({
      id: nextId++,
      category: "cloud_knowledge",
      value,
    }));

    const inserted = await CloudKnowledge.insertMany(documents);

    res.status(201).json({
      message: `Inserted ${inserted.length} new cloud knowledge values.`,
      success: true,
      insertedValues: inserted.map((doc) => doc.value),
      alreadyExists: existingValues.length,
      skipped: existingValues,
    });
  } catch (err) {
    console.error("Error inserting cloud knowledge:", err);
    res.status(500).json({
      error: "Internal server error",
      success: false,
    });
  }
};