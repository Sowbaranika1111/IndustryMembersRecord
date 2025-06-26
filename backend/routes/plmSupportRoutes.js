const express = require("express");
const router = express.Router();

const {
  getAllPLMSupportExpertise,
  addPLMSupportExpertise,
  updatePLMSupportExpertise,
  deletePLMSupportExpertise,
  deleteAllPLMSupportExpertise,
  bulkInsertPLMSupportExpertise
} = require("../controllers/dropDownValuesController/plmSupportExpertiseController");

// GET all PLM support expertise entries
router.get("/", getAllPLMSupportExpertise);

// POST one PLM support expertise
router.post("/add", addPLMSupportExpertise);

// PUT update existing PLM support expertise
router.put("/update/:id", updatePLMSupportExpertise);

// DELETE one PLM support expertise by ID
router.delete("/delete/:id", deletePLMSupportExpertise);

// DELETE all PLM support expertise entries
router.delete("/deleteall", deleteAllPLMSupportExpertise);

// POST multiple PLM support expertise values
router.post("/insert-many", bulkInsertPLMSupportExpertise);

module.exports = router;
