const express = require("express");
const router = express.Router();

const {
  getAllCloudKnowledge,
  addCloudKnowledge,
  deleteCloudKnowledgeById,
  deleteAllCloudKnowledge,
  insertAllCloudKnowledge,
} = require("../controllers/dropDownValuesController/cloudKnowledgeController.js");

// GET all cloud knowledge values
router.get("/", getAllCloudKnowledge);

// POST add new cloud knowledge
router.post("/add", addCloudKnowledge);

// DELETE cloud knowledge by ID
router.delete("/delete/:id", deleteCloudKnowledgeById);

// DELETE all cloud knowledge
router.delete("/deleteall", deleteAllCloudKnowledge);

//Bulk insert all cloud knowledge
router.post("/insertAllCloudKnowledge", insertAllCloudKnowledge);
module.exports = router;
