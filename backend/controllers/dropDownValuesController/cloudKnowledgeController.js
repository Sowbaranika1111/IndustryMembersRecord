const { CloudKnowledge } = require("../../models/dropdownValuesModel");

// GET all cloud knowledge values
const getAllCloudKnowledge = async (req, res) => {
  try {
    const values = await CloudKnowledge.find({ category: "cloud_knowledge" }).sort({ id: 1 });
    res.status(200).json(values);
  } catch (err) {
    console.error("Error fetching cloud knowledge:", err);
    res.status(500).json({ message: "Failed to fetch cloud knowledge list", error: err.message });
  }
};

// ADD new cloud knowledge value
// add project
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
      return res.status(400).json({ message: `Cloud knowledge "${cleanedValue}" already exists.` });
    }

    const last = await CloudKnowledge.findOne().sort({ id: -1 });
    const nextId = last ? last.id + 1 : 1;

    const newCloud = await CloudKnowledge.create({ id: nextId, value: cleanedValue });

    res.status(201).json({
      success: true,
      message: `Cloud knowledge "${cleanedValue}" added successfully.`,
      data: newCloud
    });
  } catch (err) {
    console.error("Error adding cloud knowledge:", err);
    res.status(500).json({ message: "Internal server error", error: err.message });
  }
};
// DELETE by ID
const deleteCloudKnowledgeById = async (req, res) => {
  try {
    const id = parseInt(req.params.id);
    const deleted = await CloudKnowledge.findOneAndDelete({ id, category: "cloud_knowledge" });

    if (!deleted) {
      return res.status(404).json({ error: "Cloud knowledge not found." });
    }

    res.status(200).json({ message: `Cloud knowledge with ID ${id} deleted.`, deleted });
  } catch (err) {
    console.error("Error deleting cloud knowledge by ID:", err);
    res.status(500).json({ error: err.message });
  }
};
// DELETE all
const deleteAllCloudKnowledge = async (req, res) => {
  try {
    const count = await CloudKnowledge.countDocuments({ category: "cloud_knowledge" });

    if (count === 0) {
      return res.status(200).json({
        message: "No cloud knowledge records found to delete.",
        success: true,
        deletedCount: 0,
      });
    }

    const result = await CloudKnowledge.deleteMany({ category: "cloud_knowledge" });

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

module.exports = {
  getAllCloudKnowledge,
  addCloudKnowledge,
  deleteCloudKnowledgeById,
  deleteAllCloudKnowledge,
};
