const express = require("express");
const router = express.Router();

const {
  getAllPLMIntegrationExpertise,
  addSinglePLMIntegrationExpertise,
  addPLMIntegrationExpertise,
  updatePLMIntegrationExpertiseById,
  deletePLMIntegrationExpertiseById,
  deleteAllPLMIntegrationExpertise,
  bulkInsertPLMIntegrationExpertise
} = require("../controllers/dropDownValuesController/plmIntegrationExpertiseController");

// GET all PLM integration expertise entries
router.get("/", getAllPLMIntegrationExpertise);

// ADD single PLM integration expertise
router.post("/add-single", addSinglePLMIntegrationExpertise);

// Legacy route (backward compatibility)
router.post("/add", addPLMIntegrationExpertise);

// UPDATE PLM integration expertise by ID
router.put("/update/:id", updatePLMIntegrationExpertiseById);

// DELETE PLM integration expertise by ID
router.delete("/delete/:id", deletePLMIntegrationExpertiseById);

// DELETE all PLM integration expertise entries
router.delete("/delete-all", deleteAllPLMIntegrationExpertise);

// BULK INSERT PLM integration expertise values
router.post("/insert-many", bulkInsertPLMIntegrationExpertise);

module.exports = router;
