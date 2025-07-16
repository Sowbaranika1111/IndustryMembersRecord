const { DevopsSkill } = require("../../models/dropdownValuesModel");

// GET all devops skills
const getAllDevOpsSkills = async (req, res) => {
  try {
    const values = await DevopsSkill.find().sort({ value: 1 });
    res.status(200).json({
      success: true,
      count: values.length,
      data: values
    });
  } catch (err) {
    console.error("Error in getAllDevOpsSkills:", err);
    res.status(500).json({ success: false, error: "Internal Server Error" });
  }
};

// POST one skill (with case-insensitive check)
// const addDevOpsSkill = async (req, res) => {
//   try {
//     const { value } = req.body;
//     if (!value || typeof value !== "string" || value.trim() === "") {
//       return res.status(400).json({ error: "DevOps skill value is required." });
//     }

//     const trimmed = value.trim();
//     const exists = await DevopsSkill.findOne({
//       value: { $regex: new RegExp(`^${trimmed}$`, "i") }
//     });

//     if (exists) {
//       return res.status(400).json({ 
//         success: false,
//         message: `DevOps skill "${exists.value}" already exists (case-insensitive match).`
//       });
//     }

//     const newItem = new DevopsSkill({ value: trimmed });
//     const saved = await newItem.save();
//     res.status(201).json({
//       success: true,
//       message: "DevOps skill added.",
//       data: saved
//     });
//   } catch (err) {
//     console.error("Error in addDevOpsSkill:", err);
//     res.status(500).json({ success: false, error: "Internal Server Error" });
//   }
// };

// ADD single devops skill value
const addSingleDevOpsSkill = async (req, res) => {
  try {
    const { value } = req.body;
    if (!value || typeof value !== "string" || value.trim() === "") {
      return res.status(400).json({ error: "DevOps skill value is required." });
    }
    const trimmed = value.trim();
    const exists = await DevopsSkill.findOne({ value: { $regex: new RegExp(`^${trimmed}$`, "i") } });
    if (exists) {
      return res.status(400).json({ success: false, message: `DevOps skill \"${exists.value}\" already exists (case-insensitive match).` });
    }
    const newItem = new DevopsSkill({ value: trimmed });
    const saved = await newItem.save();
    res.status(201).json({ success: true, message: "DevOps skill added successfully.", data: saved });
  } catch (err) {
    console.error("Error in addSingleDevOpsSkill:", err);
    if (err.code === 11000) {
      return res.status(400).json({ success: false, message: "DevOps skill already exists." });
    }
    res.status(500).json({ success: false, error: "Internal Server Error" });
  }
};

// UPDATE devops skill by ID
const updateDevOpsSkillById = async (req, res) => {
  try {
    const { id } = req.params;
    const { value } = req.body;
    if (!value || typeof value !== "string" || value.trim() === "") {
      return res.status(400).json({ error: "DevOps skill value is required." });
    }
    const trimmed = value.trim();
    const existing = await DevopsSkill.findOne({ _id: { $ne: id }, value: { $regex: new RegExp(`^${trimmed}$`, "i") } });
    if (existing) {
      return res.status(400).json({ success: false, message: `DevOps skill \"${existing.value}\" already exists (case-insensitive match).` });
    }
    const updated = await DevopsSkill.findByIdAndUpdate(id, { value: trimmed }, { new: true, runValidators: true });
    if (!updated) {
      return res.status(404).json({ success: false, message: "DevOps skill not found." });
    }
    res.status(200).json({ success: true, message: "DevOps skill updated successfully.", data: updated });
  } catch (err) {
    console.error("Error in updateDevOpsSkillById:", err);
    if (err.code === 11000) {
      return res.status(400).json({ success: false, message: "DevOps skill already exists." });
    }
    res.status(500).json({ success: false, error: "Internal Server Error" });
  }
};

// DELETE devops skill by ID
const deleteDevOpsSkillById = async (req, res) => {
  try {
    const id = req.params.id;
    const deleted = await DevopsSkill.findByIdAndDelete(id);
    if (!deleted) {
      return res.status(404).json({ success: false, message: "DevOps skill not found." });
    }
    res.status(200).json({ success: true, message: "DevOps skill deleted.", deleted });
  } catch (err) {
    console.error("Error in deleteDevOpsSkillById:", err);
    res.status(500).json({ success: false, error: "Internal Server Error" });
  }
};

// DELETE all
const deleteAllDevOpsSkills = async (req, res) => {
  try {
    const result = await DevopsSkill.deleteMany({});
    res.status(200).json({
      success: true,
      message: `Deleted ${result.deletedCount} DevOps skills.`,
      deletedCount: result.deletedCount
    });
  } catch (err) {
    console.error("Error in deleteAllDevOpsSkills:", err);
    res.status(500).json({ success: false, error: "Internal Server Error" });
  }
};

// BULK INSERT (with case-insensitive checks)
const bulkInsertDevOpsSkills = async (req, res) => {
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

    const existingDocs = await DevopsSkill.find({
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
    const inserted = await DevopsSkill.insertMany(documents);

    res.status(201).json({
      success: true,
      message: `${inserted.length} new DevOps skills added.`,
      insertedValues: inserted.map(doc => doc.value),
      alreadyExists: alreadyExistCount,
      skipped: [...existingSetLower],
    });

  } catch (error) {
    console.error("Error in bulkInsertDevOpsSkills:", error);
    res.status(500).json({
      success: false,
      error: "Internal Server Error while inserting.",
    });
  }
};

module.exports = {
  getAllDevOpsSkills,
  updateDevOpsSkillById,
  deleteDevOpsSkillById,
  deleteAllDevOpsSkills,
  bulkInsertDevOpsSkills,
  //admin
  addSingleDevOpsSkill,
  updateDevOpsSkillById,
  deleteDevOpsSkillById
};
