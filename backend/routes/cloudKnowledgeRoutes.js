const express = require("express");
const router = express.Router();
const cloudKnowledgeController = require("../controllers/dropDownValuesController/cloudKnowledgeController");

// GET all
router.get("/", cloudKnowledgeController.getCloudKnowledgeValues);

// POST one
router.post("/add", cloudKnowledgeController.addNewCloudKnowledge);

// DELETE by ID
router.delete("/delete/:id", cloudKnowledgeController.deleteCloudKnowledgeById);

// DELETE all
router.delete("/deleteall", cloudKnowledgeController.deleteAllCloudKnowledge);

// BULK INSERT
//router.post("/bulk-insert", cloudKnowledgeController.insertAllCloudKnowledge);

// 
router.put("/insert/:batchmateId", cloudKnowledgeController.insertAndAssignCloudKnowledge);

router.put("/remove/:batchmateId", cloudKnowledgeController.removeCloudKnowledgeFromBatchmate);

module.exports = router;
