const express = require("express");
const router = express.Router();

const {
  getAllDevOpsSkills,
  addSingleDevOpsSkill,
  updateDevOpsSkillById,
  deleteDevOpsSkillById,
  deleteAllDevOpsSkills,
  bulkInsertDevOpsSkills
} = require("../controllers/dropDownValuesController/devopsSkillsController");

// GET all devops skills
router.get("/", getAllDevOpsSkills);

// ADD single devops skill
router.post("/add-single", addSingleDevOpsSkill);

// UPDATE devops skill by ID
router.put("/update/:id", updateDevOpsSkillById);

// DELETE devops skill by ID
router.delete("/delete/:id", deleteDevOpsSkillById);

// DELETE all devops skills
router.delete("/delete-all", deleteAllDevOpsSkills);

// BULK INSERT devops skills
router.post("/insert-many", bulkInsertDevOpsSkills);

module.exports = router;
