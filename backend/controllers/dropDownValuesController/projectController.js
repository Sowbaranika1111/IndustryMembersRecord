const { Project } = require("../../models/dropdownValuesModel");

// GET all projects
const getAllProjects = async (req, res) => {
  try {
    const values = await Project.find().sort({ value: 1 });
    res.status(200).json({
      success: true,
      count: values.length,
      data: values
    });
  } catch (err) {
    console.error("Error in getAllProjects:", err);
    res.status(500).json({ success: false, error: "Internal Server Error" });
  }
};

// POST one project (with case-insensitive check)
const addProject = async (req, res) => {
  try {
    const { value } = req.body;
    if (!value || typeof value !== "string" || value.trim() === "") {
      return res.status(400).json({ error: "Project value is required." });
    }

    const trimmed = value.trim();
    const exists = await Project.findOne({
      value: { $regex: new RegExp(`^${trimmed}$`, "i") }
    });

    if (exists) {
      return res.status(400).json({ 
        success: false,
        message: `Project "${exists.value}" already exists (case-insensitive match).`
      });
    }

    const newItem = new Project({ value: trimmed });
    const saved = await newItem.save();
    res.status(201).json({
      success: true,
      message: "Project added.",
      data: saved
    });
  } catch (err) {
    console.error("Error in addProject:", err);
    res.status(500).json({ success: false, error: "Internal Server Error" });
  }
};

// UPDATE existing project (with case-insensitive check)
const updateProjectById = async (req, res) => {
  try {
    const { id } = req.params;
    const { value } = req.body;

    if (!value || typeof value !== "string" || value.trim() === "") {
      return res.status(400).json({ error: "Project value is required." });
    }

    const trimmed = value.trim();
    const existing = await Project.findOne({
      _id: { $ne: id },
      value: { $regex: new RegExp(`^${trimmed}$`, "i") }
    });

    if (existing) {
      return res.status(400).json({
        success: false,
        message: `Project "${existing.value}" already exists (case-insensitive match).`
      });
    }

    const updated = await Project.findByIdAndUpdate(
      id,
      { value: trimmed },
      { new: true, runValidators: true }
    );

    if (!updated) {
      return res.status(404).json({ 
        success: false,
        message: "Entry not found." 
      });
    }

    res.status(200).json({
      success: true,
      message: "Project updated.",
      data: updated
    });
  } catch (err) {
    console.error("Error in updateProjectById:", err);
    res.status(500).json({ success: false, error: "Internal Server Error" });
  }
};

// DELETE by ID
const deleteProjectById = async (req, res) => {
  try {
    const id = req.params.id;
    const deleted = await Project.findByIdAndDelete(id);

    if (!deleted) {
      return res.status(404).json({ success: false, message: "Entry not found." });
    }

    res.status(200).json({
      success: true,
      message: "Project deleted.",
      deleted
    });
  } catch (err) {
    console.error("Error in deleteProjectById:", err);
    res.status(500).json({ success: false, error: "Internal Server Error" });
  }
};

// DELETE all
const deleteAllProjects = async (req, res) => {
  try {
    const result = await Project.deleteMany({});
    res.status(200).json({
      success: true,
      message: `Deleted ${result.deletedCount} projects.`,
      deletedCount: result.deletedCount
    });
  } catch (err) {
    console.error("Error in deleteAllProjects:", err);
    res.status(500).json({ success: false, error: "Internal Server Error" });
  }
};

// BULK INSERT (with case-insensitive checks)
const bulkInsertProjects = async (req, res) => {
  try {
    const values = req.body;

    if (!Array.isArray(values) || values.length === 0) {
      return res.status(400).json({
        success: false,
        error: "Request body must be a non-empty array of values.",
      });
    }

    const cleanedValues = values
      .filter(v => typeof v === "string" && v.trim() !== "")
      .map(v => v.trim());
      
    const uniqueInputValues = [];
    const seen = new Set();
    
    for (const val of cleanedValues) {
      const lowerVal = val.toLowerCase();
      if (!seen.has(lowerVal)) {
        seen.add(lowerVal);
        uniqueInputValues.push(val);
      }
    }

    if (uniqueInputValues.length === 0) {
      return res.status(400).json({
        success: false,
        error: "No valid values provided after filtering.",
      });
    }

    const existingDocs = await Project.find({
      value: { $in: uniqueInputValues.map(v => new RegExp(`^${v}$`, 'i')) }
    });

    const existingSetLower = new Set(
      existingDocs.map(doc => doc.value.toLowerCase())
    );

    const newValues = uniqueInputValues.filter(
      val => !existingSetLower.has(val.toLowerCase())
    );

    const alreadyExistCount = uniqueInputValues.length - newValues.length;

    if (newValues.length === 0) {
      return res.status(200).json({
        success: true,
        message: "All provided values already exist (case-insensitive).",
        inserted: 0,
        alreadyExists: alreadyExistCount,
        skipped: [...existingSetLower],
      });
    }

    const documents = newValues.map(value => ({ value }));
    const inserted = await Project.insertMany(documents);

    res.status(201).json({
      success: true,
      message: `${inserted.length} new projects added.`,
      insertedValues: inserted.map(doc => doc.value),
      alreadyExists: alreadyExistCount,
      skipped: [...existingSetLower],
    });

  } catch (error) {
    console.error("Error in bulkInsertProjects:", error);
    res.status(500).json({
      success: false,
      error: "Internal Server Error while inserting.",
    });
  }
};

module.exports = {
  getAllProjects,
  addProject,
  updateProjectById,
  deleteProjectById,
  deleteAllProjects,
  bulkInsertProjects
};
