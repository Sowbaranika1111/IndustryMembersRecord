const express = require("express");
const router = express.Router();

const {
  getAllProjectDeliveryModels,
  addSingleProjectDeliveryModel,
  updateProjectDeliveryModelById,
  deleteProjectDeliveryModelById,
  updateProjectDeliveryModels,
  insertAllProjectDeliveryModels,
  deleteAllProjectDeliveryModels,
} = require("../controllers/dropDownValuesController/projectDeliveryModelsController.js");

// GET all project delivery models
router.get("/", getAllProjectDeliveryModels);

// ADD single project delivery model
router.post("/add-single", addSingleProjectDeliveryModel);

// UPDATE project delivery model by ID
router.put("/update/:id", updateProjectDeliveryModelById);

// DELETE project delivery model by ID
router.delete("/delete/:id", deleteProjectDeliveryModelById);

// Legacy bulk update
router.put("/update", updateProjectDeliveryModels);

// BULK INSERT project delivery models
router.post("/insert-many", insertAllProjectDeliveryModels);

// DELETE all project delivery models
router.delete("/delete-all", deleteAllProjectDeliveryModels);

module.exports = router;
