const express = require("express");
const router = express.Router();

const {
  getAllDevOpsSkills,
  addDevOpsSkill,
  updateDevOpsSkillById,
  deleteDevOpsSkillById,
  deleteAllDevOpsSkills,
  bulkInsertDevOpsSkills
} = require("../controllers/dropDownValuesController/devopsSkillsController");

// GET all devops skills
router.get("/", getAllDevOpsSkills);

// POST one devops skill
router.post("/add", addDevOpsSkill);

// PUT update existing devops skill
router.put("/update/:id", updateDevOpsSkillById);

// DELETE one devops skill by ID
router.delete("/delete/:id", deleteDevOpsSkillById);

// DELETE all devops skills
router.delete("/deleteall", deleteAllDevOpsSkills);

// POST multiple devops skills
router.post("/insert-many", bulkInsertDevOpsSkills);

module.exports = router;
