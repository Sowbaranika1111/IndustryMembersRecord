const express = require("express");
const router = express.Router();

const {
  getAllProjectDeliveryModels,
  updateProjectDeliveryModels,
  insertAllProjectDeliveryModels,
  deleteAllProjectDeliveryModels,
} = require("../controllers/dropDownValuesController/projectDeliveryModelsController.js");

router.get("/", getAllProjectDeliveryModels);
router.put("/update/:id", updateProjectDeliveryModels);
router.post("/insert-many", insertAllProjectDeliveryModels);
router.delete("/delete-all", deleteAllProjectDeliveryModels);

module.exports = router;
