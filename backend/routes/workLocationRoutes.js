const express = require("express");
const router = express.Router();

const {
  
  updateWorkLocation,
  getAllWorkLocations,
  deleteAllWorkLocations,
  
  // addNewCurrentRole,
  // deleteCurrentRoleById,
  // deleteAllCurrentRoles,
  // insertAllCurrentRoles,
} = require("../controllers/dropDownValuesController/workLocationController");


router.put("/updateWorkLocation/:id", updateWorkLocation); 
router.get("/getAllWorkLocations",getAllWorkLocations);
router.delete("/deleteAllWorkLocations",deleteAllWorkLocations);

module.exports = router;