const { CloudKnowledge } = require("../../models/dropdownValuesModel");
const Batchmate = require("../../models/Batchmate"); // 

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
/*
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

*/
exports.insertAndAssignCloudKnowledge = async (req, res) => {
  try {
    const { batchmateId } = req.params;
    const { value } = req.body;

    if (!value || typeof value !== "string" || value.trim() === "") {
      return res.status(400).json({ error: "Cloud value is required." });
    }

    const trimmedValue = value.trim();

    //  Add to dropdown if not already present
    let cloudKnowledge = await CloudKnowledge.findOne({
      category: "cloud_knowledge",
      value: trimmedValue,
    });

    if (!cloudKnowledge) {
      const lastEntry = await CloudKnowledge.findOne({ category: "cloud_knowledge" }).sort({ id: -1 });
      const nextId = lastEntry ? lastEntry.id + 1 : 1;

      cloudKnowledge = new CloudKnowledge({
        id: nextId,
        category: "cloud_knowledge",
        value: trimmedValue,
      });

      await cloudKnowledge.save();
    }

    //  Find batchmate
    const batchmate = await Batchmate.findById(batchmateId);
    if (!batchmate) {
      return res.status(404).json({ error: "Batchmate not found." });
    }

    //  Clean and check cloud_knowledge string
    let cloudKnowledgeArray = (batchmate.cloud_knowledge || "")
      .split(",")
      .map((item) => item.trim());

    // Convert all existing values to lowercase for comparison
    const lowerCaseCloudKnowledgeArray = cloudKnowledgeArray.map(item => item.toLowerCase());

    const valueLower = trimmedValue.toLowerCase();
    const alreadyExists = lowerCaseCloudKnowledgeArray.includes(valueLower);

    if (!alreadyExists) {
      cloudKnowledgeArray.push(trimmedValue);
    }

    // Remove duplicates while preserving case of first entry
    const uniqueCloudKnowledgeArray = [];
    const seenLower = new Set();

    for (const item of cloudKnowledgeArray) {
      const itemLower = item.toLowerCase();
      if (!seenLower.has(itemLower)) {
        uniqueCloudKnowledgeArray.push(item);
        seenLower.add(itemLower);
      }
    }

    //  Update only cloud_knowledge field using $set
    await Batchmate.findByIdAndUpdate(
      batchmateId,
      { $set: { cloud_knowledge: uniqueCloudKnowledgeArray.join(", ") } },
      { runValidators: false } // Disable validation during update
    );

    res.status(200).json({
      message: "Cloud knowledge updated successfully.",
      cloud_knowledge: uniqueCloudKnowledgeArray.join(", "),
      addedToDropdown: !alreadyExists,
    });

  } catch (error) {
    console.error("insertAndAssignCloudKnowledge error:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};


exports.removeCloudKnowledgeFromBatchmate = async (req, res) => {
  try {
    const { batchmateId } = req.params;
    const { value } = req.body;

    if (!value || typeof value !== "string" || value.trim() === "") {
      return res.status(400).json({ error: "Cloud value is required." });
    }

    const trimmedValue = value.trim().toLowerCase();

    // : Find the batchmate
    const batchmate = await Batchmate.findById(batchmateId);
    if (!batchmate) {
      return res.status(404).json({ error: "Batchmate not found." });
    }

    //  Clean up and remove the matching value
    const cloudKnowledgeArray = (batchmate.cloud_knowledge || "")
      .split(",")
      .map((item) => item.trim())
      .filter((item) => item && item.toLowerCase() !== trimmedValue);

    // Step 3: Update field without triggering validation
    await Batchmate.findByIdAndUpdate(
      batchmateId,
      { $set: { cloud_knowledge: cloudKnowledgeArray.join(", ") } },
      { runValidators: false }
    );

    res.status(200).json({
      message: "Cloud knowledge removed successfully.",
      updated_cloud_knowledge: cloudKnowledgeArray.join(", "),
    });
  } catch (error) {
    console.error("removeCloudKnowledgeFromBatchmate error:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};
