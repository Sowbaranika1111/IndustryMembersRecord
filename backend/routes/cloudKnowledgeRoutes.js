   const express = require("express");
   const router = express.Router();
   const cloudKnowledgeController = require("../controllers/dropDownValuesController/cloudKnowledgeController");

   // GET existing values
   router.get("/", cloudKnowledgeController.getCloudKnowledgeValues);

   // POST new value
   router.post("/add", cloudKnowledgeController.addNewCloudKnowledge);

   // DELETE by ID
   router.delete("/delete/:id", cloudKnowledgeController.deleteCloudKnowledgeById);

   // DELETE all values
   router.delete("/deleteall", cloudKnowledgeController.deleteAllCloudKnowledge);

   // BULK insert values
   router.post("/bulk-insert", cloudKnowledgeController.insertAllCloudKnowledge);

   module.exports = router;
   