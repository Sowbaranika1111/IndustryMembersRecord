const express = require("express");
const router = express.Router();

const {
  
  updateWorkLocation,
  
  // addNewCurrentRole,
  // deleteCurrentRoleById,
  // deleteAllCurrentRoles,
  // insertAllCurrentRoles,
} = require("../controllers/dropDownValuesController/workLocationController");


router.put("/updateWorkLocation/:id", updateWorkLocation); 

module.exports = router;