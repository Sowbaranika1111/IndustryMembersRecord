const { Project } = require("../../models/dropdownValuesModel");

// GET all projects
const getAllProjects = async (req, res) => {
  try {
    const projects = await Project.find().sort({ value: 1 });
    res.status(200).json(projects);
  } catch (err) {
    console.error("Error fetching projects:", err);
    res.status(500).json({ message: "Failed to fetch project list", error: err.message });
  }
};

// ADD single project
const addProject = async (req, res) => {
  try {
    const { value } = req.body;
    if (!value || typeof value !== "string" || value.trim() === "") {
      return res.status(400).json({ message: "Project name is required." });
    }

    const cleanedValue = value.trim();
    const exists = await Project.findOne({ value: new RegExp(`^${cleanedValue}$`, "i") });

    if (exists) {
      return res.status(400).json({ message: `Project "${cleanedValue}" already exists.` });
    }

    const newProject = await Project.create({ value: cleanedValue });

    res.status(201).json({
      success: true,
      message: `Project "${cleanedValue}" added successfully.`,
      data: newProject
    });
  } catch (err) {
    console.error("Error adding project:", err);
    res.status(500).json({ message: "Internal server error", error: err.message });
  }
};

// DELETE by MongoDB _id
const deleteProjectById = async (req, res) => {
  try {
    const _id = req.params.id;
    const deleted = await Project.findByIdAndDelete(_id);

    if (!deleted) {
      return res.status(404).json({ error: "Project not found." });
    }

    res.status(200).json({ message: `Project "${deleted.value}" deleted.`, deleted });
  } catch (err) {
    console.error("Error deleting project:", err);
    res.status(500).json({ error: err.message });
  }
};

// DELETE all
const deleteAllProjects = async (req, res) => {
  try {
    const count = await Project.countDocuments();

    if (count === 0) {
      return res.status(200).json({
        message: "No project records found to delete.",
        success: true,
        deletedCount: 0
      });
    }

    const result = await Project.deleteMany();

    res.status(200).json({
      message: "All project records removed successfully.",
      success: true,
      deletedCount: result.deletedCount
    });
  } catch (err) {
    console.error("Error deleting all projects:", err);
    res.status(500).json({ error: err.message, success: false });
  }
};

// BULK INSERT
const insertAllProjects = async (req, res) => {
  try {
    const { values } = req.body;

    if (!Array.isArray(values) || values.length === 0) {
      return res.status(400).json({
        error: "Values must be a non-empty array.",
        success: false
      });
    }

    const cleanedValues = [...new Set(values.map(v => v.trim()).filter(Boolean))];

    const existingDocs = await Project.find({
      value: { $in: cleanedValues.map(v => new RegExp(`^${v}$`, 'i')) }
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
    const inserted = await Project.insertMany(docs);

    res.status(201).json({
      message: `Inserted ${inserted.length} new project values.`,
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
  getAllProjects,
  addProject,
  deleteProjectById,
  deleteAllProjects,
  insertAllProjects
};
