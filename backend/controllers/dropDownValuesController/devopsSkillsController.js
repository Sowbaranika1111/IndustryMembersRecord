const { DevopsSkill } = require("../../models/dropdownValuesModel");

// GET all devops skills
const getAllDevopsSkills = async (req, res) => {
  try {
    const skills = await DevopsSkill.find().sort({ id: 1 });
    res.status(200).json(skills);
  } catch (err) {
    res.status(500).json({ message: "Failed to fetch DevOps skills", error: err.message });
  }
};

// ADD a devops skill
const addDevopsSkill = async (req, res) => {
  try {
    const { value } = req.body;
    if (!value || typeof value !== "string" || value.trim() === "") {
      return res.status(400).json({ message: "DevOps skill is required." });
    }

    const cleanedValue = value.trim().toLowerCase();
    const exists = await DevopsSkill.findOne({ value: cleanedValue });

    if (exists) {
      return res.status(400).json({ message: `Skill "${cleanedValue}" already exists.` });
    }

    const last = await DevopsSkill.findOne().sort({ id: -1 });
    const nextId = last ? last.id + 1 : 1;

    const newSkill = await DevopsSkill.create({ id: nextId, value: cleanedValue });

    res.status(201).json({
      success: true,
      message: `Skill "${cleanedValue}" added successfully.`,
      data: newSkill
    });
  } catch (err) {
    res.status(500).json({ message: "Internal server error", error: err.message });
  }
};

// DELETE by ID
const deleteDevopsSkillById = async (req, res) => {
  try {
    const id = parseInt(req.params.id);
    const deleted = await DevopsSkill.findOneAndDelete({ id });

    if (!deleted) {
      return res.status(404).json({ error: "Skill not found." });
    }

    res.status(200).json({ message: `Skill with ID ${id} deleted.`, deleted });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// DELETE all
const deleteAllDevopsSkills = async (req, res) => {
  try {
    const count = await DevopsSkill.countDocuments();

    if (count === 0) {
      return res.status(200).json({
        message: "No DevOps skills found to delete.",
        success: true,
        deletedCount: 0
      });
    }

    const result = await DevopsSkill.deleteMany();

    res.status(200).json({
      message: "All DevOps skills deleted.",
      success: true,
      deletedCount: result.deletedCount
    });
  } catch (err) {
    res.status(500).json({ error: err.message, success: false });
  }
};

// BULK INSERT
const bulkInsertDevopsSkills = async (req, res) => {
  try {
    const { values } = req.body;
    if (!Array.isArray(values) || values.length === 0) {
      return res.status(400).json({
        message: "Values must be a non-empty array.",
        success: false
      });
    }

    const cleanedValues = [...new Set(
      values.map(v => v.trim().toLowerCase()).filter(Boolean)
    )];

    const existingDocs = await DevopsSkill.find({ value: { $in: cleanedValues } });
    const existingValues = existingDocs.map(doc => doc.value);
    const newValues = cleanedValues.filter(v => !existingValues.includes(v));

    if (newValues.length === 0) {
      return res.status(200).json({
        message: "All values already exist.",
        inserted: 0,
        alreadyExists: existingValues.length
      });
    }

    const last = await DevopsSkill.findOne().sort({ id: -1 });
    let nextId = last ? last.id + 1 : 1;

    const docs = newValues.map(val => ({ id: nextId++, value: val }));

    const inserted = await DevopsSkill.insertMany(docs);

    res.status(201).json({
      message: `Inserted ${inserted.length} DevOps skills.`,
      insertedValues: inserted.map(i => i.value),
      inserted: inserted.length,
      alreadyExists: existingValues.length
    });

  } catch (err) {
    res.status(500).json({ error: "Bulk insert failed", success: false });
  }
};

module.exports = {
  getAllDevopsSkills,
  addDevopsSkill,
  deleteDevopsSkillById,
  deleteAllDevopsSkills,
  bulkInsertDevopsSkills
};
