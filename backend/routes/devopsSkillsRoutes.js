const express = require("express");
const router = express.Router();
const {
  getAllDevopsSkills,
  addDevopsSkill,
  deleteDevopsSkillById,
  deleteAllDevopsSkills,
  bulkInsertDevopsSkills
} = require("../controllers/dropDownValuesController/devopsSkillsController");

router.get("/", getAllDevopsSkills);
router.post("/add", addDevopsSkill);
router.delete("/delete/:id", deleteDevopsSkillById);
router.delete("/deleteall", deleteAllDevopsSkills);
router.post("/bulk-insert", bulkInsertDevopsSkills);

module.exports = router;
