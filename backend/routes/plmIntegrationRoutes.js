const express = require("express");
const router = express.Router();

const {
  getAllPLMIntegrationExpertise,
  addPLMIntegrationExpertise,
  updatePLMIntegrationExpertiseById,
  deletePLMIntegrationExpertiseById,
  deleteAllPLMIntegrationExpertise,
  bulkInsertPLMIntegrationExpertise
} = require("../controllers/dropDownValuesController/plmIntegrationExpertiseController");

// GET all PLM integration expertise entries
router.get("/", getAllPLMIntegrationExpertise);

// POST one PLM integration expertise
router.post("/add", addPLMIntegrationExpertise);

// PUT update existing PLM integration expertise
router.put("/update/:id", updatePLMIntegrationExpertiseById);

// DELETE one PLM integration expertise by ID
router.delete("/delete/:id", deletePLMIntegrationExpertiseById);

// DELETE all PLM integration expertise entries
router.delete("/deleteall", deleteAllPLMIntegrationExpertise);

// POST multiple PLM integration expertise values
router.post("/insert-many", bulkInsertPLMIntegrationExpertise);

module.exports = router;
