const express = require("express");
const router = express.Router();
const {
  getAllTestingExpertise,
  addTestingExpertise,
  deleteTestingExpertiseById,
  deleteAllTestingExpertise,
  bulkInsertTestingExpertise
} = require("../controllers/dropDownValuesController/plmTestingExpertiseController");

router.get("/", getAllTestingExpertise);
router.post("/add", addTestingExpertise);
router.delete("/delete/:id", deleteTestingExpertiseById);
router.delete("/deleteall", deleteAllTestingExpertise);
router.post("/bulk-insert", bulkInsertTestingExpertise);

module.exports = router;
