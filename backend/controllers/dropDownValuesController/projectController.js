const { Project } = require("../../models/dropdownValuesModel");

// get all projects
const getAllProjects = async (req, res) => {
  try {
    const projects = await Project.find().sort({ id: 1 });
    res.status(200).json(projects);
  } catch (err) {
    console.error("Error fetching projects:", err);
    res.status(500).json({ message: "Failed to fetch project list", error: err.message });
  }
};

// add project
const addProject = async (req, res) => {
  try {
    const { value } = req.body;

    if (!value || typeof value !== "string" || value.trim() === "") {
      return res.status(400).json({ message: "Project name is required." });
    }

    const cleanedValue = value.trim().toLowerCase();

    // Check for existing project (case-insensitive because of lowercase storage)
    const exists = await Project.findOne({ value: cleanedValue });

    let wasCreated = false;

    if (!exists) {
      const last = await Project.findOne().sort({ id: -1 });
      const nextId = last ? last.id + 1 : 1;

      await Project.create({ id: nextId, value: cleanedValue });
      wasCreated = true;
    }

    res.status(200).json({
      success: true,
      message: wasCreated
        ? `Project "${cleanedValue}" added to the system.`
        : `Project "${cleanedValue}" already exists.`,
      wasCreated
    });

  } catch (err) {
    console.error("Error adding project:", err);
    res.status(500).json({ message: "Internal server error", error: err.message });
  }
};

// delete by id
const deleteProjectById = async (req, res) => {
  try {
    const id = parseInt(req.params.id);

    const deleted = await Project.findOneAndDelete({ id });

    if (!deleted) {
      return res.status(404).json({ error: "Project not found." });
    }

    res.status(200).json({ message: `Project with ID ${id} deleted.`, deleted });
  } catch (err) {
    console.error("Error deleting project by ID:", err);
    res.status(500).json({ error: err.message });
  }
};

// delete all
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


module.exports = {
  getAllProjects,
  addProject,
  deleteProjectById,
  deleteAllProjects
};
