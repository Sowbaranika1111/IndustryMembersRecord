const express = require("express");
const router = express.Router();

const {
  getAllPLMTestingExpertise,
  addPLMTestingExpertise,
  updatePLMTestingExpertiseById,
  deletePLMTestingExpertiseById,
  deleteAllPLMTestingExpertise,
  bulkInsertPLMTestingExpertise
} = require("../controllers/dropDownValuesController/plmTestingExpertiseController");

// GET all PLM testing expertise entries
router.get("/", getAllPLMTestingExpertise);

// POST one PLM testing expertise
router.post("/add", addPLMTestingExpertise);

// PUT update existing PLM testing expertise
router.put("/update/:id", updatePLMTestingExpertiseById);

// DELETE one PLM testing expertise by ID
router.delete("/delete/:id", deletePLMTestingExpertiseById);

// DELETE all PLM testing expertise entries
router.delete("/delete-all", deleteAllPLMTestingExpertise);

// POST multiple PLM testing expertise values
router.post("/insert-many", bulkInsertPLMTestingExpertise);

module.exports = router;
