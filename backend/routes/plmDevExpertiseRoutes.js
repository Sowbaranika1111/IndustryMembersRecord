const express = require("express");
const router = express.Router();
const {
  
  getAllExpertise,
  deleteAllExpertise,
  insertAllExpertise
  // addNewCurrentRole,
  // deleteCurrentRoleById,
  // deleteAllCurrentRoles,
  // insertAllCurrentRoles,
} = require("../controllers/dropDownValuesController/plmDevExpertiseController");

// GET existing current_role values
router.get("/getAllExpertise",getAllExpertise);
// router.put("/updateDesignation/:id",updateDesignation); 

// POST new current_role
// router.post("/add", addNewCurrentRole);

// DELETE current_role by ID
// router.delete("/delete/:id", deleteCurrentRoleById);

// DELETE all roles at a time
router.delete("/deleteAllExpertise", deleteAllExpertise);

// BULK insert roles
router.post("/insertAllExpertise", insertAllExpertise);

module.exports = router;
