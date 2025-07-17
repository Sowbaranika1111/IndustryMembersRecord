const express = require("express");
const router = express.Router();
const {
  getAllExpertise,
  addSingleExpertise,
  updateExpertiseById,
  deleteExpertiseById,
  deleteAllExpertise,
  insertAllExpertise
} = require("../controllers/dropDownValuesController/plmSapExpertiseController");

// GET all expertise
router.get("/", getAllExpertise);

// ADD single expertise
router.post("/add-single", addSingleExpertise);

// UPDATE expertise by ID
router.put("/update/:id", updateExpertiseById);

// DELETE expertise by ID
router.delete("/delete/:id", deleteExpertiseById);

// DELETE all expertise
router.delete("/delete-all", deleteAllExpertise);

// BULK INSERT expertise
router.post("/insert-many", insertAllExpertise);

module.exports = router;
