const express = require("express");
const router = express.Router();

const {
  getAllCloudKnowledge,
  addCloudKnowledge,
  deleteCloudKnowledgeById,
  deleteAllCloudKnowledge,
  bulkInsertCloudKnowledge,
  updateCloudKnowledgeById,
  addSingleCloudKnowledge,


} = require("../controllers/dropDownValuesController/cloudKnowledgeController");

// GET all cloud knowledge values
router.get("/", getAllCloudKnowledge);

// POST one cloud knowledge value (with case-insensitive check)
router.post("/add", addCloudKnowledge);

// POST one cloud knowledge value (with case-insensitive check)
router.post('/add-single', addSingleCloudKnowledge);

// DELETE one cloud knowledge by ID
router.delete("/delete/:id", deleteCloudKnowledgeById);

// PUT update existing cloud knowledge value
router.put("/update/:id", updateCloudKnowledgeById);

// DELETE all cloud knowledge entries
router.delete("/delete-all", deleteAllCloudKnowledge);

// POST multiple cloud knowledge values (with case-insensitive checks)
router.post("/insert-many", bulkInsertCloudKnowledge);



module.exports = router;
