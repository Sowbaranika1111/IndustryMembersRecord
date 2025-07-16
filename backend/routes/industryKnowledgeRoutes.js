const express = require("express");
const router = express.Router();

const industryKnowledgeController = require("../controllers/dropDownValuesController/industryKnowledgeController");

// GET all industry knowledge values
router.get("/", industryKnowledgeController.getIndustryKnowledgeValues);

// POST a new industry knowledge value
router.post("/add", industryKnowledgeController.addNewIndustryKnowledge);

// UPDATE a value by ID
router.put("/update/:id", industryKnowledgeController.updateIndustryKnowledgeById);

// DELETE a value by ID
router.delete("/delete/:id", industryKnowledgeController.deleteIndustryKnowledgeById);

//Delete all at once
router.delete("/deleteall", industryKnowledgeController.deleteAllIndustryKnowledge);

// BULK INSERT all values (optional, admin use)
router.post("/bulk-insert", industryKnowledgeController.insertAllIndustryKnowledge);

module.exports = router;
