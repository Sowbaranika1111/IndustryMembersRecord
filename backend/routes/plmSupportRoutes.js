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

// ADD single PLM support expertise
router.post("/add-single", addPLMSupportExpertise);

// Legacy add route
// router.post("/add", addPLMSupportExpertise);

// UPDATE PLM support expertise by ID
router.put("/update/:id", updatePLMSupportExpertise);

// DELETE PLM support expertise by ID
router.delete("/delete/:id", deletePLMSupportExpertise);

// DELETE all PLM support expertise entries
router.delete("/delete-all", deleteAllPLMSupportExpertise);

// BULK INSERT PLM support expertise values
router.post("/insert-many", bulkInsertPLMSupportExpertise);

module.exports = router;
