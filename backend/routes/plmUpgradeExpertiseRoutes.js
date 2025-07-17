const express = require("express");
const router = express.Router();

const {
  getAllPLMUpgradeExpertise,
  addPLMUpgradeExpertise,
  updatePLMUpgradeExpertiseById,
  deletePLMUpgradeExpertiseById,
  deleteAllPLMUpgradeExpertise,
  bulkInsertPLMUpgradeExpertise
} = require("../controllers/dropDownValuesController/plmUpgradeExpertiseController");

// GET all PLM upgrade expertise entries
router.get("/", getAllPLMUpgradeExpertise);

// ADD single PLM upgrade expertise
router.post("/add-single", addPLMUpgradeExpertise);

// Legacy add route
router.post("/add", addPLMUpgradeExpertise);

// UPDATE PLM upgrade expertise by ID
router.put("/update/:id", updatePLMUpgradeExpertiseById);

// DELETE PLM upgrade expertise by ID
router.delete("/delete/:id", deletePLMUpgradeExpertiseById);

// DELETE all PLM upgrade expertise entries
router.delete("/delete-all", deleteAllPLMUpgradeExpertise);

// BULK INSERT PLM upgrade expertise values
router.post("/insert-many", bulkInsertPLMUpgradeExpertise);

module.exports = router;
