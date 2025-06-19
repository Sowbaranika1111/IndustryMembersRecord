const express = require("express");
const router = express.Router();
const {
  getAllUpgradeExpertise,
  addUpgradeExpertise,
  deleteUpgradeExpertiseById,
  deleteAllUpgradeExpertise,
  bulkInsertUpgradeExpertise
} = require("../controllers/dropDownValuesController/plmUpgradeExpertiseController");

router.get("/", getAllUpgradeExpertise);
router.post("/add", addUpgradeExpertise);
router.delete("/delete/:id", deleteUpgradeExpertiseById);
router.delete("/deleteall", deleteAllUpgradeExpertise);
router.post("/bulk-insert", bulkInsertUpgradeExpertise);

module.exports = router;
