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

// POST one PLM upgrade expertise
router.post("/add", addPLMUpgradeExpertise);

// PUT update existing PLM upgrade expertise
router.put("/update/:id", updatePLMUpgradeExpertiseById);

// DELETE one PLM upgrade expertise by ID
router.delete("/delete/:id", deletePLMUpgradeExpertiseById);

// DELETE all PLM upgrade expertise entries
router.delete("/delete-all", deleteAllPLMUpgradeExpertise);

// POST multiple PLM upgrade expertise values
router.post("/insert-many", bulkInsertPLMUpgradeExpertise);

module.exports = router;
