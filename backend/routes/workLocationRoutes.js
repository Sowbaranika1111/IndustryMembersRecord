const express = require("express");
const router = express.Router();

const {
  
  updateWorkLocation,
  getAllWorkLocations,
  deleteAllWorkLocations,
  insertAllWorkLocations,
  
  // addNewCurrentRole,
  // deleteCurrentRoleById,
  // deleteAllCurrentRoles,
  // insertAllCurrentRoles,
} = require("../controllers/dropDownValuesController/workLocationController");


router.put("/updateWorkLocation/:id", updateWorkLocation); 
router.get("/getAllWorkLocations",getAllWorkLocations);
router.delete("/deleteAllWorkLocations",deleteAllWorkLocations);
router.post("/insertAllWorkLocations", insertAllWorkLocations);

module.exports = router;