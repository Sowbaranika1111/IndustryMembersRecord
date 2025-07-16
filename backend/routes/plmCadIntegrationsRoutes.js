const express = require("express");
const router = express.Router();
const {
  getAllPlmCadIntegrations,
  addSinglePlmCadIntegration,
  updatePlmCadIntegrationById,
  deletePlmCadIntegrationById,
  updatePlmCadIntegration,
  deleteAllPlmCadIntegrations,
  insertAllPlmCadIntegrations,
} = require("../controllers/dropDownValuesController/plmCadIntegrationsController.js");

// GET all PLM CAD integrations
router.get("/", getAllPlmCadIntegrations);

// ADD single PLM CAD integration
router.post("/add-single", addSinglePlmCadIntegration);

// UPDATE PLM CAD integration by ID
router.put("/update/:id", updatePlmCadIntegrationById);

// DELETE PLM CAD integration by ID
router.delete("/delete/:id", deletePlmCadIntegrationById);

// Legacy route (keeping for backward compatibility)
router.put("/update", updatePlmCadIntegration);

// DELETE all PLM CAD integrations
router.delete("/delete-all", deleteAllPlmCadIntegrations);

// BULK INSERT PLM CAD integrations
router.post("/insert-many", insertAllPlmCadIntegrations);

module.exports = router;
