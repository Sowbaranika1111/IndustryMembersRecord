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

// ADD single PLM testing expertise
router.post("/add-single", addPLMTestingExpertise);

// Legacy add route
// router.post("/add", addPLMTestingExpertise);

// UPDATE PLM testing expertise by ID
router.put("/update/:id", updatePLMTestingExpertiseById);

// DELETE PLM testing expertise by ID
router.delete("/delete/:id", deletePLMTestingExpertiseById);

// DELETE all PLM testing expertise entries
router.delete("/delete-all", deleteAllPLMTestingExpertise);

// BULK INSERT PLM testing expertise values
router.post("/insert-many", bulkInsertPLMTestingExpertise);

module.exports = router;
