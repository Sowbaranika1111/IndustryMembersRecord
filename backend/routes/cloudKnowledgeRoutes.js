const express = require("express");
const router = express.Router();

const {
  getAllCloudKnowledge,
  addCloudKnowledge,
  deleteCloudKnowledgeById,
  deleteAllCloudKnowledge
} = require("../controllers/dropDownValuesController/cloudKnowledgeController");

// GET all cloud knowledge values
router.get("/", getAllCloudKnowledge);

// POST add new cloud knowledge
router.post("/add", addCloudKnowledge);

// DELETE cloud knowledge by ID
router.delete("/delete/:id", deleteCloudKnowledgeById);

// DELETE all cloud knowledge
router.delete("/deleteall", deleteAllCloudKnowledge);

module.exports = router;
