const express = require("express");
const router = express.Router();
const {
  getAllPlmCadIntegrations,
  deleteAllPlmCadIntegrations,
  insertAllPlmCadIntegrations,
  updatePlmCadIntegration,
} = require("../controllers/dropDownValuesController/plmCadIntegrationsController.js");

router.get("/", getAllPlmCadIntegrations);
router.put("/update/:id", updatePlmCadIntegration);
router.delete("/delete-all", deleteAllPlmCadIntegrations);
router.post("/insert-many", insertAllPlmCadIntegrations);

module.exports = router;
